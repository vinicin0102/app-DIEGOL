import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Award, Flame, Zap, Medal, Star, Target, Settings, Dumbbell, Crown, Sparkles, Heart, TrendingUp, Info, Edit3, Camera, Activity } from 'lucide-react';
import { RealFitness3DDisplay, RealFitness3DBuilder, getFitnessTier, FITNESS_TIERS } from '../components/RealFitness3DAvatar';

import RadarChart from '../components/RadarChart';

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
    const currentTier = getFitnessTier(user.level, bossesDefeatedCount);

    // Estado para URL do avatar 3D real
    const [avatar3DUrl, setAvatar3DUrl] = useState('');

    // Carregar URL do avatar do localStorage
    useEffect(() => {
        const savedUrl = localStorage.getItem('realFitness3DAvatarUrl');
        if (savedUrl) {
            setAvatar3DUrl(savedUrl);
        }
    }, []);

    // Handler para salvar o avatar 3D
    const handleSaveAvatar = (newUrl) => {
        setAvatar3DUrl(newUrl);
    };

    // Cor de destaque baseada no tier atual
    const accentColor = currentTier.color;

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            {/* === REAL 3D AVATAR BUILDER MODAL === */}
            <RealFitness3DBuilder
                isOpen={showAvatarBuilder}
                onClose={() => setShowAvatarBuilder(false)}
                onSave={handleSaveAvatar}
                currentAvatarUrl={avatar3DUrl}
                userLevel={user.level}
                bossesDefeated={bossesDefeatedCount}
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px',
                    alignItems: 'center'
                }}>
                    {/* LEFT - AVATAR 3D REAL */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* Avatar 3D Real com Equipamentos Fitness */}
                        <div
                            onClick={() => setShowAvatarBuilder(true)}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <RealFitness3DDisplay
                                avatarUrl={avatar3DUrl}
                                userLevel={user.level}
                                bossesDefeated={bossesDefeatedCount}
                                size={380}
                                onClickCreate={() => setShowAvatarBuilder(true)}
                            />

                            {/* Edit button overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '50px',
                                right: '10px',
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

                        {/* Player Info Card */}
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

                            {/* Nível Fitness Atual */}
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

                            {/* Estado Geral Bar */}
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

                            {/* Energia Segmentos */}
                            <div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                    <Zap size={14} color={accentColor} />
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Energia</span>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} style={{
                                            flex: 1,
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: i < Math.floor(energyLevel / 10)
                                                ? `linear-gradient(180deg, ${accentColor}, ${accentColor}88)`
                                                : 'rgba(255,255,255,0.08)',
                                            boxShadow: i < Math.floor(energyLevel / 10) ? `0 0 8px ${accentColor}66` : 'none',
                                            transition: 'all 0.3s ease',
                                            transitionDelay: `${i * 0.05}s`
                                        }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Customize Button */}
                        <button
                            onClick={() => setShowAvatarBuilder(true)}
                            className="btn-primary"
                            style={{
                                marginTop: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px 28px',
                                fontSize: '14px',
                                background: `linear-gradient(135deg, ${accentColor}, #00FF88)`
                            }}
                        >
                            <Dumbbell size={18} />
                            Personalizar Atleta
                        </button>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
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
        </div>
    );
};

export default Profile;
