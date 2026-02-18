import React, { useState, useEffect } from 'react';
import {
    Lock, Unlock, Zap, Trophy, Sword, Shield, Heart, Skull, Crown, Star,
    Flame, Target, ChevronRight, Play, ShoppingCart, Check, X, ArrowRight, User
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import BossSprite from '../components/BossSprites';
import { BOSSES } from '../data/challengesData';
import './Challenges.css';

// Função Helper para gerar o calendário
const generateCalendar = (days = 30) => Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    spiritual: false,
    corporal: false,
    mental: false,
    verified: false,
    locked: false // Desbloqueado para dar liberdade
}));

const DayEditModal = ({ isOpen, onClose, dayData, onToggle, dayIndex }) => {
    if (!isOpen || !dayData) return null;

    const isAllChecked = dayData.spiritual && dayData.corporal && dayData.mental;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>Dia {dayData.day}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {[
                        { key: 'corporal', label: 'Corpo (Desafios 1 e 2)', icon: '💪', desc: 'Movimento (3x/sem) + Dieta (Zero açúcar)' },
                        { key: 'mental', label: 'Mente (Desafios 3 e 4)', icon: '🧠', desc: 'Leitura (5 pág) + Estudo (20 min)' },
                        { key: 'spiritual', label: 'Extras (Desafios Opcionais)', icon: '✨', desc: 'Conexão + Domínio Digital' }
                    ].map(item => (
                        <div
                            key={item.key}
                            onClick={() => onToggle(dayIndex, item.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '12px',
                                background: dayData[item.key] ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${dayData[item.key] ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                border: `2px solid ${dayData[item.key] ? 'var(--primary)' : '#666'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: dayData[item.key] ? 'var(--primary)' : 'transparent'
                            }}>
                                {dayData[item.key] && <Check size={16} color="#000" strokeWidth={3} />}
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: dayData[item.key] ? '#fff' : '#aaa' }}>
                                    {item.icon} {item.label}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {isAllChecked && !dayData.verified && (
                    <div style={{
                        textAlign: 'center',
                        padding: '10px',
                        background: 'rgba(0,255,136,0.1)',
                        borderRadius: '8px',
                        color: 'var(--primary)',
                        fontSize: '13px',
                        fontWeight: '700',
                        marginBottom: '10px',
                        animation: 'pulse 2s infinite'
                    }}>
                        Todas as metas cumpridas! O dia será verificado.
                    </div>
                )}

                <button
                    className="btn-primary"
                    onClick={onClose}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};

const ChallengeGuideModal = ({ isOpen, onClose, guide }) => {
    if (!isOpen || !guide) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="boss-card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', padding: '0' }}>
                <div style={{ padding: '24px', position: 'relative' }}>
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 10 }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            background: 'rgba(255, 51, 102, 0.2)',
                            border: '1px solid var(--accent)',
                            borderRadius: '20px',
                            color: 'var(--accent)',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            marginBottom: '16px'
                        }}>
                            <Flame size={14} /> FASE 1
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', color: '#fff' }}>
                            {guide.title}
                        </h2>
                        <p style={{ color: '#888', fontSize: '14px' }}>{guide.duration} • {guide.objective}</p>
                    </div>

                    <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                            <Skull size={20} color="var(--accent)" /> Chefão: {guide.bossName}
                        </h3>
                        <p style={{ color: '#aaa', marginBottom: '16px', fontStyle: 'italic', fontSize: '14px' }}>{guide.bossDescription}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>CÓDIGO DE VITÓRIA:</h4>
                            {guide.winCondition.map((cond, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ddd' }}>
                                    <Check size={14} color="var(--primary)" /> {cond}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>
                            🎯 Desafios Obrigatórios
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {guide.mandatoryChallenges.map((challenge, i) => (
                                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '20px' }}>{challenge.icon}</div>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{challenge.title}</h4>
                                    </div>
                                    <div style={{ paddingLeft: '10px', borderLeft: '2px solid var(--primary)', marginLeft: '10px' }}>
                                        <p style={{ fontSize: '13px', color: '#ddd', marginBottom: '4px' }}><strong style={{ color: '#aaa' }}>Missão:</strong> {challenge.mission}</p>
                                        <p style={{ fontSize: '13px', color: '#ddd', marginBottom: '4px' }}><strong style={{ color: '#aaa' }}>Prova:</strong> {challenge.proof}</p>
                                        {challenge.extra && <p style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px' }}>⚡ {challenge.extra}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <button
                            className="btn-primary"
                            onClick={onClose}
                            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                        >
                            Entendi, Aceito o Desafio!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Challenges = () => {
    const { user, setUser } = useGame();
    const [gamePhase, setGamePhase] = useState('start');
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'locked', 'completed'

    // User Profile State
    const [userProfile, setUserProfile] = useState({
        objective: '', weight: '', height: '', targetWeight: '', sex: '', age: '', experience: ''
    });

    // Game/Boss States
    const [activeBosses, setActiveBosses] = useState([]);
    const [attackingBossId, setAttackingBossId] = useState(null);
    const [damageNumbers, setDamageNumbers] = useState([]);
    const [showVictory, setShowVictory] = useState(false);
    const [defeatedBoss, setDefeatedBoss] = useState(null);
    const [openDayModal, setOpenDayModal] = useState({ bossId: null, dayIndex: null });
    const [guideModalOpen, setGuideModalOpen] = useState(false);
    const [activeGuide, setActiveGuide] = useState(null);
    const [screenShake, setScreenShake] = useState(false);

    // Initialize Data
    useEffect(() => {
        const savedPhase = localStorage.getItem('challengeGamePhase');
        const savedProfile = localStorage.getItem('challengeUserProfile');
        const savedBosses = localStorage.getItem('challengeBosses');

        if (savedPhase) setGamePhase(savedPhase);
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));

        if (savedBosses) {
            let parsedBosses = JSON.parse(savedBosses);
            parsedBosses = parsedBosses.map(b => {
                const targetDuration = b.challengeDuration || 30;
                let currentCalendar = b.calendar || [];
                if (currentCalendar.length !== targetDuration) {
                    currentCalendar = generateCalendar(targetDuration);
                }
                return { ...b, calendar: currentCalendar };
            });
            setActiveBosses(parsedBosses);
        } else {
            setActiveBosses(BOSSES.map(b => ({
                ...b,
                calendar: generateCalendar(b.challengeDuration || 30)
            })));
        }
    }, []);

    // Save Data
    useEffect(() => {
        localStorage.setItem('challengeGamePhase', gamePhase);
        localStorage.setItem('challengeUserProfile', JSON.stringify(userProfile));
        localStorage.setItem('challengeBosses', JSON.stringify(activeBosses));
    }, [gamePhase, userProfile, activeBosses]);

    // Calendar Toggle Logic
    const handleDayToggle = (bossId, dayIndex, type) => {
        setActiveBosses(prev => prev.map(boss => {
            if (boss.id === bossId) {
                const newCalendar = [...boss.calendar];
                const day = { ...newCalendar[dayIndex] };
                day[type] = !day[type];

                const allChecked = day.spiritual && day.corporal && day.mental;
                const wasVerified = day.verified;
                day.verified = allChecked;
                newCalendar[dayIndex] = day;

                if (day.verified && !wasVerified) {
                    const allDaysCompleted = newCalendar.every(d => d.verified);
                    const damagePerDay = Math.ceil(boss.maxHealth / (boss.challengeDuration || 30));
                    let newHealth = Math.max(0, (boss.currentHealth ?? boss.maxHealth) - damagePerDay);

                    if (allDaysCompleted) newHealth = 0;
                    else if (newHealth === 0) newHealth = 1;

                    // Animation & Effect
                    setTimeout(() => {
                        setAttackingBossId(bossId);
                        setDamageNumbers(prev => [...prev, {
                            id: Date.now(),
                            value: damagePerDay,
                            isCritical: true,
                            offsetX: Math.floor(Math.random() * 60) - 30,
                            offsetY: Math.floor(Math.random() * 30) - 15
                        }]);
                        setScreenShake(true);
                        setTimeout(() => {
                            setAttackingBossId(null);
                            setScreenShake(false);
                            setDamageNumbers([]);
                        }, 800);
                    }, 100);

                    if (newHealth === 0 && allDaysCompleted) {
                        setTimeout(() => {
                            setDefeatedBoss(boss);
                            setShowVictory(true);
                            setUser(prev => ({
                                ...prev,
                                xp: prev.xp + boss.reward.xp,
                                level: Math.floor((prev.xp + boss.reward.xp) / 1000) + 1,
                                badges: [...prev.badges, {
                                    id: Date.now(),
                                    name: boss.reward.badge,
                                    icon: boss.reward.badge.split(' ')[0],
                                    description: `Derrotou ${boss.name}`
                                }]
                            }));
                            unlockNextBoss(boss.id);
                        }, 800);
                    }
                    return { ...boss, calendar: newCalendar, currentHealth: newHealth, defeated: newHealth === 0 };
                }
                return { ...boss, calendar: newCalendar };
            }
            return boss;
        }));
    };

    const unlockNextBoss = (currentBossId) => {
        setActiveBosses(prev => prev.map(boss =>
            boss.id === currentBossId + 1 ? { ...boss, locked: false } : boss
        ));
    };

    const unlockBoss = (bossId) => {
        setActiveBosses(prev => prev.map(boss =>
            boss.id === bossId ? { ...boss, locked: false } : boss
        ));
    };

    // Filter Bosses based on Tab
    const filteredBosses = activeBosses.filter(boss => {
        const isDefeated = boss.defeated || (boss.currentHealth === 0 && boss.calendar?.every(d => d.verified));
        if (activeTab === 'active') return !boss.locked && !isDefeated;
        if (activeTab === 'locked') return boss.locked;
        if (activeTab === 'completed') return isDefeated;
        return true;
    });

    if (gamePhase === 'start') {
        return (
            <div className="challenges-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div className="background-effect"></div>

                <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>⚔️</div>
                    <h1 className="page-title">Arena dos <span className="text-gradient">Desafios</span></h1>
                    <p className="page-subtitle" style={{ maxWidth: '400px', margin: '0 auto 32px' }}>
                        Enfrente seus demônios interiores, vença a procrastinação e torne-se uma lenda.
                    </p>
                    <button className="btn-primary" onClick={() => setGamePhase('form')} style={{ padding: '16px 40px', fontSize: '18px' }}>
                        COMEÇAR JORNADA
                    </button>
                </div>
            </div>
        );
    }

    if (gamePhase === 'form') {
        return (
            <div className="challenges-page" style={{ padding: '20px' }}>
                <h1 className="page-title text-center">Perfil de <span className="text-gradient">Guerreiro</span></h1>
                <form onSubmit={(e) => { e.preventDefault(); setGamePhase('battle'); }} style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <div className="boss-card" style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Objetivo Principal</label>
                            <select
                                value={userProfile.objective} onChange={e => setUserProfile({ ...userProfile, objective: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="lose">Perder Peso</option>
                                <option value="gain">Ganhar Massa</option>
                                <option value="health">Saúde & Energia</option>
                            </select>
                        </div>
                        <button className="btn-primary" type="submit" style={{ width: '100%', padding: '14px', marginTop: '20px' }}>
                            ENTRAR NA ARENA
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={`challenges-page ${screenShake ? 'screen-shake' : ''}`}>
            <div className="background-effect"></div>

            {/* Victory Modal */}
            {showVictory && defeatedBoss && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏆</div>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#FFD700', marginBottom: '8px' }}>VITÓRIA!</h2>
                        <p style={{ color: '#888', marginBottom: '24px' }}>Você derrotou {defeatedBoss.name}</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
                            <div className="reward-item"><Zap size={16} color="var(--primary)" /><span>+{defeatedBoss.reward.xp} XP</span></div>
                            <div className="reward-item"><Crown size={16} color="#FFD700" /><span>{defeatedBoss.reward.badge}</span></div>
                        </div>
                        <button className="btn-primary" onClick={() => { setShowVictory(false); setDefeatedBoss(null); }}>
                            CONTINUAR
                        </button>
                    </div>
                </div>
            )}

            <div className="challenges-header">
                <div className="header-content">
                    <div>
                        <h1 className="page-title">Arena dos <span className="text-gradient">Bosses</span></h1>
                        <p className="page-subtitle">Complete desafios diários para causar dano e vencer.</p>
                    </div>
                    <div className="user-stats-bar">
                        <div className="stat-item">
                            <div className="stat-label">Nível</div>
                            <span className="level-badge">{user.level}</span>
                        </div>
                        <div className="stat-separator"></div>
                        <div className="stat-item">
                            <div className="stat-label">XP</div>
                            <div className="stat-value">{user.xp}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs-nav">
                <button className={`tab-button ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                    <Sword size={16} /> Ativos
                </button>
                <button className={`tab-button ${activeTab === 'locked' ? 'active' : ''}`} onClick={() => setActiveTab('locked')}>
                    <Lock size={16} /> Disponíveis
                </button>
                <button className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                    <Trophy size={16} /> Conquistas
                </button>
            </div>

            <div className="boss-grid">
                {filteredBosses.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>
                        Nenhum boss encontrado nesta categoria.
                    </div>
                )}

                {filteredBosses.map((boss) => {
                    const currentHealth = boss.currentHealth ?? boss.maxHealth;
                    const healthPercent = (currentHealth / boss.maxHealth) * 100;
                    const isDefeated = boss.defeated || (currentHealth === 0 && boss.calendar?.every(d => d.verified));

                    return (
                        <div
                            key={boss.id}
                            className={`boss-card ${boss.locked ? 'locked' : ''} ${activeTab === 'active' ? 'active-border' : ''} ${isDefeated ? 'defeated-border' : ''}`}
                        >
                            <div className="card-header">
                                <span className="difficulty-badge" style={{
                                    background: boss.difficulty === 'ELITE' ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,255,255,0.1)',
                                    color: boss.difficulty === 'ELITE' ? '#000' : '#fff'
                                }}>
                                    {boss.difficulty}
                                </span>
                                {boss.element && (
                                    <span className="element-badge" style={{ color: boss.color, background: `${boss.color}22` }}>
                                        <Zap size={10} /> {boss.element}
                                    </span>
                                )}

                                <div className="boss-image-container">
                                    <BossSprite bossType={boss.spriteType} isDefeated={isDefeated} isAttacking={attackingBossId === boss.id} />
                                    {attackingBossId === boss.id && damageNumbers.map(dmg => (
                                        <div key={dmg.id} className="damage-number" style={{ color: dmg.isCritical ? '#FFD700' : '#FF3366', top: '50%', left: '50%' }}>
                                            {dmg.isCritical && '💥'} -{dmg.value}
                                        </div>
                                    ))}
                                </div>

                                <h3 className={`boss-name ${isDefeated ? 'defeated' : ''}`}>{boss.name}</h3>
                            </div>

                            <div className="card-content">
                                {!isDefeated && !boss.locked && (
                                    <div className="health-section">
                                        <div className="health-header">
                                            <span className="health-status">
                                                <Heart size={12} color={boss.color} /> HP
                                            </span>
                                            <span>{currentHealth}/{boss.maxHealth}</span>
                                        </div>
                                        <div className="health-track">
                                            <div className="health-fill" style={{ width: `${healthPercent}%`, background: boss.color }}></div>
                                        </div>
                                    </div>
                                )}

                                <div className="mission-box" style={{ borderColor: boss.color }}>
                                    <div className="mission-label">
                                        <Target size={12} /> MISSÃO
                                    </div>
                                    <p className="mission-text">{boss.challenge}</p>
                                    {boss.guide && (
                                        <button className="detail-btn" onClick={() => { setActiveGuide(boss.guide); setGuideModalOpen(true); }}>
                                            <Shield size={12} /> Ver Guia da Missão
                                        </button>
                                    )}
                                </div>

                                <div className="rewards-grid">
                                    <div className="reward-item">
                                        <Zap size={16} color="var(--primary)" />
                                        <div className="reward-info">
                                            <p>+{boss.reward.xp}</p>
                                            <span>XP</span>
                                        </div>
                                    </div>
                                    <div className="reward-item">
                                        <Trophy size={16} color="#FFD700" />
                                        <div className="reward-info">
                                            <p>{boss.reward.badge.split(' ')[0]}</p>
                                            <span>Medalha</span>
                                        </div>
                                    </div>
                                </div>

                                {boss.locked ? (
                                    <button className="action-btn unlock-btn" onClick={() => unlockBoss(boss.id)}>
                                        <Unlock size={16} /> DESBLOQUEAR
                                    </button>
                                ) : isDefeated ? (
                                    <div className="action-btn defeated-badge">
                                        <Crown size={16} /> COMPLETADO
                                    </div>
                                ) : (
                                    <div className="calendar-container">
                                        <div className="calendar-header">
                                            <span>Progresso Diário</span>
                                            <span style={{ color: boss.color }}>
                                                {boss.calendar?.filter(d => d.verified).length}/{boss.challengeDuration || 30}
                                            </span>
                                        </div>
                                        <div className="calendar-grid">
                                            {boss.calendar?.map((day, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`calendar-day ${day.verified ? 'verified' : ''}`}
                                                    onClick={() => setOpenDayModal({ bossId: boss.id, dayIndex: idx })}
                                                    style={{ borderColor: day.day === (boss.calendar?.filter(d => d.verified).length + 1) ? boss.color : 'transparent', borderWidth: '1px', borderStyle: 'solid' }}
                                                >
                                                    {day.verified ? <Check size={10} /> : day.day}
                                                    {!day.verified && (day.spiritual || day.corporal || day.mental) && (
                                                        <div className="day-dots">
                                                            {day.corporal && <div className="day-dot" style={{ background: boss.color }}></div>}
                                                            {day.mental && <div className="day-dot" style={{ background: '#fff' }}></div>}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modals */}
            <DayEditModal
                isOpen={!!openDayModal.bossId}
                onClose={() => setOpenDayModal({ bossId: null, dayIndex: null })}
                dayIndex={openDayModal.dayIndex}
                dayData={activeBosses.find(b => b.id === openDayModal.bossId)?.calendar[openDayModal.dayIndex]}
                onToggle={(idx, type) => handleDayToggle(openDayModal.bossId, idx, type)}
            />

            <ChallengeGuideModal
                isOpen={guideModalOpen}
                onClose={() => setGuideModalOpen(false)}
                guide={activeGuide}
            />
        </div>
    );
};

export default Challenges;
