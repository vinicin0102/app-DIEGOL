import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, RotateCcw, Download, Camera, Loader2 } from 'lucide-react';

// Componente de Avatar 3D usando Ready Player Me
const AvatarBuilder3D = ({ isOpen, onClose, onSave, currentAvatarUrl }) => {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '');

    // Configuração do Ready Player Me
    const subdomain = 'demo'; // Pode ser customizado
    const iframeUrl = `https://demo.readyplayer.me/avatar?frameApi&clearCache`;

    useEffect(() => {
        const handleMessage = (event) => {
            // Mensagens do Ready Player Me iframe
            if (event.origin !== 'https://demo.readyplayer.me') return;

            try {
                const data = JSON.parse(event.data);

                if (data.source === 'readyplayerme') {
                    // Avatar exportado
                    if (data.eventName === 'v1.avatar.exported') {
                        const newAvatarUrl = data.data.url;
                        setAvatarUrl(newAvatarUrl);
                        localStorage.setItem('avatar3DUrl', newAvatarUrl);
                        onSave(newAvatarUrl);
                        onClose();
                    }

                    // Frame carregado
                    if (data.eventName === 'v1.frame.ready') {
                        setIsLoading(false);
                        // Enviar configuração para o iframe
                        if (iframeRef.current) {
                            iframeRef.current.contentWindow.postMessage(
                                JSON.stringify({
                                    target: 'readyplayerme',
                                    type: 'subscribe',
                                    eventName: 'v1.avatar.exported'
                                }),
                                '*'
                            );
                        }
                    }
                }
            } catch (e) {
                // Não é JSON, ignorar
            }
        };

        if (isOpen) {
            window.addEventListener('message', handleMessage);
            setIsLoading(true);
        }

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [isOpen, onSave, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.98)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(20px)'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                        Criar Avatar <span style={{ color: 'var(--primary)' }}>3D</span>
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,51,102,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Iframe Container */}
            <div style={{ flex: 1, position: 'relative' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-app)',
                        zIndex: 10
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            border: '3px solid rgba(255,255,255,0.1)',
                            borderTopColor: 'var(--primary)',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{
                            marginTop: '20px',
                            color: 'var(--text-muted)',
                            fontSize: '14px'
                        }}>
                            Carregando criador de avatar 3D...
                        </p>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={iframeUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        opacity: isLoading ? 0 : 1,
                        transition: 'opacity 0.3s ease'
                    }}
                    allow="camera *; microphone *"
                    title="Ready Player Me Avatar Creator"
                />
            </div>

            {/* Footer Info */}
            <div style={{
                padding: '12px 24px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}>
                <Camera size={14} color="var(--primary)" />
                <span style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                }}>
                    Use sua câmera para criar um avatar baseado em você ou escolha manualmente
                </span>
            </div>
        </div>
    );
};

// Componente de visualização do Avatar 3D com animação
const Avatar3DViewer = ({ avatarUrl, size = 280 }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [rotation, setRotation] = useState(0);
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    // Gerar URL do modelo 3D para visualização
    const getAvatarImageUrl = (url) => {
        if (!url) return null;
        // Ready Player Me render API
        const renderUrl = url.replace('.glb', '.png');
        // Adicionar parâmetros de render
        return `${renderUrl}?scene=fullbody-portrait-v1&blendShapes[mouthSmile]=0.3`;
    };

    // Animação de rotação suave
    useEffect(() => {
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Movimento suave de "respiração"
            const breathe = Math.sin(elapsed / 1500) * 2;
            const sway = Math.sin(elapsed / 3000) * 1;

            if (containerRef.current) {
                containerRef.current.style.transform = `translateY(${breathe}px) rotate(${sway}deg)`;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const imageUrl = getAvatarImageUrl(avatarUrl);

    return (
        <div
            style={{
                width: size,
                height: size * 1.3,
                borderRadius: '24px',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(123,47,255,0.15)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            {/* Efeito de partículas no fundo */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    radial-gradient(circle at 20% 20%, rgba(0,255,136,0.1) 0%, transparent 40%),
                    radial-gradient(circle at 80% 80%, rgba(123,47,255,0.1) 0%, transparent 40%)
                `,
                animation: 'pulse 4s ease-in-out infinite'
            }} />

            {/* Partículas flutuantes */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        opacity: 0.6,
                        animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`
                    }}
                />
            ))}

            {/* Avatar Container com animação */}
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.1s ease-out'
                }}
            >
                {imageUrl ? (
                    <>
                        {!isLoaded && (
                            <div style={{
                                position: 'absolute',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <Loader2
                                    size={32}
                                    color="var(--primary)"
                                    style={{ animation: 'spin 1s linear infinite' }}
                                />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    Carregando avatar...
                                </span>
                            </div>
                        )}
                        <img
                            src={imageUrl}
                            alt="Avatar 3D"
                            onLoad={() => setIsLoaded(true)}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                                opacity: isLoaded ? 1 : 0,
                                transition: 'opacity 0.5s ease'
                            }}
                        />
                    </>
                ) : (
                    <DefaultAvatar3D size={size} />
                )}
            </div>

            {/* Efeito de brilho na borda inferior */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '100px',
                background: 'radial-gradient(ellipse at center bottom, rgba(123,47,255,0.3) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Sombra do avatar no chão */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '20px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(8px)'
            }} />
        </div>
    );
};

// Avatar padrão animado quando não há avatar 3D
const DefaultAvatar3D = ({ size }) => {
    return (
        <div style={{
            width: size * 0.6,
            height: size * 0.8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
        }}>
            {/* Silhueta de avatar */}
            <svg
                viewBox="0 0 100 120"
                style={{
                    width: '120px',
                    height: '160px',
                    filter: 'drop-shadow(0 0 20px rgba(123,47,255,0.3))'
                }}
            >
                <defs>
                    <linearGradient id="avatarGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7B2FFF" />
                        <stop offset="100%" stopColor="#00FF88" />
                    </linearGradient>
                    <filter id="glow3D">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Cabeça */}
                <circle
                    cx="50" cy="32" r="22"
                    fill="none"
                    stroke="url(#avatarGradient3D)"
                    strokeWidth="2"
                    filter="url(#glow3D)"
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                />

                {/* Corpo */}
                <path
                    d="M25,60 Q50,45 75,60 L80,115 Q50,120 20,115 Z"
                    fill="none"
                    stroke="url(#avatarGradient3D)"
                    strokeWidth="2"
                    filter="url(#glow3D)"
                    style={{ animation: 'pulse 2s ease-in-out infinite', animationDelay: '0.3s' }}
                />

                {/* Braços */}
                <path
                    d="M25,65 Q10,75 15,95"
                    fill="none"
                    stroke="url(#avatarGradient3D)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow3D)"
                />
                <path
                    d="M75,65 Q90,75 85,95"
                    fill="none"
                    stroke="url(#avatarGradient3D)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow3D)"
                />
            </svg>

            <p style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                lineHeight: '1.5'
            }}>
                Clique para criar<br />seu avatar 3D
            </p>
        </div>
    );
};

export { AvatarBuilder3D, Avatar3DViewer, DefaultAvatar3D };
export default AvatarBuilder3D;
