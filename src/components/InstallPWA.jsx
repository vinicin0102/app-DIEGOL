import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Detect if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        if (isStandalone) return;

        // Detect iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        if (isIOSDevice) {
            // Check if shown before in this session
            const hasShown = sessionStorage.getItem('pwa_prompt_shown');
            if (!hasShown) {
                setSupportsPWA(true);
                setShowPrompt(true);
            }
        }

        const handler = (e) => {
            e.preventDefault();
            console.log("Install prompt detected");
            setSupportsPWA(true);
            setPromptInstall(e);

            // Show prompt after a short delay
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClickInstall = (e) => {
        e.preventDefault();
        if (!promptInstall) return;
        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setShowPrompt(false);
            } else {
                console.log('User dismissed the install prompt');
            }
            setPromptInstall(null);
        });
    };

    const closePrompt = () => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa_prompt_shown', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="pwa-install-prompt" style={{
            position: 'fixed',
            bottom: '80px', // Above bottom nav
            left: '16px',
            right: '16px',
            background: 'rgba(20, 20, 24, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--primary)',
            borderRadius: '16px',
            padding: '16px',
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'slideUp 0.5s ease-out'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src="/pwa-192x192.png" alt="App Icon" style={{ width: '100%', borderRadius: '12px' }} />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#fff' }}>Instalar App</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Tenha acesso mais rápido!</p>
                    </div>
                </div>
                <button onClick={closePrompt} style={{ background: 'none', border: 'none', color: '#666' }}>
                    <X size={20} />
                </button>
            </div>

            {isIOS ? (
                <div style={{ fontSize: '13px', color: '#ddd', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0' }}>Para instalar no iPhone:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        1. Toque no ícone de compartilhar <Share size={16} color="#007AFF" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        2. Role e selecione "Adicionar à Tela de Início" <PlusSquare size={16} />
                    </div>
                </div>
            ) : (
                <button
                    onClick={onClickInstall}
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <Download size={18} /> INSTALAR AGORA
                </button>
            )}
        </div>
    );
};

export default InstallPWA;
