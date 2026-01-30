import React, { useState, useEffect } from 'react';
import { Activity, Flame, Trophy, BrainCircuit, ChevronRight, Sparkles, Target, Edit3, Crown, Dumbbell, Zap, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';
import AIAnalysis from '../components/AIAnalysis';
import { useNavigate } from 'react-router-dom';
import AvatarSelector, { AVATARS } from '../components/AvatarSelector';
import RadarChart from '../components/RadarChart';

const Dashboard = () => {
    const { user, challenges } = useGame();
    const navigate = useNavigate();
    const [showAI, setShowAI] = useState(false);

    // === AVATAR LOGIC ===
    const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        const savedAvatarId = localStorage.getItem('selectedAvatarId');
        if (savedAvatarId) {
            const avatar = AVATARS.find(a => a.id === savedAvatarId);
            if (avatar) {
                setSelectedAvatar(avatar);
            }
        }
    }, []);

    const handleSelectAvatar = (avatar) => {
        setSelectedAvatar(avatar);
        localStorage.setItem('selectedAvatarId', avatar.id);
    };

    // Calculate Stats
    const bossesDefeatedCount = user.defeatedBosses ? user.defeatedBosses.length : 0;
    const statProfissional = Math.min(100, (user.level / 50) * 100);
    const statFisico = Math.min(100, (user.xp / 10000) * 100);
    const statMental = Math.min(100, (user.streak * 2) + (bossesDefeatedCount * 15));
    const statEspiritual = Math.min(100, user.badges ? user.badges.length * 12 : 0);
    const statFinanceiro = Math.min(100, user.completedWorkouts * 3);

    const radarStats = {
        profissional: statProfissional,
        espiritual: statEspiritual,
        fisico: statFisico,
        financeiro: statFinanceiro,
        mental: statMental
    };

    const energyLevel = Math.round(
        (Object.values(radarStats).reduce((a, b) => a + b, 0)) / 5
    );

    // Simple tier calculation based on level
    const getTier = (level) => {
        if (level >= 40) return { name: 'Lendário', color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.4)' };
        if (level >= 30) return { name: 'Épico', color: '#9B59B6', glowColor: 'rgba(155, 89, 182, 0.4)' };
        if (level >= 20) return { name: 'Raro', color: '#3498DB', glowColor: 'rgba(52, 152, 219, 0.4)' };
        if (level >= 10) return { name: 'Comum', color: '#2ECC71', glowColor: 'rgba(46, 204, 113, 0.4)' };
        return { name: 'Novato', color: '#95A5A6', glowColor: 'rgba(149, 165, 166, 0.4)' };
    };
    const currentTier = getTier(user.level);
    const accentColor = currentTier.color;

    // === DASHBOARD LOGIC ===
    const unlockedChallenges = challenges.filter(c => !c.locked).slice(0, 2);
    const xpProgress = (user.xp % 1000) / 10;

    if (showAI) {
        return (
            <div className="page-enter" style={{ paddingTop: '40px' }}>
                <button
                    onClick={() => setShowAI(false)}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    ← Voltar ao Dashboard
                </button>
                <AIAnalysis onComplete={() => {
                    setShowAI(false);
                    navigate('/challenges');
                }} />
            </div>
        );
    }

    return (
        <div className="dashboard-container page-enter" style={{ paddingBottom: '80px' }}>
            {/* === AVATAR SELECTOR MODAL === */}
            <AvatarSelector
                isOpen={showAvatarBuilder}
                onClose={() => setShowAvatarBuilder(false)}
                onSelect={handleSelectAvatar}
                currentAvatarId={selectedAvatar?.id}
            />

            {/* === HEADER === */}
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span className="badge badge-primary">
                            <Sparkles size={12} /> Online
                        </span>
                    </div>
                    <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px', lineHeight: '1.1' }}>
                        Olá, <span className="text-gradient">{user.name.split(' ')[0]}</span>! 👋
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Pronto para superar seus limites hoje?</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '20px 28px',
                    minWidth: '200px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span className="level-badge">LVL {user.level}</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Guerreiro</span>
                    </div>
                    <div className="xp-bar">
                        <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }}></div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        {user.xp} / {Math.ceil(user.xp / 1000) * 1000} XP
                    </p>
                </div>
            </header>

            {/* === MAIN PROFILE CARD (First Thing Seen) === */}
            <div style={{ marginBottom: '48px' }}>
                <div className="glass-panel" style={{
                    padding: '32px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    {/* LEFT - AVATAR IMAGE */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <div
                            onClick={() => setShowAvatarBuilder(true)}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'transform 0.3s ease',
                                width: '320px',
                                height: '320px'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {/* Avatar Container */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                border: `3px solid ${accentColor}`,
                                boxShadow: `0 10px 40px ${currentTier.glowColor}, 0 0 60px ${currentTier.glowColor}`,
                                background: 'linear-gradient(145deg, #1a1a2e, #0f0f23)'
                            }}>
                                {selectedAvatar ? (
                                    <img
                                        src={selectedAvatar.image}
                                        alt={selectedAvatar.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '16px',
                                        background: 'linear-gradient(145deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))'
                                    }}>
                                        <Sparkles size={48} color="#FFD700" />
                                        <span style={{ color: '#FFD700', fontSize: '16px', fontWeight: '600' }}>
                                            Escolher Avatar
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Edit Button */}
                            <div style={{
                                position: 'absolute',
                                bottom: '15px',
                                right: '15px',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 20px ${currentTier.glowColor}`,
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}>
                                <Edit3 size={18} color="#fff" />
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            padding: '20px 28px',
                            background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
                            borderRadius: '20px',
                            border: `1px solid ${accentColor}33`,
                            width: '100%',
                            maxWidth: '300px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                                <Crown size={18} color={accentColor} />
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                    {user.name}
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginBottom: '16px',
                                padding: '8px 16px',
                                background: `${accentColor}22`,
                                borderRadius: '100px',
                                border: `1px solid ${accentColor}44`
                            }}>
                                <Dumbbell size={14} color={accentColor} />
                                <span style={{ fontSize: '12px', fontWeight: '700', color: accentColor }}>
                                    {currentTier.emoji} Nível {currentTier.name}
                                </span>
                                <Activity size={14} color={accentColor} />
                            </div>

                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Estado Geral</span>
                                    <span style={{ fontSize: '11px', fontWeight: '800', color: accentColor }}>{energyLevel}%</span>
                                </div>
                                <div style={{ height: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${energyLevel}%`,
                                        background: `linear-gradient(90deg, ${accentColor}, #00FF88)`,
                                        borderRadius: '100px',
                                        boxShadow: `0 0 15px ${accentColor}66`,
                                        transition: 'width 1s ease'
                                    }} />
                                </div>
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

            {/* === STATS GRID (Keep specific dashboard stats) === */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
                <div className="glass-panel stat-card" style={{ padding: '28px' }}>
                    <div style={{
                        width: '52px', height: '52px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.2), rgba(123, 47, 255, 0.05))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px'
                    }}>
                        <Trophy size={26} color="var(--secondary)" />
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Pontos Totais</span>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', marginTop: '4px' }}>
                        {user.xp.toLocaleString()} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>XP</span>
                    </h3>
                </div>

                <div className="glass-panel stat-card" style={{ padding: '28px' }}>
                    <div style={{
                        width: '52px', height: '52px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.2), rgba(255, 51, 102, 0.05))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px'
                    }}>
                        <Flame size={26} color="var(--accent)" />
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Sequência</span>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', marginTop: '4px' }}>
                        {user.streak} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>dias</span>
                    </h3>
                </div>

                <div className="glass-panel stat-card" style={{ padding: '28px' }}>
                    <div style={{
                        width: '52px', height: '52px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.05))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px'
                    }}>
                        <Activity size={26} color="var(--primary)" />
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Treinos</span>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', marginTop: '4px' }}>
                        {user.completedWorkouts}
                    </h3>
                </div>
            </div>

            {/* === AI TRAINER CTA === */}
            <section style={{ marginBottom: '48px' }}>
                <div
                    className="glass-panel"
                    style={{
                        padding: '36px 40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '32px',
                        background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.15) 0%, rgba(123, 47, 255, 0) 60%)',
                        border: '1px solid rgba(123, 47, 255, 0.3)',
                        flexWrap: 'wrap'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{
                            width: '70px', height: '70px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, var(--secondary), #9B59FF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(123, 47, 255, 0.4)'
                        }}>
                            <BrainCircuit size={36} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>IA Personal Trainer</h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.5' }}>
                                Tire uma foto para análise corporal e receba desafios personalizados.
                            </p>
                        </div>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                        onClick={() => setShowAI(true)}
                    >
                        <Target size={18} /> Nova Análise
                    </button>
                </div>
            </section>

            {/* === ACTIVE CHALLENGES === */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Desafios Ativos</h2>
                    <button
                        onClick={() => navigate('/challenges')}
                        style={{
                            background: 'none', border: 'none', color: 'var(--primary)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            fontWeight: '600', fontSize: '14px'
                        }}
                    >
                        Ver todos <ChevronRight size={18} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {unlockedChallenges.map((c, i) => (
                        <div
                            key={c.id}
                            className="glass-panel challenge-card"
                            style={{
                                padding: '28px',
                                border: i === 0 ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid var(--border)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span className={i === 0 ? 'badge badge-primary' : 'badge badge-secondary'}>
                                    {i === 0 ? 'RECOMENDADO' : `LEVEL ${c.level}`}
                                </span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>+{c.xp} XP</span>
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>{c.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                                {c.description}
                            </p>
                            <button className="btn-primary" style={{ width: '100%' }}>
                                Iniciar Desafio
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
