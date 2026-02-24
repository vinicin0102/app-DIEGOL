import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.6'

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { title, body } = await req.json()

        // Configuração VAPID
        const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
        const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
        const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'

        webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

        // Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Buscar todas as inscrições ativas
        const { data: subscriptions, error: subError } = await supabaseAdmin
            .from('notification_subscriptions')
            .select('subscription')

        if (subError) throw subError;

        // Disparo em massa
        const results = await Promise.allSettled(
            subscriptions.map(async (sub: any) => {
                try {
                    return await webpush.sendNotification(sub.subscription, JSON.stringify({
                        title: title || 'Desafio dos Vencedores',
                        body
                    }))
                } catch (e: any) {
                    // Log individual errors for failed notifications
                    console.warn('Falha ao enviar notificação para uma inscrição:', e.message, sub.subscription);
                    // Re-throw or return a rejected promise to be caught by Promise.allSettled
                    throw e;
                }
            })
        )

        return new Response(JSON.stringify({
            message: `Disparo concluído. ${results.filter(r => r.status === 'fulfilled').length} enviados com sucesso.`,
            details: results
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        // Log the main error for the entire function execution
        console.error('Erro na função Edge:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
