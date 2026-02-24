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

        // 2. Buscar inscritos
        const { data: subs } = await supabase.from('notification_subscriptions').select('subscription')
        if (!subs || subs.length === 0) return new Response('Sem inscritos', { headers: corsHeaders })

        console.log(`Processando ${pending.length} agendamentos para ${subs.length} usuários.`)

        for (const notif of pending) {
            const payload = JSON.stringify({ title: notif.title, body: notif.body })

            // Marcar como 'processando' para evitar duplicidade
            await supabase.from('scheduled_notifications').update({ status: 'sending' }).eq('id', notif.id)

            const results = await Promise.allSettled(
                subs.map(s => webpush.sendNotification(s.subscription, payload))
            )

            const success = results.filter(r => r.status === 'fulfilled').length

            // Atualizar status final
            await supabase.from('scheduled_notifications')
                .update({
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    sent_count: success
                })
                .eq('id', notif.id)
        }

        return new Response(JSON.stringify({ processed: pending.length }), {
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
