
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Loader, Shield, Zap, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const VAPID_PUBLIC_KEY = 'BK670BTn0OkhJSUCgiPxbOgYQFQuZ2JjtjzKclt0U0sLUlNYK8sVI7y16t5Mh9DuOzwrauee10aHgius65CCR3U';

const NotificationModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    useEffect(() => {
        // Verificar se já foi mostrado ou se já tem permissão
        const hasSeen = localStorage.getItem('vencedores_notif_modal_seen');
        const permission = typeof Notification !== 'undefined' ? Notification.permission : 'granted';

        if (!hasSeen && permission === 'default') {
            // Pequeno delay para não assustar assim que abre
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const handleActivate = async () => {
        setLoading(true);
        setStatus('loading');
        try {
            // Pedir permissão
            const permission = await Notification.requestPermission();
            
            if (permission !== 'granted') {
                throw new Error('Permissão negada');
            }

            // Registrar Service Worker e Inscrição
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const options = {
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                };
                subscription = await registration.pushManager.subscribe(options);
            }

            // Salvar no banco
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const subData = JSON.parse(JSON.stringify(subscription));
                await supabase.from('notification_subscriptions').upsert({
                    user_id: user.id,
                    subscription: subData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }

            setStatus('success');
            localStorage.setItem('vencedores_notif_modal_seen', 'true');
            
            // Fechar após um tempo
            setTimeout(() => {
                setIsOpen(false);
            }, 2000);

        } catch (error) {
            console.error('Erro ao ativar notificações:', error);
            setStatus('error');
            setLoading(false);
        }
    };

    const handleClose = () => {
        localStorage.setItem('vencedores_notif_modal_seen', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            animation: 'fade-in 0.4s ease'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'linear-gradient(145deg, #1a1a2e, #0f0f23)',
                borderRadius: '28px',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 255, 136, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                padding: '40px 32px'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
                    zIndex: 0
                }}></div>

                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                    }}
                >
                    <X size={18} />
                </button>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.05))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
                    }}>
                        <Bell size={40} color="#00FF88" className={status === 'loading' ? 'pulse' : ''} />
                    </div>

                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', marginBottom: '12px', lineHeight: '1.2' }}>
                        Não perca nenhum incentivo! ⚡
                    </h2>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                        Ative as notificações para receber os chamados do Chefão, lembretes de hidratação e mensagens motivacionais em tempo real.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Shield size={16} color="#00D4FF" style={{ marginBottom: '8px' }} />
                            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#fff' }}>100% Seguro</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Zap size={16} color="#FFD700" style={{ marginBottom: '8px' }} />
                            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#fff' }}>Tempo Real</span>
                        </div>
                    </div>

                    {status === 'success' ? (
                        <div style={{
                            background: 'rgba(0, 255, 136, 0.1)',
                            border: '1px solid rgba(0, 255, 136, 0.3)',
                            padding: '16px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            color: '#00FF88',
                            fontWeight: '700'
                        }}>
                            <Check size={20} /> Notificações Ativadas!
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={handleActivate}
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: '0 10px 20px rgba(0, 255, 136, 0.2)'
                                }}
                            >
                                {loading ? <Loader size={20} className="spin" /> : <Sparkles size={20} />}
                                {status === 'error' ? 'Tentar Novamente' : 'ATIVAR AGORA'}
                            </button>
                            
                            <button
                                onClick={handleClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '10px'
                                }}
                            >
                                Talvez mais tarde
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom decorative bar */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)'
                }}></div>
            </div>
            
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .pulse {
                        animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                    }
                    @keyframes pulse-ring {
                        0% { transform: scale(.8); opacity: 0.5; }
                        80%, 100% { transform: scale(1.1); opacity: 0; }
                    }
                `}
            </style>
        </div>
    );
};

export default NotificationModal;
