import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const InAppNotification = () => {
    const [notifications, setNotifications] = useState([]);

    // Listen for custom events from GameContext
    useEffect(() => {
        const handler = (e) => {
            const { title, body, id } = e.detail;
            setNotifications(prev => [...prev, { id: id || Date.now(), title, body, timestamp: Date.now() }]);
        };

        window.addEventListener('admin-notification', handler);
        return () => window.removeEventListener('admin-notification', handler);
    }, []);

    // Auto-dismiss after 8 seconds
    useEffect(() => {
        if (notifications.length === 0) return;
        const timer = setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 8000);
        return () => clearTimeout(timer);
    }, [notifications]);

    const dismiss = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '90%',
            maxWidth: '400px',
            pointerEvents: 'none'
        }}>
            {notifications.map((n) => (
                <div
                    key={n.id}
                    style={{
                        background: 'rgba(10, 10, 15, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        border: '1px solid rgba(0, 255, 136, 0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0, 255, 136, 0.1)',
                        animation: 'notif-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        pointerEvents: 'auto'
                    }}
                >
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.05))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Bell size={20} color="#00FF88" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: '700', fontSize: '15px', color: '#fff',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {n.title}
                        </div>
                        <div style={{
                            fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                            lineHeight: '1.4',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                            {n.body}
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontWeight: '600' }}>
                            VENCEDORES • Agora
                        </div>
                    </div>
                    <button
                        onClick={() => dismiss(n.id)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'rgba(255,255,255,0.4)', padding: '4px', flexShrink: 0
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes notif-slide-in {
                    0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}} />
        </div>
    );
};

export default InAppNotification;
