import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { title, body } = await req.json()

        const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
        const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
        const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'

        webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: subscriptions, error: subError } = await supabaseAdmin
            .from('notification_subscriptions')
            .select('subscription')

        if (subError) throw subError;

        if (!subscriptions || subscriptions.length === 0) {
            return new Response(JSON.stringify({ message: 'Nenhuma inscrição encontrada' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        const results = await Promise.allSettled(
            subscriptions.map(async (sub: any) => {
                return webpush.sendNotification(sub.subscription, JSON.stringify({
                    title: title || 'Desafio dos Vencedores',
                    body
                }))
            })
        )

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failCount = results.filter(r => r.status === 'rejected').length;

        return new Response(JSON.stringify({
            message: `Disparo concluído. Sucesso: ${successCount}, Falha: ${failCount}`,
            sent: successCount,
            failed: failCount,
            details: results
        }), {
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
