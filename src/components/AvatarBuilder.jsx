import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

// === CONFIGURAÇÃO DAS PARTES DO AVATAR ===
const AVATAR_CONFIG = {
    skinTones: [
        { id: 'fair', color: '#FFDCB0', name: 'Claro' },
        { id: 'light', color: '#E5B887', name: 'Médio Claro' },
        { id: 'medium', color: '#C68642', name: 'Médio' },
        { id: 'tan', color: '#8D5524', name: 'Moreno' },
        { id: 'dark', color: '#5C3317', name: 'Escuro' },
        { id: 'deep', color: '#3B1F0F', name: 'Muito Escuro' }
    ],

    hairstyles: [
        { id: 'none', name: 'Careca', emoji: '👨‍🦲', svgPath: null },
        { id: 'short', name: 'Curto', emoji: '💇‍♂️', svgPath: 'short' },
        { id: 'medium', name: 'Médio', emoji: '💇', svgPath: 'medium' },
        { id: 'long', name: 'Longo', emoji: '💇‍♀️', svgPath: 'long' },
        { id: 'curly', name: 'Cacheado', emoji: '🦱', svgPath: 'curly' },
        { id: 'afro', name: 'Afro', emoji: '👨‍🦱', svgPath: 'afro' },
        { id: 'spiky', name: 'Espetado', emoji: '⚡', svgPath: 'spiky' },
        { id: 'mohawk', name: 'Moicano', emoji: '🎸', svgPath: 'mohawk' }
    ],

    hairColors: [
        { id: 'black', color: '#1a1a1a', name: 'Preto' },
        { id: 'brown', color: '#4a3728', name: 'Castanho' },
        { id: 'blonde', color: '#e6c87a', name: 'Loiro' },
        { id: 'red', color: '#b44c43', name: 'Ruivo' },
        { id: 'gray', color: '#9e9e9e', name: 'Grisalho' },
        { id: 'blue', color: '#4169E1', name: 'Azul' },
        { id: 'purple', color: '#9B30FF', name: 'Roxo' },
        { id: 'green', color: '#00FF88', name: 'Verde' },
        { id: 'pink', color: '#FF69B4', name: 'Rosa' }
    ],

    eyes: [
        { id: 'normal', name: 'Normal', emoji: '👁️' },
        { id: 'happy', name: 'Feliz', emoji: '😊' },
        { id: 'determined', name: 'Determinado', emoji: '😤' },
        { id: 'cool', name: 'Descolado', emoji: '😎' },
        { id: 'wink', name: 'Piscando', emoji: '😉' },
        { id: 'sleepy', name: 'Sonolento', emoji: '😴' }
    ],

    eyeColors: [
        { id: 'brown', color: '#4a3728', name: 'Castanho' },
        { id: 'blue', color: '#4169E1', name: 'Azul' },
        { id: 'green', color: '#228B22', name: 'Verde' },
        { id: 'hazel', color: '#8B7355', name: 'Avelã' },
        { id: 'amber', color: '#FFBF00', name: 'Âmbar' },
        { id: 'gray', color: '#708090', name: 'Cinza' },
        { id: 'purple', color: '#9B30FF', name: 'Roxo' },
        { id: 'red', color: '#FF3366', name: 'Vermelho' }
    ],

    mouths: [
        { id: 'smile', name: 'Sorriso', emoji: '😊' },
        { id: 'grin', name: 'Sorriso Largo', emoji: '😁' },
        { id: 'serious', name: 'Sério', emoji: '😐' },
        { id: 'open', name: 'Aberto', emoji: '😮' },
        { id: 'smirk', name: 'Sarcastico', emoji: '😏' }
    ],

    accessories: [
        { id: 'none', name: 'Nenhum', emoji: '❌' },
        { id: 'glasses', name: 'Óculos', emoji: '👓' },
        { id: 'sunglasses', name: 'Óculos Escuros', emoji: '🕶️' },
        { id: 'monocle', name: 'Monóculo', emoji: '🧐' },
        { id: 'eyepatch', name: 'Tapa-olho', emoji: '🏴‍☠️' },
        { id: 'headband', name: 'Faixa', emoji: '🎌' },
        { id: 'crown', name: 'Coroa', emoji: '👑' },
        { id: 'cap', name: 'Boné', emoji: '🧢' },
        { id: 'helmet', name: 'Capacete', emoji: '⛑️' }
    ],

    outfits: [
        { id: 'tshirt', name: 'Camiseta', emoji: '👕', color: '#4169E1' },
        { id: 'hoodie', name: 'Moletom', emoji: '🧥', color: '#333' },
        { id: 'tank', name: 'Regata', emoji: '🎽', color: '#FF3366' },
        { id: 'suit', name: 'Terno', emoji: '🤵', color: '#1a1a1a' },
        { id: 'sport', name: 'Esportivo', emoji: '🏃', color: '#00FF88' },
        { id: 'armor', name: 'Armadura', emoji: '⚔️', color: '#C0C0C0' },
        { id: 'ninja', name: 'Ninja', emoji: '🥷', color: '#2d2d2d' },
        { id: 'warrior', name: 'Guerreiro', emoji: '⚔️', color: '#8B4513' }
    ],

    outfitColors: [
        { id: 'blue', color: '#4169E1', name: 'Azul' },
        { id: 'red', color: '#FF3366', name: 'Vermelho' },
        { id: 'green', color: '#00FF88', name: 'Verde' },
        { id: 'purple', color: '#9B30FF', name: 'Roxo' },
        { id: 'black', color: '#1a1a1a', name: 'Preto' },
        { id: 'white', color: '#f0f0f0', name: 'Branco' },
        { id: 'gold', color: '#FFD700', name: 'Dourado' },
        { id: 'orange', color: '#FF6B35', name: 'Laranja' }
    ],

    backgrounds: [
        { id: 'gym', name: 'Academia', gradient: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' },
        { id: 'nature', name: 'Natureza', gradient: 'linear-gradient(180deg, #134e4a 0%, #0f172a 100%)' },
        { id: 'fire', name: 'Fogo', gradient: 'linear-gradient(180deg, #7f1d1d 0%, #450a0a 100%)' },
        { id: 'ice', name: 'Gelo', gradient: 'linear-gradient(180deg, #1e3a5f 0%, #0c1929 100%)' },
        { id: 'cosmic', name: 'Cósmico', gradient: 'linear-gradient(180deg, #2d1b4e 0%, #1a0d2e 100%)' },
        { id: 'sunset', name: 'Pôr do Sol', gradient: 'linear-gradient(180deg, #ff7e5f 0%, #feb47b 50%, #1a1a2e 100%)' },
        { id: 'ocean', name: 'Oceano', gradient: 'linear-gradient(180deg, #0077b6 0%, #023e8a 100%)' },
        { id: 'forest', name: 'Floresta', gradient: 'linear-gradient(180deg, #2d5a27 0%, #1a3318 100%)' }
    ]
};

const CATEGORIES = [
    { id: 'skin', name: 'Pele', icon: '🎨' },
    { id: 'hair', name: 'Cabelo', icon: '💇' },
    { id: 'eyes', name: 'Olhos', icon: '👁️' },
    { id: 'mouth', name: 'Boca', icon: '👄' },
    { id: 'accessory', name: 'Acessórios', icon: '👓' },
    { id: 'outfit', name: 'Roupa', icon: '👕' },
    { id: 'background', name: 'Fundo', icon: '🖼️' }
];

// SVG Hair Components
const HairSVG = ({ style, color }) => {
    const styles = {
        short: (
            <path d="M35,35 Q50,20 65,35 Q70,25 65,18 Q50,8 35,18 Q30,25 35,35 Z"
                fill={color} opacity="0.95" />
        ),
        medium: (
            <>
                <path d="M30,35 Q50,15 70,35 Q75,20 65,12 Q50,5 35,12 Q25,20 30,35 Z"
                    fill={color} opacity="0.95" />
                <path d="M28,40 Q25,50 28,60" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M72,40 Q75,50 72,60" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
            </>
        ),
        long: (
            <>
                <path d="M28,35 Q50,10 72,35 Q78,18 65,8 Q50,0 35,8 Q22,18 28,35 Z"
                    fill={color} opacity="0.95" />
                <path d="M25,40 Q20,60 25,85" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M75,40 Q80,60 75,85" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M30,38 Q28,55 32,75" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M70,38 Q72,55 68,75" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
            </>
        ),
        curly: (
            <>
                <circle cx="35" cy="25" r="10" fill={color} />
                <circle cx="50" cy="20" r="10" fill={color} />
                <circle cx="65" cy="25" r="10" fill={color} />
                <circle cx="30" cy="35" r="8" fill={color} />
                <circle cx="70" cy="35" r="8" fill={color} />
                <circle cx="40" cy="28" r="8" fill={color} />
                <circle cx="60" cy="28" r="8" fill={color} />
            </>
        ),
        afro: (
            <>
                <circle cx="50" cy="30" r="28" fill={color} />
                <circle cx="30" cy="35" r="15" fill={color} />
                <circle cx="70" cy="35" r="15" fill={color} />
                <circle cx="50" cy="15" r="12" fill={color} />
                <circle cx="35" cy="20" r="10" fill={color} />
                <circle cx="65" cy="20" r="10" fill={color} />
            </>
        ),
        spiky: (
            <>
                <polygon points="50,5 45,30 55,30" fill={color} />
                <polygon points="35,12 38,32 48,25" fill={color} />
                <polygon points="65,12 62,32 52,25" fill={color} />
                <polygon points="25,25 32,38 40,28" fill={color} />
                <polygon points="75,25 68,38 60,28" fill={color} />
                <path d="M30,35 Q50,28 70,35" fill={color} />
            </>
        ),
        mohawk: (
            <>
                <path d="M45,8 Q50,0 55,8 L58,35 L42,35 Z" fill={color} />
                <path d="M42,35 L40,20 Q50,15 60,20 L58,35 Z" fill={color} />
                <rect x="43" y="5" width="14" height="30" rx="4" fill={color} />
            </>
        )
    };

    return styles[style] || null;
};

// Eyes SVG Component
const EyesSVG = ({ style, color }) => {
    const baseEyeWhite = (
        <>
            <ellipse cx="38" cy="45" rx="8" ry="6" fill="white" />
            <ellipse cx="62" cy="45" rx="8" ry="6" fill="white" />
        </>
    );

    const styles = {
        normal: (
            <>
                {baseEyeWhite}
                <circle cx="38" cy="45" r="4" fill={color} />
                <circle cx="62" cy="45" r="4" fill={color} />
                <circle cx="36" cy="44" r="1.5" fill="white" />
                <circle cx="60" cy="44" r="1.5" fill="white" />
            </>
        ),
        happy: (
            <>
                <path d="M32,45 Q38,40 44,45" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M56,45 Q62,40 68,45" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
        ),
        determined: (
            <>
                {baseEyeWhite}
                <circle cx="38" cy="45" r="4" fill={color} />
                <circle cx="62" cy="45" r="4" fill={color} />
                <line x1="32" y1="40" x2="44" y2="42" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <line x1="56" y1="42" x2="68" y2="40" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </>
        ),
        cool: (
            <>
                <rect x="28" y="42" width="20" height="8" rx="2" fill="#1a1a1a" />
                <rect x="52" y="42" width="20" height="8" rx="2" fill="#1a1a1a" />
                <rect x="48" y="44" width="4" height="4" rx="1" fill="#1a1a1a" />
            </>
        ),
        wink: (
            <>
                {baseEyeWhite}
                <circle cx="38" cy="45" r="4" fill={color} />
                <path d="M56,45 Q62,42 68,45" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="36" cy="44" r="1.5" fill="white" />
            </>
        ),
        sleepy: (
            <>
                <ellipse cx="38" cy="47" rx="8" ry="4" fill="white" />
                <ellipse cx="62" cy="47" rx="8" ry="4" fill="white" />
                <circle cx="38" cy="47" r="3" fill={color} />
                <circle cx="62" cy="47" r="3" fill={color} />
            </>
        )
    };

    return styles[style] || styles.normal;
};

// Mouth SVG Component
const MouthSVG = ({ style }) => {
    const styles = {
        smile: <path d="M40,60 Q50,68 60,60" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
        grin: (
            <>
                <path d="M38,58 Q50,72 62,58" fill="#fff" stroke="#333" strokeWidth="2" />
                <path d="M38,58 Q50,52 62,58" fill="#333" />
            </>
        ),
        serious: <line x1="42" y1="62" x2="58" y2="62" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />,
        open: (
            <>
                <ellipse cx="50" cy="62" rx="8" ry="6" fill="#333" />
                <ellipse cx="50" cy="60" rx="4" ry="2" fill="#FF6B6B" />
            </>
        ),
        smirk: <path d="M42,62 Q48,62 55,58" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    };

    return styles[style] || styles.smile;
};

// Accessory SVG Component
const AccessorySVG = ({ style }) => {
    const styles = {
        glasses: (
            <>
                <rect x="28" y="40" width="18" height="14" rx="3" fill="none" stroke="#333" strokeWidth="2" />
                <rect x="54" y="40" width="18" height="14" rx="3" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="46" y1="47" x2="54" y2="47" stroke="#333" strokeWidth="2" />
            </>
        ),
        sunglasses: (
            <>
                <rect x="27" y="40" width="20" height="14" rx="4" fill="#1a1a1a" />
                <rect x="53" y="40" width="20" height="14" rx="4" fill="#1a1a1a" />
                <line x1="47" y1="47" x2="53" y2="47" stroke="#1a1a1a" strokeWidth="3" />
                <rect x="29" y="42" width="16" height="10" rx="3" fill="#333" opacity="0.8" />
                <rect x="55" y="42" width="16" height="10" rx="3" fill="#333" opacity="0.8" />
            </>
        ),
        monocle: (
            <>
                <circle cx="62" cy="45" r="10" fill="none" stroke="#FFD700" strokeWidth="2" />
                <line x1="72" y1="50" x2="75" y2="70" stroke="#FFD700" strokeWidth="1" />
            </>
        ),
        eyepatch: (
            <>
                <ellipse cx="62" cy="45" rx="10" ry="8" fill="#1a1a1a" />
                <line x1="52" y1="38" x2="72" y2="52" stroke="#1a1a1a" strokeWidth="3" />
            </>
        ),
        headband: (
            <rect x="25" y="32" width="50" height="6" rx="2" fill="#FF3366" />
        ),
        crown: (
            <>
                <path d="M30,25 L35,15 L42,22 L50,8 L58,22 L65,15 L70,25 Z" fill="#FFD700" />
                <rect x="32" y="25" width="36" height="8" fill="#FFD700" />
                <circle cx="50" cy="20" r="3" fill="#FF3366" />
                <circle cx="38" cy="23" r="2" fill="#4169E1" />
                <circle cx="62" cy="23" r="2" fill="#4169E1" />
            </>
        ),
        cap: (
            <>
                <path d="M25,35 Q50,25 75,35 L72,32 Q50,20 28,32 Z" fill="#4169E1" />
                <ellipse cx="50" cy="35" rx="28" ry="6" fill="#4169E1" />
                <ellipse cx="30" cy="40" rx="15" ry="5" fill="#4169E1" />
            </>
        ),
        helmet: (
            <>
                <path d="M25,45 Q25,15 50,10 Q75,15 75,45" fill="#C0C0C0" stroke="#888" strokeWidth="2" />
                <rect x="35" y="38" width="30" height="15" rx="3" fill="rgba(0,200,255,0.3)" />
            </>
        )
    };

    return styles[style] || null;
};

// Outfit SVG Component
const OutfitSVG = ({ style, color }) => {
    const bodyBase = (
        <path d="M35,75 L30,120 L70,120 L65,75 Q50,70 35,75 Z" fill={color} />
    );

    const styles = {
        tshirt: (
            <>
                {bodyBase}
                <path d="M30,78 L20,90 L25,95 L35,83" fill={color} />
                <path d="M70,78 L80,90 L75,95 L65,83" fill={color} />
                <path d="M42,77 Q50,80 58,77" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
            </>
        ),
        hoodie: (
            <>
                {bodyBase}
                <path d="M30,78 L18,95 L25,102 L35,85" fill={color} />
                <path d="M70,78 L82,95 L75,102 L65,85" fill={color} />
                <path d="M40,75 Q50,65 60,75" fill="rgba(0,0,0,0.15)" />
                <ellipse cx="50" cy="95" rx="8" ry="5" fill="rgba(0,0,0,0.1)" />
                <line x1="50" y1="95" x2="50" y2="105" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            </>
        ),
        tank: (
            <>
                <path d="M38,75 L35,120 L65,120 L62,75 Q50,72 38,75 Z" fill={color} />
            </>
        ),
        suit: (
            <>
                {bodyBase}
                <path d="M30,78 L22,100 L28,105 L35,85" fill={color} />
                <path d="M70,78 L78,100 L72,105 L65,85" fill={color} />
                <path d="M45,75 L42,120 L50,120 L50,75 Z" fill="white" />
                <path d="M55,75 L58,120 L50,120 L50,75 Z" fill="white" />
                <polygon points="45,78 50,90 55,78" fill="#FF3366" />
            </>
        ),
        sport: (
            <>
                {bodyBase}
                <path d="M30,78 L20,92 L26,98 L35,84" fill={color} />
                <path d="M70,78 L80,92 L74,98 L65,84" fill={color} />
                <line x1="35" y1="80" x2="35" y2="115" stroke="white" strokeWidth="3" />
                <line x1="65" y1="80" x2="65" y2="115" stroke="white" strokeWidth="3" />
            </>
        ),
        armor: (
            <>
                <path d="M32,75 L28,120 L72,120 L68,75 Q50,68 32,75 Z" fill={color} />
                <path d="M28,78 L15,95 L22,102 L35,85" fill={color} />
                <path d="M72,78 L85,95 L78,102 L65,85" fill={color} />
                <ellipse cx="50" cy="90" rx="12" ry="10" fill="rgba(0,0,0,0.2)" />
                <path d="M50,82 L55,88 L50,98 L45,88 Z" fill="#FFD700" />
            </>
        ),
        ninja: (
            <>
                {bodyBase}
                <path d="M30,78 L20,95 L28,100 L38,83" fill={color} />
                <path d="M70,78 L80,95 L72,100 L62,83" fill={color} />
                <rect x="30" y="88" width="40" height="3" fill="#8B4513" />
            </>
        ),
        warrior: (
            <>
                {bodyBase}
                <path d="M28,78 L15,100 L25,108 L38,85" fill={color} />
                <path d="M72,78 L85,100 L75,108 L62,85" fill={color} />
                <ellipse cx="50" cy="92" rx="15" ry="12" fill="#8B4513" opacity="0.8" />
                <path d="M50,82 L58,92 L50,105 L42,92 Z" fill="#C0C0C0" />
            </>
        )
    };

    return styles[style] || styles.tshirt;
};

// === AVATAR PREVIEW COMPONENT ===
const AvatarPreview = ({ config, size = 200 }) => {
    const scale = size / 120;

    return (
        <div style={{
            width: size,
            height: size * 1.4,
            background: config.background,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '40%',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <svg
                viewBox="0 0 100 140"
                style={{
                    width: size,
                    height: size * 1.4,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
            >
                {/* Body/Outfit */}
                <OutfitSVG style={config.outfit} color={config.outfitColor} />

                {/* Neck */}
                <rect x="42" y="68" width="16" height="10" rx="4" fill={config.skin} />

                {/* Head */}
                <ellipse cx="50" cy="48" rx="25" ry="28" fill={config.skin} />

                {/* Ears */}
                <ellipse cx="25" cy="48" rx="5" ry="7" fill={config.skin} />
                <ellipse cx="75" cy="48" rx="5" ry="7" fill={config.skin} />

                {/* Hair */}
                <HairSVG style={config.hair} color={config.hairColor} />

                {/* Eyes */}
                <EyesSVG style={config.eyes} color={config.eyeColor} />

                {/* Nose */}
                <ellipse cx="50" cy="52" rx="2" ry="3" fill={config.skin} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

                {/* Mouth */}
                <MouthSVG style={config.mouth} />

                {/* Accessory */}
                <AccessorySVG style={config.accessory} />
            </svg>
        </div>
    );
};

// === MAIN AVATAR BUILDER COMPONENT ===
const AvatarBuilder = ({ isOpen, onClose, onSave, initialConfig }) => {
    const defaultConfig = {
        skin: AVATAR_CONFIG.skinTones[2].color,
        skinId: 'medium',
        hair: 'short',
        hairColor: AVATAR_CONFIG.hairColors[0].color,
        hairColorId: 'black',
        eyes: 'normal',
        eyeColor: AVATAR_CONFIG.eyeColors[0].color,
        eyeColorId: 'brown',
        mouth: 'smile',
        accessory: 'none',
        outfit: 'tshirt',
        outfitColor: AVATAR_CONFIG.outfitColors[0].color,
        outfitColorId: 'blue',
        background: AVATAR_CONFIG.backgrounds[0].gradient,
        backgroundId: 'gym'
    };

    const [config, setConfig] = useState(initialConfig || defaultConfig);
    const [activeCategory, setActiveCategory] = useState('skin');
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    const updateConfig = (key, value, id = null) => {
        setConfig(prev => ({
            ...prev,
            [key]: value,
            ...(id ? { [`${key}Id`]: id } : {})
        }));
    };

    const resetConfig = () => {
        setConfig(defaultConfig);
    };

    const handleSave = () => {
        localStorage.setItem('userAvatarConfig', JSON.stringify(config));
        onSave(config);
        onClose();
    };

    const renderCategoryOptions = () => {
        switch (activeCategory) {
            case 'skin':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tom de Pele</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {AVATAR_CONFIG.skinTones.map(tone => (
                                <button
                                    key={tone.id}
                                    onClick={() => updateConfig('skin', tone.color, tone.id)}
                                    className="avatar-option"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: tone.color,
                                        border: config.skinId === tone.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    {config.skinId === tone.id && (
                                        <Check size={16} color="#000" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'hair':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Estilo de Cabelo</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {AVATAR_CONFIG.hairstyles.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => updateConfig('hair', style.id)}
                                        className="avatar-option"
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: config.hair === style.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: config.hair === style.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                            cursor: 'pointer',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>{style.emoji}</span>
                                        {style.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Cor do Cabelo</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {AVATAR_CONFIG.hairColors.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => updateConfig('hairColor', color.color, color.id)}
                                        className="avatar-option"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: color.color,
                                            border: config.hairColorId === color.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'eyes':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Estilo dos Olhos</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {AVATAR_CONFIG.eyes.map(eye => (
                                    <button
                                        key={eye.id}
                                        onClick={() => updateConfig('eyes', eye.id)}
                                        className="avatar-option"
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: config.eyes === eye.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: config.eyes === eye.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                            cursor: 'pointer',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>{eye.emoji}</span>
                                        {eye.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Cor dos Olhos</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {AVATAR_CONFIG.eyeColors.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => updateConfig('eyeColor', color.color, color.id)}
                                        className="avatar-option"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: color.color,
                                            border: config.eyeColorId === color.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'mouth':
                return (
                    <div>
                        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Expressão da Boca</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {AVATAR_CONFIG.mouths.map(mouth => (
                                <button
                                    key={mouth.id}
                                    onClick={() => updateConfig('mouth', mouth.id)}
                                    className="avatar-option"
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        background: config.mouth === mouth.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                        border: config.mouth === mouth.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '13px'
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{mouth.emoji}</span>
                                    {mouth.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'accessory':
                return (
                    <div>
                        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Acessórios</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {AVATAR_CONFIG.accessories.map(acc => (
                                <button
                                    key={acc.id}
                                    onClick={() => updateConfig('accessory', acc.id)}
                                    className="avatar-option"
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        background: config.accessory === acc.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                        border: config.accessory === acc.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '13px'
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{acc.emoji}</span>
                                    {acc.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'outfit':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Tipo de Roupa</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {AVATAR_CONFIG.outfits.map(outfit => (
                                    <button
                                        key={outfit.id}
                                        onClick={() => updateConfig('outfit', outfit.id)}
                                        className="avatar-option"
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: config.outfit === outfit.id ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: config.outfit === outfit.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                            cursor: 'pointer',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '13px'
                                        }}
                                    >
                                        <span style={{ fontSize: '18px' }}>{outfit.emoji}</span>
                                        {outfit.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Cor da Roupa</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {AVATAR_CONFIG.outfitColors.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => updateConfig('outfitColor', color.color, color.id)}
                                        className="avatar-option"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: color.color,
                                            border: config.outfitColorId === color.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'background':
                return (
                    <div>
                        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Fundo do Avatar</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                            {AVATAR_CONFIG.backgrounds.map(bg => (
                                <button
                                    key={bg.id}
                                    onClick={() => updateConfig('background', bg.gradient, bg.id)}
                                    className="avatar-option"
                                    style={{
                                        height: '80px',
                                        borderRadius: '12px',
                                        background: bg.gradient,
                                        border: config.backgroundId === bg.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        padding: '8px',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {bg.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 28px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Sparkles size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '24px', fontWeight: '900' }}>
                            Crie seu <span className="text-gradient">Avatar</span>
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={resetConfig}
                            style={{
                                padding: '10px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '18px'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden'
                }}>
                    {/* Preview */}
                    <div style={{
                        width: '300px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                        borderRight: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{
                            transform: isRotating ? 'rotateY(180deg)' : 'rotateY(0)',
                            transition: 'transform 0.6s ease'
                        }}>
                            <AvatarPreview config={config} size={200} />
                        </div>
                        <p style={{
                            marginTop: '20px',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            textAlign: 'center'
                        }}>
                            Personalize cada detalhe do seu avatar!
                        </p>
                    </div>

                    {/* Customization Options */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Category Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            overflowX: 'auto'
                        }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '10px',
                                        background: activeCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        color: activeCategory === cat.id ? '#000' : '#fff',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Options */}
                        <div style={{
                            flex: 1,
                            padding: '24px',
                            overflowY: 'auto'
                        }}>
                            {renderCategoryOptions()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 28px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        style={{ padding: '12px 24px' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ padding: '12px 32px' }}
                    >
                        Salvar Avatar
                    </button>
                </div>
            </div>
        </div>
    );
};

export { AvatarBuilder, AvatarPreview, AVATAR_CONFIG };
export default AvatarBuilder;
