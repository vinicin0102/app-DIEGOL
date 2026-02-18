import React from 'react';

// SVG definitions for bosses
// No external imports needed for SVGs

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
    const SpriteComponent = {
        megalodon: MegalodonSprite,
        sabertooth: SaberToothSprite,
        icedragon: IceDragonSprite,
        kraken: KrakenSprite,
        phoenix: DarkPhoenixSprite,
        cerberus: CerberusSprite
    }[bossType] || MegalodonSprite;

    return (
        <div
            className={`boss-sprite-container ${bossType}`}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                filter: isDefeated ? 'grayscale(100%)' : 'none',
                opacity: isDefeated ? 0.7 : 1,
                transition: 'all 0.5s ease'
            }}
        >
            <SpriteComponent
                isAttacking={isAttacking}
                isDefeated={isDefeated}
            />
        </div>
    );
};

export default BossSprite;
