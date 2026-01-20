import React, { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone, Plus, Zap, WifiOff, Bell } from 'lucide-react';

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
        <div className="install-pwa-overlay" style={{ zIndex: 9999 }}>
            {/* Backdrop */}
            <div className="install-pwa-backdrop" onClick={closeBanner} />

            {/* Card Container */}
            <div className="install-pwa-card mb-safe">
                <div className="install-pwa-content-wrapper">

                    {/* Decorative Top Glow */}
                    <div className="decorative-glow" />

                    {/* Close Button */}
                    <button onClick={closeBanner} className="close-button">
                        <X size={20} color="rgba(255,255,255,0.6)" />
                    </button>

                    {/* Content */}
                    <div className="content-inner">
                        {/* App Icon */}
                        <div className="app-icon-container">
                            <div className="icon-glow-bg" />
                            <div className="app-icon-box">
                                <Smartphone size={32} color="var(--primary)" />
                            </div>
                            {/* Verified Badge */}
                            <div className="free-badge">FREE</div>
                        </div>

                        {/* Text Content */}
                        <h3 className="title-text">Instale o App</h3>

                        <p className="description-text">
                            {isIOS
                                ? "Adicione à tela inicial para ter a melhor experiência possível."
                                : "Navegue mais rápido e receba notificações exclusivas."}
                        </p>

                        {isIOS ? (
                            /* iOS Instructions */
                            <div className="ios-instructions">
                                <div className="ios-step">
                                    <div className="step-icon">
                                        <Share size={18} />
                                    </div>
                                    <div className="step-text">
                                        <div className="step-label">Passo 1</div>
                                        <div className="step-desc">Toque em <span style={{ color: '#007AFF' }}>Compartilhar</span></div>
                                    </div>
                                </div>

                                <div className="ios-step">
                                    <div className="step-icon" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                                        <Plus size={18} />
                                    </div>
                                    <div className="step-text">
                                        <div className="step-label">Passo 2</div>
                                        <div className="step-desc">Adicionar à Tela de Início</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Android Action Button */
                            <button onClick={handleInstall} className="android-install-btn">
                                <div className="shimmer-effect" />
                                <Download size={18} />
                                <span>Instalar Agora</span>
                            </button>
                        )}

                        {/* Micro Features */}
                        <div className="features-row">
                            <div className="feature-item">
                                <Zap size={16} color="#FACC15" />
                                <span>Rápido</span>
                            </div>
                            <div className="feature-item">
                                <WifiOff size={16} color="#60A5FA" />
                                <span>Offline</span>
                            </div>
                            <div className="feature-item">
                                <Bell size={16} color="#F87171" />
                                <span>Alertas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .install-pwa-overlay {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 16px;
                    pointer-events: none;
                    font-family: var(--font-main, sans-serif);
                }

                .install-pwa-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    pointer-events: auto;
                    animation: fadeIn 0.3s ease-out;
                }

                .install-pwa-card {
                    position: relative;
                    width: 100%;
                    max-width: 380px;
                    pointer-events: auto;
                    margin: 0 auto;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .install-pwa-content-wrapper {
                    position: relative;
                    overflow: hidden;
                    border-radius: 24px;
                    background: rgba(20, 20, 25, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.2);
                }

                .decorative-glow {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 75%;
                    height: 96px;
                    background: var(--primary);
                    opacity: 0.1;
                    filter: blur(60px);
                    pointer-events: none;
                }

                .close-button {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    z-index: 10;
                    background: transparent;
                    border: none;
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .close-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .content-inner {
                    position: relative;
                    padding: 32px 24px 24px;
                    text-align: center;
                }

                .app-icon-container {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 16px;
                }

                .icon-glow-bg {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top right, var(--primary), var(--secondary));
                    border-radius: 16px;
                    opacity: 0.2;
                    filter: blur(16px);
                    animation: pulse 2s infinite;
                }

                .app-icon-box {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .free-badge {
                    position: absolute;
                    bottom: -6px;
                    right: -6px;
                    background: #22c55e;
                    color: #000;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 100px;
                    border: 2px solid #141419;
                }

                .title-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }

                .description-text {
                    font-size: 14px;
                    color: #9ca3af;
                    margin-bottom: 24px;
                    line-height: 1.5;
                }

                .ios-instructions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .ios-step {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .step-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 122, 255, 0.2);
                    color: #007AFF;
                }

                .step-text {
                    text-align: left;
                }

                .step-label {
                    font-size: 10px;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }

                .step-desc {
                    font-size: 14px;
                    font-weight: 500;
                    color: #fff;
                }

                .android-install-btn {
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                    border-radius: 12px;
                    font-weight: 600;
                    padding: 14px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: linear-gradient(135deg, var(--primary) 0%, #00DDAA 100%);
                    color: #09090b;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s;
                    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.2);
                }

                .android-install-btn:active {
                    transform: scale(0.98);
                }

                .shimmer-effect {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transform: translateX(-100%);
                    animation: shimmerMove 3s infinite;
                }

                .features-row {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 24px;
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .feature-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                }

                .feature-item span {
                    font-size: 10px;
                    color: #6b7280;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .mb-safe {
                    margin-bottom: env(safe-area-inset-bottom, 24px);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }

                @keyframes shimmerMove {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default InstallPWA;
