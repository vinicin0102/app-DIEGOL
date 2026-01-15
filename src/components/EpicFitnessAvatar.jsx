import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Medal, Trophy, Flame, Zap, Target, Heart, Star, Crown, X, Check, Activity } from 'lucide-react';

// === SISTEMA DE NÍVEIS FITNESS ===
const FITNESS_TIERS = [
    {
        id: 'beginner', name: 'Iniciante', emoji: '🌱', minLevel: 0, minBosses: 0,
        color: '#4CAF50', glowColor: 'rgba(76, 175, 80, 0.5)', auraColor: '#4CAF50'
    },
    {
        id: 'regular', name: 'Regular', emoji: '💪', minLevel: 5, minBosses: 1,
        color: '#2196F3', glowColor: 'rgba(33, 150, 243, 0.5)', auraColor: '#2196F3'
    },
    {
        id: 'athlete', name: 'Atleta', emoji: '🏃', minLevel: 10, minBosses: 2,
        color: '#9C27B0', glowColor: 'rgba(156, 39, 176, 0.5)', auraColor: '#9C27B0'
    },
    {
        id: 'pro', name: 'Pro', emoji: '🏆', minLevel: 20, minBosses: 3,
        color: '#FF9800', glowColor: 'rgba(255, 152, 0, 0.6)', auraColor: '#FF9800'
    },
    {
        id: 'elite', name: 'Elite', emoji: '⭐', minLevel: 30, minBosses: 4,
        color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.6)', auraColor: '#FFD700'
    },
    {
        id: 'champion', name: 'Campeão', emoji: '👑', minLevel: 40, minBosses: 5,
        color: '#E91E63', glowColor: 'rgba(233, 30, 99, 0.6)', auraColor: '#E91E63'
    },
    {
        id: 'legend', name: 'Lenda', emoji: '🔥', minLevel: 50, minBosses: 6,
        color: '#FF3366', glowColor: 'rgba(255, 51, 102, 0.7)', auraColor: '#FF3366'
    }
];

const getFitnessTier = (level, bossesDefeated) => {
    for (let i = FITNESS_TIERS.length - 1; i >= 0; i--) {
        if (level >= FITNESS_TIERS[i].minLevel || bossesDefeated >= FITNESS_TIERS[i].minBosses) {
            return FITNESS_TIERS[i];
        }
    }
    return FITNESS_TIERS[0];
};

// CSS Keyframes para animações
const avatarStyles = `
@keyframes energyPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
}
@keyframes floatEquipment {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
}
@keyframes auraSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
@keyframes particleFloat {
    0% { opacity: 0; transform: translateY(20px) scale(0); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
}
@keyframes heroBreath {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.02); }
}
@keyframes glowPulse {
    0%, 100% { filter: drop-shadow(0 0 20px var(--glow-color)); }
    50% { filter: drop-shadow(0 0 40px var(--glow-color)); }
}
`;

// Componente do Avatar Épico estilo Jogo
const EpicAvatarSVG = ({ config, tier, size = 280 }) => {
    const { skinTone, hairStyle, hairColor, outfitColor, bodyType } = config;

    // Cores secundárias baseadas na cor principal
    const accentColor = tier.color;
    const glowColor = tier.glowColor;

    // Escala muscular baseada no tipo de corpo
    const muscleScale = bodyType === 'bodybuilder' ? 1.25 :
        bodyType === 'muscular' ? 1.15 :
            bodyType === 'fit' ? 1.05 : 1;

    return (
        <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{
            filter: `drop-shadow(0 0 30px ${glowColor})`
        }}>
            <defs>
                {/* Gradientes para o corpo */}
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={skinTone} />
                    <stop offset="100%" stopColor={`${skinTone}dd`} />
                </linearGradient>

                {/* Gradiente da roupa esportiva futurística */}
                <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a2e" />
                    <stop offset="50%" stopColor="#16213e" />
                    <stop offset="100%" stopColor="#0f0f1a" />
                </linearGradient>

                {/* Gradiente neon para detalhes */}
                <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={accentColor} />
                    <stop offset="50%" stopColor="#00FF88" />
                    <stop offset="100%" stopColor={accentColor} />
                </linearGradient>

                {/* Gradiente para músculos - sombreamento 3D */}
                <linearGradient id="muscleShade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="50%" stopColor="rgba(0,0,0,0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                </linearGradient>

                {/* Filtro de brilho */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Filtro para efeito metálico */}
                <filter id="metallic">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <feOffset in="blur" dx="1" dy="2" result="offsetBlur" />
                    <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
                </filter>
            </defs>

            {/* === AURA DE ENERGIA === */}
            <g style={{ animation: 'auraSpin 8s linear infinite' }}>
                <ellipse cx="100" cy="140" rx="85" ry="100"
                    fill="none" stroke={accentColor} strokeWidth="2"
                    strokeDasharray="10 5" opacity="0.3" />
                <ellipse cx="100" cy="140" rx="75" ry="90"
                    fill="none" stroke="#00FF88" strokeWidth="1"
                    strokeDasharray="5 10" opacity="0.2" />
            </g>

            {/* === PERNAS MUSCULOSAS === */}
            <g transform={`scale(${muscleScale}) translate(${(1 - muscleScale) * 100}, 0)`}>
                {/* Perna esquerda */}
                <path d="M70,175 Q60,200 62,240 L78,240 Q80,210 82,180"
                    fill="url(#outfitGrad)" stroke="#000" strokeWidth="0.5" />
                {/* Linha neon na perna */}
                <path d="M65,180 L64,235" stroke="url(#neonGrad)" strokeWidth="2" />

                {/* Perna direita */}
                <path d="M130,175 Q140,200 138,240 L122,240 Q120,210 118,180"
                    fill="url(#outfitGrad)" stroke="#000" strokeWidth="0.5" />
                <path d="M135,180 L136,235" stroke="url(#neonGrad)" strokeWidth="2" />

                {/* Tênis esportivos */}
                <ellipse cx="70" cy="245" rx="15" ry="6" fill="#1a1a1a" />
                <ellipse cx="70" cy="245" rx="12" ry="4" fill={accentColor} />
                <ellipse cx="130" cy="245" rx="15" ry="6" fill="#1a1a1a" />
                <ellipse cx="130" cy="245" rx="12" ry="4" fill={accentColor} />
            </g>

            {/* === TORSO MUSCULOSO === */}
            <g transform={`scale(${muscleScale}) translate(${(1 - muscleScale) * 100}, ${(1 - muscleScale) * 50})`}>
                {/* Corpo principal - camisa compression */}
                <path d="M60,85 Q50,100 48,130 L48,175 Q70,185 100,185 Q130,185 152,175 
                         L152,130 Q150,100 140,85 Q120,75 100,75 Q80,75 60,85"
                    fill="url(#outfitGrad)" stroke="#000" strokeWidth="0.5" />

                {/* Padrão hexagonal futurístico no peito */}
                <path d="M75,100 L85,95 L95,100 L95,115 L85,120 L75,115 Z"
                    fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
                <path d="M105,100 L115,95 L125,100 L125,115 L115,120 L105,115 Z"
                    fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
                <path d="M90,115 L100,110 L110,115 L110,130 L100,135 L90,130 Z"
                    fill="none" stroke="#00FF88" strokeWidth="1.5" opacity="0.6" />

                {/* Linhas de energia nas laterais */}
                <path d="M52,100 Q55,140 50,170" stroke="url(#neonGrad)" strokeWidth="3" fill="none" />
                <path d="M148,100 Q145,140 150,170" stroke="url(#neonGrad)" strokeWidth="3" fill="none" />

                {/* Definição de abdômen (6-pack hint) */}
                <line x1="100" y1="125" x2="100" y2="170" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                <line x1="85" y1="130" x2="85" y2="160" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                <line x1="115" y1="130" x2="115" y2="160" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

                {/* Cinto de campeão */}
                <rect x="55" y="165" width="90" height="15" rx="3" fill="#1a1a1a" />
                <rect x="85" y="167" width="30" height="11" rx="2" fill={accentColor} />
                <circle cx="100" cy="172" r="4" fill="#FFD700" />
            </g>

            {/* === BRAÇOS MUSCULOSOS === */}
            <g transform={`scale(${muscleScale}) translate(${(1 - muscleScale) * 100}, ${(1 - muscleScale) * 30})`}>
                {/* Braço esquerdo - bíceps flexionado */}
                <path d="M48,90 Q25,100 20,120 Q18,135 25,145 L40,140 Q50,125 50,105"
                    fill="url(#skinGrad)" />
                {/* Definição do bíceps */}
                <ellipse cx="32" cy="118" rx="12" ry="8" fill="url(#muscleShade)" />
                {/* Antebraço */}
                <path d="M25,145 Q15,160 20,175 L35,175 Q38,162 40,150"
                    fill="url(#skinGrad)" />
                {/* Pulseira fitness */}
                <rect x="18" y="168" width="18" height="5" rx="2" fill={accentColor} />

                {/* Braço direito - segurando halter */}
                <path d="M152,90 Q175,100 180,120 Q182,135 175,145 L160,140 Q150,125 150,105"
                    fill="url(#skinGrad)" />
                <ellipse cx="168" cy="118" rx="12" ry="8" fill="url(#muscleShade)" />
                <path d="M175,145 Q185,160 180,175 L165,175 Q162,162 160,150"
                    fill="url(#skinGrad)" />
                <rect x="164" y="168" width="18" height="5" rx="2" fill={accentColor} />
            </g>

            {/* === CABEÇA E ROSTO === */}
            <g>
                {/* Pescoço musculoso */}
                <path d="M85,75 L85,58 Q100,55 115,58 L115,75" fill="url(#skinGrad)" />

                {/* Cabeça */}
                <ellipse cx="100" cy="42" rx="28" ry="32" fill="url(#skinGrad)" />

                {/* Mandíbula forte */}
                <path d="M72,45 Q75,65 100,70 Q125,65 128,45" fill="url(#skinGrad)" />

                {/* Orelhas */}
                <ellipse cx="72" cy="42" rx="5" ry="8" fill="url(#skinGrad)" />
                <ellipse cx="128" cy="42" rx="5" ry="8" fill="url(#skinGrad)" />

                {/* Cabelo estilo atleta */}
                {hairStyle === 'short' && (
                    <path d="M75,25 Q100,8 125,25 Q130,15 120,8 Q100,0 80,8 Q70,15 75,25"
                        fill={hairColor} />
                )}
                {hairStyle === 'buzz' && (
                    <ellipse cx="100" cy="25" rx="25" ry="15" fill={hairColor} opacity="0.8" />
                )}
                {hairStyle === 'spiky' && (
                    <>
                        <polygon points="100,2 95,22 105,22" fill={hairColor} />
                        <polygon points="85,8 88,25 98,20" fill={hairColor} />
                        <polygon points="115,8 112,25 102,20" fill={hairColor} />
                        <polygon points="75,18 82,28 90,22" fill={hairColor} />
                        <polygon points="125,18 118,28 110,22" fill={hairColor} />
                    </>
                )}
                {hairStyle === 'mohawk' && (
                    <path d="M92,0 Q100,-5 108,0 L110,28 L90,28 Z" fill={hairColor} />
                )}

                {/* Olhos determinados */}
                <ellipse cx="88" cy="40" rx="6" ry="4" fill="#fff" />
                <ellipse cx="112" cy="40" rx="6" ry="4" fill="#fff" />
                <circle cx="88" cy="40" r="3" fill="#1a1a1a" />
                <circle cx="112" cy="40" r="3" fill="#1a1a1a" />
                {/* Brilho nos olhos */}
                <circle cx="87" cy="39" r="1" fill="#fff" />
                <circle cx="111" cy="39" r="1" fill="#fff" />

                {/* Sobrancelhas fortes */}
                <path d="M80,34 Q88,32 94,35" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
                <path d="M106,35 Q112,32 120,34" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />

                {/* Nariz */}
                <path d="M98,42 L100,52 L102,42" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />

                {/* Boca confiante */}
                <path d="M90,58 Q100,62 110,58" stroke="#8B4513" strokeWidth="2" fill="none" />

                {/* Barba leve (opcional) */}
                <ellipse cx="100" cy="62" rx="12" ry="8" fill="rgba(0,0,0,0.05)" />

                {/* Faixa na testa */}
                <rect x="72" y="28" width="56" height="6" rx="3" fill={accentColor} />
                <circle cx="100" cy="31" r="3" fill="#FFD700" />
            </g>

            {/* === EQUIPAMENTOS FLUTUANTES === */}
            {/* Halter Esquerdo */}
            <g style={{ animation: 'floatEquipment 3s ease-in-out infinite' }}>
                <rect x="5" y="100" width="35" height="12" rx="3" fill="#FFD700" filter="url(#glow)" />
                <rect x="0" y="95" width="12" height="22" rx="2" fill="#FFD700" />
                <rect x="28" y="95" width="12" height="22" rx="2" fill="#FFD700" />
                <ellipse cx="22" cy="106" rx="3" ry="3" fill="#fff" opacity="0.5" />
            </g>

            {/* Halter Direito */}
            <g style={{ animation: 'floatEquipment 3s ease-in-out infinite', animationDelay: '0.5s' }}>
                <rect x="160" y="100" width="35" height="12" rx="3" fill="#FFD700" filter="url(#glow)" />
                <rect x="155" y="95" width="12" height="22" rx="2" fill="#FFD700" />
                <rect x="183" y="95" width="12" height="22" rx="2" fill="#FFD700" />
                <ellipse cx="177" cy="106" rx="3" ry="3" fill="#fff" opacity="0.5" />
            </g>

            {/* Medalha de Campeão */}
            <g style={{ animation: 'floatEquipment 4s ease-in-out infinite', animationDelay: '1s' }}>
                {/* Fita */}
                <polygon points="170,30 180,55 190,30" fill={accentColor} />
                {/* Medalha */}
                <circle cx="180" cy="65" r="18" fill="#FFD700" stroke="#B8860B" strokeWidth="2" filter="url(#glow)" />
                <circle cx="180" cy="65" r="13" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
                {/* Estrela central */}
                <polygon points="180,52 183,60 192,60 185,66 187,74 180,70 173,74 175,66 168,60 177,60"
                    fill="#fff" />
            </g>

            {/* === PARTÍCULAS DE ENERGIA === */}
            {[...Array(8)].map((_, i) => (
                <circle
                    key={i}
                    cx={50 + i * 15}
                    cy={200 - i * 10}
                    r={2 + (i % 3)}
                    fill={i % 2 === 0 ? accentColor : '#00FF88'}
                    style={{
                        animation: `particleFloat ${2 + i * 0.3}s ease-out infinite`,
                        animationDelay: `${i * 0.2}s`
                    }}
                />
            ))}

            {/* === EFEITO DE AURA INFERIOR === */}
            <ellipse cx="100" cy="250" rx="60" ry="8"
                fill={`url(#neonGrad)`} opacity="0.4" />
        </svg>
    );
};

// === DISPLAY PRINCIPAL ÉPICO ===
const EpicFitnessAvatarDisplay = ({ config, userLevel, bossesDefeated, size = 350 }) => {
    const tier = getFitnessTier(userLevel, bossesDefeated);
    const containerRef = useRef(null);

    useEffect(() => {
        // Injetar CSS de animações
        const styleId = 'epic-avatar-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = avatarStyles;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div style={{
            width: size,
            height: size * 1.35,
            borderRadius: '28px',
            background: `
                radial-gradient(ellipse at 50% 30%, ${tier.glowColor} 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, ${tier.color}33 0%, transparent 40%),
                linear-gradient(180deg, #0a0a15 0%, #1a1a2e 50%, #0f0f1a 100%)
            `,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `
                0 30px 100px rgba(0,0,0,0.8), 
                0 0 80px ${tier.glowColor},
                inset 0 0 100px rgba(0,0,0,0.5)
            `,
            border: `3px solid ${tier.color}66`,
            '--glow-color': tier.color
        }}>
            {/* Efeito de grade futurística */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(${tier.color}11 1px, transparent 1px),
                    linear-gradient(90deg, ${tier.color}11 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                opacity: 0.3
            }} />

            {/* Partículas animadas de fundo */}
            {[...Array(15)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: `${3 + (i % 4)}px`,
                    height: `${3 + (i % 4)}px`,
                    borderRadius: '50%',
                    background: i % 2 === 0 ? tier.color : '#00FF88',
                    left: `${5 + i * 6}%`,
                    top: `${10 + (i % 5) * 18}%`,
                    opacity: 0.6,
                    animation: `particleFloat ${2 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                }} />
            ))}

            {/* Avatar Central */}
            <div ref={containerRef} style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'heroBreath 4s ease-in-out infinite'
            }}>
                <EpicAvatarSVG config={config} tier={tier} size={size * 0.85} />
            </div>

            {/* Badge do Tier */}
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '10px 20px',
                background: `linear-gradient(135deg, ${tier.color}aa, ${tier.color}55)`,
                borderRadius: '100px',
                border: `2px solid ${tier.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 30px ${tier.glowColor}`
            }}>
                <span style={{ fontSize: '20px' }}>{tier.emoji}</span>
                <span style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    textShadow: `0 0 10px ${tier.color}`
                }}>
                    {tier.name}
                </span>
            </div>

            {/* Indicadores de Stats */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                padding: '14px 20px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.9))',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Dumbbell size={18} color={tier.color} />
                    <span style={{ fontSize: '11px', color: tier.color, fontWeight: '700' }}>FORÇA</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="#00FF88" />
                    <span style={{ fontSize: '11px', color: '#00FF88', fontWeight: '700' }}>ENERGIA</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={18} color="#FFD700" />
                    <span style={{ fontSize: '11px', color: '#FFD700', fontWeight: '700' }}>VITÓRIAS</span>
                </div>
            </div>

            {/* Reflexo brilhante no topo */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '30%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
                borderRadius: '28px 28px 50% 50%',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

// === BUILDER MODAL ===
const EpicFitnessAvatarBuilder = ({ isOpen, onClose, onSave, initialConfig, userLevel, bossesDefeated }) => {
    const SKIN_TONES = [
        { id: 'fair', color: '#FFDCB0' }, { id: 'light', color: '#E5B887' },
        { id: 'medium', color: '#C68642' }, { id: 'tan', color: '#8D5524' },
        { id: 'dark', color: '#5C3317' }, { id: 'deep', color: '#3B1F0F' }
    ];
    const HAIR_COLORS = [
        { id: 'black', color: '#1a1a1a' }, { id: 'brown', color: '#4a3728' },
        { id: 'blonde', color: '#e6c87a' }, { id: 'gray', color: '#9e9e9e' }
    ];
    const BODY_TYPES = [
        { id: 'slim', name: 'Atlético', emoji: '🏃' },
        { id: 'fit', name: 'Fit', emoji: '💪' },
        { id: 'muscular', name: 'Musculoso', emoji: '🏋️' },
        { id: 'bodybuilder', name: 'Bodybuilder', emoji: '💪🔥' }
    ];
    const HAIRSTYLES = [
        { id: 'short', name: 'Curto', emoji: '💇' },
        { id: 'buzz', name: 'Raspado', emoji: '👨' },
        { id: 'spiky', name: 'Espetado', emoji: '⚡' },
        { id: 'mohawk', name: 'Moicano', emoji: '🎸' }
    ];

    const defaultConfig = {
        skinTone: '#C68642', hairStyle: 'short', hairColor: '#1a1a1a',
        outfitColor: '#1a1a1a', bodyType: 'fit'
    };

    const [config, setConfig] = useState(initialConfig || defaultConfig);
    const [activeTab, setActiveTab] = useState('body');
    const tier = getFitnessTier(userLevel, bossesDefeated);

    useEffect(() => { if (initialConfig) setConfig(initialConfig); }, [initialConfig]);

    const handleSave = () => {
        localStorage.setItem('epicFitnessAvatarConfig', JSON.stringify(config));
        onSave(config);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', backdropFilter: 'blur(20px)'
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '1000px', maxHeight: '90vh',
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{
                    padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Crown size={26} color={tier.color} />
                        <h2 style={{ fontSize: '24px', fontWeight: '900' }}>
                            Criar <span style={{ color: tier.color }}>Campeão</span>
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.1)', border: 'none',
                        color: '#fff', cursor: 'pointer', fontSize: '20px'
                    }}>✕</button>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <div style={{
                        width: '400px', padding: '30px', display: 'flex',
                        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.4)', borderRight: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <EpicFitnessAvatarDisplay config={config} userLevel={userLevel}
                            bossesDefeated={bossesDefeated} size={280} />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{
                            display: 'flex', gap: '8px', padding: '16px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto'
                        }}>
                            {[{ id: 'body', name: 'Físico', icon: '💪' },
                            { id: 'skin', name: 'Pele', icon: '🎨' },
                            { id: 'hair', name: 'Cabelo', icon: '💇' }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                    padding: '12px 20px', borderRadius: '12px',
                                    background: activeTab === tab.id ? tier.color : 'rgba(255,255,255,0.05)',
                                    border: 'none', color: activeTab === tab.id ? '#000' : '#fff',
                                    cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <span>{tab.icon}</span>{tab.name}
                                </button>
                            ))}
                        </div>

                        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                            {activeTab === 'body' && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    {BODY_TYPES.map(type => (
                                        <button key={type.id} onClick={() => setConfig({ ...config, bodyType: type.id })}
                                            style={{
                                                padding: '20px 30px', borderRadius: '16px',
                                                background: config.bodyType === type.id ? `${tier.color}33` : 'rgba(255,255,255,0.05)',
                                                border: config.bodyType === type.id ? `2px solid ${tier.color}` : '1px solid rgba(255,255,255,0.1)',
                                                cursor: 'pointer', color: '#fff', display: 'flex',
                                                flexDirection: 'column', alignItems: 'center', gap: '10px'
                                            }}>
                                            <span style={{ fontSize: '36px' }}>{type.emoji}</span>
                                            <span style={{ fontSize: '13px', fontWeight: '600' }}>{type.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'skin' && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                                    {SKIN_TONES.map(tone => (
                                        <button key={tone.id} onClick={() => setConfig({ ...config, skinTone: tone.color })}
                                            style={{
                                                width: '60px', height: '60px', borderRadius: '50%',
                                                background: tone.color, cursor: 'pointer',
                                                border: config.skinTone === tone.color ? `4px solid ${tier.color}` : '3px solid rgba(255,255,255,0.2)',
                                                boxShadow: config.skinTone === tone.color ? `0 0 25px ${tier.glowColor}` : 'none'
                                            }} />
                                    ))}
                                </div>
                            )}
                            {activeTab === 'hair' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>Estilo</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {HAIRSTYLES.map(style => (
                                                <button key={style.id} onClick={() => setConfig({ ...config, hairStyle: style.id })}
                                                    style={{
                                                        padding: '12px 20px', borderRadius: '12px',
                                                        background: config.hairStyle === style.id ? `${tier.color}33` : 'rgba(255,255,255,0.05)',
                                                        border: config.hairStyle === style.id ? `2px solid ${tier.color}` : '1px solid rgba(255,255,255,0.1)',
                                                        cursor: 'pointer', color: '#fff',
                                                        display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}>
                                                    <span style={{ fontSize: '20px' }}>{style.emoji}</span>{style.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>Cor</h4>
                                        <div style={{ display: 'flex', gap: '14px' }}>
                                            {HAIR_COLORS.map(hc => (
                                                <button key={hc.id} onClick={() => setConfig({ ...config, hairColor: hc.color })}
                                                    style={{
                                                        width: '50px', height: '50px', borderRadius: '50%',
                                                        background: hc.color, cursor: 'pointer',
                                                        border: config.hairColor === hc.color ? `4px solid ${tier.color}` : '3px solid rgba(255,255,255,0.2)'
                                                    }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{
                            padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', justifyContent: 'flex-end', gap: '12px'
                        }}>
                            <button onClick={onClose} style={{
                                padding: '14px 28px', borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff', cursor: 'pointer', fontWeight: '600'
                            }}>Cancelar</button>
                            <button onClick={handleSave} className="btn-primary" style={{
                                padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '10px',
                                background: `linear-gradient(135deg, ${tier.color}, #00FF88)`
                            }}>
                                <Check size={20} />Salvar Campeão
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { EpicFitnessAvatarDisplay, EpicFitnessAvatarBuilder, getFitnessTier, FITNESS_TIERS };
export default EpicFitnessAvatarBuilder;
