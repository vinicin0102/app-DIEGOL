import React, { useState, useEffect } from 'react';
import {
    Lock, Unlock, Zap, Trophy, Sword, Shield, Heart, Skull, Crown, Star,
    Flame, Target, ChevronRight, Play, ShoppingCart, Check, X, ArrowRight, User,
    Calendar as CalendarIcon, Plus, Trash2, Clock, Search, ChevronLeft, Edit2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import BossSprite from '../components/BossSprites';
import { BOSSES } from '../data/challengesData';
import { getRank, getRankColor } from '../data/missionsData';
import './Challenges.css';

// Reuse components for tabs
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
                        { key: 'corporal', label: 'Corpo (Treino/Saúde)', icon: '💪', desc: 'Movimento + Dieta Limpa' },
                        { key: 'mental', label: 'Mente (Estudo/Leitura)', icon: '🧠', desc: 'Leitura + Estudo' },
                        { key: 'spiritual', label: 'Espiritual (Extra/Hábito)', icon: '✨', desc: 'Conexão + Disciplina Digital' }
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
                                cursor: 'pointer'
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
                    <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,255,136,0.1)', borderRadius: '8px', color: 'var(--primary)', fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>
                        Dia completado automaticamente! 🔥
                    </div>
                )}

                <button className="btn-primary" onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '10px' }}>Confirmar</button>
            </div>
        </div>
    );
};

const ChallengeGuideModal = ({ isOpen, onClose, guide }) => {
    if (!isOpen || !guide) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Guia do Guerreiro</span>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{guide.title}</h2>
                        </div>
                        <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', background: 'rgba(0, 255, 136, 0.05)', borderColor: 'rgba(0, 255, 136, 0.2)' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16} /> OBJETIVO</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#fff' }}>{guide.objective}</p>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>🎯 Desafios Obrigatórios</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {guide.mandatoryChallenges.map((challenge, i) => (
                                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{challenge.icon} {challenge.title}</h4>
                                    <p style={{ fontSize: '13px', color: '#ddd' }}>{challenge.mission}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="btn-primary" onClick={onClose} style={{ width: '100%', padding: '16px' }}>ENTENDI OS DESAFIOS</button>
                </div>
            </div>
        </div>
    );
};

const Challenges = () => {
    const {
        user, addXp
    } = useGame();

    const [activeBosses, setActiveBosses] = useState([]);
    const [openDayModal, setOpenDayModal] = useState({ bossId: null, dayIndex: null });
    const [guideModalOpen, setGuideModalOpen] = useState(false);
    const [activeGuide, setActiveGuide] = useState(null);
    const [attackingBossId, setAttackingBossId] = useState(null);
    const [showVictory, setShowVictory] = useState(false);
    const [defeatedBoss, setDefeatedBoss] = useState(null);

    const rank = getRank(user.level);
    const rankColor = getRankColor(rank);

    useEffect(() => {
        const savedBosses = localStorage.getItem('challengeBosses');
        if (savedBosses) {
            setActiveBosses(JSON.parse(savedBosses));
        } else {
            setActiveBosses(BOSSES.map(b => ({
                ...b,
                calendar: Array.from({ length: b.challengeDuration || 30 }, (_, i) => ({
                    day: i + 1, spiritual: false, corporal: false, mental: false, verified: false
                }))
            })));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('challengeBosses', JSON.stringify(activeBosses));
    }, [activeBosses]);

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
                    const damage = Math.ceil(boss.maxHealth / (boss.challengeDuration || 30));
                    const newHealth = Math.max(0, (boss.currentHealth ?? boss.maxHealth) - damage);

                    setAttackingBossId(bossId);
                    setTimeout(() => setAttackingBossId(null), 800);

                    if (newHealth === 0 && newCalendar.every(d => d.verified)) {
                        setDefeatedBoss(boss);
                        setShowVictory(true);
                        addXp(boss.reward.xp);
                    }

                    return { ...boss, calendar: newCalendar, currentHealth: newHealth, defeated: newHealth === 0 };
                }
                return { ...boss, calendar: newCalendar };
            }
            return boss;
        }));
    };

    return (
        <div className="challenges-page page-enter">
            <div className="background-effect"></div>

            {/* Victory Modal */}
            {showVictory && defeatedBoss && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏆</div>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#FFD700', marginBottom: '8px' }}>VITÓRIA!</h2>
                        <p style={{ color: '#888', marginBottom: '24px' }}>Você derrotou {defeatedBoss.name}</p>
                        <button className="btn-primary" onClick={() => setShowVictory(false)}>CONTINUAR</button>
                    </div>
                </div>
            )}

            {/* Top Rank Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', position: 'relative', zHeight: 1 }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', textTransform: 'uppercase' }}>Bosses do Desafio</h1>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: rankColor }}>RANK {rank}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>NÍVEL {user.level}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>ESTADO ATUAL</div>
                    <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px' }}>
                        <div style={{ width: `${(user.xp % 1000) / 10}%`, height: '100%', background: 'var(--primary)', borderRadius: '100px' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="boss-grid">
                    {activeBosses.map(boss => {
                        const currentHealth = boss.currentHealth ?? boss.maxHealth;
                        const healthPercent = (currentHealth / boss.maxHealth) * 100;
                        return (
                            <div key={boss.id} className={`boss-card ${boss.locked ? 'locked' : ''}`}>
                                <div className="card-header">
                                    <div className="boss-image-container">
                                        <BossSprite bossType={boss.spriteType} isDefeated={boss.defeated} isAttacking={attackingBossId === boss.id} />
                                    </div>
                                    <h3 className="boss-name">{boss.name}</h3>
                                </div>
                                <div className="card-content">
                                    <div className="health-section">
                                        <div className="health-header">
                                            <span>HP</span>
                                            <span>{currentHealth}/{boss.maxHealth}</span>
                                        </div>
                                        <div className="health-track">
                                            <div className="health-fill" style={{ width: `${healthPercent}%`, background: boss.color }}></div>
                                        </div>
                                    </div>
                                    <div className="mission-box" style={{ borderColor: boss.color }}>
                                        <p className="mission-text">{boss.challenge}</p>
                                        <button className="detail-btn" onClick={() => { setActiveGuide(boss.guide); setGuideModalOpen(true); }}>
                                            Ver Guia
                                        </button>
                                    </div>
                                    <div className="calendar-grid" style={{ marginTop: '16px' }}>
                                        {boss.calendar.slice(0, 14).map((day, idx) => (
                                            <div
                                                key={idx}
                                                className={`calendar-day ${day.verified ? 'verified' : ''}`}
                                                onClick={() => setOpenDayModal({ bossId: boss.id, dayIndex: idx })}
                                            >
                                                {day.verified ? <Check size={10} /> : day.day}
                                            </div>
                                        ))}
                                        <div className="calendar-day" style={{ background: 'none', border: 'none' }}><Plus size={10} /></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

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
