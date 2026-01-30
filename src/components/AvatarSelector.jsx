import React, { useState, useEffect } from 'react';
import { X, Check, User, Sparkles } from 'lucide-react';

// Import avatar images - Males
import warriorMale1 from '../assets/avatars/warrior_male_1.png';
import warriorMale2 from '../assets/avatars/warrior_male_2.png';
import warriorMale3 from '../assets/avatars/warrior_male_3.png';
import warriorMale4 from '../assets/avatars/warrior_male_4.png';
import warriorMale5 from '../assets/avatars/warrior_male_5.png';

// Import avatar images - Females
import warriorFemale1 from '../assets/avatars/warrior_female_1.png';
import warriorFemale2 from '../assets/avatars/warrior_female_2.png';
import warriorFemale3 from '../assets/avatars/warrior_female_3.png';
import warriorFemale4 from '../assets/avatars/warrior_female_4.png';
import warriorFemale5 from '../assets/avatars/warrior_female_5.png';

// Avatar options
const AVATARS = [
    // === MALE WARRIORS ===
    {
        id: 'warrior_male_1',
        name: 'Guerreiro das Sombras',
        description: 'Armadura azul rúnica',
        image: warriorMale1,
        gender: 'male',
        skinTone: 'light',
        hairColor: 'dark'
    },
    {
        id: 'warrior_male_2',
        name: 'Paladino Dourado',
        description: 'Armadura com runas douradas',
        image: warriorMale2,
        gender: 'male',
        skinTone: 'dark',
        hairColor: 'dark'
    },
    {
        id: 'warrior_male_3',
        name: 'Cavaleiro Esmeralda',
        description: 'Armadura com brilho verde',
        image: warriorMale3,
        gender: 'male',
        skinTone: 'medium',
        hairColor: 'blonde'
    },
    {
        id: 'warrior_male_4',
        name: 'Samurai Carmesim',
        description: 'Armadura oriental vermelha',
        image: warriorMale4,
        gender: 'male',
        skinTone: 'light',
        hairColor: 'black'
    },
    {
        id: 'warrior_male_5',
        name: 'Cavaleiro das Ruínas',
        description: 'Armadura prateada e roxa',
        image: warriorMale5,
        gender: 'male',
        skinTone: 'medium',
        hairColor: 'dark'
    },
    // === FEMALE WARRIORS ===
    {
        id: 'warrior_female_1',
        name: 'Guerreira Arcana',
        description: 'Armadura roxa mística',
        image: warriorFemale1,
        gender: 'female',
        skinTone: 'light',
        hairColor: 'red'
    },
    {
        id: 'warrior_female_2',
        name: 'Rainha do Fogo',
        description: 'Armadura dourada flamejante',
        image: warriorFemale2,
        gender: 'female',
        skinTone: 'dark',
        hairColor: 'braids'
    },
    {
        id: 'warrior_female_3',
        name: 'Caçadora de Dragões',
        description: 'Armadura negra e carmesim',
        image: warriorFemale3,
        gender: 'female',
        skinTone: 'medium',
        hairColor: 'brown'
    },
    {
        id: 'warrior_female_4',
        name: 'Samurai de Gelo',
        description: 'Armadura cristalina azul',
        image: warriorFemale4,
        gender: 'female',
        skinTone: 'light',
        hairColor: 'black'
    },
    {
        id: 'warrior_female_5',
        name: 'Guardiã da Floresta',
        description: 'Armadura esmeralda natural',
        image: warriorFemale5,
        gender: 'female',
        skinTone: 'medium',
        hairColor: 'curly'
    }
];

const AvatarSelector = ({ isOpen, onClose, onSelect, currentAvatarId }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarId || null);
    const [filter, setFilter] = useState('all'); // 'all', 'male', 'female'

    useEffect(() => {
        if (currentAvatarId) {
            setSelectedAvatar(currentAvatarId);
        }
    }, [currentAvatarId]);

    // Ocultar navbar mobile quando modal estiver aberto
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('hide-mobile-nav');
        } else {
            document.body.classList.remove('hide-mobile-nav');
        }

        return () => {
            document.body.classList.remove('hide-mobile-nav');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredAvatars = filter === 'all'
        ? AVATARS
        : AVATARS.filter(a => a.gender === filter);

    const handleSelect = () => {
        if (selectedAvatar) {
            const avatar = AVATARS.find(a => a.id === selectedAvatar);
            if (avatar) {
                onSelect(avatar);
                onClose();
            }
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '10px', // Reduzido padding para mobile
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
                borderRadius: '24px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '95vh', // Aumentado um pouco
                display: 'flex', // Mudança chave: Flex column
                flexDirection: 'column',
                overflow: 'hidden',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.15)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%)',
                    flexShrink: 0 // Não deixa encolher
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '24px', // Levemente menor para mobile
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Sparkles size={24} color="#FFD700" />
                            Seu Guerreiro
                        </h2>
                        <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>
                            Quem você será na batalha?
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '10px',
                            cursor: 'pointer',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Filters */}
                <div style={{
                    padding: '12px 24px',
                    display: 'flex',
                    gap: '8px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    overflowX: 'auto', // Scroll horizontal se precisar
                    flexShrink: 0
                }}>
                    {[
                        { id: 'all', label: '👥 Todos' },
                        { id: 'male', label: '👨 Homens' },
                        { id: 'female', label: '👩 Mulheres' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '16px',
                                border: 'none',
                                background: filter === f.id
                                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                color: filter === f.id ? '#000' : '#fff',
                                fontWeight: filter === f.id ? '700' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '13px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Avatar Grid - Scrollable Area */}
                <div style={{
                    padding: '20px 24px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', // Cards um pouco menores
                    gap: '16px',
                    overflowY: 'auto',
                    flex: 1, // Ocupa o espaço restante
                    minHeight: 0 // Importante para flexbox scroll funcionar
                }}>
                    {filteredAvatars.map(avatar => (
                        <div
                            key={avatar.id}
                            onClick={() => setSelectedAvatar(avatar.id)}
                            style={{
                                background: selectedAvatar === avatar.id
                                    ? 'linear-gradient(145deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))'
                                    : 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                padding: '10px',
                                cursor: 'pointer',
                                border: selectedAvatar === avatar.id
                                    ? '3px solid #FFD700'
                                    : '2px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease',
                                transform: selectedAvatar === avatar.id ? 'scale(1.02)' : 'scale(1)',
                                position: 'relative'
                            }}
                        >
                            {/* Selection indicator */}
                            {selectedAvatar === avatar.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
                                    zIndex: 10
                                }}>
                                    <Check size={14} color="#000" strokeWidth={3} />
                                </div>
                            )}

                            {/* Avatar Image */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '10px',
                                border: '2px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <img
                                    src={avatar.image}
                                    alt={avatar.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Avatar Info */}
                            <h4 style={{
                                margin: '0 0 4px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#fff',
                                textAlign: 'center',
                                lineHeight: '1.2'
                            }}>
                                {avatar.name}
                            </h4>
                            <p style={{
                                margin: 0,
                                fontSize: '11px',
                                color: '#888',
                                textAlign: 'center',
                                lineHeight: '1.2'
                            }}>
                                {avatar.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Avatar count - Footer Info */}
                <div style={{
                    padding: '12px 24px',
                    background: 'rgba(46, 204, 113, 0.1)',
                    borderTop: '1px solid rgba(46, 204, 113, 0.2)',
                    textAlign: 'center',
                    flexShrink: 0
                }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#2ECC71' }}>
                        ⚔️ 10 guerreiros disponíveis!
                    </p>
                </div>

                {/* Footer Actions */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    background: '#13131a', // Fundo sólido para garantir leitura
                    flexShrink: 0
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'transparent',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flex: 1 // Botões crescem iguais no mobile
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSelect}
                        disabled={!selectedAvatar}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            background: selectedAvatar
                                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                : 'rgba(255, 255, 255, 0.1)',
                            color: selectedAvatar ? '#000' : '#666',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: selectedAvatar ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Centralizar texto/ícone
                            gap: '8px',
                            flex: 2, // Botão de confirmar maior
                            boxShadow: selectedAvatar ? '0 4px 15px rgba(255, 215, 0, 0.3)' : 'none'
                        }}
                    >
                        <User size={18} />
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Export avatars list for use elsewhere
export { AVATARS };
export default AvatarSelector;
