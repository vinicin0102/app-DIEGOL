import React, { useState, useEffect } from 'react';
import { X, Check, User, Sparkles, Shield, Swords } from 'lucide-react';
import { useGame } from '../context/GameContext';

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

// AVATAR VISUAL OPTIONS
const VISUALS = {
    male: [
        { id: 'm_loiro', name: 'Loiro', image: warriorMale3, desc: 'Guerreiro de cabelos claros' },
        { id: 'm_moreno', name: 'Moreno', image: warriorMale1, desc: 'Guerreiro de cabelos escuros' },
        { id: 'm_preto', name: 'Negro', image: warriorMale2, desc: 'Guerreiro de pele retinta' },
        { id: 'm_ruivo', name: 'Ruivo', image: warriorMale5, desc: 'Guerreiro de cabelos avermelhados' },
        { id: 'm_oriental', name: 'Oriental', image: warriorMale4, desc: 'Estilo Samurai' },
    ],
    female: [
        { id: 'f_ruiva', name: 'Ruiva', image: warriorFemale1, desc: 'Guerreira de cabelos de fogo' },
        { id: 'f_preta', name: 'Negra', image: warriorFemale2, desc: 'Guerreira de pele retinta' },
        { id: 'f_morena', name: 'Morena', image: warriorFemale3, desc: 'Guerreira de cabelos castanhos' },
        { id: 'f_loira', name: 'Loira', image: warriorFemale5, desc: 'Guerreira de cabelos claros' },
        { id: 'f_oriental', name: 'Oriental', image: warriorFemale4, desc: 'Estilo Ninja/Samurai' },
    ]
};

// WARRIOR TITLES
const TITLES = {
    female: [
        'Exterminadora da Preguiça', 'Guardiã da Disciplina', 'Caçadora de Resultados',
        'Rainha da Constância', 'Dominadora do Foco', 'Guerreira Imparável',
        'Forjadora de Hábitos', 'Sentinela da Evolução', 'Gladiadora do Shape',
        'Conquistadora de Metas'
    ],
    male: [
        'Exterminador da Preguiça', 'Guardião da Disciplina', 'Caçador de Resultados',
        'Rei da Constância', 'Dominador do Foco', 'Guerreiro Imparável',
        'Forjador de Hábitos', 'Sentinela da Evolução', 'Gladiador do Shape',
        'Conquistador de Metas'
    ]
};

const AvatarSelector = ({ isOpen, onClose, onSelect, currentAvatarId }) => {
    const { user, updateWarriorTitle } = useGame();
    const [step, setStep] = useState(1); // 1: Gender, 2: Title, 3: Visual
    const [gender, setGender] = useState('male');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedVisual, setSelectedVisual] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setGender(user.gender === 'female' ? 'female' : 'male');
            setSelectedTitle(user.warrior_title || '');
            document.body.classList.add('hide-mobile-nav');
        } else {
            document.body.classList.remove('hide-mobile-nav');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleFinalize = () => {
        if (selectedVisual && selectedTitle) {
            updateWarriorTitle(selectedTitle);
            onSelect({
                ...selectedVisual,
                title: selectedTitle
            });
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(15px)'
        }}>
            <div style={{
                background: '#0f0f1a',
                borderRadius: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                boxShadow: '0 0 100px rgba(0,0,0,0.5)'
            }}>
                {/* Progress Header */}
                <div style={{ padding: '30px 40px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: 0 }}>Forjar Personagem</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24}/></button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ 
                                height: '4px', flex: 1, borderRadius: '2px',
                                background: step >= s ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '40px', overflowY: 'auto' }}>
                    {step === 1 && (
                        <div className="page-enter">
                            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff' }}>Qual sua essência?</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <button 
                                    onClick={() => { setGender('male'); setStep(2); }}
                                    style={{
                                        padding: '40px 20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: gender === 'male' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                                        color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                                    }}
                                >
                                    <Swords size={40} color="#007AFF" />
                                    <span style={{ fontWeight: '700' }}>MASCULINO</span>
                                </button>
                                <button 
                                    onClick={() => { setGender('female'); setStep(2); }}
                                    style={{
                                        padding: '40px 20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: gender === 'female' ? 'rgba(255, 45, 85, 0.1)' : 'rgba(255,255,255,0.02)',
                                        color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                                    }}
                                >
                                    <Shield size={40} color="#FF2D55" />
                                    <span style={{ fontWeight: '700' }}>FEMININO</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="page-enter">
                            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Escolha seu título de herói:</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {TITLES[gender].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => { setSelectedTitle(t); setStep(3); }}
                                        style={{
                                            padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                                            background: selectedTitle === t ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                            color: selectedTitle === t ? '#000' : '#fff', textAlign: 'left', cursor: 'pointer', fontWeight: '600'
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setStep(1)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Voltar</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="page-enter">
                            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Seu rastro visual:</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                                {VISUALS[gender].map(v => (
                                    <div 
                                        key={v.id}
                                        onClick={() => setSelectedVisual(v)}
                                        style={{
                                            padding: '10px', borderRadius: '20px', border: selectedVisual?.id === v.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ width: '100%', aspectRatio: '1', borderRadius: '14px', overflow: 'hidden', marginBottom: '10px' }}>
                                            <img src={v.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{v.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                                <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Voltar</button>
                                <button 
                                    onClick={handleFinalize}
                                    disabled={!selectedVisual}
                                    style={{ 
                                        padding: '12px 30px', borderRadius: '14px', background: 'var(--primary)', color: '#000', 
                                        fontWeight: '800', border: 'none', cursor: 'pointer', opacity: selectedVisual ? 1 : 0.5 
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AVATARS = [
    ...VISUALS.male.map(v => ({...v, gender: 'male'})),
    ...VISUALS.female.map(v => ({...v, gender: 'female'}))
];

export default AvatarSelector;
