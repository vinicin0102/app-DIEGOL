
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Check, Loader, AlertTriangle } from 'lucide-react';

const NotificationSettings = ({ user }) => {
    const [permission, setPermission] = useState('default');
    const [loading, setLoading] = useState(false);
    const [scheduleTime, setScheduleTime] = useState('08:00');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    // Detect environment
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.navigator?.standalone ||
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    const supportsNotifications = typeof Notification !== 'undefined';

    useEffect(() => {
        // Check current permission
        if (supportsNotifications) {
            setPermission(Notification.permission);
        }

        // Load saved preferences
        const savedEnabled = localStorage.getItem('notifications_enabled') === 'true';
        const savedTime = localStorage.getItem('notification_time');
        if (savedEnabled) setNotificationsEnabled(true);
        if (savedTime) setScheduleTime(savedTime);

        // Start scheduler if enabled
        if (savedEnabled && Notification.permission === 'granted') {
            startNotificationScheduler();
        }
    }, []);

    // Motivational messages
    const motivationalMessages = [
        { title: '💪 Hora de treinar!', body: 'Seu corpo merece atenção hoje. Bora mover!' },
        { title: '🔥 Não quebre o streak!', body: 'Você está indo bem. Mantenha a constância!' },
        { title: '⚡ Guerreiro, acorda!', body: 'Cada dia sem treinar é um dia que o boss fica mais forte.' },
        { title: '🏆 Falta pouco!', body: 'Você está mais perto do próximo nível. Continue!' },
        { title: '🎯 Missão do dia', body: 'Complete seu treino e ganhe XP. Vamos lá!' },
        { title: '🐉 O boss te espera', body: 'A preguiça é seu maior inimigo. Derrote-a hoje!' },
        { title: '⭐ Bom dia, campeão!', body: 'Hoje é mais um dia para evoluir. Levanta e vai!' },
    ];

    const getRandomMessage = () => {
        return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    };

    const sendTestNotification = () => {
        const msg = getRandomMessage();
        new Notification(msg.title, {
            body: msg.body,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'fitquest-daily',
        });
    };

    const startNotificationScheduler = () => {
        // Check every 60 seconds if it's time to send
        const checkInterval = setInterval(() => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const today = now.toDateString();
            const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat

            // 1. Check user's personal notification time
            const savedTime = localStorage.getItem('notification_time') || '08:00';
            if (currentTime === savedTime) {
                const lastSent = localStorage.getItem('last_notification_date');
                if (lastSent !== today) {
                    sendTestNotification();
                    localStorage.setItem('last_notification_date', today);
                }
            }

            // 2. Check admin-scheduled notifications
            try {
                const adminNotifs = JSON.parse(localStorage.getItem('admin_scheduled_notifications') || '[]');
                adminNotifs.forEach(n => {
                    if (!n.active) return;
                    if (n.time !== currentTime) return;

                    // Check repeat rule
                    if (n.repeat === 'weekdays' && (dayOfWeek === 0 || dayOfWeek === 6)) return;

                    const lastKey = `admin_notif_sent_${n.id}`;
                    const lastSentForThis = localStorage.getItem(lastKey);
                    if (lastSentForThis === today) return;

                    // Send it!
                    new Notification(n.title, {
                        body: n.body,
                        icon: '/pwa-192x192.png',
                        badge: '/pwa-192x192.png',
                        vibrate: [200, 100, 200],
                        tag: 'admin-scheduled-' + n.id,
                    });
                    localStorage.setItem(lastKey, today);

                    // If "once", deactivate it
                    if (n.repeat === 'once') {
                        const updated = adminNotifs.map(x => x.id === n.id ? { ...x, active: false } : x);
                        localStorage.setItem('admin_scheduled_notifications', JSON.stringify(updated));
                    }
                });
            } catch (e) { /* ignore parse errors */ }
        }, 60000); // Check every minute

        // 3. Listen for instant admin notifications via BroadcastChannel
        try {
            const bc = new BroadcastChannel('admin_notifications');
            bc.onmessage = (event) => {
                if (event.data?.type === 'INSTANT' && Notification.permission === 'granted') {
                    new Notification(event.data.title, {
                        body: event.data.body,
                        icon: '/pwa-192x192.png',
                        badge: '/pwa-192x192.png',
                        vibrate: [200, 100, 200],
                        tag: 'admin-instant-' + Date.now(),
                    });
                }
            };
        } catch (e) { /* BroadcastChannel not supported */ }

        return () => clearInterval(checkInterval);
    };

    const enableNotifications = async () => {
        setLoading(true);

        try {
            // iOS without standalone mode
            if (isIOS && !isStandalone) {
                setShowIOSGuide(true);
                setLoading(false);
                return;
            }

            // Check if Notification API exists
            if (!supportsNotifications) {
                alert('Este navegador não suporta notificações. Tente instalar o app na tela inicial primeiro.');
                setLoading(false);
                return;
            }

            // Request permission
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                setNotificationsEnabled(true);
                localStorage.setItem('notifications_enabled', 'true');
                localStorage.setItem('notification_time', scheduleTime);

                // Send a test notification
                sendTestNotification();

                // Start scheduler
                startNotificationScheduler();
            } else if (result === 'denied') {
                alert('Você bloqueou as notificações. Para reativar, vá nas configurações do navegador/app e permita notificações para este site.');
            } else {
                alert('Permissão não concedida. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao ativar notificações:', error);
            alert('Erro ao configurar notificações. Tente instalar o app na tela inicial primeiro.');
        } finally {
            setLoading(false);
        }
    };

    const disableNotifications = () => {
        setNotificationsEnabled(false);
        localStorage.setItem('notifications_enabled', 'false');
    };

    const savePreferences = () => {
        localStorage.setItem('notification_time', scheduleTime);
        alert('✅ Horário salvo! Você será notificado às ' + scheduleTime + ' todos os dias.');
    };

    // === iOS Guide Modal ===
    if (showIOSGuide) {
        return (
            <div className="glass-panel" style={{ padding: '24px', animation: 'slide-up 0.3s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(255, 165, 0, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <AlertTriangle size={20} color="#FFA500" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Instale o App Primeiro</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O iOS exige que o app esteja na tela inicial.</p>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'rgba(0, 122, 255, 0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', flexShrink: 0
                            }}>📤</div>
                            <div>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>Passo 1</span>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    Toque no botão <strong style={{ color: '#007AFF' }}>Compartilhar</strong> do Safari (ícone quadrado com seta)
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', flexShrink: 0
                            }}>➕</div>
                            <div>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>Passo 2</span>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    Selecione <strong style={{ color: '#fff' }}>"Adicionar à Tela de Início"</strong>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'rgba(0, 255, 136, 0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', flexShrink: 0
                            }}>🔔</div>
                            <div>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>Passo 3</span>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    Abra pelo ícone novo e ative as notificações aqui
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowIOSGuide(false)}
                    className="btn-primary"
                    style={{ width: '100%' }}
                >
                    Entendi
                </button>
            </div>
        );
    }

    // === Não suporta notificações neste ambiente ===
    if (!supportsNotifications) {
        return (
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <BellOff size={20} color="var(--text-muted)" />
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Notificações Indisponíveis</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {isIOS
                                ? 'Adicione o app à Tela de Início para habilitar notificações.'
                                : 'Seu navegador não suporta notificações.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // === Main UI ===
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
                        Notificações bloqueadas. Vá nas configurações do navegador e permita notificações para este site.
                    </div>
                ) : !notificationsEnabled ? (
                    <button
                        onClick={enableNotifications}
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
                            onClick={disableNotifications}
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
                * Para funcionar com o app fechado, certifique-se de instalar o app na tela inicial.
            </p>
        </div>
    );
};

export default NotificationSettings;
