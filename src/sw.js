
// Service Worker customizado
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

cleanupOutdatedCaches()

// Precache dos assets gerados pelo build (vite-plugin-pwa injeção automática)
precacheAndRoute(self.__WB_MANIFEST)

// Assume controle imediatamente após ativação
self.skipWaiting()
clientsClaim()

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
        tag: notificationData.tag || 'general-notification',
        renotify: true,
        vibrate: [100, 50, 100],
        actions: notificationData.actions || []
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    )
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    // Ao clicar, focar ou abrir a janela do app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Se já tem uma janela aberta, foca nela
            for (let client of windowClients) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus()
                }
            }
            // Se não, abre uma nova
            if (clients.openWindow) {
                return clients.openWindow('/')
            }
        })
    )
})
