// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const webpush = (await import('npm:web-push@3.6.7')).default

        const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
        const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
        const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'

        webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Buscar notificações pendentes que já passaram do horário
        const now = new Date().toISOString()
        const { data: pending, error: fetchError } = await supabase
            .from('scheduled_notifications')
            .select('*')
            .eq('status', 'pending')
            .lte('schedule_at', now)

        if (fetchError) throw fetchError
        if (!pending || pending.length === 0) {
            return new Response(JSON.stringify({ message: 'Nada para enviar agora.' }), { headers: corsHeaders })
        }

        // 2. Desduplicar agendamentos no próprio lote (caso existam registros idênticos no banco)
        const uniquePending = []
        const seenNotifs = new Set()
        const duplicateIds = []

        for (const notif of pending) {
            const key = `${notif.title}|${notif.body}|${notif.schedule_at}`
            if (seenNotifs.has(key)) {
                duplicateIds.push(notif.id)
                continue
            }
            seenNotifs.add(key)
            uniquePending.push(notif)
        }

        // Marcar duplicatas como 'duplicate' para não tentarem ser processadas de novo
        if (duplicateIds.length > 0) {
            await supabase.from('scheduled_notifications')
                .update({ status: 'duplicate' })
                .in('id', duplicateIds)
        }

        if (uniquePending.length === 0) {
            return new Response(JSON.stringify({ message: 'Tudo limpo ou desduplicado.' }), { headers: corsHeaders })
        }

        // 3. Buscar inscritos e desduplicar por endpoint para evitar envios repetidos no mesmo dispositivo
        const { data: rawSubs } = await supabase.from('notification_subscriptions').select('subscription')
        if (!rawSubs || rawSubs.length === 0) return new Response('Sem inscritos', { headers: corsHeaders })

        const subs = []
        const seenEndpoints = new Set()
        for (const s of rawSubs) {
            const endpoint = s.subscription?.endpoint
            if (endpoint && !seenEndpoints.has(endpoint)) {
                seenEndpoints.add(endpoint)
                subs.push(s)
            }
        }

        console.log(`Processando ${uniquePending.length} agendamentos únicos para ${subs.length} dispositivos únicos.`)

        for (const notif of uniquePending) {
            // Incluir uma tag baseada no título para colapsar duplicatas no celular
            const payload = JSON.stringify({ 
                title: notif.title, 
                body: notif.body,
                tag: notif.title.toLowerCase().replace(/\s+/g, '-') // Ex: 'chefão', 'hidratação'
            })

            // Trava Atômica: Tenta marcar como 'sending' apenas se ainda estiver 'pending'
            const { data: updatedNotif, error: updateError } = await supabase
                .from('scheduled_notifications')
                .update({ status: 'sending' })
                .eq('id', notif.id)
                .eq('status', 'pending')
                .select();

            if (updateError || !updatedNotif || updatedNotif.length === 0) {
                console.log(`Notificação ${notif.id} já está sendo processada por outra instância.`);
                continue;
            }

            const results = await Promise.allSettled(
                subs.map(s => webpush.sendNotification(s.subscription, payload))
            );

            const success = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.length - success;

            // Atualizar status final com timestamp real e contagem
            await supabase.from('scheduled_notifications')
                .update({
                    status: success > 0 ? 'sent' : 'failed',
                    sent_at: new Date().toISOString(),
                    sent_count: success,
                    error_log: failed > 0 ? `Falha em ${failed} envios.` : null
                })
                .eq('id', notif.id);

            console.log(`Notificação ${notif.id} finalizada: ${success} sucessos, ${failed} falhas.`);
        }

        return new Response(JSON.stringify({ processed: uniquePending.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
