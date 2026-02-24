import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Web Push helpers using Web Crypto API (Deno-native, no npm dependency)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function uint8ArrayToUrlBase64(uint8Array: Uint8Array): string {
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i])
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function generateJWT(vapidSubject: string, audience: string, vapidPrivateKey: string, vapidPublicKey: string): Promise<string> {
    const header = { typ: 'JWT', alg: 'ES256' }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
        aud: audience,
        exp: now + 12 * 60 * 60, // 12 hours
        sub: vapidSubject,
    }

    const headerB64 = uint8ArrayToUrlBase64(new TextEncoder().encode(JSON.stringify(header)))
    const payloadB64 = uint8ArrayToUrlBase64(new TextEncoder().encode(JSON.stringify(payload)))
    const unsignedToken = `${headerB64}.${payloadB64}`

    // Import the private key for signing
    const privateKeyBytes = urlBase64ToUint8Array(vapidPrivateKey)
    const key = await crypto.subtle.importKey(
        'raw',
        privateKeyBytes,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['sign']
    )

    // Sign the token
    const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' },
        key,
        new TextEncoder().encode(unsignedToken)
    )

    // Convert DER signature to raw format (r + s, 32 bytes each)
    const sigArray = new Uint8Array(signature)
    let r: Uint8Array, s: Uint8Array

    if (sigArray.length === 64) {
        r = sigArray.slice(0, 32)
        s = sigArray.slice(32)
    } else {
        // DER format
        r = sigArray.slice(0, 32)
        s = sigArray.slice(32, 64)
    }

    const rawSig = new Uint8Array(64)
    rawSig.set(r, 0)
    rawSig.set(s, 32)

    const signatureB64 = uint8ArrayToUrlBase64(rawSig)
    return `${unsignedToken}.${signatureB64}`
}

async function sendWebPush(subscription: any, payload: string, vapidPublicKey: string, vapidPrivateKey: string, vapidSubject: string) {
    const endpoint = subscription.endpoint
    const audience = new URL(endpoint).origin

    const jwt = await generateJWT(vapidSubject, audience, vapidPrivateKey, vapidPublicKey)

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'TTL': '86400',
            'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
        },
        body: payload,
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Push failed (${response.status}): ${text}`)
    }

    return response
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { title, body } = await req.json()

        // Configuração VAPID
        const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
        const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
        const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'

        // Admin Client para ler todas as inscrições
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Buscar todas as inscrições ativas
        const { data: subscriptions, error: subError } = await supabaseAdmin
            .from('notification_subscriptions')
            .select('subscription')

        if (subError) {
            console.error('Erro ao buscar inscrições:', subError)
            throw subError
        }

        if (!subscriptions || subscriptions.length === 0) {
            return new Response(JSON.stringify({
                message: 'Nenhum dispositivo inscrito encontrado.',
                sent: 0,
                total: 0
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        console.log(`Encontradas ${subscriptions.length} inscrições. Iniciando disparo...`)

        const notificationPayload = JSON.stringify({
            title: title || 'Desafio dos Vencedores',
            body: body || 'Nova mensagem!'
        })

        // Tentar enviar para cada dispositivo
        let successCount = 0
        let failCount = 0
        const errors: string[] = []

        for (const sub of subscriptions) {
            try {
                await sendWebPush(
                    sub.subscription,
                    notificationPayload,
                    VAPID_PUBLIC_KEY,
                    VAPID_PRIVATE_KEY,
                    VAPID_SUBJECT
                )
                successCount++
            } catch (e: any) {
                failCount++
                errors.push(e.message)
                console.warn('Falha em um envio:', e.message)
            }
        }

        // Salvar histórico
        try {
            await supabaseAdmin.from('mass_notifications').insert([{
                title,
                body
            }])
        } catch (e) {
            console.warn('Não foi possível salvar histórico:', e)
        }

        return new Response(JSON.stringify({
            message: `Disparo concluído. ${successCount} enviados, ${failCount} falharam.`,
            sent: successCount,
            failed: failCount,
            total: subscriptions.length,
            errors: errors.slice(0, 5) // Primeiros 5 erros para debug
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error('Erro principal na função:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
