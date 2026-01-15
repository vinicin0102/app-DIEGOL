import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Dumbbell, Medal, Trophy, Flame, Zap, Target, Heart, Star, Crown, X, Check, Activity, Timer } from 'lucide-react';

// === SISTEMA DE NÍVEIS FITNESS ===
const FITNESS_TIERS = [
    {
        id: 'beginner',
        name: 'Iniciante',
        emoji: '🌱',
        minLevel: 0,
        minBosses: 0,
        color: '#4CAF50',
        glowColor: 'rgba(76, 175, 80, 0.4)',
        description: 'Começando a jornada fitness',
        athleteType: 'casual'
    },
    {
        id: 'regular',
        name: 'Regular',
        emoji: '💪',
        minLevel: 5,
        minBosses: 1,
        color: '#2196F3',
        glowColor: 'rgba(33, 150, 243, 0.4)',
        description: 'Comprometido com o treino'
    },
    {
        id: 'athlete',
        name: 'Atleta',
        emoji: '🏃',
        minLevel: 10,
        minBosses: 2,
        color: '#9C27B0',
        glowColor: 'rgba(156, 39, 176, 0.4)',
        description: 'Desempenho consistente'
    },
    {
        id: 'pro',
        name: 'Profissional',
        emoji: '🏆',
        minLevel: 20,
        minBosses: 3,
        color: '#FF9800',
        glowColor: 'rgba(255, 152, 0, 0.5)',
        description: 'Nível competitivo'
    },
    {
        id: 'elite',
        name: 'Elite',
        emoji: '⭐',
        minLevel: 30,
        minBosses: 4,
        color: '#FFD700',
        glowColor: 'rgba(255, 215, 0, 0.5)',
        description: 'Entre os melhores'
    },
    {
        id: 'champion',
        name: 'Campeão',
        emoji: '👑',
        minLevel: 40,
        minBosses: 5,
        color: '#E91E63',
        glowColor: 'rgba(233, 30, 99, 0.5)',
        description: 'Dominando os desafios'
    },
    {
        id: 'legend',
        name: 'Lenda',
        emoji: '🔥',
        minLevel: 50,
        minBosses: 6,
        color: '#FF3366',
        glowColor: 'rgba(255, 51, 102, 0.6)',
        description: 'Status lendário'
    }
];

// Tipos de corpo/físico
const BODY_TYPES = [
    { id: 'slim', name: 'Atlético Leve', emoji: '🏃' },
    { id: 'fit', name: 'Fitness', emoji: '💪' },
    { id: 'muscular', name: 'Musculoso', emoji: '🏋️' },
    { id: 'bodybuilder', name: 'Bodybuilder', emoji: '💪🔥' }
];

// Tons de pele
const SKIN_TONES = [
    { id: 'fair', color: '#FFDCB0', name: 'Claro' },
    { id: 'light', color: '#E5B887', name: 'Médio Claro' },
    { id: 'medium', color: '#C68642', name: 'Médio' },
    { id: 'tan', color: '#8D5524', name: 'Moreno' },
    { id: 'dark', color: '#5C3317', name: 'Escuro' },
    { id: 'deep', color: '#3B1F0F', name: 'Muito Escuro' }
];

// Cores de roupa esportiva
const SPORT_COLORS = [
    { id: 'black', color: '#1a1a1a', name: 'Preto' },
    { id: 'red', color: '#FF3366', name: 'Vermelho' },
    { id: 'blue', color: '#4169E1', name: 'Azul' },
    { id: 'green', color: '#00FF88', name: 'Verde Neon' },
    { id: 'purple', color: '#9B30FF', name: 'Roxo' },
    { id: 'orange', color: '#FF6B35', name: 'Laranja' },
    { id: 'cyan', color: '#00FFFF', name: 'Ciano' },
    { id: 'gold', color: '#FFD700', name: 'Dourado' }
];

// Estilos de cabelo
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
    { id: 'blue', color: '#4169E1', name: 'Azul' }
];

// Função para calcular o tier
const getFitnessTier = (level, bossesDefeated) => {
    for (let i = FITNESS_TIERS.length - 1; i >= 0; i--) {
        const tier = FITNESS_TIERS[i];
        if (level >= tier.minLevel || bossesDefeated >= tier.minBosses) {
            return tier;
        }
    }
    return FITNESS_TIERS[0];
};

// === COMPONENTE SVG DO HALTER (DUMBBELL) ===
const DumbbellSVG = ({ tier, size = 80 }) => {
    const { color, glowColor, id } = tier;
    const isLegend = id === 'legend';
    const isElite = ['elite', 'champion', 'legend'].includes(id);

    return (
        <svg width={size} height={size * 0.5} viewBox="0 0 100 50" style={{
            filter: isElite ? `drop-shadow(0 0 15px ${glowColor})` : `drop-shadow(0 0 5px ${glowColor})`
        }}>
            <defs>
                <linearGradient id={`dumbbellGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="50%" stopColor={isLegend ? '#FFD700' : color} />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
            </defs>

            {/* Pesos à esquerda */}
            <rect x="5" y="10" width="15" height="30" rx="3" fill={`url(#dumbbellGrad-${id})`} stroke="#333" strokeWidth="1" />
            <rect x="12" y="8" width="10" height="34" rx="2" fill={color} opacity="0.8" />

            {/* Barra central */}
            <rect x="22" y="22" width="56" height="6" rx="3" fill="#444" stroke="#222" strokeWidth="1" />
            <line x1="25" y1="25" x2="75" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

            {/* Pesos à direita */}
            <rect x="80" y="10" width="15" height="30" rx="3" fill={`url(#dumbbellGrad-${id})`} stroke="#333" strokeWidth="1" />
            <rect x="78" y="8" width="10" height="34" rx="2" fill={color} opacity="0.8" />

            {/* Brilho nos pesos */}
            {isElite && (
                <>
                    <ellipse cx="12" cy="18" rx="3" ry="4" fill="rgba(255,255,255,0.3)" />
                    <ellipse cx="88" cy="18" rx="3" ry="4" fill="rgba(255,255,255,0.3)" />
                </>
            )}

            {/* Efeito de energia para lendário */}
            {isLegend && (
                <>
                    <circle cx="50" cy="25" r="3" fill="#FF3366" opacity="0.7" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                    <circle cx="30" cy="25" r="2" fill="#FFD700" opacity="0.5" style={{ animation: 'pulse 2.5s ease-in-out infinite' }} />
                    <circle cx="70" cy="25" r="2" fill="#FFD700" opacity="0.5" style={{ animation: 'pulse 2.5s ease-in-out infinite' }} />
                </>
            )}
        </svg>
    );
};

// === COMPONENTE SVG DO KETTLEBELL ===
const KettlebellSVG = ({ tier, size = 70 }) => {
    const { color, glowColor, id } = tier;
    const isLegend = id === 'legend';
    const isElite = ['elite', 'champion', 'legend'].includes(id);

    return (
        <svg width={size} height={size * 1.1} viewBox="0 0 60 66" style={{
            filter: isElite ? `drop-shadow(0 0 12px ${glowColor})` : `drop-shadow(0 0 5px ${glowColor})`
        }}>
            <defs>
                <linearGradient id={`kettleGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="50%" stopColor={isLegend ? '#FFD700' : color} />
                    <stop offset="100%" stopColor={color} />
                </linearGradient>
                <radialGradient id={`kettleShine-${id}`} cx="30%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
            </defs>

            {/* Alça do kettlebell */}
            <path
                d="M18,18 Q30,5 42,18"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
            />

            {/* Corpo principal */}
            <ellipse cx="30" cy="42" rx="22" ry="20" fill={`url(#kettleGrad-${id})`} stroke="#333" strokeWidth="2" />

            {/* Reflexo */}
            <ellipse cx="30" cy="42" rx="22" ry="20" fill={`url(#kettleShine-${id})`} />

            {/* Base plana */}
            <ellipse cx="30" cy="58" rx="15" ry="4" fill={color} opacity="0.7" />

            {/* Número do peso */}
            <text x="30" y="46" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" opacity="0.9">
                {id === 'legend' ? '50' : id === 'champion' ? '40' : id === 'elite' ? '32' : id === 'pro' ? '24' : id === 'athlete' ? '16' : id === 'regular' ? '12' : '8'}
            </text>

            {/* Efeito de energia */}
            {isLegend && (
                <circle cx="30" cy="42" r="4" fill="#FF3366" opacity="0.6" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            )}
        </svg>
    );
};

// === COMPONENTE SVG DA MEDALHA ===
const MedalSVG = ({ tier, size = 60 }) => {
    const { color, glowColor, id } = tier;
    const isLegend = id === 'legend';
    const isElite = ['elite', 'champion', 'legend'].includes(id);

    const medalColor = id === 'legend' ? '#FFD700' :
        id === 'champion' ? '#E91E63' :
            id === 'elite' ? '#FFD700' :
                id === 'pro' ? '#C0C0C0' :
                    id === 'athlete' ? '#CD7F32' : color;

    return (
        <svg width={size} height={size * 1.2} viewBox="0 0 50 60" style={{
            filter: isElite ? `drop-shadow(0 0 10px ${glowColor})` : `drop-shadow(0 0 4px ${glowColor})`
        }}>
            <defs>
                <linearGradient id={`medalGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={medalColor} />
                    <stop offset="50%" stopColor={isLegend ? '#fff' : medalColor} />
                    <stop offset="100%" stopColor={medalColor} />
                </linearGradient>
            </defs>

            {/* Fita */}
            <polygon points="18,0 25,20 32,0" fill={color} />
            <polygon points="25,20 32,0 39,20" fill={color} opacity="0.7" />

            {/* Medalha */}
            <circle cx="25" cy="38" r="18" fill={`url(#medalGrad-${id})`} stroke="#333" strokeWidth="2" />

            {/* Borda interna */}
            <circle cx="25" cy="38" r="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

            {/* Estrela central */}
            <polygon
                points="25,26 27.5,33 35,33 29,38 31.5,46 25,42 18.5,46 21,38 15,33 22.5,33"
                fill="#fff"
                opacity="0.9"
            />

            {/* Brilho */}
            {isElite && (
                <circle cx="20" cy="32" r="4" fill="rgba(255,255,255,0.4)" />
            )}
        </svg>
    );
};

// === COMPONENTE DO ATLETA SVG ===
const AthleteSVG = ({ config, tier, size = 200 }) => {
    const { skinColor, hairStyle, hairColor, outfitColor, bodyType } = config;

    // Ajustar largura do corpo baseado no tipo físico
    const bodyWidth = bodyType === 'bodybuilder' ? 1.3 :
        bodyType === 'muscular' ? 1.2 :
            bodyType === 'fit' ? 1.1 : 1;

    const shoulderWidth = 26 * bodyWidth;
    const chestWidth = 24 * bodyWidth;
    const armWidth = 8 * bodyWidth;

    return (
        <svg width={size} height={size * 1.4} viewBox="0 0 100 140">
            <defs>
                <linearGradient id="outfitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={outfitColor} />
                    <stop offset="100%" stopColor={`${outfitColor}99`} />
                </linearGradient>
                <linearGradient id="muscleShade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
                </linearGradient>
            </defs>

            {/* === CORPO ATLÉTICO === */}

            {/* Torso - Camiseta/Regata esportiva */}
            <path
                d={`M${50 - shoulderWidth},72 
                    L${50 - shoulderWidth - 3},130 
                    L${50 + shoulderWidth + 3},130 
                    L${50 + shoulderWidth},72 
                    Q50,62 ${50 - shoulderWidth},72 Z`}
                fill="url(#outfitGradient)"
            />

            {/* Detalhe da regata - gola em V */}
            <path
                d={`M${50 - 8},65 L50,80 L${50 + 8},65`}
                fill={skinColor}
            />

            {/* Linhas laterais da roupa (estilo esportivo) */}
            <line x1={50 - shoulderWidth + 3} y1="75" x2={50 - shoulderWidth + 3} y2="125" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <line x1={50 + shoulderWidth - 3} y1="75" x2={50 + shoulderWidth - 3} y2="125" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

            {/* Logo/Número no peito */}
            <text x="50" y="95" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontWeight="bold">
                {tier.emoji}
            </text>

            {/* Shorts esportivos */}
            <path
                d={`M${50 - chestWidth},120 
                    L${50 - chestWidth + 5},138 
                    L${50 - 3},138 
                    L50,125 
                    L${50 + 3},138 
                    L${50 + chestWidth - 5},138 
                    L${50 + chestWidth},120 Z`}
                fill={`${outfitColor}CC`}
            />

            {/* Linha do short */}
            <line x1="50" y1="120" x2="50" y2="136" stroke={outfitColor} strokeWidth="2" />

            {/* === BRAÇOS MUSCULOSOS === */}

            {/* Braço esquerdo */}
            <path
                d={`M${50 - shoulderWidth},72 
                    Q${50 - shoulderWidth - 15},85 ${50 - shoulderWidth - 10},105 
                    L${50 - shoulderWidth - 10 + armWidth},105 
                    Q${50 - shoulderWidth - 15 + armWidth},85 ${50 - shoulderWidth + 5},73`}
                fill={skinColor}
            />

            {/* Definição muscular braço esquerdo */}
            {bodyType !== 'slim' && (
                <path
                    d={`M${50 - shoulderWidth - 8},82 Q${50 - shoulderWidth - 12},90 ${50 - shoulderWidth - 8},98`}
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                />
            )}

            {/* Braço direito */}
            <path
                d={`M${50 + shoulderWidth},72 
                    Q${50 + shoulderWidth + 15},85 ${50 + shoulderWidth + 10},105 
                    L${50 + shoulderWidth + 10 - armWidth},105 
                    Q${50 + shoulderWidth + 15 - armWidth},85 ${50 + shoulderWidth - 5},73`}
                fill={skinColor}
            />

            {/* Definição muscular braço direito */}
            {bodyType !== 'slim' && (
                <path
                    d={`M${50 + shoulderWidth + 8},82 Q${50 + shoulderWidth + 12},90 ${50 + shoulderWidth + 8},98`}
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                />
            )}

            {/* Mãos com luvas de treino */}
            <ellipse cx={50 - shoulderWidth - 7} cy="108" rx="6" ry="5" fill={skinColor} />
            <ellipse cx={50 + shoulderWidth + 7} cy="108" rx="6" ry="5" fill={skinColor} />
            {/* Pulseiras fitness */}
            <rect x={50 - shoulderWidth - 12} y="103" width="10" height="3" rx="1" fill={outfitColor} />
            <rect x={50 + shoulderWidth + 2} y="103" width="10" height="3" rx="1" fill={outfitColor} />

            {/* === CABEÇA === */}

            {/* Pescoço */}
            <rect x="44" y="58" width="12" height="14" rx="4" fill={skinColor} />

            {/* Cabeça */}
            <ellipse cx="50" cy="40" rx="22" ry="24" fill={skinColor} />

            {/* Orelhas */}
            <ellipse cx="28" cy="42" rx="4" ry="6" fill={skinColor} />
            <ellipse cx="72" cy="42" rx="4" ry="6" fill={skinColor} />

            {/* === CABELO === */}
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
            {hairStyle === 'mohawk' && (
                <path d="M45,5 Q50,0 55,5 L58,32 L42,32 Z" fill={hairColor} />
            )}

            {/* === ROSTO === */}

            {/* Olhos determinados */}
            <ellipse cx="40" cy="42" rx="5" ry="4" fill="white" />
            <ellipse cx="60" cy="42" rx="5" ry="4" fill="white" />
            <circle cx="40" cy="42" r="2.5" fill="#333" />
            <circle cx="60" cy="42" r="2.5" fill="#333" />
            <circle cx="39" cy="41" r="1" fill="white" />
            <circle cx="59" cy="41" r="1" fill="white" />

            {/* Sobrancelhas fortes */}
            <line x1="35" y1="36" x2="45" y2="38" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="38" x2="65" y2="36" stroke="#333" strokeWidth="2" strokeLinecap="round" />

            {/* Nariz */}
            <ellipse cx="50" cy="48" rx="2" ry="3" fill={skinColor} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

            {/* Boca determinada */}
            <path d="M42,55 Q50,58 58,55" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Faixa na testa (headband) */}
            <rect x="28" y="30" width="44" height="4" rx="2" fill={outfitColor} />

            {/* Suor (gotas) */}
            <ellipse cx="26" cy="50" rx="2" ry="3" fill="rgba(100,200,255,0.6)" />
            <ellipse cx="74" cy="52" rx="1.5" ry="2.5" fill="rgba(100,200,255,0.5)" />

            {/* === ACESSÓRIOS FITNESS === */}

            {/* Fones de ouvido (earbuds) */}
            <circle cx="28" cy="45" r="3" fill="#333" />
            <circle cx="72" cy="45" r="3" fill="#333" />
        </svg>
    );
};

// === DISPLAY PRINCIPAL DO ATLETA ===
const FitnessAvatarDisplay = ({ config, userLevel, bossesDefeated, size = 300 }) => {
    const tier = getFitnessTier(userLevel, bossesDefeated);
    const containerRef = useRef(null);

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
            {/* Partículas para níveis altos */}
            {['elite', 'champion', 'legend'].includes(tier.id) && (
                [...Array(10)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: tier.color,
                        left: `${10 + i * 9}%`,
                        top: `${15 + (i % 5) * 18}%`,
                        opacity: 0.6,
                        animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
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
                {/* HALTER À ESQUERDA */}
                <div style={{
                    position: 'absolute',
                    left: '0%',
                    top: '25%',
                    transform: 'rotate(-25deg)',
                    zIndex: 2,
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    <DumbbellSVG tier={tier} size={size * 0.35} />
                </div>

                {/* ATLETA CENTRAL */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '-5%'
                }}>
                    <AthleteSVG
                        config={config}
                        tier={tier}
                        size={size * 0.65}
                    />
                </div>

                {/* KETTLEBELL À DIREITA */}
                <div style={{
                    position: 'absolute',
                    right: '5%',
                    top: '30%',
                    transform: 'rotate(15deg)',
                    zIndex: 2,
                    animation: 'float 3.5s ease-in-out infinite',
                    animationDelay: '0.5s'
                }}>
                    <KettlebellSVG tier={tier} size={size * 0.22} />
                </div>

                {/* MEDALHA EMBAIXO */}
                <div style={{
                    position: 'absolute',
                    right: '10%',
                    bottom: '18%',
                    zIndex: 3,
                    animation: 'float 4s ease-in-out infinite',
                    animationDelay: '1s'
                }}>
                    <MedalSVG tier={tier} size={size * 0.18} />
                </div>
            </div>

            {/* Badge do tier */}
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '8px 16px',
                background: `linear-gradient(135deg, ${tier.color}55, ${tier.color}33)`,
                borderRadius: '100px',
                border: `1px solid ${tier.color}77`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(10px)'
            }}>
                <span style={{ fontSize: '16px' }}>{tier.emoji}</span>
                <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: tier.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {tier.name}
                </span>
            </div>

            {/* Indicador de equipamentos no rodapé */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                padding: '10px 16px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Dumbbell size={14} color={tier.color} />
                    <span style={{ fontSize: '10px', color: tier.color, fontWeight: '600' }}>Halter</span>
                </div>
                <div style={{ width: '1px', height: '16px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={14} color={tier.color} />
                    <span style={{ fontSize: '10px', color: tier.color, fontWeight: '600' }}>Kettlebell</span>
                </div>
                <div style={{ width: '1px', height: '16px', background: `${tier.color}44` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Medal size={14} color={tier.color} />
                    <span style={{ fontSize: '10px', color: tier.color, fontWeight: '600' }}>Medalha</span>
                </div>
            </div>

            {/* Sombra */}
            <div style={{
                position: 'absolute',
                bottom: '55px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50%',
                height: '15px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(5px)'
            }} />
        </div>
    );
};

// === MODAL BUILDER DO ATLETA ===
const FitnessAvatarBuilder = ({ isOpen, onClose, onSave, initialConfig, userLevel, bossesDefeated }) => {
    const defaultConfig = {
        skinColor: SKIN_TONES[2].color,
        skinId: 'medium',
        hairStyle: 'short',
        hairColor: HAIR_COLORS[0].color,
        hairColorId: 'black',
        outfitColor: SPORT_COLORS[0].color,
        outfitColorId: 'black',
        bodyType: 'fit'
    };

    const [config, setConfig] = useState(initialConfig || defaultConfig);
    const [activeTab, setActiveTab] = useState('body');

    const tier = getFitnessTier(userLevel, bossesDefeated);
    const nextTier = FITNESS_TIERS.find(t => t.minLevel > userLevel) || null;

    useEffect(() => {
        if (initialConfig) setConfig(initialConfig);
    }, [initialConfig]);

    const handleSave = () => {
        localStorage.setItem('fitnessAvatarConfig', JSON.stringify(config));
        onSave(config);
        onClose();
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'body', name: 'Físico', icon: '💪' },
        { id: 'skin', name: 'Pele', icon: '🎨' },
        { id: 'hair', name: 'Cabelo', icon: '💇' },
        { id: 'outfit', name: 'Roupa', icon: '👕' },
        { id: 'equipment', name: 'Equipamentos', icon: '🏋️' }
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
                        <Dumbbell size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '22px', fontWeight: '900' }}>
                            Criar <span className="text-gradient">Atleta</span>
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
                        <FitnessAvatarDisplay
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
                                Nível Fitness Atual
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
                            {activeTab === 'body' && (
                                <div>
                                    <h4 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Tipo Físico
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {BODY_TYPES.map(type => (
                                            <button key={type.id} onClick={() => setConfig({
                                                ...config, bodyType: type.id
                                            })} style={{
                                                padding: '16px 24px',
                                                borderRadius: '14px',
                                                background: config.bodyType === type.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                                border: config.bodyType === type.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                                cursor: 'pointer',
                                                color: '#fff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '8px',
                                                minWidth: '100px'
                                            }}>
                                                <span style={{ fontSize: '32px' }}>{type.emoji}</span>
                                                <span style={{ fontSize: '12px', fontWeight: '600' }}>{type.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {HAIR_COLORS.map(hc => (
                                                <button key={hc.id} onClick={() => setConfig({
                                                    ...config, hairColor: hc.color, hairColorId: hc.id
                                                })} style={{
                                                    width: '44px', height: '44px', borderRadius: '50%',
                                                    background: hc.color,
                                                    border: config.hairColorId === hc.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
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
                                        {SPORT_COLORS.map(sc => (
                                            <button key={sc.id} onClick={() => setConfig({
                                                ...config, outfitColor: sc.color, outfitColorId: sc.id
                                            })} style={{
                                                width: '52px', height: '52px', borderRadius: '14px',
                                                background: sc.color,
                                                border: config.outfitColorId === sc.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                boxShadow: config.outfitColorId === sc.id ? '0 0 20px var(--primary-glow)' : 'none'
                                            }}>
                                                {config.outfitColorId === sc.id && (
                                                    <Check size={20} color="#fff" style={{
                                                        position: 'absolute', top: '50%', left: '50%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'equipment' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{
                                        padding: '20px',
                                        background: `linear-gradient(135deg, ${tier.color}22, transparent)`,
                                        borderRadius: '16px',
                                        border: `1px solid ${tier.color}44`
                                    }}>
                                        <h4 style={{ marginBottom: '16px', color: tier.color, fontSize: '14px', fontWeight: '700' }}>
                                            Seus Equipamentos Atuais
                                        </h4>
                                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <DumbbellSVG tier={tier} size={80} />
                                            <KettlebellSVG tier={tier} size={70} />
                                            <MedalSVG tier={tier} size={60} />
                                        </div>
                                        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px' }}>
                                            Equipamentos evoluem automaticamente com seu nível!
                                        </p>
                                    </div>

                                    {/* Lista de tiers */}
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                        Evolução dos Equipamentos
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {FITNESS_TIERS.map((t) => {
                                            const isUnlocked = userLevel >= t.minLevel || bossesDefeated >= t.minBosses;
                                            const isCurrent = t.id === tier.id;

                                            return (
                                                <div key={t.id} style={{
                                                    padding: '14px 18px',
                                                    borderRadius: '12px',
                                                    background: isCurrent ? `linear-gradient(135deg, ${t.color}22, ${t.color}11)` : 'rgba(255,255,255,0.02)',
                                                    border: isCurrent ? `2px solid ${t.color}` : '1px solid rgba(255,255,255,0.06)',
                                                    opacity: isUnlocked ? 1 : 0.4,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '14px'
                                                }}>
                                                    <div style={{
                                                        width: '44px', height: '44px',
                                                        borderRadius: '12px',
                                                        background: `linear-gradient(135deg, ${t.color}44, ${t.color}22)`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '22px'
                                                    }}>
                                                        {t.emoji}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontWeight: '700', fontSize: '13px', color: t.color }}>
                                                                {t.name}
                                                            </span>
                                                            {isCurrent && (
                                                                <span style={{
                                                                    padding: '2px 8px',
                                                                    background: t.color,
                                                                    borderRadius: '100px',
                                                                    fontSize: '8px',
                                                                    fontWeight: '700',
                                                                    color: '#000'
                                                                }}>ATUAL</span>
                                                            )}
                                                        </div>
                                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                            Nível {t.minLevel}+
                                                        </p>
                                                    </div>
                                                    {isUnlocked ? (
                                                        <Check size={18} color={t.color} />
                                                    ) : (
                                                        <span style={{ fontSize: '18px' }}>🔒</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <div style={{
                            padding: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button onClick={onClose} style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} className="btn-primary" style={{
                                padding: '12px 28px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Check size={18} />
                                Salvar Atleta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === EXPORTAÇÕES ===
export {
    FitnessAvatarDisplay,
    FitnessAvatarBuilder,
    DumbbellSVG,
    KettlebellSVG,
    MedalSVG,
    AthleteSVG,
    getFitnessTier,
    FITNESS_TIERS,
    SKIN_TONES,
    SPORT_COLORS,
    HAIRSTYLES,
    HAIR_COLORS,
    BODY_TYPES
};

export default FitnessAvatarBuilder;
