import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Zap, Trophy, Sword, Shield, Heart, Skull, Crown, Star, Flame, Target, ChevronRight, Play, ShoppingCart } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Calendar, Check, X, ArrowRight } from 'lucide-react';

// ========== BOSS SPRITES COMPONENTS ==========

// Megalodon - Tubarão Gigante
const MegalodonSprite = ({ isAttacking, isDefeated }) => (
    <svg viewBox="0 0 120 80" className={`boss-sprite megalodon ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}>
        <defs>
            <linearGradient id="megalodonBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2C5F7C" />
                <stop offset="50%" stopColor="#1E4258" />
                <stop offset="100%" stopColor="#0D2B3A" />
            </linearGradient>
            <linearGradient id="megalodonBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B8D4E3" />
                <stop offset="100%" stopColor="#8FB8CD" />
            </linearGradient>
            <filter id="megalodonGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Corpo principal */}
        <ellipse cx="55" cy="40" rx="45" ry="22" fill="url(#megalodonBody)" className="body-main" />

        {/* Barriga */}
        <ellipse cx="55" cy="48" rx="35" ry="12" fill="url(#megalodonBelly)" />

        {/* Cabeça */}
        <path d="M 95 40 Q 115 40 110 45 Q 105 50 95 48 Z" fill="url(#megalodonBody)" />

        {/* Focinho afiado */}
        <path d="M 110 43 L 120 42 L 110 46 Z" fill="#1E4258" />

        {/* Barbatana dorsal gigante */}
        <path d="M 45 18 L 55 -5 L 65 18 Q 55 20 45 18 Z" fill="url(#megalodonBody)" className="dorsal-fin" />

        {/* Barbatanas laterais */}
        <path d="M 35 50 L 15 65 L 25 55 L 40 52 Z" fill="url(#megalodonBody)" className="side-fin-left" />
        <path d="M 70 50 L 85 62 L 80 55 L 72 52 Z" fill="url(#megalodonBody)" className="side-fin-right" />

        {/* Cauda */}
        <path d="M 10 35 L -5 20 L 5 40 L -5 60 L 10 45 Z" fill="url(#megalodonBody)" className="tail" />

        {/* Olho malvado */}
        <circle cx="100" cy="38" r="5" fill="#1a1a1a" />
        <circle cx="101" cy="37" r="2" fill="#FF3333" filter="url(#megalodonGlow)" className="eye-glow" />

        {/* Guelras */}
        <path d="M 80 35 L 83 30 M 85 35 L 88 30 M 90 35 L 93 30" stroke="#0D2B3A" strokeWidth="1.5" fill="none" />

        {/* Dentes enormes */}
        <g className="teeth">
            <path d="M 105 44 L 107 50 L 109 44" fill="#FFFFFF" />
            <path d="M 108 44 L 110 49 L 112 44" fill="#FFFFFF" />
            <path d="M 111 44 L 113 48 L 115 44" fill="#FFFFFF" />
            <path d="M 105 46 L 107 52 L 109 46" fill="#FFFFFF" />
            <path d="M 108 46 L 110 51 L 112 46" fill="#FFFFFF" />
        </g>

        {/* Cicatrizes de batalha */}
        <path d="M 60 30 L 70 33 L 65 28" stroke="#0D2B3A" strokeWidth="1" fill="none" />
        <path d="M 40 35 L 48 32" stroke="#0D2B3A" strokeWidth="1" fill="none" />

        {/* Bolhas */}
        <g className="bubbles">
            <circle cx="115" cy="35" r="2" fill="rgba(255,255,255,0.3)" />
            <circle cx="118" cy="30" r="1.5" fill="rgba(255,255,255,0.2)" />
            <circle cx="116" cy="25" r="1" fill="rgba(255,255,255,0.2)" />
        </g>
    </svg>
);

// Tigre Dentes de Sabre
const SaberToothSprite = ({ isAttacking, isDefeated }) => (
    <svg viewBox="0 0 120 100" className={`boss-sprite sabertooth ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}>
        <defs>
            <linearGradient id="saberFur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A84B" />
                <stop offset="50%" stopColor="#C49432" />
                <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
            <linearGradient id="saberStripe" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2D1810" />
                <stop offset="100%" stopColor="#1A0F0A" />
            </linearGradient>
            <filter id="saberGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Corpo */}
        <ellipse cx="50" cy="60" rx="35" ry="25" fill="url(#saberFur)" className="body-main" />

        {/* Patas traseiras */}
        <ellipse cx="25" cy="80" rx="10" ry="15" fill="url(#saberFur)" />
        <ellipse cx="45" cy="82" rx="8" ry="12" fill="url(#saberFur)" />

        {/* Patas dianteiras */}
        <ellipse cx="70" cy="78" rx="8" ry="15" fill="url(#saberFur)" className="front-leg-left" />
        <ellipse cx="85" cy="80" rx="8" ry="14" fill="url(#saberFur)" className="front-leg-right" />

        {/* Garras */}
        <g className="claws">
            <path d="M 65 92 L 63 98 L 66 93" fill="#333" />
            <path d="M 68 92 L 66 98 L 69 93" fill="#333" />
            <path d="M 71 92 L 69 98 L 72 93" fill="#333" />
            <path d="M 80 92 L 78 98 L 81 93" fill="#333" />
            <path d="M 83 92 L 81 98 L 84 93" fill="#333" />
            <path d="M 86 92 L 84 98 L 87 93" fill="#333" />
        </g>

        {/* Cabeça */}
        <ellipse cx="95" cy="45" rx="22" ry="18" fill="url(#saberFur)" />

        {/* Focinho */}
        <ellipse cx="112" cy="50" rx="10" ry="8" fill="#E8C896" />

        {/* Nariz */}
        <ellipse cx="118" cy="48" rx="4" ry="3" fill="#2D1810" />

        {/* Orelhas */}
        <path d="M 80 28 L 75 15 L 85 25 Z" fill="url(#saberFur)" className="ear-left" />
        <path d="M 95 25 L 95 10 L 105 22 Z" fill="url(#saberFur)" className="ear-right" />
        <path d="M 82 27 L 78 18 L 85 26 Z" fill="#FFB6C1" />
        <path d="M 96 24 L 96 14 L 103 23 Z" fill="#FFB6C1" />

        {/* Olhos furiosos */}
        <ellipse cx="90" cy="40" rx="5" ry="4" fill="#1a1a1a" />
        <ellipse cx="105" cy="40" rx="5" ry="4" fill="#1a1a1a" />
        <circle cx="91" cy="39" r="2" fill="#FFD700" filter="url(#saberGlow)" className="eye-glow" />
        <circle cx="106" cy="39" r="2" fill="#FFD700" filter="url(#saberGlow)" className="eye-glow" />

        {/* Sobrancelhas tensas */}
        <path d="M 85 35 L 94 37" stroke="#2D1810" strokeWidth="2" fill="none" />
        <path d="M 116 37 L 107 35" stroke="#2D1810" strokeWidth="2" fill="none" />

        {/* DENTES DE SABRE GIGANTES */}
        <g className="saber-teeth">
            <path d="M 105 55 Q 103 80 108 85 Q 110 80 108 55" fill="#FFFFF0" stroke="#E8E8D0" strokeWidth="0.5" />
            <path d="M 115 55 Q 113 78 118 82 Q 120 78 118 55" fill="#FFFFF0" stroke="#E8E8D0" strokeWidth="0.5" />
        </g>

        {/* Listras */}
        <g className="stripes">
            <path d="M 30 50 Q 35 45 40 50" stroke="url(#saberStripe)" strokeWidth="4" fill="none" />
            <path d="M 40 45 Q 45 40 50 45" stroke="url(#saberStripe)" strokeWidth="4" fill="none" />
            <path d="M 50 42 Q 55 37 60 42" stroke="url(#saberStripe)" strokeWidth="4" fill="none" />
            <path d="M 55 55 Q 60 50 65 55" stroke="url(#saberStripe)" strokeWidth="3" fill="none" />
        </g>

        {/* Rabo */}
        <path d="M 15 55 Q 5 50 0 55 Q 5 60 10 58" fill="url(#saberFur)" className="tail" />

        {/* Juba */}
        <path d="M 75 35 Q 70 30 72 25 Q 78 28 75 35" fill="#B8860B" />
        <path d="M 78 32 Q 75 25 78 20 Q 82 24 78 32" fill="#B8860B" />
    </svg>
);

// Dragão de Gelo
const IceDragonSprite = ({ isAttacking, isDefeated }) => (
    <svg viewBox="0 0 140 120" className={`boss-sprite ice-dragon ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}>
        <defs>
            <linearGradient id="iceScale" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="50%" stopColor="#4FC3F7" />
                <stop offset="100%" stopColor="#0288D1" />
            </linearGradient>
            <linearGradient id="iceBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0F7FA" />
                <stop offset="100%" stopColor="#B2EBF2" />
            </linearGradient>
            <filter id="iceGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="frostEffect">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>

        {/* Asa esquerda */}
        <g className="wing-left">
            <path d="M 35 45 L 5 15 L 15 35 L 0 25 L 20 45 L 10 40 L 30 50 Z" fill="url(#iceScale)" opacity="0.8" />
            <path d="M 30 48 L 15 30" stroke="#0288D1" strokeWidth="1" fill="none" />
            <path d="M 28 50 L 8 38" stroke="#0288D1" strokeWidth="1" fill="none" />
        </g>

        {/* Asa direita */}
        <g className="wing-right">
            <path d="M 90 45 L 120 10 L 110 35 L 135 20 L 105 48 L 125 35 L 95 55 Z" fill="url(#iceScale)" opacity="0.8" />
            <path d="M 95 50 L 115 28" stroke="#0288D1" strokeWidth="1" fill="none" />
            <path d="M 97 53 L 122 35" stroke="#0288D1" strokeWidth="1" fill="none" />
        </g>

        {/* Corpo principal */}
        <ellipse cx="65" cy="65" rx="35" ry="25" fill="url(#iceScale)" className="body-main" />

        {/* Barriga com escamas de gelo */}
        <ellipse cx="65" cy="72" rx="25" ry="15" fill="url(#iceBelly)" />

        {/* Escamas detalhadas */}
        <g className="scales" opacity="0.5">
            <path d="M 45 60 Q 50 55 55 60" stroke="#0288D1" strokeWidth="1" fill="none" />
            <path d="M 55 58 Q 60 53 65 58" stroke="#0288D1" strokeWidth="1" fill="none" />
            <path d="M 65 56 Q 70 51 75 56" stroke="#0288D1" strokeWidth="1" fill="none" />
            <path d="M 75 58 Q 80 53 85 58" stroke="#0288D1" strokeWidth="1" fill="none" />
        </g>

        {/* Pescoço longo */}
        <path d="M 95 55 Q 110 45 120 50 Q 125 55 120 60" fill="url(#iceScale)" />

        {/* Cabeça de dragão */}
        <ellipse cx="125" cy="50" rx="15" ry="12" fill="url(#iceScale)" />

        {/* Chifres de gelo */}
        <path d="M 115 40 L 108 25 L 112 38" fill="#B2EBF2" className="horn-left" />
        <path d="M 125 38 L 125 20 L 128 36" fill="#B2EBF2" className="horn-right" />
        <path d="M 133 42 L 140 28 L 135 40" fill="#B2EBF2" />

        {/* Focinho */}
        <path d="M 135 48 L 145 50 L 135 55 Z" fill="url(#iceScale)" />

        {/* Olhos gelados */}
        <ellipse cx="120" cy="47" rx="4" ry="3" fill="#0D47A1" />
        <circle cx="121" cy="46" r="1.5" fill="#00FFFF" filter="url(#iceGlow)" className="eye-glow" />
        <ellipse cx="130" cy="47" rx="4" ry="3" fill="#0D47A1" />
        <circle cx="131" cy="46" r="1.5" fill="#00FFFF" filter="url(#iceGlow)" className="eye-glow" />

        {/* Respiração gelada */}
        <g className="ice-breath" filter="url(#iceGlow)">
            <ellipse cx="148" cy="52" rx="5" ry="3" fill="rgba(0,255,255,0.3)" />
            <ellipse cx="155" cy="52" rx="4" ry="2" fill="rgba(0,255,255,0.2)" />
            <ellipse cx="160" cy="52" rx="3" ry="1.5" fill="rgba(0,255,255,0.1)" />
        </g>

        {/* Patas com garras de gelo */}
        <g className="legs">
            <ellipse cx="45" cy="88" rx="8" ry="12" fill="url(#iceScale)" />
            <ellipse cx="60" cy="90" rx="7" ry="10" fill="url(#iceScale)" />
            <ellipse cx="75" cy="90" rx="7" ry="10" fill="url(#iceScale)" />
            <ellipse cx="88" cy="88" rx="8" ry="12" fill="url(#iceScale)" />
        </g>

        {/* Garras de gelo */}
        <g className="ice-claws">
            <path d="M 42 98 L 38 108 L 44 100" fill="#B2EBF2" />
            <path d="M 46 98 L 44 108 L 48 100" fill="#B2EBF2" />
            <path d="M 86 98 L 84 108 L 88 100" fill="#B2EBF2" />
            <path d="M 90 98 L 88 108 L 92 100" fill="#B2EBF2" />
        </g>

        {/* Cauda com espinhos */}
        <path d="M 30 65 Q 15 60 5 70 Q 10 75 20 72 Q 10 78 5 85 Q 15 82 25 78" fill="url(#iceScale)" className="tail" />

        {/* Espinhos na cauda */}
        <path d="M 8 70 L 3 65 L 10 72" fill="#B2EBF2" />
        <path d="M 6 78 L 0 75 L 8 80" fill="#B2EBF2" />
        <path d="M 8 85 L 2 88 L 10 86" fill="#B2EBF2" />

        {/* Cristais de gelo flutuando */}
        <g className="ice-crystals">
            <polygon points="50,25 53,20 56,25 53,30" fill="#00FFFF" opacity="0.6" filter="url(#iceGlow)" />
            <polygon points="80,20 82,16 84,20 82,24" fill="#00FFFF" opacity="0.4" filter="url(#iceGlow)" />
            <polygon points="100,30 102,27 104,30 102,33" fill="#00FFFF" opacity="0.5" filter="url(#iceGlow)" />
        </g>
    </svg>
);

// Kraken - Polvo Gigante
const KrakenSprite = ({ isAttacking, isDefeated }) => (
    <svg viewBox="0 0 120 120" className={`boss-sprite kraken ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}>
        <defs>
            <linearGradient id="krakenBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B3FA0" />
                <stop offset="50%" stopColor="#4A2C6E" />
                <stop offset="100%" stopColor="#2D1B4E" />
            </linearGradient>
            <linearGradient id="tentacleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6B3FA0" />
                <stop offset="100%" stopColor="#9B59B6" />
            </linearGradient>
            <filter id="krakenGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Tentáculos traseiros */}
        <g className="tentacles-back">
            <path d="M 30 70 Q 10 90 15 110 Q 20 115 25 105 Q 22 95 35 75" fill="url(#tentacleGrad)" className="tentacle-1" />
            <path d="M 90 70 Q 110 90 105 110 Q 100 115 95 105 Q 98 95 85 75" fill="url(#tentacleGrad)" className="tentacle-2" />
        </g>

        {/* Cabeça/Manto principal */}
        <ellipse cx="60" cy="45" rx="35" ry="35" fill="url(#krakenBody)" className="body-main" />

        {/* Textura do manto */}
        <g className="mantle-texture" opacity="0.3">
            <ellipse cx="45" cy="35" rx="8" ry="10" fill="#9B59B6" />
            <ellipse cx="75" cy="35" rx="8" ry="10" fill="#9B59B6" />
            <ellipse cx="60" cy="28" rx="10" ry="8" fill="#9B59B6" />
        </g>

        {/* Olhos enormes e assustadores */}
        <ellipse cx="45" cy="50" rx="12" ry="14" fill="#1a1a1a" />
        <ellipse cx="75" cy="50" rx="12" ry="14" fill="#1a1a1a" />
        <circle cx="47" cy="48" r="5" fill="#FF4500" filter="url(#krakenGlow)" className="eye-glow" />
        <circle cx="77" cy="48" r="5" fill="#FF4500" filter="url(#krakenGlow)" className="eye-glow" />
        <circle cx="49" cy="46" r="2" fill="#FFFFFF" />
        <circle cx="79" cy="46" r="2" fill="#FFFFFF" />

        {/* Bico */}
        <path d="M 55 68 L 60 78 L 65 68 Q 60 72 55 68" fill="#1a1a1a" />

        {/* Tentáculos frontais */}
        <g className="tentacles-front">
            <path d="M 35 75 Q 15 85 8 100 Q 5 110 12 108 Q 18 100 25 95 Q 15 105 18 115 Q 25 112 30 100 Q 35 90 40 80" fill="url(#tentacleGrad)" className="tentacle-3" />
            <path d="M 85 75 Q 105 85 112 100 Q 115 110 108 108 Q 102 100 95 95 Q 105 105 102 115 Q 95 112 90 100 Q 85 90 80 80" fill="url(#tentacleGrad)" className="tentacle-4" />
            <path d="M 45 78 Q 35 95 30 108 Q 32 118 40 112 Q 42 100 48 88" fill="url(#tentacleGrad)" className="tentacle-5" />
            <path d="M 75 78 Q 85 95 90 108 Q 88 118 80 112 Q 78 100 72 88" fill="url(#tentacleGrad)" className="tentacle-6" />
            <path d="M 55 80 Q 50 100 55 120 Q 60 118 58 100 Q 58 90 58 82" fill="url(#tentacleGrad)" className="tentacle-7" />
            <path d="M 65 80 Q 70 100 65 120 Q 60 118 62 100 Q 62 90 62 82" fill="url(#tentacleGrad)" className="tentacle-8" />
        </g>

        {/* Ventosas nos tentáculos */}
        <g className="suckers" fill="#9B59B6">
            <circle cx="20" cy="100" r="3" opacity="0.7" />
            <circle cx="25" cy="108" r="2.5" opacity="0.6" />
            <circle cx="100" cy="100" r="3" opacity="0.7" />
            <circle cx="95" cy="108" r="2.5" opacity="0.6" />
            <circle cx="38" cy="105" r="2" opacity="0.5" />
            <circle cx="82" cy="105" r="2" opacity="0.5" />
        </g>

        {/* Aura sombria */}
        <ellipse cx="60" cy="60" rx="50" ry="45" fill="none" stroke="rgba(155,89,182,0.2)" strokeWidth="2" className="aura" />

        {/* Bolhas */}
        <g className="bubbles">
            <circle cx="25" cy="30" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="95" cy="25" r="2" fill="rgba(255,255,255,0.15)" />
            <circle cx="40" cy="15" r="2.5" fill="rgba(255,255,255,0.2)" />
        </g>
    </svg>
);

// Fênix Sombria
const DarkPhoenixSprite = ({ isAttacking, isDefeated }) => (
    <svg viewBox="0 0 140 120" className={`boss-sprite dark-phoenix ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}>
        <defs>
            <linearGradient id="phoenixFlame" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="30%" stopColor="#FF4500" />
                <stop offset="60%" stopColor="#FF8C00" />
                <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <linearGradient id="phoenixBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B0000" />
                <stop offset="50%" stopColor="#B22222" />
                <stop offset="100%" stopColor="#DC143C" />
            </linearGradient>
            <filter id="fireGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="emberGlow">
                <feGaussianBlur stdDeviation="2" />
            </filter>
        </defs>

        {/* Aura de fogo */}
        <ellipse cx="70" cy="50" rx="55" ry="45" fill="none" stroke="rgba(255,69,0,0.3)" strokeWidth="3" filter="url(#fireGlow)" className="fire-aura" />

        {/* Asa esquerda em chamas */}
        <g className="wing-left">
            <path d="M 30 55 L 5 30 L 15 45 L -5 20 L 20 50 L 0 35 L 25 55" fill="url(#phoenixFlame)" filter="url(#fireGlow)" />
            <path d="M 28 58 L 10 40 L 18 52 L 5 35 L 22 55" fill="url(#phoenixBody)" />
        </g>

        {/* Asa direita em chamas */}
        <g className="wing-right">
            <path d="M 110 55 L 135 30 L 125 45 L 145 20 L 120 50 L 140 35 L 115 55" fill="url(#phoenixFlame)" filter="url(#fireGlow)" />
            <path d="M 112 58 L 130 40 L 122 52 L 135 35 L 118 55" fill="url(#phoenixBody)" />
        </g>

        {/* Chamas da cauda */}
        <g className="tail-flames">
            <path d="M 55 90 Q 40 105 50 120 Q 55 110 60 115 Q 58 105 55 95" fill="url(#phoenixFlame)" filter="url(#fireGlow)" className="flame-1" />
            <path d="M 70 92 Q 65 110 70 125 Q 75 115 78 120 Q 75 108 70 95" fill="url(#phoenixFlame)" filter="url(#fireGlow)" className="flame-2" />
            <path d="M 85 90 Q 100 105 90 120 Q 85 110 80 115 Q 82 105 85 95" fill="url(#phoenixFlame)" filter="url(#fireGlow)" className="flame-3" />
        </g>

        {/* Corpo principal */}
        <ellipse cx="70" cy="60" rx="30" ry="25" fill="url(#phoenixBody)" className="body-main" />

        {/* Penas detalhadas */}
        <g className="feathers" opacity="0.6">
            <path d="M 50 55 Q 55 50 60 55" stroke="#FFD700" strokeWidth="1" fill="none" />
            <path d="M 60 52 Q 65 47 70 52" stroke="#FFD700" strokeWidth="1" fill="none" />
            <path d="M 70 50 Q 75 45 80 50" stroke="#FFD700" strokeWidth="1" fill="none" />
            <path d="M 80 52 Q 85 47 90 52" stroke="#FFD700" strokeWidth="1" fill="none" />
        </g>

        {/* Pescoço */}
        <path d="M 75 40 Q 85 35 95 38" fill="url(#phoenixBody)" />

        {/* Cabeça */}
        <ellipse cx="100" cy="35" rx="15" ry="12" fill="url(#phoenixBody)" />

        {/* Crista de fogo */}
        <g className="fire-crest" filter="url(#fireGlow)">
            <path d="M 95 25 L 90 10 L 95 20 L 93 5 L 98 18 L 100 2 L 102 18 L 107 5 L 105 20 L 110 10 L 105 25" fill="url(#phoenixFlame)" />
        </g>

        {/* Bico afiado */}
        <path d="M 112 33 L 125 35 L 112 40 Z" fill="#FFD700" />
        <path d="M 112 36 L 120 37 L 112 38 Z" fill="#FFA500" />

        {/* Olhos flamejantes */}
        <ellipse cx="97" cy="32" rx="4" ry="3" fill="#1a1a1a" />
        <circle cx="98" cy="31" r="2" fill="#FFFF00" filter="url(#fireGlow)" className="eye-glow" />
        <ellipse cx="107" cy="32" rx="4" ry="3" fill="#1a1a1a" />
        <circle cx="108" cy="31" r="2" fill="#FFFF00" filter="url(#fireGlow)" className="eye-glow" />

        {/* Patas com garras */}
        <g className="legs">
            <path d="M 55 82 L 50 95 L 45 100 M 50 95 L 50 102 M 50 95 L 55 100" stroke="#8B0000" strokeWidth="3" fill="none" />
            <path d="M 85 82 L 90 95 L 95 100 M 90 95 L 90 102 M 90 95 L 85 100" stroke="#8B0000" strokeWidth="3" fill="none" />
        </g>

        {/* Fagulhas flutuantes */}
        <g className="embers" filter="url(#emberGlow)">
            <circle cx="30" cy="40" r="2" fill="#FF4500" opacity="0.8" />
            <circle cx="110" cy="45" r="1.5" fill="#FFD700" opacity="0.7" />
            <circle cx="50" cy="25" r="1.5" fill="#FF6347" opacity="0.6" />
            <circle cx="90" cy="20" r="2" fill="#FF4500" opacity="0.7" />
            <circle cx="65" cy="15" r="1" fill="#FFD700" opacity="0.8" />
            <circle cx="120" cy="55" r="1.5" fill="#FF6347" opacity="0.6" />
        </g>
    </svg>
);

// Cérbero - Cachorro de 3 Cabeças
const CerberusSprite = ({ isAttacking, isDefeated }) => (
    <svg viewBox="0 0 150 110" className={`boss-sprite cerberus ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}>
        <defs>
            <linearGradient id="cerberusFur" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2C2C2C" />
                <stop offset="50%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0D0D0D" />
            </linearGradient>
            <linearGradient id="hellFire" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#8B0000" />
                <stop offset="50%" stopColor="#FF4500" />
                <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
            <filter id="hellGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Chamas do inferno no fundo */}
        <g className="hell-flames" filter="url(#hellGlow)" opacity="0.5">
            <path d="M 10 110 Q 15 90 10 70 Q 20 85 15 110" fill="url(#hellFire)" />
            <path d="M 30 110 Q 35 85 28 65 Q 40 80 35 110" fill="url(#hellFire)" />
            <path d="M 120 110 Q 115 90 120 70 Q 110 85 115 110" fill="url(#hellFire)" />
            <path d="M 140 110 Q 135 85 142 65 Q 130 80 135 110" fill="url(#hellFire)" />
        </g>

        {/* Corpo massivo */}
        <ellipse cx="75" cy="70" rx="45" ry="28" fill="url(#cerberusFur)" className="body-main" />

        {/* Patas poderosas */}
        <g className="legs">
            <ellipse cx="40" cy="95" rx="10" ry="15" fill="url(#cerberusFur)" />
            <ellipse cx="60" cy="97" rx="9" ry="13" fill="url(#cerberusFur)" />
            <ellipse cx="90" cy="97" rx="9" ry="13" fill="url(#cerberusFur)" />
            <ellipse cx="110" cy="95" rx="10" ry="15" fill="url(#cerberusFur)" />
        </g>

        {/* Garras infernais */}
        <g className="claws" fill="#4A4A4A">
            <path d="M 35 108 L 32 115 L 37 110" />
            <path d="M 40 108 L 38 115 L 42 110" />
            <path d="M 45 108 L 44 115 L 47 110" />
            <path d="M 105 108 L 103 115 L 107 110" />
            <path d="M 110 108 L 108 115 L 112 110" />
            <path d="M 115 108 L 114 115 L 117 110" />
        </g>

        {/* Cauda serpentina */}
        <path d="M 120 65 Q 135 60 145 70 Q 150 75 145 80 Q 140 75 135 78 Q 130 72 125 70" fill="url(#cerberusFur)" className="tail" />
        <ellipse cx="147" cy="75" rx="5" ry="4" fill="#2C2C2C" />
        <circle cx="149" cy="74" r="1.5" fill="#FF4500" filter="url(#hellGlow)" />

        {/* === CABEÇA ESQUERDA === */}
        <g className="head-left">
            <ellipse cx="35" cy="40" rx="18" ry="15" fill="url(#cerberusFur)" />
            {/* Focinho */}
            <ellipse cx="22" cy="45" rx="10" ry="7" fill="#1a1a1a" />
            {/* Nariz */}
            <ellipse cx="15" cy="44" rx="4" ry="3" fill="#0D0D0D" />
            {/* Orelha */}
            <path d="M 45 28 L 55 15 L 50 30 Z" fill="url(#cerberusFur)" />
            {/* Olho flamejante */}
            <ellipse cx="38" cy="35" rx="5" ry="4" fill="#1a1a1a" />
            <circle cx="39" cy="34" r="2.5" fill="#FF0000" filter="url(#hellGlow)" className="eye-glow" />
            {/* Boca com presas */}
            <path d="M 15 48 Q 22 55 30 50" stroke="#0D0D0D" strokeWidth="2" fill="none" />
            <path d="M 18 50 L 16 58 L 20 52" fill="#FFFFF0" />
            <path d="M 25 52 L 24 59 L 27 53" fill="#FFFFF0" />
        </g>

        {/* === CABEÇA CENTRAL (maior e mais feroz) === */}
        <g className="head-center">
            <ellipse cx="75" cy="35" rx="22" ry="18" fill="url(#cerberusFur)" />
            {/* Focinho */}
            <ellipse cx="75" cy="48" rx="12" ry="9" fill="#1a1a1a" />
            {/* Nariz */}
            <ellipse cx="75" cy="42" rx="5" ry="4" fill="#0D0D0D" />
            {/* Orelhas */}
            <path d="M 60 20 L 55 5 L 65 18 Z" fill="url(#cerberusFur)" />
            <path d="M 90 20 L 95 5 L 85 18 Z" fill="url(#cerberusFur)" />
            {/* Olhos flamejantes */}
            <ellipse cx="65" cy="32" rx="6" ry="5" fill="#1a1a1a" />
            <circle cx="66" cy="31" r="3" fill="#FF4500" filter="url(#hellGlow)" className="eye-glow" />
            <ellipse cx="85" cy="32" rx="6" ry="5" fill="#1a1a1a" />
            <circle cx="86" cy="31" r="3" fill="#FF4500" filter="url(#hellGlow)" className="eye-glow" />
            {/* Cicatriz */}
            <path d="M 70 25 L 80 28" stroke="#4A4A4A" strokeWidth="1.5" fill="none" />
            {/* Boca aberta com presas enormes */}
            <path d="M 63 52 Q 75 62 87 52" stroke="#0D0D0D" strokeWidth="2" fill="none" />
            <path d="M 67 54 L 64 65 L 70 56" fill="#FFFFF0" />
            <path d="M 75 56 L 75 68 L 78 58" fill="#FFFFF0" />
            <path d="M 83 54 L 86 65 L 80 56" fill="#FFFFF0" />
            {/* Baba infernal */}
            <path d="M 72 60 Q 70 70 72 75" stroke="rgba(255,69,0,0.5)" strokeWidth="2" fill="none" filter="url(#hellGlow)" />
        </g>

        {/* === CABEÇA DIREITA === */}
        <g className="head-right">
            <ellipse cx="115" cy="40" rx="18" ry="15" fill="url(#cerberusFur)" />
            {/* Focinho */}
            <ellipse cx="128" cy="45" rx="10" ry="7" fill="#1a1a1a" />
            {/* Nariz */}
            <ellipse cx="135" cy="44" rx="4" ry="3" fill="#0D0D0D" />
            {/* Orelha */}
            <path d="M 105 28 L 95 15 L 100 30 Z" fill="url(#cerberusFur)" />
            {/* Olho flamejante */}
            <ellipse cx="112" cy="35" rx="5" ry="4" fill="#1a1a1a" />
            <circle cx="113" cy="34" r="2.5" fill="#FF0000" filter="url(#hellGlow)" className="eye-glow" />
            {/* Boca com presas */}
            <path d="M 135 48 Q 128 55 120 50" stroke="#0D0D0D" strokeWidth="2" fill="none" />
            <path d="M 132 50 L 134 58 L 130 52" fill="#FFFFF0" />
            <path d="M 125 52 L 126 59 L 123 53" fill="#FFFFF0" />
        </g>

        {/* Coleira infernal */}
        <ellipse cx="75" cy="55" rx="35" ry="8" fill="none" stroke="#8B0000" strokeWidth="3" />
        <circle cx="75" cy="60" r="4" fill="#FFD700" />

        {/* Correntes */}
        <g className="chains" stroke="#4A4A4A" strokeWidth="2" fill="none">
            <path d="M 45 55 Q 40 60 45 65 Q 50 60 45 55" />
            <path d="M 105 55 Q 110 60 105 65 Q 100 60 105 55" />
        </g>
    </svg>
);

// Componente para renderizar o sprite correto baseado no tipo
const BossSprite = ({ bossType, isAttacking, isDefeated }) => {
    const sprites = {
        megalodon: MegalodonSprite,
        sabertooth: SaberToothSprite,
        icedragon: IceDragonSprite,
        kraken: KrakenSprite,
        phoenix: DarkPhoenixSprite,
        cerberus: CerberusSprite
    };

    const SpriteComponent = sprites[bossType] || MegalodonSprite;
    return <SpriteComponent isAttacking={isAttacking} isDefeated={isDefeated} />;
};

// Boss data com BOSSES ÉPICOS DE JOGOS
const BOSSES = [
    {
        id: 1,
        name: 'O Procrastinador',
        spriteType: 'megalodon',
        maxHealth: 100,
        color: '#1E4258',
        glowColor: 'rgba(30, 66, 88, 0.6)',
        story: 'Ele usa distrações, desculpas e dopamina barata para te impedir de começar. A única forma de vencê-lo é com CONSTÂNCIA.',
        challenge: 'FASE 1 — O DESPERTAR: 30 dias de disciplina básica.',
        reward: { xp: 1000, badge: '🏅 Fundador do Despertar' },
        difficulty: 'INICIANTE',
        locked: false,
        price: 0,
        challengeDuration: 30,
        element: 'ÁGUA',
        attack: 'Onda de Preguiça',
        guide: {
            title: 'FASE 1 — O DESPERTAR (Versão Iniciante)',
            duration: '30 dias',
            objective: 'Criar disciplina básica, constância e identidade vencedora',
            bossName: 'O Procrastinador',
            bossDescription: '(Inimigos: distração, desculpas, dopamina barata)',
            importantNote: 'Você não precisa ser perfeito. Pode falhar alguns dias. O que importa é atingir o XP mínimo da fase.',
            winCondition: [
                'Completar os 30 dias',
                'Concluir 4 desafios obrigatórios',
                'Alcançar 70% do XP total da fase'
            ],
            mandatoryChallenges: [
                {
                    title: '1 — CORPO EM MOVIMENTO',
                    name: 'Corpo em Movimento',
                    icon: '🦾',
                    mission: 'Treinar mínimo 3x por semana (20+ min). Vale caminhada, corrida, academia, funcional ou treino em casa.',
                    proof: 'Foto pós-treino ou check-in simples no app.',
                    extra: '+XP se treinar 4x na semana ou chamar alguém.'
                },
                {
                    title: '2 — CORPO LIMPO',
                    name: 'Corpo Limpo',
                    icon: '🥗',
                    mission: 'Reduzir açúcar refinado e refrigerante. Se escorregar um dia, segue o jogo.',
                    proof: 'Foto de 1 refeição limpa por dia ou check-in.',
                    extra: '+XP se completar a semana sem recaídas.'
                },
                {
                    title: '3 — MENTE FORTE',
                    name: 'Mente Forte',
                    icon: '🧠',
                    mission: 'Ler 5 páginas por dia de livro de desenvolvimento ou disciplina.',
                    proof: 'Foto do livro + 1 insight curto.',
                    extra: '+XP se não pular nenhum dia.'
                },
                {
                    title: '4 — EVOLUÇÃO REAL',
                    name: 'Evolução Real',
                    icon: '⚙️',
                    mission: 'Estudar 20 minutos por dia algo que gere crescimento pessoal/profissional.',
                    proof: 'Print do estudo + o que aprendeu.',
                    extra: '+XP se aplicar algo na prática.'
                }
            ],
            optionalChallenges: [
                {
                    title: '📖 CONEXÃO',
                    name: 'Conexão',
                    icon: '✨',
                    mission: 'Escolha UM: Leitura espiritual, Oração/Meditação 10 min ou Encontro religioso.',
                    proof: 'Foto ou check-in.'
                },
                {
                    title: '📵 DOMÍNIO DIGITAL',
                    name: 'Domínio Digital',
                    icon: '📵',
                    mission: 'Reduzir redes sociais para até 2h por dia.',
                    proof: 'Print do tempo de uso.',
                    extra: '+XP se ficar abaixo de 1h ou substituir por estudo.'
                }
            ],
            rewards: [
                'Acesso à Fase 2',
                'Badge "Fundador do Despertar"',
                'Nome no Hall dos Vencedores',
                'Prioridade em desafios futuros',
                'Acesso a grupo fechado'
            ]
        }
    },
    {
        id: 2,
        name: 'Tigre Dentes de Sabre',
        spriteType: 'sabertooth',
        maxHealth: 200,
        color: '#C49432',
        glowColor: 'rgba(196, 148, 50, 0.6)',
        story: 'Sobrevivente da Era do Gelo, o Smilodon Fatalis retornou! Seus caninos de 28cm perfuram qualquer defesa. Ele é a GULA que te caça quando você baixa a guarda.',
        challenge: 'Siga sua dieta por 14 dias sem trapacear',
        reward: { xp: 1000, badge: '🐯 Domador Primitivo' },
        difficulty: 'MÉDIO',
        locked: true,
        price: 29.90,
        element: 'TERRA',
        attack: 'Salto Fatal'
    },
    {
        id: 3,
        name: 'Dragão de Gelo Ancestral',
        spriteType: 'icedragon',
        maxHealth: 350,
        color: '#0288D1',
        glowColor: 'rgba(2, 136, 209, 0.6)',
        story: 'Vindo das montanhas congeladas além do tempo, este dragão milenar congela almas com seu sopro. Ele é a INSEGURANÇA que paralisa seu progresso.',
        challenge: 'Perca 5kg mantendo massa muscular',
        reward: { xp: 2000, badge: '🐲 Senhor do Gelo' },
        difficulty: 'DIFÍCIL',
        locked: true,
        price: 49.90,
        element: 'GELO',
        attack: 'Sopro Glacial'
    },
    {
        id: 4,
        name: 'Cérbero Infernal',
        spriteType: 'cerberus',
        maxHealth: 500,
        color: '#FF4500',
        glowColor: 'rgba(255, 69, 0, 0.6)',
        story: 'O guardião dos portões do Inferno tem 3 cabeças, cada uma sussurrando: "Desista!", "Você não consegue!", "É impossível!". Derrotar o Cérbero é conquistar a IMORTALIDADE!',
        challenge: 'Complete 30 dias de transformação total',
        reward: { xp: 5000, badge: '👑 Conquistador do Inferno' },
        difficulty: 'ELITE',
        locked: true,
        price: 99.90,
        element: 'FOGO',
        attack: 'Tríplice Mordida Infernal'
    },
    {
        id: 5,
        name: 'Kraken das Sombras',
        spriteType: 'kraken',
        maxHealth: 300,
        color: '#6B3FA0',
        glowColor: 'rgba(107, 63, 160, 0.6)',
        story: 'Das profundezas onde a luz nunca alcança, o Kraken estende seus tentáculos. Cada um representa uma desculpa: "Estou cansado", "Hoje não dá", "Amanhã eu vou".',
        challenge: 'Acorde às 5h e treine por 21 dias',
        reward: { xp: 2500, badge: '🦑 Destruidor de Tentáculos' },
        difficulty: 'DIFÍCIL',
        locked: true,
        price: 59.90,
        element: 'TREVAS',
        attack: 'Abraço Abissal'
    },
    {
        id: 6,
        name: 'Fênix Sombria',
        spriteType: 'phoenix',
        maxHealth: 250,
        color: '#DC143C',
        glowColor: 'rgba(220, 20, 60, 0.6)',
        story: 'A Fênix Sombria renasce das cinzas da comparação. Ela te mostra o sucesso dos outros para queimar sua autoestima. Mas das suas próprias cinzas, você também pode renascer!',
        challenge: 'Melhore seus próprios records em todos exercícios',
        reward: { xp: 1500, badge: '🔥 Renascido das Chamas' },
        difficulty: 'MÉDIO',
        locked: true,
        price: 39.90,
        element: 'FOGO',
        attack: 'Chama da Inveja'
    }
];

// Função Helper para gerar o calendário
const generateCalendar = (days = 30) => Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    spiritual: false,
    corporal: false,
    mental: false,
    verified: false,
    locked: false // Desbloqueado para dar liberdade
}));

const DayEditModal = ({ isOpen, onClose, dayData, onToggle, dayIndex }) => {
    if (!isOpen || !dayData) return null;

    const isAllChecked = dayData.spiritual && dayData.corporal && dayData.mental;

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                onClick={e => e.stopPropagation()}
                style={{
                    width: '90%',
                    maxWidth: '320px',
                    padding: '24px',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>Dia {dayData.day}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {[
                        { key: 'corporal', label: 'Corpo (Desafios 1 e 2)', icon: '💪', desc: 'Movimento (3x/sem) + Dieta (Zero açúcar)' },
                        { key: 'mental', label: 'Mente (Desafios 3 e 4)', icon: '🧠', desc: 'Leitura (5 pág) + Estudo (20 min)' },
                        { key: 'spiritual', label: 'Extras (Desafios Opcionais)', icon: '✨', desc: 'Conexão + Domínio Digital' }
                    ].map(item => (
                        <div
                            key={item.key}
                            onClick={() => onToggle(dayIndex, item.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '12px',
                                background: dayData[item.key] ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${dayData[item.key] ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                border: `2px solid ${dayData[item.key] ? 'var(--primary)' : '#666'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: dayData[item.key] ? 'var(--primary)' : 'transparent'
                            }}>
                                {dayData[item.key] && <Check size={16} color="#000" strokeWidth={3} />}
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: dayData[item.key] ? '#fff' : '#aaa' }}>
                                    {item.icon} {item.label}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {isAllChecked && !dayData.verified && (
                    <div style={{
                        textAlign: 'center',
                        padding: '10px',
                        background: 'rgba(0,255,136,0.1)',
                        borderRadius: '8px',
                        color: 'var(--primary)',
                        fontSize: '13px',
                        fontWeight: '700',
                        marginBottom: '10px',
                        animation: 'pulse 2s infinite'
                    }}>
                        Todas as metas cumpridas! O dia será verificado.
                    </div>
                )}

                <button
                    className="btn-primary"
                    onClick={onClose}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};

const ChallengeGuideModal = ({ isOpen, onClose, guide }) => {
    if (!isOpen || !guide) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease',
            padding: '20px'
        }} onClick={onClose}>
            <div
                className="glass-panel"
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '32px',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 0 50px rgba(0, 255, 136, 0.15)',
                    position: 'relative'
                }}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        background: 'rgba(255, 51, 102, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: '20px',
                        color: 'var(--accent)',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginBottom: '16px'
                    }}>
                        <Flame size={14} /> FASE 1
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {guide.title}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{guide.duration} • {guide.objective}</p>
                </div>

                <div style={{ marginBottom: '32px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                        <Skull size={20} color="var(--accent)" /> Chefão: {guide.bossName}
                    </h3>
                    <p style={{ color: '#aaa', marginBottom: '16px', fontStyle: 'italic' }}>{guide.bossDescription}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>CÓDIGO DE VITÓRIA:</h4>
                        {guide.winCondition.map((cond, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ddd' }}>
                                <Check size={14} color="var(--primary)" /> {cond}
                            </div>
                        ))}
                    </div>
                </div>

                {guide.importantNote && (
                    <div style={{ marginBottom: '32px', padding: '16px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '12px', borderLeft: '4px solid #FFC107', display: 'flex', gap: '12px', alignItems: 'start' }}>
                        <div style={{ marginTop: '2px' }}>💡</div>
                        <p style={{ fontSize: '14px', color: '#FFCa28', lineHeight: '1.5' }}>{guide.importantNote}</p>
                    </div>
                )}

                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🎯 Desafios Obrigatórios
                    </h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {guide.mandatoryChallenges.map((challenge, i) => (
                            <div key={i} style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '24px' }}>{challenge.icon}</div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{challenge.title}</h4>
                                </div>
                                <div style={{ paddingLeft: '4px', borderLeft: '2px solid var(--primary)', marginLeft: '10px' }}>
                                    <div style={{ marginLeft: '16px' }}>
                                        <p style={{ fontSize: '14px', color: '#ddd', marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Missão:</strong> {challenge.mission}</p>
                                        <p style={{ fontSize: '14px', color: '#ddd', marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Prova:</strong> {challenge.proof}</p>
                                        {challenge.extra && <p style={{ fontSize: '13px', color: 'var(--primary)' }}>⚡ {challenge.extra}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {guide.optionalChallenges && (
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa' }}>
                            ✨ Opcionais (XP Extra)
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {guide.optionalChallenges.map((challenge, i) => (
                                <div key={i} style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{ fontSize: '24px' }}>{challenge.icon}</div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ddd' }}>{challenge.title}</h4>
                                    </div>
                                    <div style={{ paddingLeft: '4px', borderLeft: '2px solid #aaa', marginLeft: '10px' }}>
                                        <div style={{ marginLeft: '16px' }}>
                                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><strong style={{ color: '#ddd' }}>Missão:</strong> {challenge.mission}</p>
                                            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '8px' }}><strong style={{ color: '#ddd' }}>Prova:</strong> {challenge.proof}</p>
                                            {challenge.extra && <p style={{ fontSize: '13px', color: 'var(--primary)' }}>⚡ {challenge.extra}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255, 215, 0, 0.1) 100%)', borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFD700', marginBottom: '16px' }}>🏆 RECOMPENSA AO VENCER</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                        {guide.rewards.map((reward, i) => (
                            <span key={i} style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.4)', borderRadius: '20px', fontSize: '13px', border: '1px solid rgba(255, 215, 0, 0.3)', color: '#fff' }}>
                                {reward}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <button
                        className="btn-primary"
                        onClick={onClose}
                        style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                    >
                        Entendi, Aceito o Desafio!
                    </button>
                </div>
            </div>
        </div>
    );
};

const Challenges = () => {
    const { user, setUser } = useGame();

    // Estados do fluxo
    const [gamePhase, setGamePhase] = useState('start'); // 'start', 'form', 'battle'
    const [userProfile, setUserProfile] = useState({
        objective: '',
        weight: '',
        height: '',
        targetWeight: '',
        sex: '',
        age: '',
        experience: ''
    });
    const [activeBosses, setActiveBosses] = useState(BOSSES);
    const [currentBoss, setCurrentBoss] = useState(null);
    const [attackAnimation, setAttackAnimation] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [defeatedBoss, setDefeatedBoss] = useState(null);

    // Novos estados para efeitos visuais épicos
    const [damageNumbers, setDamageNumbers] = useState([]);
    const [comboCount, setComboCount] = useState(0);
    const [lastAttackTime, setLastAttackTime] = useState(0);
    const [screenShake, setScreenShake] = useState(false);
    const [attackingBossId, setAttackingBossId] = useState(null);

    // Estado para o calendar modal
    const [openDayModal, setOpenDayModal] = useState({ bossId: null, dayIndex: null });

    // Estado para o modal de guia/detalhes
    const [guideModalOpen, setGuideModalOpen] = useState(false);
    const [activeGuide, setActiveGuide] = useState(null);

    // Carregar progresso do localStorage e Inicializar Calendários
    useEffect(() => {
        const savedPhase = localStorage.getItem('challengeGamePhase');
        const savedProfile = localStorage.getItem('challengeUserProfile');
        const savedBosses = localStorage.getItem('challengeBosses');
        const savedCombo = localStorage.getItem('challengeCombo');

        if (savedPhase) setGamePhase(savedPhase);
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));

        if (savedBosses) {
            let parsedBosses = JSON.parse(savedBosses);
            // Migração: Adicionar calendário se não existir
            parsedBosses = parsedBosses.map(b => {
                const targetDuration = b.challengeDuration || 30; // Default agora é 30
                let currentCalendar = b.calendar || [];

                if (currentCalendar.length !== targetDuration) {
                    // Regenerar calendar mantendo 30 dias se o tamanho mudou
                    currentCalendar = generateCalendar(targetDuration);
                }

                return {
                    ...b,
                    calendar: currentCalendar
                };
            });
            setActiveBosses(parsedBosses);
        } else {
            // Inicializar com estrutura de calendário
            setActiveBosses(BOSSES.map(b => ({
                ...b,
                calendar: generateCalendar(b.challengeDuration || 30)
            })));
        }

        if (savedCombo) setComboCount(parseInt(savedCombo));
    }, []);

    // Salvar progresso
    useEffect(() => {
        localStorage.setItem('challengeGamePhase', gamePhase);
        localStorage.setItem('challengeUserProfile', JSON.stringify(userProfile));
        localStorage.setItem('challengeBosses', JSON.stringify(activeBosses));
        localStorage.setItem('challengeCombo', comboCount.toString());
    }, [gamePhase, userProfile, activeBosses, comboCount]);

    // Resetar combo após 5 segundos de inatividade
    useEffect(() => {
        if (comboCount > 0) {
            const timer = setTimeout(() => {
                setComboCount(0);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastAttackTime, comboCount]);

    // Limpar números de dano após animação
    useEffect(() => {
        if (damageNumbers.length > 0) {
            const timer = setTimeout(() => {
                setDamageNumbers([]);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [damageNumbers]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setGamePhase('battle');
    };

    // Função para gerar posição aleatória para números de dano
    const getRandomOffset = () => ({
        x: Math.floor(Math.random() * 60) - 30,
        y: Math.floor(Math.random() * 30) - 15
    });

    const handleDayToggle = (bossId, dayIndex, type) => {
        setActiveBosses(prev => prev.map(boss => {
            if (boss.id === bossId) {
                const newCalendar = [...boss.calendar];
                const day = { ...newCalendar[dayIndex] };

                // Toggle o tipo (spiritual, corporal, mental)
                day[type] = !day[type];

                // Verifica se todos estão marcados
                const allChecked = day.spiritual && day.corporal && day.mental;
                const wasVerified = day.verified;
                day.verified = allChecked;

                newCalendar[dayIndex] = day;

                // Se acabou de completar o dia (verified true e antes não era), causar dano ao boss
                if (day.verified && !wasVerified) {
                    // Dano baseado na duração do desafio (padrão 21 dias se não especificado)
                    const duration = boss.challengeDuration || 21;
                    // Dano exato para derrotar o boss no final do desafio
                    const damagePerDay = Math.ceil(boss.maxHealth / duration);

                    const newHealth = Math.max(0, (boss.currentHealth ?? boss.maxHealth) - damagePerDay);

                    // Side effect para animação (timeout para sair do render loop)
                    setTimeout(() => {
                        // Gatilho visual apenas
                        setAttackingBossId(bossId);
                        setAttackAnimation(true);
                        const offset = getRandomOffset();
                        setDamageNumbers(prevDmg => [...prevDmg, {
                            id: Date.now(),
                            value: damagePerDay,
                            isCritical: true, // Dia completo é sempre crítico!
                            offsetX: offset.x,
                            offsetY: offset.y
                        }]);
                        setTimeout(() => setAttackAnimation(false), 500);
                    }, 100);

                    // Verificar morte
                    if (newHealth === 0 && (boss.currentHealth ?? boss.maxHealth) > 0) {
                        setTimeout(() => {
                            setDefeatedBoss(boss);
                            setShowVictory(true);
                            setUser(prev => ({
                                ...prev,
                                xp: prev.xp + boss.reward.xp,
                                level: Math.floor((prev.xp + boss.reward.xp) / 1000) + 1,
                                badges: [...prev.badges, {
                                    id: Date.now(),
                                    name: boss.reward.badge,
                                    icon: boss.reward.badge.split(' ')[0],
                                    description: `Derrotou ${boss.name}`
                                }]
                            }));
                        }, 800);
                    }

                    return { ...boss, calendar: newCalendar, currentHealth: newHealth, defeated: newHealth === 0 };
                }

                return { ...boss, calendar: newCalendar };
            }
            return boss;
        }));
    };

    const handleProgressUpdate = (bossId, baseDamage) => {
        const now = Date.now();

        // Calcular combo multiplier
        const timeSinceLastAttack = now - lastAttackTime;
        let newCombo = comboCount;

        if (timeSinceLastAttack < 3000) {
            newCombo = Math.min(comboCount + 1, 10);
        } else {
            newCombo = 1;
        }

        // Calcular dano com bônus de combo
        const comboMultiplier = 1 + (newCombo - 1) * 0.1;
        const damage = Math.floor(baseDamage * comboMultiplier);
        const isCritical = Math.random() < 0.15; // 15% chance de crítico
        const finalDamage = isCritical ? damage * 2 : damage;

        setComboCount(newCombo);
        setLastAttackTime(now);
        setAttackAnimation(true);
        setAttackingBossId(bossId);
        setScreenShake(true);

        // Adicionar número de dano flutuante
        const offset = getRandomOffset();
        setDamageNumbers([{
            id: now,
            value: finalDamage,
            isCritical,
            offsetX: offset.x,
            offsetY: offset.y
        }]);

        setTimeout(() => {
            setAttackAnimation(false);
            setAttackingBossId(null);
        }, 500);

        setTimeout(() => setScreenShake(false), 600);

        setActiveBosses(prev => prev.map(boss => {
            if (boss.id === bossId) {
                const newHealth = Math.max(0, (boss.currentHealth || boss.maxHealth) - finalDamage);
                if (newHealth === 0 && (boss.currentHealth || boss.maxHealth) > 0) {
                    // Boss derrotado!
                    setTimeout(() => {
                        setDefeatedBoss(boss);
                        setShowVictory(true);
                        setComboCount(0);

                        // Atualizar usuário com recompensas + bônus de combo
                        const bonusXP = Math.floor(boss.reward.xp * (1 + newCombo * 0.05));
                        setUser(prev => ({
                            ...prev,
                            xp: prev.xp + bonusXP,
                            level: Math.floor((prev.xp + bonusXP) / 1000) + 1,
                            badges: [...prev.badges, {
                                id: Date.now(),
                                name: boss.reward.badge,
                                icon: boss.reward.badge.split(' ')[0],
                                description: `Derrotou ${boss.name}`
                            }]
                        }));
                    }, 600);
                }
                return { ...boss, currentHealth: newHealth, defeated: newHealth === 0 };
            }
            return boss;
        }));
    };

    const unlockBoss = (bossId) => {
        setActiveBosses(prev => prev.map(boss =>
            boss.id === bossId ? { ...boss, locked: false } : boss
        ));
    };

    // ========== TELA INICIAL ==========
    if (gamePhase === 'start') {
        return (
            <div className="page-enter" style={{
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                textAlign: 'center'
            }}>
                {/* Background effects */}
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 30%, rgba(123, 47, 255, 0.3), transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo/Icon */}
                    <div style={{
                        width: '180px',
                        height: '180px',
                        margin: '0 auto 40px',
                        background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.3), rgba(123, 47, 255, 0.3))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '80px',
                        animation: 'float 3s ease-in-out infinite',
                        border: '3px solid rgba(255, 51, 102, 0.5)',
                        boxShadow: '0 0 60px rgba(255, 51, 102, 0.4)'
                    }}>
                        ⚔️
                    </div>

                    <h1 style={{
                        fontSize: '52px',
                        fontWeight: '900',
                        marginBottom: '16px',
                        textShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
                    }}>
                        Arena dos <span className="text-gradient">Desafios</span>
                    </h1>

                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '18px',
                        maxWidth: '500px',
                        margin: '0 auto 16px',
                        lineHeight: '1.6'
                    }}>
                        Enfrente poderosos inimigos que representam seus obstáculos.
                        Cada vitória te tornará mais forte!
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '32px',
                        justifyContent: 'center',
                        marginBottom: '48px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🗡️</div>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Derrote Bosses</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🏆</div>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ganhe Medalhas</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '4px' }}>⚡</div>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Suba de Nível</span>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => setGamePhase('form')}
                        style={{
                            padding: '20px 60px',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '0 auto',
                            animation: 'glow-pulse 2s ease-in-out infinite'
                        }}
                    >
                        <Play size={24} />
                        COMEÇAR DESAFIO
                    </button>
                </div>
            </div>
        );
    }

    // ========== FORMULÁRIO ==========
    if (gamePhase === 'form') {
        return (
            <div className="page-enter" style={{ paddingBottom: '100px', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto 24px',
                        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(123, 47, 255, 0.2))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px'
                    }}>
                        🎯
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '12px' }}>
                        Monte seu <span className="text-gradient">Perfil de Guerreiro</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Precisamos conhecer você para criar desafios personalizados
                    </p>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
                        {/* Objetivo */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                🎯 Qual seu objetivo principal?
                            </label>
                            <select
                                value={userProfile.objective}
                                onChange={(e) => setUserProfile({ ...userProfile, objective: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '15px',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="lose">Perder peso</option>
                                <option value="gain">Ganhar massa muscular</option>
                                <option value="maintain">Manter e definir</option>
                                <option value="health">Melhorar saúde geral</option>
                                <option value="performance">Aumentar performance</option>
                            </select>
                        </div>

                        {/* Peso e Altura */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                    ⚖️ Peso atual (kg)
                                </label>
                                <input
                                    type="number"
                                    value={userProfile.weight}
                                    onChange={(e) => setUserProfile({ ...userProfile, weight: e.target.value })}
                                    required
                                    placeholder="Ex: 75"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                    📏 Altura (cm)
                                </label>
                                <input
                                    type="number"
                                    value={userProfile.height}
                                    onChange={(e) => setUserProfile({ ...userProfile, height: e.target.value })}
                                    required
                                    placeholder="Ex: 175"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Peso Meta */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                🏆 Peso meta (kg)
                            </label>
                            <input
                                type="number"
                                value={userProfile.targetWeight}
                                onChange={(e) => setUserProfile({ ...userProfile, targetWeight: e.target.value })}
                                required
                                placeholder="Ex: 70"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '15px'
                                }}
                            />
                        </div>

                        {/* Sexo e Idade */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                    👤 Sexo
                                </label>
                                <select
                                    value={userProfile.sex}
                                    onChange={(e) => setUserProfile({ ...userProfile, sex: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                    🎂 Idade
                                </label>
                                <input
                                    type="number"
                                    value={userProfile.age}
                                    onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
                                    required
                                    placeholder="Ex: 28"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Experiência */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', fontSize: '14px' }}>
                                💪 Nível de experiência com treinos
                            </label>
                            <select
                                value={userProfile.experience}
                                onChange={(e) => setUserProfile({ ...userProfile, experience: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '15px',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="beginner">Iniciante (0-6 meses)</option>
                                <option value="intermediate">Intermediário (6 meses - 2 anos)</option>
                                <option value="advanced">Avançado (2+ anos)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '18px',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}
                    >
                        <Sword size={20} />
                        ENTRAR NA ARENA
                        <ChevronRight size={20} />
                    </button>
                </form>
            </div>
        );
    }

    // ========== BATALHA / CARDS DE BOSS ==========
    return (
        <div className={`page-enter ${screenShake ? 'screen-shake' : ''}`} style={{ paddingBottom: '100px' }}>

            {/* Combo Counter Display */}
            {comboCount > 1 && (
                <div className="combo-display" style={{
                    position: 'fixed',
                    top: '150px',
                    right: '30px',
                    textAlign: 'right',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    animation: 'slide-up 0.3s ease-out'
                }}>
                    <div style={{
                        fontSize: comboCount > 5 ? '72px' : '56px',
                        fontWeight: '900',
                        background: comboCount > 7 ? 'linear-gradient(135deg, #FF0000, #FFD700)' :
                            comboCount > 4 ? 'linear-gradient(135deg, #FF4500, #FFD700)' :
                                'linear-gradient(135deg, #FFD700, #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: `drop-shadow(0 0 ${comboCount * 3}px rgba(255, 215, 0, 0.5))`,
                        animation: 'combo-bounce 0.3s ease-out'
                    }}>
                        {comboCount}x
                    </div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#FFD700',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                    }}>
                        {comboCount > 7 ? '🔥 ULTRA COMBO!' :
                            comboCount > 4 ? '⚡ SUPER COMBO!' :
                                'COMBO'}
                    </div>
                </div>
            )}

            {/* Victory Modal */}
            {showVictory && defeatedBoss && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'slide-up 0.5s ease'
                }}>
                    <div className="glass-panel" style={{
                        padding: '48px',
                        textAlign: 'center',
                        maxWidth: '500px',
                        position: 'relative',
                        overflow: 'visible'
                    }}>
                        {/* Confetti effect */}
                        <div style={{
                            position: 'absolute',
                            top: '-100px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '120px',
                            animation: 'float 2s ease-in-out infinite'
                        }}>🏆</div>

                        <h2 style={{
                            fontSize: '42px',
                            fontWeight: '900',
                            marginTop: '60px',
                            marginBottom: '16px',
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            VITÓRIA!
                        </h2>

                        <p style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                            Você derrotou
                        </p>
                        <p style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>
                            {defeatedBoss.emoji} {defeatedBoss.name}
                        </p>

                        <div style={{
                            display: 'flex',
                            gap: '24px',
                            justifyContent: 'center',
                            marginBottom: '32px'
                        }}>
                            <div className="glass-panel" style={{ padding: '20px 32px' }}>
                                <Zap size={28} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                <p style={{ fontSize: '24px', fontWeight: '800' }}>+{defeatedBoss.reward.xp}</p>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>XP</span>
                            </div>
                            <div className="glass-panel" style={{ padding: '20px 32px' }}>
                                <Trophy size={28} color="#FFD700" style={{ marginBottom: '8px' }} />
                                <p style={{ fontSize: '18px', fontWeight: '800' }}>{defeatedBoss.reward.badge.split(' ')[0]}</p>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Medalha</span>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={() => {
                                setShowVictory(false);
                                setDefeatedBoss(null);
                            }}
                            style={{ padding: '16px 48px', fontSize: '16px' }}
                        >
                            CONTINUAR JORNADA
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px' }}>
                            Arena dos <span className="text-gradient">Bosses</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                            Derrote cada boss para provar sua força e evoluir!
                        </p>
                    </div>
                    <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span className="level-badge">LVL {user.level}</span>
                        </div>
                        <div style={{ width: '1px', height: '32px', background: 'var(--border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>XP</p>
                            <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>{user.xp}</p>
                        </div>
                        <div style={{ width: '1px', height: '32px', background: 'var(--border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>MEDALHAS</p>
                            <p style={{ fontSize: '18px', fontWeight: '800' }}>{user.badges.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Boss Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '28px' }}>
                {activeBosses.map((boss, index) => {
                    const currentHealth = boss.currentHealth ?? boss.maxHealth;
                    const healthPercent = (currentHealth / boss.maxHealth) * 100;
                    const isDefeated = boss.defeated || currentHealth === 0;

                    return (
                        <div
                            key={boss.id}
                            className="glass-panel"
                            style={{
                                padding: '0',
                                opacity: boss.locked ? 0.85 : 1,
                                position: 'relative',
                                overflow: 'hidden',
                                animationDelay: `${index * 0.1}s`,
                                border: isDefeated ? '2px solid rgba(0, 255, 136, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)'
                            }}
                        >
                            {/* Boss Header with gradient */}
                            <div style={{
                                padding: '28px',
                                background: boss.locked
                                    ? 'linear-gradient(135deg, rgba(50,50,50,0.8), rgba(30,30,30,0.8))'
                                    : `linear-gradient(135deg, ${boss.color}44, ${boss.color}11)`,
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                position: 'relative'
                            }}>
                                {/* Difficulty Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    padding: '6px 14px',
                                    borderRadius: '100px',
                                    background: boss.difficulty === 'ELITE'
                                        ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                        : boss.difficulty === 'DIFÍCIL'
                                            ? 'rgba(255, 51, 102, 0.2)'
                                            : boss.difficulty === 'MÉDIO'
                                                ? 'rgba(255, 193, 7, 0.2)'
                                                : 'rgba(0, 255, 136, 0.2)',
                                    color: boss.difficulty === 'ELITE' ? '#000' : '#fff',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    letterSpacing: '1px'
                                }}>
                                    {boss.difficulty}
                                </div>

                                {/* Boss Sprite Container */}
                                <div style={{
                                    width: '180px',
                                    height: '140px',
                                    margin: '0 auto 20px',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {/* Background glow effect */}
                                    {!boss.locked && !isDefeated && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: '10px',
                                            background: `radial-gradient(circle, ${boss.glowColor || boss.color + '66'}, transparent 70%)`,
                                            borderRadius: '50%',
                                            animation: 'glow-pulse 3s ease-in-out infinite',
                                            filter: 'blur(15px)'
                                        }}></div>
                                    )}

                                    {/* Locked overlay */}
                                    {boss.locked ? (
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            background: 'rgba(50,50,50,0.5)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '50px',
                                            border: '3px dashed rgba(255,255,255,0.2)'
                                        }}>
                                            🔒
                                        </div>
                                    ) : isDefeated ? (
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            background: 'rgba(0,255,136,0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '60px',
                                            border: '3px solid rgba(0,255,136,0.3)'
                                        }}>
                                            💀
                                        </div>
                                    ) : (
                                        <div className={`boss-sprite-container ${boss.spriteType}`} style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            <BossSprite
                                                bossType={boss.spriteType}
                                                isAttacking={attackAnimation && attackingBossId === boss.id}
                                                isDefeated={false}
                                            />

                                            {/* Damage Numbers */}
                                            {attackingBossId === boss.id && damageNumbers.map(dmg => (
                                                <div
                                                    key={dmg.id}
                                                    className={`damage-number ${dmg.isCritical ? 'critical' : ''}`}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: `translate(calc(-50% + ${dmg.offsetX}px), calc(-50% + ${dmg.offsetY}px))`,
                                                        fontSize: dmg.isCritical ? '38px' : '28px',
                                                        fontWeight: '900',
                                                        color: dmg.isCritical ? '#FFD700' : '#FF3366',
                                                        textShadow: dmg.isCritical
                                                            ? '0 0 15px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 215, 0, 0.7), 3px 3px 0 #000'
                                                            : '0 0 10px rgba(255, 51, 102, 0.8), 0 0 20px rgba(255, 51, 102, 0.5), 2px 2px 0 #000',
                                                        animation: 'damage-number-pop 1s ease-out forwards',
                                                        pointerEvents: 'none',
                                                        zIndex: 100,
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {dmg.isCritical && '💥 '}-{dmg.value}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Elemental ring effect */}
                                    {!boss.locked && !isDefeated && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: '0',
                                            border: `2px solid ${boss.color}`,
                                            borderRadius: '50%',
                                            opacity: 0.3,
                                            animation: 'spin 12s linear infinite'
                                        }}></div>
                                    )}
                                </div>

                                {/* Element Badge */}
                                {!boss.locked && boss.element && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        left: '20px',
                                        padding: '4px 10px',
                                        borderRadius: '100px',
                                        background: `${boss.color}33`,
                                        border: `1px solid ${boss.color}66`,
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        color: boss.color,
                                        letterSpacing: '1px'
                                    }}>
                                        ⚡ {boss.element}
                                    </div>
                                )}

                                {/* Boss Name */}
                                <h3 style={{
                                    fontSize: '26px',
                                    fontWeight: '900',
                                    textAlign: 'center',
                                    color: boss.locked ? '#666' : isDefeated ? 'var(--primary)' : '#fff',
                                    textDecoration: isDefeated ? 'line-through' : 'none'
                                }}>
                                    {boss.name}
                                </h3>

                                {/* Defeated Badge */}
                                {isDefeated && (
                                    <div style={{
                                        textAlign: 'center',
                                        marginTop: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        color: 'var(--primary)'
                                    }}>
                                        <Crown size={20} />
                                        <span style={{ fontWeight: '700' }}>DERROTADO!</span>
                                    </div>
                                )}
                            </div>

                            {/* Boss Content */}
                            <div style={{ padding: '24px' }}>
                                {/* Story */}
                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '12px',
                                    marginBottom: '20px',
                                    borderLeft: `3px solid ${boss.locked ? '#444' : boss.color}`
                                }}>
                                    <p style={{
                                        fontSize: '14px',
                                        color: boss.locked ? '#666' : 'var(--text-muted)',
                                        lineHeight: '1.7',
                                        fontStyle: 'italic'
                                    }}>
                                        {boss.locked
                                            ? '🔒 Desbloqueie para descobrir a história deste boss...'
                                            : `"${boss.story}"`
                                        }
                                    </p>
                                </div>

                                {/* Challenge */}
                                {!boss.locked && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <Target size={16} color="var(--primary)" />
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                                                MISSÃO
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '15px', fontWeight: '600' }}>
                                            {boss.challenge}
                                        </p>

                                        {boss.guide && (
                                            <button
                                                onClick={() => {
                                                    setActiveGuide(boss.guide);
                                                    setGuideModalOpen(true);
                                                }}
                                                style={{
                                                    marginTop: '12px',
                                                    width: '100%',
                                                    padding: '10px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                📜 Ver Detalhes da Missão
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Health Bar (for unlocked bosses) */}
                                {!boss.locked && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Heart size={16} color={isDefeated ? 'var(--primary)' : healthPercent < 25 ? '#FF0000' : '#FF3366'} />
                                                <span style={{
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    color: healthPercent < 25 && !isDefeated ? '#FF0000' : 'inherit',
                                                    animation: healthPercent < 25 && !isDefeated ? 'health-critical 0.5s ease-in-out infinite' : 'none'
                                                }}>
                                                    {isDefeated ? 'DERROTADO' : healthPercent < 25 ? '⚠️ VIDA CRÍTICA!' : 'VIDA DO BOSS'}
                                                </span>
                                            </div>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: '800',
                                                color: isDefeated ? 'var(--primary)' : healthPercent < 25 ? '#FF0000' : '#FF3366'
                                            }}>
                                                {currentHealth}/{boss.maxHealth}
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '16px',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '100px',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <div
                                                className={healthPercent < 25 && !isDefeated ? 'health-bar-fill critical' : ''}
                                                style={{
                                                    height: '100%',
                                                    width: `${healthPercent}%`,
                                                    background: isDefeated
                                                        ? 'linear-gradient(90deg, var(--primary), #00FFFF)'
                                                        : healthPercent < 25
                                                            ? 'linear-gradient(90deg, #FF0000, #FF4500)'
                                                            : `linear-gradient(90deg, #FF3366, ${boss.color})`,
                                                    borderRadius: '100px',
                                                    transition: 'width 0.5s ease',
                                                    boxShadow: isDefeated
                                                        ? '0 0 15px var(--primary-glow)'
                                                        : healthPercent < 25
                                                            ? '0 0 20px rgba(255, 0, 0, 0.6)'
                                                            : `0 0 15px ${boss.color}66`
                                                }}></div>
                                        </div>

                                        {/* Attack indicator */}
                                        {boss.attack && !isDefeated && (
                                            <div style={{
                                                marginTop: '12px',
                                                padding: '8px 12px',
                                                background: `${boss.color}15`,
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '12px'
                                            }}>
                                                <Flame size={14} color={boss.color} />
                                                <span style={{ color: 'var(--text-muted)' }}>Ataque Especial:</span>
                                                <span style={{ fontWeight: '700', color: boss.color }}>{boss.attack}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Rewards */}
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'rgba(0, 255, 136, 0.1)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <Zap size={20} color="var(--primary)" />
                                        <div>
                                            <p style={{ fontSize: '16px', fontWeight: '800' }}>+{boss.reward.xp}</p>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>XP</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'rgba(255, 215, 0, 0.1)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <Trophy size={20} color="#FFD700" />
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: '700' }}>{boss.reward.badge.split(' ')[0]}</p>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Medalha</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                {boss.locked ? (
                                    <button
                                        onClick={() => unlockBoss(boss.id)}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.3), rgba(255, 51, 102, 0.3))',
                                            border: '1px solid rgba(123, 47, 255, 0.5)',
                                            borderRadius: '14px',
                                            color: '#fff',
                                            fontWeight: '700',
                                            fontSize: '15px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <ShoppingCart size={18} />
                                        DESBLOQUEAR POR R$ {boss.price.toFixed(2)}
                                    </button>
                                ) : isDefeated ? (
                                    <div style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: 'rgba(0, 255, 136, 0.1)',
                                        border: '1px solid rgba(0, 255, 136, 0.3)',
                                        borderRadius: '14px',
                                        textAlign: 'center',
                                        color: 'var(--primary)',
                                        fontWeight: '700',
                                        fontSize: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}>
                                        <Crown size={18} />
                                        CONQUISTA COMPLETA!
                                    </div>
                                ) : (
                                    <>
                                        {/* Calendar Grid */}
                                        <div style={{ marginTop: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                                                    📅 CALENDÁRIO DE {boss.challengeDuration || 21} DIAS
                                                </span>
                                                <span style={{ fontSize: '11px', color: boss.color }}>
                                                    {boss.calendar ? boss.calendar.filter(d => d.verified).length : 0}/{boss.challengeDuration || 21} Dias
                                                </span>
                                            </div>

                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(7, 1fr)',
                                                gap: '6px'
                                            }}>
                                                {boss.calendar && boss.calendar.map((day, dIndex) => (
                                                    <div
                                                        key={dIndex}
                                                        onClick={() => setOpenDayModal({ bossId: boss.id, dayIndex: dIndex })}
                                                        style={{
                                                            aspectRatio: '1',
                                                            borderRadius: '6px',
                                                            background: day.verified
                                                                ? 'var(--primary)'
                                                                : (day.spiritual || day.corporal || day.mental)
                                                                    ? `${boss.color}44`
                                                                    : 'rgba(255,255,255,0.05)',
                                                            border: day.verified
                                                                ? 'none'
                                                                : `1px solid ${day.day === (boss.calendar.filter(d => d.verified).length + 1) ? boss.color : 'rgba(255,255,255,0.1)'}`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            position: 'relative',
                                                            color: day.verified ? '#000' : '#fff',
                                                            fontWeight: '700',
                                                            fontSize: '11px',
                                                            transition: 'transform 0.2s',
                                                            boxShadow: day.verified ? `0 0 10px ${boss.color}66` : 'none'
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        {day.verified ? <Check size={14} strokeWidth={3} /> : day.day}

                                                        {/* Pontinhos indicadores de progresso parcial */}
                                                        {!day.verified && (day.spiritual || day.corporal || day.mental) && (
                                                            <div style={{ position: 'absolute', bottom: '2px', display: 'flex', gap: '1px' }}>
                                                                {day.spiritual && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: boss.color }}></div>}
                                                                {day.corporal && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: boss.color }}></div>}
                                                                {day.mental && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: boss.color }}></div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Day Edit Modal Inline */}
                                        <DayEditModal
                                            isOpen={openDayModal.bossId === boss.id}
                                            onClose={() => setOpenDayModal({ bossId: null, dayIndex: null })}
                                            dayIndex={openDayModal.dayIndex}
                                            dayData={boss.calendar && openDayModal.dayIndex !== null ? boss.calendar[openDayModal.dayIndex] : null}
                                            onToggle={(idx, type) => handleDayToggle(boss.id, idx, type)}
                                        />

                                        {/* Botão de Ataque Manual (Opcional - vamos manter ma menor para dar foco ao calendario) */}
                                        <div style={{ marginTop: '20px', opacity: 0.6 }}>
                                            <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                Complete os dias para causar dano ao boss!
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChallengeGuideModal
                isOpen={guideModalOpen}
                onClose={() => setGuideModalOpen(false)}
                guide={activeGuide}
            />
        </div>
    );
};

export default Challenges;
