
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Bell, BellOff, Clock, Check, Loader } from 'lucide-react';

// VAPID Public Key
const VAPID_PUBLIC_KEY = 'BK670BTn0OkhJSUCgiPxbOgYQFQuZ2JjtjzKclt0U0sLUlNYK8sVI7y16t5Mh9DuOzwrauee10aHgius65CCR3U';

const NotificationSettings = ({ user }) => {
    // Pegar o user autenticado do Supabase (com UUID real)
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setAuthUser(data.user);
                console.log('Auth user ID:', data.user.id);
            }
        });
    }, []);

    const [permission, setPermission] = useState(() => {
        if (typeof Notification !== 'undefined') {
            return Notification.permission;
        }
        return 'default';
    });
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scheduleTime, setScheduleTime] = useState('08:00');
    const [incentiveType, setIncentiveType] = useState('both'); // 'morning', 'evening', 'both'

    useEffect(() => {
        checkSubscription();
    }, []);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const checkSubscription = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);

            // Carregar preferências salvas do usuário se existirem
            if (authUser) {
                try {
                    const { data } = await supabase
                        .from('user_notification_settings')
                        .select('preferred_time, incentive_type')
                        .eq('user_id', authUser.id)
                        .maybeSingle();

                    if (data) {
                        setScheduleTime(data.preferred_time || '08:00');
                        setIncentiveType(data.incentive_type || 'both');
                    }
                } catch (e) {
                    console.warn('Tabela user_notification_settings não encontrada, usando padrão.');
                }
            }
        }
    };

    const subscribeToPush = async () => {
        setLoading(true);
        try {
            // Verificar se é iOS e se está na tela de início (PWA instalado)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

            if (isIOS && !isStandalone) {
                alert('No iPhone, as notificações só funcionam se você adicionar o app à sua Tela de Início primeiro. Toque no ícone de compartilhar e depois em "Adicionar à Tela de Início".');
                setLoading(false);
                return;
            }

            // Pedir permissão explicitamente
            if (typeof Notification !== 'undefined') {
                const permissionResult = await Notification.requestPermission();
                setPermission(permissionResult);
                if (permissionResult !== 'granted') {
                    alert('Permissão negada. Para ativar, vá nas Configurações do seu dispositivo e permita notificações para este site.');
                    setLoading(false);
                    return;
                }
            }

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const options = {
                    userVisibleOnly: true,
                    applicationServerKey: VAPID_PUBLIC_KEY && VAPID_PUBLIC_KEY !== 'YOUR_VAPID_PUBLIC_KEY_HERE'
                        ? urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                        : undefined
                };
                subscription = await registration.pushManager.subscribe(options);
            }

            // Ativar localmente independente do Supabase
            setIsSubscribed(true);
            setPermission('granted');

            // Salvar no Supabase com o UUID real do usuário autenticado
            const userId = authUser?.id;
            if (userId && subscription) {
                try {
                    console.log('Salvando inscrição para user_id:', userId);
                    const subData = JSON.parse(JSON.stringify(subscription));

                    // Verificar se já existe uma inscrição para este usuário
                    const { data: existing } = await supabase
                        .from('notification_subscriptions')
                        .select('id')
                        .eq('user_id', userId)
                        .maybeSingle();

                    let error;
                    if (existing) {
                        // Atualizar a inscrição existente
                        const result = await supabase
                            .from('notification_subscriptions')
                            .update({ subscription: subData, updated_at: new Date().toISOString() })
                            .eq('user_id', userId);
                        error = result.error;
                    } else {
                        // Inserir nova inscrição
                        const result = await supabase
                            .from('notification_subscriptions')
                            .insert({ user_id: userId, subscription: subData });
                        error = result.error;
                    }

                    if (error) {
                        console.error('ERRO ao salvar inscrição no Supabase:', error.message, error);
                        alert('Aviso: Notificações ativadas localmente, mas houve um erro ao sincronizar com o servidor: ' + error.message);
                    } else {
                        console.log('✅ Inscrição salva com sucesso no Supabase!');
                    }
                } catch (dbErr) {
                    console.warn('Aviso: Erro de rede ao salvar inscrição:', dbErr);
                }
            }

            alert('Notificações ativadas com sucesso! ✅ Você receberá incentivos diários.');
        } catch (error) {
            console.error('Erro ao inscrever:', error);
            alert('Não foi possível ativar as notificações: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    const unsubscribeFromPush = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();

                // Remover do Supabase
                if (authUser) {
                    await supabase
                        .from('notification_subscriptions')
                        .delete()
                        .eq('user_id', authUser.id);
                }

                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Erro ao desativar:', error);
        } finally {
            setLoading(false);
        }
    };

    const savePreferences = async () => {
        if (!authUser) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('user_notification_settings')
                .upsert({
                    user_id: authUser.id,
                    preferred_time: scheduleTime,
                    incentive_type: incentiveType
                }, { onConflict: 'user_id' });

            if (error) throw error;

            alert('Preferências salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
            alert('Erro ao sincronizar preferências com o servidor.');
        } finally {
            setLoading(false);
        }
    };


    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return (
            <div className="glass-panel" style={{ padding: '20px', color: 'var(--text-muted)' }}>
                <p>Notificações Push não são suportadas neste dispositivo.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '24px', animation: 'slide-up 0.3s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(0, 255, 136, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Bell size={20} color="#00FF88" />
                </div>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Incentivos Diários</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receba lembretes para manter o foco.</p>
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                {permission === 'denied' ? (
                    <div style={{
                        padding: '12px',
                        background: 'rgba(255, 75, 75, 0.1)',
                        border: '1px solid rgba(255, 75, 75, 0.3)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#ff4b4b'
                    }}>
                        Notificações bloqueadas. Habilite nas configurações do navegador.
                    </div>
                ) : !isSubscribed ? (
                    <button
                        onClick={subscribeToPush}
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? <Loader size={18} className="spin" /> : <Bell size={18} />}
                        Ativar Notificações no Celular
                    </button>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            padding: '12px',
                            background: 'rgba(0, 255, 136, 0.1)',
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#00FF88',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <Check size={16} /> Notificações Ativadas
                        </div>

                        <div style={{ display: 'grid', gap: '16px', textAlign: 'left', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Horário do Incentivo
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            padding: '10px 10px 10px 36px',
                                            color: '#fff',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={savePreferences}
                                className="btn-secondary"
                                style={{ width: '100%' }}
                            >
                                Salvar Preferências
                            </button>
                        </div>

                        <button
                            onClick={unsubscribeFromPush}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            Desativar Notificações
                        </button>
                    </div>
                )}
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
                * Para funcionar com o app fechado, certifique-se de instalar o app na tela inicial ("Adicionar à Tela Inicial").
            </p>
        </div>
    );
};

export default NotificationSettings;
