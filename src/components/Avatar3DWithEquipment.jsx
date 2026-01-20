import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Shield, Sword, Award, Star, ChevronLeft, ChevronRight, Check, Zap, Camera, Loader2 } from 'lucide-react';

// === SISTEMA DE EQUIPAMENTOS EVOLUTIVOS ===
const EQUIPMENT_TIERS = [
    {
        id: 'wood',
        name: 'Madeira',
        emoji: '🪵',
        minLevel: 0,
        minBosses: 0,
        color: '#8B4513',
        glowColor: 'rgba(139, 69, 19, 0.4)',
        description: 'Equipamento de iniciante',
        shieldImage: 'wood',
        swordImage: 'wood'
    },
    {
        id: 'bronze',
        name: 'Bronze',
        emoji: '🥉',
        minLevel: 5,
        minBosses: 1,
        color: '#CD7F32',
        glowColor: 'rgba(205, 127, 50, 0.4)',
        description: 'Forjado pelo esforço'
    },
    {
        id: 'iron',
        name: 'Ferro',
        emoji: '🔩',
        minLevel: 10,
        minBosses: 2,
        color: '#71797E',
        glowColor: 'rgba(113, 121, 126, 0.4)',
        description: 'Resistente e confiável'
    },
    {
        id: 'steel',
        name: 'Aço',
        emoji: '⚔️',
        minLevel: 20,
        minBosses: 3,
        color: '#C0C0C0',
        glowColor: 'rgba(192, 192, 192, 0.5)',
        description: 'Lâmina afiada'
    },
    {
        id: 'gold',
        name: 'Ouro',
        emoji: '🥇',
        minLevel: 30,
        minBosses: 4,
        color: '#FFD700',
        glowColor: 'rgba(255, 215, 0, 0.5)',
        description: 'Brilho da vitória'
    },
    {
        id: 'diamond',
        name: 'Diamante',
        emoji: '💎',
        minLevel: 40,
        minBosses: 5,
        color: '#00FFFF',
        glowColor: 'rgba(0, 255, 255, 0.5)',
        description: 'Indestrutível'
    },
    {
        id: 'legendary',
        name: 'Lendário',
        emoji: '🔥',
        minLevel: 50,
        minBosses: 6,
        color: '#FF3366',
        glowColor: 'rgba(255, 51, 102, 0.6)',
        description: 'Poder supremo'
    }
];

// Função para calcular o tier do equipamento baseado no progresso
const getEquipmentTier = (level, bossesDefeated) => {
    for (let i = EQUIPMENT_TIERS.length - 1; i >= 0; i--) {
        const tier = EQUIPMENT_TIERS[i];
        if (level >= tier.minLevel || bossesDefeated >= tier.minBosses) {
            return tier;
        }
    }
    return EQUIPMENT_TIERS[0];
};

// Componente SVG da Espada (Overlay)
const SwordOverlay = ({ tier, size = 100 }) => {
    const { color, glowColor, id } = tier;
    const isLegendary = id === 'legendary';
    const hasMagic = ['gold', 'diamond', 'legendary'].includes(id);

    return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" style={{
            filter: hasMagic ? `drop-shadow(0 0 15px ${glowColor})` : `drop-shadow(0 0 8px ${glowColor})`
        }}>
            <defs>
                <linearGradient id={`swordGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="50%" stopColor={isLegendary ? '#FFD700' : color} />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
            </defs>

            {/* Lâmina */}
            <path
                d="M30,5 L36,50 L30,55 L24,50 Z"
                fill={`url(#swordGrad-${id})`}
                stroke={id === 'wood' ? '#5a3d1a' : '#333'}
                strokeWidth="1"
            />

            {/* Linha central */}
            <line x1="30" y1="10" x2="30" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* Guarda */}
            <rect x="18" y="50" width="24" height="6" rx="2"
                fill={id === 'wood' ? '#6b4423' : color}
                stroke="#333" strokeWidth="1" />

            {/* Cabo */}
            <rect x="26" y="56" width="8" height="20" rx="2"
                fill={id === 'wood' ? '#4a3018' : '#2a2a2a'}
                stroke="#333" strokeWidth="1" />

            {/* Detalhes do cabo */}
            {['iron', 'steel', 'gold', 'diamond', 'legendary'].includes(id) && (
                <>
                    <line x1="27" y1="60" x2="33" y2="60" stroke={color} strokeWidth="1.5" />
                    <line x1="27" y1="65" x2="33" y2="65" stroke={color} strokeWidth="1.5" />
                    <line x1="27" y1="70" x2="33" y2="70" stroke={color} strokeWidth="1.5" />
                </>
            )}

            {/* Pomo */}
            <circle cx="30" cy="78" r="5"
                fill={id === 'wood' ? '#5a3d1a' : color}
                stroke="#333" strokeWidth="1" />

            {/* Gema */}
            {hasMagic && (
                <circle cx="30" cy="78" r="2.5" fill={isLegendary ? '#FF3366' : '#fff'}
                    style={{ animation: isLegendary ? 'pulse 2s ease-in-out infinite' : 'none' }} />
            )}

            {/* Efeitos mágicos lendário */}
            {isLegendary && (
                <>
                    <circle cx="30" cy="25" r="3" fill="#FF3366" opacity="0.7"
                        style={{ animation: 'float 2s ease-in-out infinite' }} />
                    <circle cx="28" cy="38" r="2" fill="#FFD700" opacity="0.6"
                        style={{ animation: 'float 2.5s ease-in-out infinite' }} />
                </>
            )}
        </svg>
    );
};

// Componente SVG do Escudo (Overlay)
const ShieldOverlay = ({ tier, size = 80 }) => {
    const { color, glowColor, id } = tier;
    const isLegendary = id === 'legendary';
    const hasMagic = ['gold', 'diamond', 'legendary'].includes(id);

    return (
        <svg width={size} height={size * 1.2} viewBox="0 0 60 72" style={{
            filter: hasMagic ? `drop-shadow(0 0 12px ${glowColor})` : `drop-shadow(0 0 6px ${glowColor})`
        }}>
            <defs>
                <linearGradient id={`shieldGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="50%" stopColor={isLegendary ? '#FFD700' : color} />
                    <stop offset="100%" stopColor={id === 'wood' ? '#6b4423' : color} />
                </linearGradient>
            </defs>

            {/* Forma do escudo */}
            <path
                d="M30,5 L55,15 L55,35 Q55,55 30,68 Q5,55 5,35 L5,15 Z"
                fill={`url(#shieldGrad-${id})`}
                stroke={id === 'wood' ? '#5a3d1a' : '#444'}
                strokeWidth="2"
            />

            {/* Borda interna */}
            <path
                d="M30,10 L50,18 L50,34 Q50,50 30,62 Q10,50 10,34 L10,18 Z"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
            />

            {/* Emblemas baseados no tier */}
            {id === 'wood' && (
                <circle cx="30" cy="36" r="12" fill="#5a3d1a" opacity="0.5" />
            )}
            {id === 'bronze' && (
                <path d="M30,24 L37,40 L30,48 L23,40 Z" fill="#8B4513" />
            )}
            {id === 'iron' && (
                <rect x="22" y="26" width="16" height="20" rx="3" fill="#555" />
            )}
            {id === 'steel' && (
                <>
                    <path d="M30,22 L42,36 L30,50 L18,36 Z" fill="#888" />
                    <circle cx="30" cy="36" r="5" fill="#bbb" />
                </>
            )}
            {id === 'gold' && (
                <>
                    <path d="M30,20 L44,36 L30,52 L16,36 Z" fill="#FFA500" />
                    <circle cx="30" cy="36" r="7" fill="#FFD700" />
                    <circle cx="30" cy="36" r="3" fill="#fff" opacity="0.6" />
                </>
            )}
            {id === 'diamond' && (
                <>
                    <polygon points="30,18 47,36 30,54 13,36" fill="#00CED1" />
                    <polygon points="30,23 42,36 30,49 18,36" fill="#00FFFF" />
                    <polygon points="30,28 36,36 30,44 24,36" fill="#fff" opacity="0.7" />
                </>
            )}
            {id === 'legendary' && (
                <>
                    <path d="M30,18 L47,36 L30,54 L13,36 Z" fill="#FF6B6B" />
                    <circle cx="30" cy="36" r="10" fill="#FF3366" />
                    <circle cx="30" cy="36" r="5" fill="#FFD700" />
                    <ellipse cx="30" cy="22" rx="5" ry="7" fill="#FF6B6B" opacity="0.8"
                        style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                </>
            )}

            {/* Reflexos */}
            {!['wood'].includes(id) && (
                <ellipse cx="20" cy="26" rx="4" ry="6" fill="rgba(255,255,255,0.25)" transform="rotate(-20 20 26)" />
            )}
        </svg>
    );
};

// Componente de Avatar 3D Realista com Equipamentos
const RealisticAvatarWithEquipment = ({ avatarUrl, userLevel, bossesDefeated, size = 300 }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);
    const tier = getEquipmentTier(userLevel, bossesDefeated);

    // URL de render do avatar 3D
    const getAvatarRenderUrl = (url) => {
        if (!url) return null;
        // Ready Player Me render API para full body
        const baseUrl = url.replace('.glb', '.png');
        return `${baseUrl}?scene=fullbody-portrait-v1-transparent&blendShapes[mouthSmile]=0.2`;
    };

    // Animação de respiração
    useEffect(() => {
        let animationId;
        let startTime;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const breathe = Math.sin(elapsed / 1500) * 3;

            if (containerRef.current) {
                containerRef.current.style.transform = `translateY(${breathe}px)`;
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const imageUrl = getAvatarRenderUrl(avatarUrl);

    return (
        <div style={{
            width: size,
            height: size * 1.35,
            borderRadius: '24px',
            background: `linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, ${tier.glowColor} 70%, #0f0f1a 100%)`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${tier.glowColor}`,
            border: `2px solid ${tier.color}55`
        }}>
            {/* Partículas de fundo animadas */}
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                [...Array(10)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: i % 2 === 0 ? '4px' : '3px',
                        height: i % 2 === 0 ? '4px' : '3px',
                        borderRadius: '50%',
                        background: tier.color,
                        left: `${8 + i * 9}%`,
                        top: `${10 + (i % 5) * 18}%`,
                        opacity: 0.6,
                        animation: `float ${2 + i * 0.4}s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`
                    }} />
                ))
            )}

            {/* Container animado */}
            <div ref={containerRef} style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* ESCUDO À ESQUERDA */}
                <div style={{
                    position: 'absolute',
                    left: '2%',
                    top: '25%',
                    transform: 'rotate(-20deg)',
                    zIndex: 3,
                    animation: 'float 4s ease-in-out infinite'
                }}>
                    <ShieldOverlay tier={tier} size={size * 0.28} />
                </div>

                {/* AVATAR 3D CENTRAL */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '70%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
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
                                    <Loader2 size={40} color={tier.color} style={{ animation: 'spin 1s linear infinite' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Carregando avatar...</span>
                                </div>
                            )}
                            <img
                                src={imageUrl}
                                alt="Avatar 3D"
                                onLoad={() => setIsLoaded(true)}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '90%',
                                    objectFit: 'contain',
                                    filter: `drop-shadow(0 10px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 20px ${tier.glowColor})`,
                                    opacity: isLoaded ? 1 : 0,
                                    transition: 'opacity 0.5s ease'
                                }}
                            />
                        </>
                    ) : (
                        /* Placeholder quando não há avatar */
                        <div style={{
                            width: '60%',
                            height: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '160px',
                                borderRadius: '20px',
                                background: `linear-gradient(180deg, ${tier.color}44, ${tier.color}22)`,
                                border: `2px dashed ${tier.color}66`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Camera size={48} color={tier.color} opacity={0.5} />
                            </div>
                            <p style={{
                                fontSize: '13px',
                                color: 'var(--text-muted)',
                                textAlign: 'center',
                                lineHeight: '1.4'
                            }}>
                                Clique para criar<br />seu avatar 3D
                            </p>
                        </div>
                    )}
                </div>

                {/* ESPADA À DIREITA */}
                <div style={{
                    position: 'absolute',
                    right: '2%',
                    top: '20%',
                    transform: 'rotate(20deg)',
                    zIndex: 3,
                    animation: 'float 4s ease-in-out infinite',
                    animationDelay: '0.5s'
                }}>
                    <SwordOverlay tier={tier} size={size * 0.32} />
                </div>
            </div>

            {/* Badge do tier no canto */}
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '6px 14px',
                background: `linear-gradient(135deg, ${tier.color}55, ${tier.color}33)`,
                borderRadius: '100px',
                border: `1px solid ${tier.color}77`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)'
            }}>
                <span style={{ fontSize: '14px' }}>{tier.emoji}</span>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: tier.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {tier.name}
                </span>
            </div>

            {/* Sombra do avatar */}
            <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '55%',
                height: '20px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(8px)'
            }} />
        </div>
    );
};

// Modal do Avatar Builder 3D com suporte a equipamentos
const Avatar3DBuilderWithEquipment = ({ isOpen, onClose, onSave, currentAvatarUrl, userLevel, bossesDefeated }) => {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('create');

    const tier = getEquipmentTier(userLevel, bossesDefeated);
    const nextTier = EQUIPMENT_TIERS.find(t => t.minLevel > userLevel) || null;

    const iframeUrl = 'https://demo.readyplayer.me/avatar?frameApi&clearCache';

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== 'https://demo.readyplayer.me') return;

            try {
                const data = JSON.parse(event.data);

                if (data.source === 'readyplayerme') {
                    if (data.eventName === 'v1.avatar.exported') {
                        const newAvatarUrl = data.data.url;
                        localStorage.setItem('avatar3DUrl', newAvatarUrl);
                        onSave(newAvatarUrl);
                        onClose();
                    }

                    if (data.eventName === 'v1.frame.ready') {
                        setIsLoading(false);
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
            } catch (e) { }
        };

        if (isOpen) {
            window.addEventListener('message', handleMessage);
            setIsLoading(true);
        }

        return () => window.removeEventListener('message', handleMessage);
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sword size={22} color={tier.color} />
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
                            Criar <span style={{ color: tier.color }}>Guerreiro 3D</span>
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
                        <button onClick={() => setActiveTab('create')} style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: activeTab === 'create' ? tier.color : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: activeTab === 'create' ? '#000' : '#fff',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '12px'
                        }}>
                            🎨 Criar Avatar
                        </button>
                        <button onClick={() => setActiveTab('equipment')} style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: activeTab === 'equipment' ? tier.color : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: activeTab === 'equipment' ? '#000' : '#fff',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '12px'
                        }}>
                            ⚔️ Equipamentos
                        </button>
                    </div>
                </div>

                <button onClick={onClose} style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            {activeTab === 'create' ? (
                <div style={{ flex: 1, position: 'relative' }}>
                    {isLoading && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-app)', zIndex: 10
                        }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                border: `3px solid ${tier.color}33`,
                                borderTopColor: tier.color,
                                animation: 'spin 1s linear infinite'
                            }} />
                            <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                Carregando criador de avatar 3D...
                            </p>
                        </div>
                    )}

                    <iframe
                        ref={iframeRef}
                        src={iframeUrl}
                        style={{
                            width: '100%', height: '100%', border: 'none',
                            opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease'
                        }}
                        allow="camera *; microphone *"
                        title="Ready Player Me Avatar Creator"
                    />
                </div>
            ) : (
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    {/* Equipamento Atual */}
                    <div style={{
                        padding: '24px',
                        background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}11)`,
                        borderRadius: '20px',
                        border: `2px solid ${tier.color}55`,
                        marginBottom: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px'
                    }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <ShieldOverlay tier={tier} size={80} />
                            <SwordOverlay tier={tier} size={70} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                Equipamento Atual
                            </p>
                            <h3 style={{ fontSize: '24px', fontWeight: '800', color: tier.color, marginBottom: '4px' }}>
                                {tier.emoji} {tier.name}
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                {tier.description}
                            </p>
                        </div>
                    </div>

                    {/* Próximo Tier */}
                    {nextTier && (
                        <div style={{
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            marginBottom: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    Próxima Evolução
                                </p>
                                <p style={{ fontSize: '14px', fontWeight: '700', color: nextTier.color }}>
                                    {nextTier.emoji} {nextTier.name}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    Faltam {nextTier.minLevel - userLevel} níveis
                                </p>
                                <div style={{
                                    width: '120px', height: '6px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '100px', marginTop: '6px'
                                }}>
                                    <div style={{
                                        width: `${(userLevel / nextTier.minLevel) * 100}%`,
                                        height: '100%',
                                        background: nextTier.color,
                                        borderRadius: '100px'
                                    }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de Tiers */}
                    <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Evolução dos Equipamentos
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {EQUIPMENT_TIERS.map((t) => {
                            const isUnlocked = userLevel >= t.minLevel || bossesDefeated >= t.minBosses;
                            const isCurrent = t.id === tier.id;

                            return (
                                <div key={t.id} style={{
                                    padding: '16px 20px',
                                    borderRadius: '16px',
                                    background: isCurrent ? `linear-gradient(135deg, ${t.color}22, ${t.color}11)` : 'rgba(255,255,255,0.02)',
                                    border: isCurrent ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.06)',
                                    opacity: isUnlocked ? 1 : 0.4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        width: '56px', height: '56px',
                                        borderRadius: '14px',
                                        background: `linear-gradient(135deg, ${t.color}44, ${t.color}22)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px'
                                    }}>
                                        {t.emoji}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '15px', color: t.color }}>
                                                {t.name}
                                            </span>
                                            {isCurrent && (
                                                <span style={{
                                                    padding: '3px 10px',
                                                    background: t.color,
                                                    borderRadius: '100px',
                                                    fontSize: '9px',
                                                    fontWeight: '700',
                                                    color: '#000'
                                                }}>ATUAL</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                                            {t.description}
                                        </p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            Nível {t.minLevel}+ ou {t.minBosses} boss{t.minBosses > 1 ? 'es' : ''} derrotado{t.minBosses > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    {isUnlocked ? (
                                        <Check size={22} color={t.color} />
                                    ) : (
                                        <span style={{ fontSize: '22px' }}>🔒</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div style={{
                padding: '12px 24px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}>
                <Shield size={14} color={tier.color} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Seu avatar usará automaticamente o equipamento <strong style={{ color: tier.color }}>{tier.name}</strong> baseado no seu progresso
                </span>
                <Sword size={14} color={tier.color} />
            </div>
        </div>
    );
};

export {
    Avatar3DBuilderWithEquipment,
    RealisticAvatarWithEquipment,
    ShieldOverlay,
    SwordOverlay,
    getEquipmentTier,
    EQUIPMENT_TIERS
};
export default Avatar3DBuilderWithEquipment;
