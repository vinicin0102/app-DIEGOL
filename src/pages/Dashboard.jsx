import React, { useState } from 'react';
import { Activity, Flame, Trophy, BrainCircuit, ChevronRight, Sparkles, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import AIAnalysis from '../components/AIAnalysis';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, challenges } = useGame();
    const navigate = useNavigate();
    const [showAI, setShowAI] = useState(false);

    const unlockedChallenges = challenges.filter(c => !c.locked).slice(0, 2);
    const xpProgress = (user.xp % 1000) / 10; // Simulates progress within level

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

            {/* === STATS GRID === */}
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
