import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { User, Shield, Zap, Star, Check, Lock, Palette, Info } from 'lucide-react';
import { AVATARS } from '../components/AvatarSelector';

const Avatars = () => {
    const { user } = useGame();
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('vencedores_avatar_id');
        if (saved) setSelectedId(saved);
        else setSelectedId(AVATARS[0].id);
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        localStorage.setItem('vencedores_avatar_id', id);
    };

    const currentAvatar = AVATARS.find(a => a.id === selectedId) || AVATARS[0];

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>
                    Galeria de <span className="text-gradient">Guerreiros</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Escolha a representação da sua disciplina</p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '40px',
                alignItems: 'start'
            }}>
                {/* Visualização Atual */}
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', position: 'sticky', top: '24px' }}>
                    <div style={{ 
                        width: '100%', 
                        aspectRatio: '1', 
                        borderRadius: '24px', 
                        overflow: 'hidden', 
                        border: '3px solid var(--primary)',
                        marginBottom: '24px',
                        boxShadow: '0 10px 40px rgba(0, 255, 136, 0.2)'
                    }}>
                        <img 
                            src={currentAvatar.image} 
                            alt={currentAvatar.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px' }}>{currentAvatar.name}</h2>
                    <div className="badge badge-primary" style={{ marginBottom: '24px' }}>SELECIONADO</div>
                    
                    <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: '700' }}>
                            <Info size={16} color="var(--primary)" /> Detalhes do Avatar
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            Este guerreiro representa sua força interior. Suba de nível e complete conquistas para desbloquear novos visuais e itens exclusivos.
                        </p>
                    </div>
                </div>

                {/* Lista de Seleção */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
                    {AVATARS.map(avatar => {
                        const isSelected = selectedId === avatar.id;
                        const isLocked = avatar.level > user.level;

                        return (
                            <div 
                                key={avatar.id}
                                onClick={() => !isLocked && handleSelect(avatar.id)}
                                style={{ 
                                    aspectRatio: '1',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    position: 'relative',
                                    border: isSelected ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                    opacity: isLocked ? 0.4 : 1,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isSelected ? 'scale(1.05)' : 'none'
                                }}
                            >
                                <img 
                                    src={avatar.image} 
                                    alt={avatar.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {isSelected && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '8px', 
                                        right: '8px', 
                                        width: '24px', 
                                        height: '24px', 
                                        borderRadius: '50%', 
                                        background: 'var(--primary)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}>
                                        <Check size={14} color="#000" />
                                    </div>
                                )}
                                {isLocked && (
                                    <div style={{ 
                                        position: 'absolute', 
                                        inset: 0, 
                                        background: 'rgba(0,0,0,0.6)', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        gap: '4px'
                                    }}>
                                        <Lock size={20} color="#fff" />
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#fff' }}>LVL {avatar.level}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="glass-panel" style={{ marginTop: '48px', padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Palette size={40} color="var(--primary)" />
                <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>Personalização Avançada</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Tornar-se um Guerreiro Elite permite customizar cores e itens específicos do seu avatar.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Avatars;
