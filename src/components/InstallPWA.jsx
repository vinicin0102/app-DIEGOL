import React, { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone, Plus, Sparkles } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                onClick={closeBanner}
                style={{ animation: 'fadeIn 0.3s ease-out' }}
            />

            {/* Card Container */}
            <div
                className="relative w-full max-w-md pointer-events-auto mb-safe"
                style={{ animation: 'slideUpBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 255, 136, 0.2)',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 136, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                >
                    {/* Animated Gradient Border */}
                    <div
                        className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--primary))',
                            backgroundSize: '200% 200%',
                            animation: 'gradientMove 3s ease infinite',
                            padding: '1px',
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'xor',
                            WebkitMaskComposite: 'xor'
                        }}
                    />

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-[var(--primary)]"
                                style={{
                                    left: `${15 + i * 15}%`,
                                    top: `${20 + (i % 3) * 25}%`,
                                    opacity: 0.4 + (i * 0.1),
                                    animation: `floatParticle ${3 + i * 0.5}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.3}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={closeBanner}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <X size={16} className="text-white/70" />
                    </button>

                    {/* Content */}
                    <div className="relative p-6 text-center">
                        {/* App Icon with Animation */}
                        <div className="relative w-20 h-20 mx-auto mb-5">
                            {/* Glow Effect */}
                            <div
                                className="absolute inset-0 rounded-2xl blur-xl"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    opacity: 0.5,
                                    animation: 'pulseGlow 2s ease-in-out infinite'
                                }}
                            />
                            {/* Icon Container */}
                            <div
                                className="relative w-full h-full rounded-2xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #00DDAA 50%, var(--secondary) 100%)',
                                    boxShadow: '0 8px 32px rgba(0, 255, 136, 0.4)',
                                    animation: 'iconFloat 3s ease-in-out infinite'
                                }}
                            >
                                <Smartphone className="w-10 h-10 text-black" />
                            </div>
                            {/* Badge */}
                            <div
                                className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    color: '#000',
                                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                                }}
                            >
                                Grátis
                            </div>
                        </div>

                        {/* Title */}
                        <h3
                            className="text-xl font-bold mb-2"
                            style={{
                                background: 'linear-gradient(135deg, #fff 0%, var(--primary) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Instale o App
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
                            {isIOS
                                ? "Adicione à sua tela inicial para uma experiência completa"
                                : "Acesso rápido, notificações e funciona offline"
                            }
                        </p>

                        {isIOS ? (
                            /* iOS Instructions */
                            <div className="space-y-3 mb-5">
                                {/* Step 1 */}
                                <div
                                    className="flex items-center gap-4 p-4 rounded-2xl text-left"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.05))',
                                            border: '1px solid rgba(0, 255, 136, 0.3)'
                                        }}
                                    >
                                        <Share size={18} className="text-[var(--primary)]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold mb-1">
                                            Passo 1
                                        </div>
                                        <div className="text-sm text-white font-medium">
                                            Toque em <span className="text-[var(--primary)]">Compartilhar</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div
                                    className="flex items-center gap-4 p-4 rounded-2xl text-left"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.2), rgba(123, 47, 255, 0.05))',
                                            border: '1px solid rgba(123, 47, 255, 0.3)'
                                        }}
                                    >
                                        <Plus size={18} className="text-[var(--secondary)]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] uppercase tracking-wider text-[var(--secondary)] font-semibold mb-1">
                                            Passo 2
                                        </div>
                                        <div className="text-sm text-white font-medium">
                                            Adicionar à Tela de Início
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Android/Chrome Install Button */
                            <button
                                onClick={handleInstall}
                                className="relative w-full overflow-hidden rounded-2xl font-bold py-4 px-6 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #00DDAA 100%)',
                                    color: '#000',
                                    boxShadow: '0 8px 32px rgba(0, 255, 136, 0.4)'
                                }}
                            >
                                {/* Shimmer Effect */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                                        animation: 'shimmerMove 2s ease-in-out infinite'
                                    }}
                                />
                                <Download size={20} className="relative z-10" />
                                <span className="relative z-10">Instalar Agora</span>
                                <Sparkles size={16} className="relative z-10 opacity-80" />
                            </button>
                        )}

                        {/* Features */}
                        <div className="flex justify-center gap-6 mt-5">
                            {[
                                { icon: '⚡', text: 'Rápido' },
                                { icon: '📴', text: 'Offline' },
                                { icon: '🔔', text: 'Alertas' }
                            ].map((feature, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-lg mb-1">{feature.icon}</div>
                                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                                        {feature.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUpBounce {
                    from {
                        opacity: 0;
                        transform: translateY(100px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes gradientMove {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                
                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                
                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
                    50% { transform: translateY(-15px) translateX(5px); opacity: 0.8; }
                }
                
                @keyframes shimmerMove {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                
                .mb-safe {
                    margin-bottom: env(safe-area-inset-bottom, 16px);
                }
            `}</style>
        </div>
    );
};

export default InstallPWA;
