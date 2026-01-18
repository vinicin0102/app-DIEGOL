import React, { useState, useEffect } from 'react';
import { Download, Share, X, Phone } from 'lucide-react';

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setIsVisible(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = (evt) => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setIsVisible(false);
            }
            setPromptInstall(null);
        });
    };

    const closeBanner = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
            <div className="glass-panel p-4 flex flex-col gap-4 relative border border-[var(--primary)]/30 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
                <button
                    onClick={closeBanner}
                    className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shrink-0 shadow-lg">
                        <Phone className="text-black w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">Instalar App</h3>
                        <p className="text-[var(--text-muted)] text-sm">
                            {isIOS
                                ? "Instale para uma melhor experiência no iPhone"
                                : "Instale o app para acesso rápido e offline"}
                        </p>
                    </div>
                </div>

                {isIOS ? (
                    <div className="text-sm text-[var(--text-muted)] bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Share size={16} className="text-[var(--primary)]" />
                            <span>1. Toque no botão Compartilhar</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-current rounded-[4px] flex items-center justify-center text-[var(--primary)]">
                                +
                            </div>
                            <span>2. Selecione "Adicionar à Tela de Início"</span>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleInstall}
                        className="w-full bg-[var(--primary)] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00ffa5] transition-colors shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    >
                        <Download size={20} />
                        Instalar Agora
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstallPWA;
