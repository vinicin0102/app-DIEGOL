import React, { useState, useEffect } from 'react';
import { Target, Users, Shield, Zap, TrendingUp, Skull, Trophy, Star, Activity, PlusCircle, CheckCircle2, Flame, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import BossSprite from '../components/BossSprites';
import { getCurrentBoss, getAllBosses } from '../data/bossesData';
import './BossGlobal.css';

const DIFFICULTY_COLORS = {
    'Normal': '#00FF88',
    'Difícil': '#FFD700',
    'Épico': '#FF3366',
    'Lendário': '#7B2FFF',
};

const BossGlobal = () => {
    const { user, addXp } = useGame();
    const currentBoss = getCurrentBoss();
    const allBosses = getAllBosses();

    const BOSS_TOTAL_HP = currentBoss.hp;
    const WEEKLY_CAPS = currentBoss.weeklyCaps;

    // For simulation & local storage tracking
    const [teamXp, setTeamXp] = useState(12450);
    const [myMonthXp, setMyMonthXp] = useState(0);
    const [myTreinos, setMyTreinos] = useState(0);
    const [myHidratacoes, setMyHidratacoes] = useState(0);
    const [myExtras, setMyExtras] = useState(0);
    const [streak, setStreak] = useState(2);
    const [showBestiary, setShowBestiary] = useState(false);

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
                    <h1 className="boss-title">Desafio Coletivo</h1>
                    <p className="boss-subtitle">30 Guerreiros vs <span style={{ color: currentBoss.color, fontWeight: 800 }}>{currentBoss.name}</span></p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        className="bestiary-btn"
                        onClick={() => setShowBestiary(!showBestiary)}
                        title="Bestiário"
                    >
                        <Skull size={20} />
                        <span>Bestiário</span>
                    </button>
                    <div className="streak-badge">
                        <Flame color="#ff4500" size={24} />
                        <div className="streak-info">
                            <span>Streak</span>
                            <strong>{streak} Meses</strong>
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── BOSS ARENA ─── */}
            <div className="boss-arena glass-panel" style={{ borderColor: currentBoss.aura }}>
                <div className="boss-visual">
                    <div className="boss-info-badge">
                        <span className="boss-difficulty" style={{ color: DIFFICULTY_COLORS[currentBoss.difficulty], borderColor: DIFFICULTY_COLORS[currentBoss.difficulty] }}>
                            {currentBoss.difficulty}
                        </span>
                        <span className="boss-emoji">{currentBoss.emoji}</span>
                    </div>
                    <div className="boss-avatar" style={{ boxShadow: `0 0 40px ${currentBoss.aura}` }}>
                        <BossSprite bossType={currentBoss.key} isAttacking={false} isDefeated={bossRemaining === 0} />
                    </div>
                    <div className="boss-name-plate">
                        <h2 style={{ color: currentBoss.color }}>{currentBoss.name}</h2>
                        <p className="boss-title-sub">{currentBoss.title}</p>
                    </div>
                    <p className="boss-lore">{currentBoss.description}</p>
                    <div className="boss-health-container">
                        <div className="boss-health-labels">
                            <span className="boss-hp-label">HP DO BOSS</span>
                            <span className="boss-hp-value">{bossRemaining.toLocaleString('pt-BR')} / {BOSS_TOTAL_HP.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="boss-health-bar">
                            <div className="boss-health-fill" style={{ width: `${bossPercent}%`, background: `linear-gradient(90deg, ${currentBoss.color}, #FF3366)` }}></div>
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

            {/* ─── BESTIÁRIO MODAL ─── */}
            {showBestiary && (
                <div className="bestiary-overlay" onClick={() => setShowBestiary(false)}>
                    <div className="bestiary-modal" onClick={e => e.stopPropagation()}>
                        <div className="bestiary-header">
                            <Skull size={28} color="#FF3366" />
                            <h2>Bestiário dos Chefões</h2>
                            <button className="bestiary-close" onClick={() => setShowBestiary(false)}>×</button>
                        </div>
                        <p className="bestiary-sub">10 inimigos mortais que você deve derrotar ao longo da sua jornada</p>
                        
                        <div className="bestiary-grid">
                            {allBosses.map((boss, i) => {
                                const isCurrentBoss = boss.key === currentBoss.key;
                                const isDefeated = i < (new Date().getMonth() % allBosses.length);
                                return (
                                    <div
                                        key={boss.id}
                                        className={`bestiary-card ${isCurrentBoss ? 'bestiary-active' : ''} ${isDefeated ? 'bestiary-defeated' : ''}`}
                                        style={{ '--boss-color': boss.color }}
                                    >
                                        <div className="bestiary-card-header">
                                            <span className="bestiary-number">#{boss.id}</span>
                                            <span className="bestiary-difficulty" style={{ color: DIFFICULTY_COLORS[boss.difficulty] }}>
                                                {boss.difficulty}
                                            </span>
                                        </div>
                                        <div className="bestiary-sprite">
                                            <BossSprite bossType={boss.key} isAttacking={false} isDefeated={isDefeated} />
                                        </div>
                                        <div className="bestiary-info">
                                            <h3 style={{ color: boss.color }}>
                                                {boss.emoji} {boss.name}
                                            </h3>
                                            <p className="bestiary-title">{boss.title}</p>
                                            <p className="bestiary-desc">{boss.description}</p>
                                            <div className="bestiary-stats">
                                                <span>❤️ {boss.hp.toLocaleString('pt-BR')} HP</span>
                                                <span>📅 Mês {boss.month}</span>
                                            </div>
                                            {isCurrentBoss && (
                                                <div className="bestiary-current-badge">
                                                    <Flame size={14} /> BOSS ATUAL
                                                </div>
                                            )}
                                            {isDefeated && (
                                                <div className="bestiary-defeated-badge">
                                                    <CheckCircle2 size={14} /> DERROTADO
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BossGlobal;
