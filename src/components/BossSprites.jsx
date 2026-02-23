import React from 'react';

// Import boss images
import megalodonImg from '../assets/bosses/megalodon.png';
import sabertoothImg from '../assets/bosses/sabertooth.png';
import icedragonImg from '../assets/bosses/icedragon.png';
import krakenImg from '../assets/bosses/kraken.png';
import phoenixImg from '../assets/bosses/phoenix.png';
import cerberusImg from '../assets/bosses/cerberus.png';

// Componente para renderizar o sprite correto baseado no tipo
const BossSprite = ({ bossType, isAttacking, isDefeated }) => {
    const bossImages = {
        megalodon: megalodonImg,
        sabertooth: sabertoothImg,
        icedragon: icedragonImg,
        kraken: krakenImg,
        phoenix: phoenixImg,
        cerberus: cerberusImg
    };

    const imageSrc = bossImages[bossType] || megalodonImg;

    return (
        <div
            className={`boss-sprite-container ${isAttacking ? 'attacking' : ''} ${isDefeated ? 'defeated' : ''}`}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}
        >
            <img
                src={imageSrc}
                alt={bossType}
                style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '180px',
                    objectFit: 'contain',
                    filter: isDefeated ? 'grayscale(100%) brightness(0.5)' : 'none',
                    transform: isAttacking ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    animation: isAttacking
                        ? 'boss-attack-shake 0.5s ease-in-out'
                        : isDefeated ? 'none' : 'boss-idle-animation 3s ease-in-out infinite'
                }}
            />
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes boss-idle-animation {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-8px) scale(1.03); }
                }
                @keyframes boss-attack-shake {
                    0% { transform: scale(1) translateX(0); }
                    25% { transform: scale(1.1) translateX(15px); }
                    50% { transform: scale(1.2) translateX(-10px); }
                    75% { transform: scale(1.1) translateX(10px); }
                    100% { transform: scale(1) translateX(0); }
                }
            `}} />
        </div>
    );
};

export default BossSprite;
