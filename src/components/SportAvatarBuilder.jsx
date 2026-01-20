import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Shield, Sword, Award, Star, ChevronLeft, ChevronRight, Check, Zap } from 'lucide-react';

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
        description: 'Equipamento de iniciante'
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

// Tipos de avatar esportivo
const SPORT_AVATARS = [
    { id: 1, name: 'Atleta Corredor', type: 'runner', emoji: '🏃', outfit: 'running' },
    { id: 2, name: 'Lutador MMA', type: 'fighter', emoji: '🥊', outfit: 'mma' },
    { id: 3, name: 'Crossfitter', type: 'crossfit', emoji: '🏋️', outfit: 'crossfit' },
    { id: 4, name: 'Nadador', type: 'swimmer', emoji: '🏊', outfit: 'swim' },
    { id: 5, name: 'Ciclista', type: 'cyclist', emoji: '🚴', outfit: 'bike' },
    { id: 6, name: 'Jogador de Futebol', type: 'soccer', emoji: '⚽', outfit: 'soccer' },
    { id: 7, name: 'Jogador de Basquete', type: 'basketball', emoji: '🏀', outfit: 'basketball' },
    { id: 8, name: 'Ginasta', type: 'gymnast', emoji: '🤸', outfit: 'gymnast' }
];

// Cores de pele
const SKIN_TONES = [
    { id: 'fair', color: '#FFDCB0', name: 'Claro' },
    { id: 'light', color: '#E5B887', name: 'Médio Claro' },
    { id: 'medium', color: '#C68642', name: 'Médio' },
    { id: 'tan', color: '#8D5524', name: 'Moreno' },
    { id: 'dark', color: '#5C3317', name: 'Escuro' },
    { id: 'deep', color: '#3B1F0F', name: 'Muito Escuro' }
];

// Cores de roupa esportiva
const OUTFIT_COLORS = [
    { id: 'blue', color: '#4169E1', name: 'Azul' },
    { id: 'red', color: '#FF3366', name: 'Vermelho' },
    { id: 'green', color: '#00FF88', name: 'Verde' },
    { id: 'purple', color: '#9B30FF', name: 'Roxo' },
    { id: 'black', color: '#1a1a1a', name: 'Preto' },
    { id: 'orange', color: '#FF6B35', name: 'Laranja' },
    { id: 'gold', color: '#FFD700', name: 'Dourado' },
    { id: 'cyan', color: '#00FFFF', name: 'Ciano' }
];

// Cabelos
const HAIRSTYLES = [
    { id: 'bald', name: 'Careca', emoji: '👨‍🦲' },
    { id: 'short', name: 'Curto', emoji: '💇‍♂️' },
    { id: 'buzz', name: 'Raspado', emoji: '👨' },
    { id: 'spiky', name: 'Espetado', emoji: '⚡' },
    { id: 'ponytail', name: 'Rabo de Cavalo', emoji: '👩' },
    { id: 'afro', name: 'Afro', emoji: '👨‍🦱' },
    { id: 'braids', name: 'Tranças', emoji: '🧑‍🦱' },
    { id: 'mohawk', name: 'Moicano', emoji: '🎸' }
];

const HAIR_COLORS = [
    { id: 'black', color: '#1a1a1a', name: 'Preto' },
    { id: 'brown', color: '#4a3728', name: 'Castanho' },
    { id: 'blonde', color: '#e6c87a', name: 'Loiro' },
    { id: 'red', color: '#b44c43', name: 'Ruivo' },
    { id: 'gray', color: '#9e9e9e', name: 'Grisalho' },
    { id: 'blue', color: '#4169E1', name: 'Azul' },
    { id: 'green', color: '#00FF88', name: 'Verde' }
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

// Componente SVG da Espada
const SwordSVG = ({ tier, size = 80 }) => {
    const { color, glowColor, id } = tier;

    // Detalhes baseados no tier
    const isLegendary = id === 'legendary';
    const hasMagic = ['gold', 'diamond', 'legendary'].includes(id);

    return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" style={{
            filter: hasMagic ? `drop-shadow(0 0 10px ${glowColor})` : 'none'
        }}>
            <defs>
                <linearGradient id={`swordGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="50%" stopColor={isLegendary ? '#FFD700' : color} />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
                {hasMagic && (
                    <filter id={`swordGlow-${id}`}>
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                )}
            </defs>

            {/* Lâmina */}
            <path
                d="M30,5 L36,50 L30,55 L24,50 Z"
                fill={`url(#swordGrad-${id})`}
                stroke={id === 'wood' ? '#5a3d1a' : '#333'}
                strokeWidth="1"
                filter={hasMagic ? `url(#swordGlow-${id})` : undefined}
            />

            {/* Linha central da lâmina */}
            <line x1="30" y1="10" x2="30" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

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
                    <line x1="27" y1="60" x2="33" y2="60" stroke={color} strokeWidth="1" />
                    <line x1="27" y1="65" x2="33" y2="65" stroke={color} strokeWidth="1" />
                    <line x1="27" y1="70" x2="33" y2="70" stroke={color} strokeWidth="1" />
                </>
            )}

            {/* Pomo */}
            <circle cx="30" cy="78" r="4"
                fill={id === 'wood' ? '#5a3d1a' : color}
                stroke="#333" strokeWidth="1" />

            {/* Gema para tiers altos */}
            {hasMagic && (
                <circle cx="30" cy="78" r="2" fill={isLegendary ? '#FF3366' : '#fff'}
                    style={{ animation: isLegendary ? 'pulse 2s ease-in-out infinite' : 'none' }} />
            )}

            {/* Efeitos mágicos para lendário */}
            {isLegendary && (
                <>
                    <circle cx="30" cy="30" r="3" fill="#FF3366" opacity="0.6"
                        style={{ animation: 'float 2s ease-in-out infinite' }} />
                    <circle cx="28" cy="40" r="2" fill="#FFD700" opacity="0.5"
                        style={{ animation: 'float 2.5s ease-in-out infinite' }} />
                </>
            )}
        </svg>
    );
};

// Componente SVG do Escudo/Armadura
const ShieldSVG = ({ tier, size = 70 }) => {
    const { color, glowColor, id } = tier;

    const isLegendary = id === 'legendary';
    const hasMagic = ['gold', 'diamond', 'legendary'].includes(id);

    return (
        <svg width={size} height={size * 1.2} viewBox="0 0 60 72" style={{
            filter: hasMagic ? `drop-shadow(0 0 8px ${glowColor})` : 'none'
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
                stroke={id === 'wood' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}
                strokeWidth="1"
            />

            {/* Emblema central */}
            {id === 'wood' && (
                <circle cx="30" cy="36" r="10" fill="#5a3d1a" opacity="0.5" />
            )}
            {id === 'bronze' && (
                <path d="M30,26 L35,40 L30,45 L25,40 Z" fill="#8B4513" />
            )}
            {id === 'iron' && (
                <rect x="24" y="28" width="12" height="16" rx="2" fill="#555" />
            )}
            {id === 'steel' && (
                <>
                    <path d="M30,25 L40,36 L30,47 L20,36 Z" fill="#888" />
                    <circle cx="30" cy="36" r="4" fill="#aaa" />
                </>
            )}
            {id === 'gold' && (
                <>
                    <path d="M30,23 L42,36 L30,49 L18,36 Z" fill="#FFA500" />
                    <circle cx="30" cy="36" r="6" fill="#FFD700" />
                    <circle cx="30" cy="36" r="3" fill="#fff" opacity="0.5" />
                </>
            )}
            {id === 'diamond' && (
                <>
                    <polygon points="30,20 45,36 30,52 15,36" fill="#00CED1" />
                    <polygon points="30,25 40,36 30,47 20,36" fill="#00FFFF" />
                    <polygon points="30,30 35,36 30,42 25,36" fill="#fff" opacity="0.6" />
                </>
            )}
            {id === 'legendary' && (
                <>
                    <path d="M30,20 L45,36 L30,52 L15,36 Z" fill="#FF6B6B" />
                    <circle cx="30" cy="36" r="8" fill="#FF3366" />
                    <circle cx="30" cy="36" r="4" fill="#FFD700" />
                    {/* Chamas animadas */}
                    <ellipse cx="30" cy="24" rx="4" ry="6" fill="#FF6B6B" opacity="0.7"
                        style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                </>
            )}

            {/* Reflexos */}
            {!['wood'].includes(id) && (
                <ellipse cx="22" cy="28" rx="3" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-20 22 28)" />
            )}
        </svg>
    );
};

// Componente do Avatar Esportivo
const SportAvatarSVG = ({ config, size = 200, equipmentTier }) => {
    const { skinColor, hairStyle, hairColor, outfitColor, avatarType } = config;

    return (
        <svg width={size} height={size * 1.4} viewBox="0 0 100 140">
            <defs>
                <linearGradient id="outfitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={outfitColor} />
                    <stop offset="100%" stopColor={`${outfitColor}99`} />
                </linearGradient>
            </defs>

            {/* Corpo/Roupa Esportiva */}
            <path
                d="M35,72 L30,130 L70,130 L65,72 Q50,65 35,72 Z"
                fill="url(#outfitGradient)"
            />

            {/* Shorts esportivos */}
            <path
                d="M32,95 L30,115 L45,115 L50,100 L55,115 L70,115 L68,95 Z"
                fill={`${outfitColor}88`}
            />
            <line x1="50" y1="95" x2="50" y2="110" stroke={outfitColor} strokeWidth="2" />

            {/* Detalhes da roupa esportiva */}
            <line x1="35" y1="75" x2="35" y2="92" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1="65" y1="75" x2="65" y2="92" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

            {/* Número na camisa */}
            <text x="50" y="88" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10" fontWeight="bold">
                01
            </text>

            {/* Braços */}
            <path d="M32,74 L20,95 L26,100 L38,80" fill={skinColor} />
            <path d="M68,74 L80,95 L74,100 L62,80" fill={skinColor} />

            {/* Mangas esportivas */}
            <path d="M32,74 L25,82 L30,85 L36,78" fill={outfitColor} />
            <path d="M68,74 L75,82 L70,85 L64,78" fill={outfitColor} />

            {/* Pescoço */}
            <rect x="44" y="58" width="12" height="16" rx="4" fill={skinColor} />

            {/* Cabeça */}
            <ellipse cx="50" cy="40" rx="22" ry="25" fill={skinColor} />

            {/* Orelhas */}
            <ellipse cx="28" cy="42" rx="4" ry="6" fill={skinColor} />
            <ellipse cx="72" cy="42" rx="4" ry="6" fill={skinColor} />

            {/* Cabelo baseado no estilo */}
            {hairStyle === 'short' && (
                <path d="M32,32 Q50,18 68,32 Q72,20 65,12 Q50,5 35,12 Q28,20 32,32 Z" fill={hairColor} />
            )}
            {hairStyle === 'buzz' && (
                <ellipse cx="50" cy="28" rx="20" ry="12" fill={hairColor} opacity="0.8" />
            )}
            {hairStyle === 'spiky' && (
                <>
                    <polygon points="50,5 46,25 54,25" fill={hairColor} />
                    <polygon points="38,12 40,28 48,22" fill={hairColor} />
                    <polygon points="62,12 60,28 52,22" fill={hairColor} />
                    <polygon points="30,22 35,32 42,26" fill={hairColor} />
                    <polygon points="70,22 65,32 58,26" fill={hairColor} />
                </>
            )}
            {hairStyle === 'ponytail' && (
                <>
                    <path d="M30,32 Q50,15 70,32 Q75,18 60,10 Q50,5 40,10 Q25,18 30,32 Z" fill={hairColor} />
                    <path d="M50,20 Q60,22 58,45 Q56,65 50,75" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
                </>
            )}
            {hairStyle === 'afro' && (
                <>
                    <circle cx="50" cy="30" r="26" fill={hairColor} />
                    <circle cx="32" cy="35" r="12" fill={hairColor} />
                    <circle cx="68" cy="35" r="12" fill={hairColor} />
                </>
            )}
            {hairStyle === 'braids' && (
                <>
                    <path d="M30,32 Q50,15 70,32" fill={hairColor} />
                    <path d="M32,35 Q28,50 30,70" stroke={hairColor} strokeWidth="5" fill="none" />
                    <path d="M68,35 Q72,50 70,70" stroke={hairColor} strokeWidth="5" fill="none" />
                    <circle cx="30" cy="72" r="3" fill={hairColor} />
                    <circle cx="70" cy="72" r="3" fill={hairColor} />
                </>
            )}
            {hairStyle === 'mohawk' && (
                <path d="M45,5 Q50,0 55,5 L58,32 L42,32 Z" fill={hairColor} />
            )}

            {/* Olhos */}
            <ellipse cx="40" cy="42" rx="5" ry="4" fill="white" />
            <ellipse cx="60" cy="42" rx="5" ry="4" fill="white" />
            <circle cx="40" cy="42" r="2.5" fill="#333" />
            <circle cx="60" cy="42" r="2.5" fill="#333" />
            <circle cx="39" cy="41" r="1" fill="white" />
            <circle cx="59" cy="41" r="1" fill="white" />

            {/* Sobrancelhas determinadas */}
            <line x1="35" y1="36" x2="45" y2="38" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="38" x2="65" y2="36" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

            {/* Nariz */}
            <ellipse cx="50" cy="48" rx="2" ry="3" fill={skinColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

            {/* Boca sorridente/determinada */}
            <path d="M42,55 Q50,60 58,55" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Faixa esportiva na testa */}
            <rect x="28" y="30" width="44" height="4" rx="2" fill={outfitColor} />

            {/* Tênis */}
            <ellipse cx="38" cy="132" rx="8" ry="4" fill="#fff" />
            <ellipse cx="62" cy="132" rx="8" ry="4" fill="#fff" />
            <ellipse cx="38" cy="132" rx="6" ry="3" fill={outfitColor} />
            <ellipse cx="62" cy="132" rx="6" ry="3" fill={outfitColor} />
        </svg>
    );
};

// Componente principal do Avatar com Equipamentos
const WarriorAvatarDisplay = ({ config, userLevel, bossesDefeated, size = 280 }) => {
    const tier = getEquipmentTier(userLevel, bossesDefeated);
    const containerRef = useRef(null);

    // Animação de respiração
    useEffect(() => {
        let animationId;
        let startTime;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const breathe = Math.sin(elapsed / 1500) * 2;

            if (containerRef.current) {
                containerRef.current.style.transform = `translateY(${breathe}px)`;
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div style={{
            width: size,
            height: size * 1.4,
            borderRadius: '24px',
            background: `linear-gradient(180deg, #1a1a2e 0%, ${tier.glowColor} 50%, #0f0f1a 100%)`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 60px ${tier.glowColor}`,
            border: `2px solid ${tier.color}44`
        }}>
            {/* Partículas de fundo */}
            {['gold', 'diamond', 'legendary'].includes(tier.id) && (
                [...Array(8)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: tier.color,
                        left: `${10 + i * 12}%`,
                        top: `${15 + (i % 4) * 20}%`,
                        opacity: 0.5,
                        animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`
                    }} />
                ))
            )}

            {/* Container do avatar animado */}
            <div ref={containerRef} style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Escudo à esquerda */}
                <div style={{
                    position: 'absolute',
                    left: '5%',
                    top: '35%',
                    transform: 'rotate(-15deg)',
                    zIndex: 2
                }}>
                    <ShieldSVG tier={tier} size={size * 0.22} />
                </div>

                {/* Avatar central */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '-10%'
                }}>
                    <SportAvatarSVG
                        config={config}
                        size={size * 0.65}
                        equipmentTier={tier}
                    />
                </div>

                {/* Espada à direita */}
                <div style={{
                    position: 'absolute',
                    right: '5%',
                    top: '30%',
                    transform: 'rotate(15deg)',
                    zIndex: 2
                }}>
                    <SwordSVG tier={tier} size={size * 0.25} />
                </div>
            </div>

            {/* Badge do tier */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 16px',
                background: `linear-gradient(135deg, ${tier.color}44, ${tier.color}22)`,
                borderRadius: '20px',
                border: `1px solid ${tier.color}66`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 4px 15px ${tier.glowColor}`
            }}>
                <span style={{ fontSize: '16px' }}>{tier.emoji}</span>
                <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: tier.color,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {tier.name}
                </span>
            </div>

            {/* Sombra */}
            <div style={{
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '15px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(5px)'
            }} />
        </div>
    );
};

// Builder de Avatar Esportivo
const SportAvatarBuilder = ({ isOpen, onClose, onSave, initialConfig, userLevel, bossesDefeated }) => {
    const defaultConfig = {
        skinColor: SKIN_TONES[2].color,
        skinId: 'medium',
        hairStyle: 'short',
        hairColor: HAIR_COLORS[0].color,
        hairColorId: 'black',
        outfitColor: OUTFIT_COLORS[0].color,
        outfitColorId: 'blue',
        avatarType: 'runner'
    };

    const [config, setConfig] = useState(initialConfig || defaultConfig);
    const [activeTab, setActiveTab] = useState('skin');

    const tier = getEquipmentTier(userLevel, bossesDefeated);
    const nextTier = EQUIPMENT_TIERS.find(t => t.minLevel > userLevel) || null;

    useEffect(() => {
        if (initialConfig) setConfig(initialConfig);
    }, [initialConfig]);

    const handleSave = () => {
        localStorage.setItem('sportAvatarConfig', JSON.stringify(config));
        onSave(config);
        onClose();
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'skin', name: 'Pele', icon: '🎨' },
        { id: 'hair', name: 'Cabelo', icon: '💇' },
        { id: 'outfit', name: 'Roupa', icon: '👕' },
        { id: 'equipment', name: 'Equipamentos', icon: '⚔️' }
    ];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(20px)'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '950px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 28px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Sword size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '22px', fontWeight: '900' }}>
                            Criar <span className="text-gradient">Guerreiro</span>
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer'
                    }}>✕</button>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Preview */}
                    <div style={{
                        width: '350px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                        borderRight: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <WarriorAvatarDisplay
                            config={config}
                            userLevel={userLevel}
                            bossesDefeated={bossesDefeated}
                            size={240}
                        />

                        {/* Tier Info */}
                        <div style={{
                            marginTop: '20px',
                            padding: '12px 20px',
                            background: `linear-gradient(135deg, ${tier.color}22, transparent)`,
                            borderRadius: '12px',
                            border: `1px solid ${tier.color}44`,
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                Equipamento Atual
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: tier.color }}>
                                {tier.emoji} {tier.name}
                            </p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {tier.description}
                            </p>
                        </div>

                        {nextTier && (
                            <p style={{
                                marginTop: '12px',
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                textAlign: 'center'
                            }}>
                                Próximo: <span style={{ color: nextTier.color }}>{nextTier.emoji} {nextTier.name}</span>
                                <br />Nível {nextTier.minLevel}+
                            </p>
                        )}
                    </div>

                    {/* Options */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            overflowX: 'auto'
                        }}>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                    padding: '10px 18px',
                                    borderRadius: '10px',
                                    background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    color: activeTab === tab.id ? '#000' : '#fff',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <span>{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                            {activeTab === 'skin' && (
                                <div>
                                    <h4 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Tom de Pele
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {SKIN_TONES.map(tone => (
                                            <button key={tone.id} onClick={() => setConfig({
                                                ...config, skinColor: tone.color, skinId: tone.id
                                            })} style={{
                                                width: '52px', height: '52px', borderRadius: '50%',
                                                background: tone.color,
                                                border: config.skinId === tone.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                boxShadow: config.skinId === tone.id ? '0 0 20px var(--primary-glow)' : 'none'
                                            }}>
                                                {config.skinId === tone.id && (
                                                    <Check size={20} color="#000" style={{
                                                        position: 'absolute', top: '50%', left: '50%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hair' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            Estilo de Cabelo
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {HAIRSTYLES.map(style => (
                                                <button key={style.id} onClick={() => setConfig({
                                                    ...config, hairStyle: style.id
                                                })} style={{
                                                    padding: '10px 16px', borderRadius: '10px',
                                                    background: config.hairStyle === style.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                                    border: config.hairStyle === style.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                                    cursor: 'pointer', color: '#fff',
                                                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px'
                                                }}>
                                                    <span style={{ fontSize: '18px' }}>{style.emoji}</span>
                                                    {style.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            Cor do Cabelo
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {HAIR_COLORS.map(color => (
                                                <button key={color.id} onClick={() => setConfig({
                                                    ...config, hairColor: color.color, hairColorId: color.id
                                                })} style={{
                                                    width: '44px', height: '44px', borderRadius: '10px',
                                                    background: color.color,
                                                    border: config.hairColorId === color.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                                    cursor: 'pointer'
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'outfit' && (
                                <div>
                                    <h4 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Cor da Roupa Esportiva
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {OUTFIT_COLORS.map(color => (
                                            <button key={color.id} onClick={() => setConfig({
                                                ...config, outfitColor: color.color, outfitColorId: color.id
                                            })} style={{
                                                width: '52px', height: '52px', borderRadius: '12px',
                                                background: color.color,
                                                border: config.outfitColorId === color.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                                cursor: 'pointer',
                                                boxShadow: config.outfitColorId === color.id ? '0 0 20px var(--primary-glow)' : 'none'
                                            }} />
                                        ))}
                                    </div>
                                    <p style={{
                                        marginTop: '20px',
                                        padding: '12px 16px',
                                        background: 'rgba(0,255,136,0.1)',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(0,255,136,0.2)',
                                        fontSize: '12px',
                                        color: 'var(--text-muted)'
                                    }}>
                                        💪 Seu personagem usa roupa esportiva para mostrar que está pronto para os desafios!
                                    </p>
                                </div>
                            )}

                            {activeTab === 'equipment' && (
                                <div>
                                    <h4 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Evolução dos Equipamentos
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {EQUIPMENT_TIERS.map((t, i) => {
                                            const isUnlocked = userLevel >= t.minLevel || bossesDefeated >= t.minBosses;
                                            const isCurrent = t.id === tier.id;

                                            return (
                                                <div key={t.id} style={{
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    background: isCurrent ? `linear-gradient(135deg, ${t.color}22, ${t.color}11)` : 'rgba(255,255,255,0.03)',
                                                    border: isCurrent ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.08)',
                                                    opacity: isUnlocked ? 1 : 0.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px'
                                                }}>
                                                    <div style={{
                                                        width: '50px', height: '50px',
                                                        borderRadius: '12px',
                                                        background: `linear-gradient(135deg, ${t.color}44, ${t.color}22)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '24px'
                                                    }}>
                                                        {t.emoji}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontWeight: '700', color: t.color }}>
                                                                {t.name}
                                                            </span>
                                                            {isCurrent && (
                                                                <span style={{
                                                                    padding: '2px 8px',
                                                                    background: t.color,
                                                                    borderRadius: '100px',
                                                                    fontSize: '9px',
                                                                    fontWeight: '700',
                                                                    color: '#000'
                                                                }}>ATUAL</span>
                                                            )}
                                                        </div>
                                                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                            {t.description}
                                                        </p>
                                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                            Nível {t.minLevel}+ ou {t.minBosses} boss{t.minBosses > 1 ? 'es' : ''} derrotado{t.minBosses > 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    {isUnlocked ? (
                                                        <Check size={20} color={t.color} />
                                                    ) : (
                                                        <span style={{ fontSize: '20px' }}>🔒</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 28px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button onClick={onClose} className="btn-secondary" style={{ padding: '12px 24px' }}>
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="btn-primary" style={{ padding: '12px 32px' }}>
                        Salvar Guerreiro
                    </button>
                </div>
            </div>
        </div>
    );
};

export {
    SportAvatarBuilder,
    WarriorAvatarDisplay,
    SwordSVG,
    ShieldSVG,
    getEquipmentTier,
    EQUIPMENT_TIERS,
    SKIN_TONES,
    OUTFIT_COLORS,
    HAIRSTYLES,
    HAIR_COLORS
};
export default SportAvatarBuilder;
