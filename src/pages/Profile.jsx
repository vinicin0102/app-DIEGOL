
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Award, Flame, Zap, Medal, Star, Target, Settings, Dumbbell, Crown, Sparkles, Heart, TrendingUp, Info, Edit3, Camera, Activity, User } from 'lucide-react';
import AvatarSelector, { AVATARS } from '../components/AvatarSelector';
import NotificationSettings from '../components/NotificationSettings';

import RadarChart from '../components/RadarChart';

// Simplified Tier Logic (same as Dashboard)
const getTier = (level) => {
    if (level >= 50) return { name: 'LENDÁRIO', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.8)', emoji: '👑' };
    if (level >= 30) return { name: 'ELITE', color: '#FF4500', glowColor: 'rgba(255, 69, 0, 0.8)', emoji: '⚔️' };
    if (level >= 15) return { name: 'VETERANO', color: '#9B59B6', glowColor: 'rgba(155, 89, 182, 0.8)', emoji: '🛡️' };
    if (level >= 5) return { name: 'GUERREIRO', color: '#3498DB', glowColor: 'rgba(52, 152, 219, 0.8)', emoji: '🗡️' };
    return { name: 'NOVATO', color: '#2ECC71', glowColor: 'rgba(46, 204, 113, 0.8)', emoji: '🌱' };
};

const Profile = () => {
    const { user } = useGame();

    // Mostrar builder de avatar
    const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);

    // === CÁLCULO DE STATS AUTOMÁTICO ===
    // Baseado no progresso real do usuário no contexto

    // Profissional: Baseado no Nível Global (Max Lvl 50 = 100%)
    const statProfissional = Math.min(100, (user.level / 50) * 100);

    // Físico: Baseado no XP acumulado (Max 10.000 XP = 100%)
    const statFisico = Math.min(100, (user.xp / 10000) * 100);

    // Mental: Baseado na Ofensiva/Streak e Bosses Derrotados (Mentalidade forte)
    const bossesDefeatedCount = user.defeatedBosses ? user.defeatedBosses.length : 0;
    const statMental = Math.min(100, (user.streak * 2) + (bossesDefeatedCount * 15));

    // Espiritual: Baseado em Medalhas conquistadas (Conquistas da alma)
    const statEspiritual = Math.min(100, user.badges.length * 12);

    // Financeiro (Simulado): Baseado em "trabalho" concluído (Treinos/Desafios totais)
    const statFinanceiro = Math.min(100, user.completedWorkouts * 3);

    const radarStats = {
        profissional: statProfissional,
        espiritual: statEspiritual, // Usando badges como métrica
        fisico: statFisico,
        financeiro: statFinanceiro,
        mental: statMental
    };

    // Média para Energia
    const energyLevel = Math.round(
        (Object.values(radarStats).reduce((a, b) => a + b, 0)) / 5
    );

    // Progresso do XP para a barra
    const xpProgress = (user.xp % 1000) / 10;

    // Calcular tier fitness
    const currentTier = getTier(user.level);

    // Estado para o Avatar Selecionado (ID do avatar)
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    // Carregar Avatar do localStorage
    useEffect(() => {
        const savedAvatarId = localStorage.getItem('userSelectedAvatarId');
        if (savedAvatarId) {
            setSelectedAvatar(savedAvatarId);
        } else {
            // Default para o primeiro avatar
            setSelectedAvatar(AVATARS[0].id);
        }
    }, []);

    // Handler para salvar o avatar
    const handleSaveAvatar = (avatar) => {
        setSelectedAvatar(avatar.id);
        localStorage.setItem('userSelectedAvatarId', avatar.id);
        setShowAvatarBuilder(false);
    };

    // Encontrar o objeto do avatar selecionado
    const currentAvatarObj = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

    // Cor de destaque baseada no tier atual
    const accentColor = currentTier.color;

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            {/* === AVATAR SELECTOR MODAL === */}
            <AvatarSelector
                isOpen={showAvatarBuilder}
                onClose={() => setShowAvatarBuilder(false)}
                onSelect={handleSaveAvatar}
                currentAvatarId={selectedAvatar}
            />

            {/* === HEADER === */}
            <div style={{ marginBottom: '32px', padding: '0 24px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>
                    Meu <span className="text-gradient">Perfil</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Seu progresso real calculado automaticamente</p>
            </div>

            {/* === MAIN CARD === */}
            <div style={{ padding: '0 24px', marginBottom: '48px' }}>
                <div className="glass-panel" style={{
                    padding: '32px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Reduzido min-width para caber em mobile pequeno
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    {/* LEFT - AVATAR DISPLAY */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        width: '100%' // Garante largura total no mobile
                    }}>
                        {/* Avatar Image Container */}
                        <div
                            onClick={() => setShowAvatarBuilder(true)}
                            className="avatar-card" // Reusing animation class
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                width: '100%', // Responsivo
                                maxWidth: '300px', // Limite máximo
                                aspectRatio: '1', // Mantém quadrado
                                borderRadius: '24px',
                                border: `3px solid ${currentTier.color}`,
                                boxShadow: `0 0 30px ${currentTier.glowColor}`,
                                overflow: 'hidden',
                                animation: 'avatar-float 6s ease-in-out infinite',
                                margin: '0 auto' // Centralizar
                            }}
                        >
                            <img
                                src={currentAvatarObj.image}
                                alt={currentAvatarObj.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />

                            {/* Overlay info */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                padding: '20px',
                                paddingTop: '40px',
                                textAlign: 'center'
                            }}>
                                <span style={{
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '18px',
                                    display: 'block'
                                }}>
                                    {currentAvatarObj.name}
                                </span>
                            </div>

                            {/* Edit button overlay */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.2)',
                                transition: 'all 0.2s',
                                zIndex: 10
                            }}>
                                <Edit3 size={18} color="#fff" />
                            </div>
                        </div>

                        {/* Player Info Card */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '24px',
                            padding: '24px',
                            background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
                            borderRadius: '24px',
                            border: `1px solid ${accentColor}33`,
                            width: '100%',
                            maxWidth: '320px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative background glow */}
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: `radial-gradient(circle at 50% 50%, ${accentColor}10, transparent 70%)`,
                                pointerEvents: 'none'
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <Crown size={20} color={accentColor} fill={accentColor + '44'} />
                                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {user.name}
                                    </span>
                                </div>

                                {/* Nível Fitness Atual */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginBottom: '20px',
                                    padding: '10px 20px',
                                    background: 'rgba(0,0,0,0.4)',
                                    borderRadius: '100px',
                                    border: `1px solid ${accentColor}44`,
                                    boxShadow: `0 4px 15px rgba(0,0,0,0.2)`
                                }}>
                                    <span style={{ fontSize: '24px' }}>{currentTier.emoji}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '800', color: accentColor, letterSpacing: '0.5px' }}>
                                        NÍVEL {currentTier.name}
                                    </span>
                                </div>

                                {/* Estado Geral Bar */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Vigor Total</span>
                                        <span style={{ fontSize: '12px', fontWeight: '800', color: accentColor }}>{energyLevel}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${energyLevel}%`,
                                            background: `linear-gradient(90deg, ${accentColor}, #ffffff)`,
                                            borderRadius: '100px',
                                            boxShadow: `0 0 10px ${accentColor}`,
                                            transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowAvatarBuilder(true)}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        marginTop: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        padding: '14px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                                        border: 'none',
                                        boxShadow: `0 4px 15px ${accentColor}44`
                                    }}
                                >
                                    <User size={18} />
                                    Trocar Guerreiro
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - RADAR CHART */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <RadarChart stats={radarStats} color={accentColor} />
                        <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                            <Info size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Vença desafios para expandir seu gráfico
                        </p>
                    </div>
                </div>
            </div>

            {/* === NOTIFICATION SETTINGS === */}
            <div style={{ padding: '0 24px', marginBottom: '48px' }}>
                <NotificationSettings user={user} />
            </div>

            {/* === STATS EXPLANATION (READ ONLY) === */}
            <div style={{ padding: '0 24px', marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <TrendingUp size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Seus Atributos</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {[
                        {
                            key: 'profissional', label: 'Profissional', icon: '💼', color: '#FFD700',
                            desc: 'Baseado no seu Nível', val: statProfissional
                        },
                        {
                            key: 'fisico', label: 'Físico', icon: '💪', color: '#00FF88',
                            desc: 'Baseado no XP Total', val: statFisico
                        },
                        {
                            key: 'mental', label: 'Mental', icon: '🧠', color: '#4169E1',
                            desc: 'Sequência + Bosses', val: statMental
                        },
                        {
                            key: 'financeiro', label: 'Financeiro', icon: '💰', color: '#32CD32',
                            desc: 'Total de Treinos', val: statFinanceiro
                        },
                        {
                            key: 'espiritual', label: 'Espiritual', icon: '✨', color: '#9B30FF',
                            desc: 'Medalhas Ganhas', val: statEspiritual
                        }
                    ].map(stat => (
                        <div key={stat.key} className="glass-panel" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                                    <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '15px' }}>{stat.label}</h4>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.desc}</span>
                                    </div>
                                </div>
                                <span style={{ fontWeight: '800', fontSize: '18px', color: stat.color }}>
                                    {Math.round(stat.val)}%
                                </span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${stat.val}%`,
                                    background: stat.color, borderRadius: '100px',
                                    transition: 'width 1s ease'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* === XP PROGRESS === */}
            <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="level-badge">NÍVEL {user.level}</span>
                            <span style={{ fontWeight: '700', fontSize: '14px' }}>Progresso do Nível</span>
                        </div>
                        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{user.xp} XP</span>
                    </div>
                    <div className="xp-bar" style={{ height: '12px' }}>
                        <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }}></div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        Faltam <strong style={{ color: '#fff' }}>{1000 - (user.xp % 1000)}</strong> XP para o próximo nível
                    </p>
                </div>
            </div>

            {/* === STATS GRID === */}
            <div style={{ padding: '0 24px', marginBottom: '48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px' }}>
                    <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.05))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <Zap size={28} color="var(--primary)" />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '900' }}>{user.xp.toLocaleString()}</h3>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>XP TOTAL</span>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.2), rgba(255, 51, 102, 0.05))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <Flame size={28} color="var(--accent)" />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '900' }}>{user.streak}</h3>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>SEQUÊNCIA</span>
                    </div>
                    <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.2), rgba(123, 47, 255, 0.05))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <Target size={28} color="var(--secondary)" />
                        </div>
                        <h3 style={{ fontSize: '28px', fontWeight: '900' }}>{user.completedWorkouts}</h3>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>TREINOS</span>
                    </div>
                </div>
            </div>

            {/* === TROPHY ROOM === */}
            <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Award size={28} color="#FFD700" />
                    <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Sala de Troféus</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {user.badges.map(badge => (
                        <div key={badge.id} className="glass-panel trophy-card">
                            <div className="trophy-icon">
                                {badge.icon}
                            </div>
                            <h4 style={{ fontWeight: '700', marginBottom: '6px', fontSize: '15px' }}>{badge.name}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{badge.description}</p>
                        </div>
                    ))}

                    {/* Locked Trophies */}
                    {[1, 2, 3].map(i => (
                        <div key={`locked-${i}`} className="glass-panel" style={{ padding: '32px 24px', textAlign: 'center', opacity: 0.4 }}>
                            <div style={{
                                width: '80px', height: '80px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '50%',
                                margin: '0 auto 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed rgba(255,255,255,0.1)'
                            }}>
                                <Medal size={32} color="#444" />
                            </div>
                            <h4 style={{ fontWeight: '700', marginBottom: '6px', color: '#666' }}>Bloqueado</h4>
                            <p style={{ fontSize: '12px', color: '#555' }}>Continue jogando...</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* === LGPD FOOTER === */}
            <div style={{
                marginTop: '60px',
                padding: '40px 24px',
                borderTop: '1px solid var(--border)',
                textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>Termos de Uso</a>
                    <a href="#" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>Política de Privacidade</a>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
                    Seus dados estão protegidos seguindo as diretrizes da LGPD (Lei Geral de Proteção de Dados).
                    Utilizamos criptografia ponta-a-ponta para garantir sua segurança.
                </p>
            </div>
        </div>
    );
};

export default Profile;
