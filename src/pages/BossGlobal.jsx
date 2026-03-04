import React, { useState, useEffect } from 'react';
import { Target, Users, Shield, Zap, TrendingUp, Skull, Trophy, Star, Activity, PlusCircle, CheckCircle2, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';
import BossSprite from '../components/BossSprites';
import './BossGlobal.css';

const BOSS_TOTAL_HP = 25000;
const WEEKLY_CAPS = [5000, 6250, 6250, 7500];

const BossGlobal = () => {
    const { user, addXp } = useGame();

    // For simulation & local storage tracking
    const [teamXp, setTeamXp] = useState(12450); // Simulated team progress
    const [myMonthXp, setMyMonthXp] = useState(0);
    const [myTreinos, setMyTreinos] = useState(0);
    const [myHidratacoes, setMyHidratacoes] = useState(0);
    const [myExtras, setMyExtras] = useState(0);
    const [streak, setStreak] = useState(2); // In months

    useEffect(() => {
        const saved = localStorage.getItem('bossGlobalProgress');
        if (saved) {
            const data = JSON.parse(saved);
            setMyMonthXp(data.myMonthXp || 0);
            setMyTreinos(data.myTreinos || 0);
            setMyHidratacoes(data.myHidratacoes || 0);
            setMyExtras(data.myExtras || 0);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('bossGlobalProgress', JSON.stringify({
            myMonthXp, myTreinos, myHidratacoes, myExtras
        }));
    }, [myMonthXp, myTreinos, myHidratacoes, myExtras]);

    const handleTreino = () => {
        if (myTreinos < 30) {
            setMyTreinos(p => p + 1);
            setMyMonthXp(p => p + 50);
            setTeamXp(p => p + 50);
            addXp(50);
        }
    };

    const handleHidratacao = () => {
        if (myHidratacoes < 30) {
            setMyHidratacoes(p => p + 1);
            setMyMonthXp(p => p + 20);
            setTeamXp(p => p + 20);
            addXp(20);
        }
    };

    const handleExtra = () => {
        if (myExtras < 12) {
            setMyExtras(p => p + 1);
            setMyMonthXp(p => p + 30);
            setTeamXp(p => p + 30);
            addXp(30);
        }
    };

    const bossRemaining = Math.max(0, BOSS_TOTAL_HP - teamXp);
    const bossPercent = Math.min(100, Math.max(0, (bossRemaining / BOSS_TOTAL_HP) * 100));

    // Identify current week based on teamXp (simplification for UI)
    let currentWeek = 1;
    let accumulatedCap = 0;
    for (let i = 0; i < WEEKLY_CAPS.length; i++) {
        accumulatedCap += WEEKLY_CAPS[i];
        if (teamXp <= accumulatedCap) {
            currentWeek = i + 1;
            break;
        }
        if (i === 3) currentWeek = 4;
    }

    const myProgressPercent = Math.min(100, (myMonthXp / 800) * 100);

    const PATENTES = [
        "Recruta", "Soldado", "Combatente", "Executor", "Dominador",
        "Imparável", "Elite", "Veterano", "Comandante", "General",
        "Lenda", "Ícone Vencedor"
    ];
    const patenteAtual = PATENTES[Math.min(11, streak)];

    return (
        <div className="boss-global-page page-enter">
            <div className="bg-blur-circle"></div>

            <header className="boss-header">
                <div>
                    <h1 className="boss-title">Boss Global</h1>
                    <p className="boss-subtitle">30 Guerreiros vs O Inimigo Comum</p>
                </div>
                <div className="streak-badge">
                    <Flame color="#ff4500" size={24} />
                    <div className="streak-info">
                        <span>Streak</span>
                        <strong>{streak} Meses</strong>
                    </div>
                </div>
            </header>

            <div className="boss-arena glass-panel">
                <div className="boss-visual">
                    <div className="boss-avatar">
                        <BossSprite bossType="cerberus" isAttacking={false} isDefeated={bossRemaining === 0} />
                    </div>
                    <div className="boss-health-container">
                        <div className="boss-health-labels">
                            <span className="boss-hp-label">HP DO BOSS</span>
                            <span className="boss-hp-value">{bossRemaining.toLocaleString('pt-BR')} / {BOSS_TOTAL_HP.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="boss-health-bar">
                            <div className="boss-health-fill" style={{ width: `${bossPercent}%` }}></div>
                        </div>
                        <div className="boss-fase-indicator">
                            FASE SEMANAL: {currentWeek}/4
                        </div>
                    </div>
                </div>
                <div className="team-stats">
                    <div className="stat-card">
                        <Users size={20} color="#00DDEE" />
                        <div className="stat-data">
                            <span>Esquadrão</span>
                            <strong>30 Ativos</strong>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Zap size={20} color="#FFD700" />
                        <div className="stat-data">
                            <span>Dano Total</span>
                            <strong>{teamXp.toLocaleString('pt-BR')} XP</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="personal-contribution glass-panel">
                    <div className="panel-header">
                        <Target size={20} color="#00FF88" />
                        <h2>Sua Missão Individual</h2>
                    </div>

                    <div className="my-xp-summary">
                        <div className="xp-circle">
                            <h3>{myMonthXp}</h3>
                            <span>XP Mês</span>
                        </div>
                        <div className="xp-target">
                            <span>Meta para Patente: 800 XP</span>
                            <div className="progress-track">
                                <div className="progress-fill my-xp-fill" style={{ width: `${myProgressPercent}%` }}></div>
                            </div>
                            <span className="status-text" style={{ color: myMonthXp >= 800 ? '#00FF88' : '#aaa' }}>
                                {myMonthXp >= 800 ? 'META BATIDA! 🎉' : `Faltam ${800 - myMonthXp} XP`}
                            </span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="action-btn treino-btn" onClick={handleTreino} disabled={myTreinos >= 30}>
                            Dumbbell Treino (50 XP)
                            <span className="counter">{myTreinos}/30</span>
                        </button>
                        <button className="action-btn hidrata-btn" onClick={handleHidratacao} disabled={myHidratacoes >= 30}>
                            Drop Hidratação (20 XP)
                            <span className="counter">{myHidratacoes}/30</span>
                        </button>
                    </div>

                    <div className="extra-missions">
                        <h3>Missões Extras (30 XP cada) max 3/sem</h3>
                        <button className="action-btn extra-btn" onClick={handleExtra} disabled={myExtras >= 12}>
                            <Star size={16} /> Completar Extra
                            <span className="counter">{myExtras}/12</span>
                        </button>
                    </div>
                </div>

                <div className="rank-system glass-panel">
                    <div className="panel-header">
                        <Trophy size={20} color="#FFD700" />
                        <h2>Sistema de Patentes</h2>
                    </div>
                    <div className="current-rank">
                        <span>Sua Patente Atual:</span>
                        <h3 className="rank-name">{patenteAtual}</h3>
                    </div>

                    <ul className="rank-list">
                        {PATENTES.map((pat, idx) => (
                            <li key={idx} className={`rank-item ${idx < streak ? 'unlocked' : ''} ${idx === streak ? 'current' : ''}`}>
                                <div className="rank-icon">
                                    {idx < streak ? <CheckCircle2 size={16} color="#00FF88" /> : (idx === streak ? <Zap size={16} color="#FFD700" /> : <Shield size={16} color="#444" />)}
                                </div>
                                <span>{pat} (Mês {idx + 1})</span>
                            </li>
                        ))}
                    </ul>
                    <div className="rank-warning">
                        <Activity size={14} />
                        <p>Atenção: Se não atingir 800 XP no mês, a patente congela e o Streak zera.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BossGlobal;
