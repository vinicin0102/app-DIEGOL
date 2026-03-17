
// Service Worker robusto para PWA
// CACHE_VERSION: v3 - atualizar este número força o service worker a limpar o cache antigo
const CACHE_VERSION = 'v5';

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

cleanupOutdatedCaches()

// Precache dos assets gerados pelo build (vite-plugin-pwa injeção automática)
precacheAndRoute(self.__WB_MANIFEST)

// Assume controle imediatamente após ativação
self.skipWaiting()
clientsClaim()

// Cache de Imagens
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Dias
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
)

// Cache de Fontes (Google Fonts)
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate({
        cacheName: 'google-fonts',
    })
)

// --- Lógica de Push Notification ---
self.addEventListener('push', (event) => {
    let notificationData = {}
    try {
        notificationData = event.data.json()
    } catch (e) {
        notificationData = {
            title: 'Desafio dos Vencedores',
            body: event.data ? event.data.text() : 'Nova notificação!',
            icon: '/pwa-192x192.png'
        }
    }

    const title = notificationData.title || 'Desafio dos Vencedores'
    const options = {
        body: notificationData.body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: notificationData.data || {},
        tag: notificationData.tag || 'vencedores-notification',
        renotify: true,
        vibrate: [200, 100, 200, 100, 200], // Vibração mais heróica
        sound: '/notification.mp3?v=5', // Cache-busting para garantir novo som
        actions: notificationData.actions || []
    }

    // Tenta tocar som se houver uma janela aberta (Fundo)
    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            // Notifica as abas abertas para tocarem o som manualmente se necessário
            self.clients.matchAll({ type: 'window' }).then(clients => {
                clients.forEach(client => client.postMessage({ type: 'PLAY_SOUND', sound: 'notification' }))
            })
        ])
    )
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if (client.url === '/' && 'focus' in client) return client.focus()
            }
            if (clients.openWindow) return clients.openWindow('/')
        })
    )
})
