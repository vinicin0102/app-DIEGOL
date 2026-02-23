import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { supabase } from './supabaseClient';

// === CONFIGURAÇÃO FIREBASE ===
// O usuário deve substituir estes valores pelos do seu Console Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "SUA_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "SEU_AUTH_DOMAIN",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "SEU_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "SEU_STORAGE_BUCKET",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "SEU_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Solicita permissão e registra o token FCM no Supabase
 * @param {string} userId - ID do usuário logado
 */
export const registerPushNotifications = async (userId) => {
    try {
        if (!userId) return;

        // Verificar se o navegador suporta notificações
        if (!('Notification' in window)) {
            console.warn('Este navegador não suporta notificações desktop');
            return;
        }

        // Solicitar permissão
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Permissão de notificação negada');
            return;
        }

        // Obter token FCM
        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // Chave VAPID do Console Firebase
        });

        if (token) {
            // Salvar no Supabase
            const { error } = await supabase
                .from('user_push_tokens')
                .upsert({
                    user_id: userId,
                    fcm_token: token,
                    device_info: {
                        userAgent: navigator.userAgent,
                        platform: navigator.platform,
                        language: navigator.language
                    }
                }, { onConflict: 'user_id, fcm_token' });

            if (error) throw error;
            console.log('FCM Token registrado com sucesso!');
        } else {
            console.warn('Nenhum código de registro disponível. Solicite permissão para gerar um.');
        }
    } catch (error) {
        console.error('Erro ao registrar notificações:', error);
    }
};

// Listener para mensagens enquanto o app está aberto (foreground)
export const onForegroundMessage = (callback) => {
    return onMessage(messaging, (payload) => {
        console.log('Mensagem recebida em foreground:', payload);
        if (callback) callback(payload);
    });
};

export { messaging };
