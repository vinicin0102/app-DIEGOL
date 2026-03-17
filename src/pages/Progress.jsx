import React from 'react';
import { useGame } from '../context/GameContext';
import { TrendingUp, Calendar, Target, Activity, Zap, Flame, Award } from 'lucide-react';

const ProgressStat = ({ label, value, color, icon: Icon }) => (
    <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: `${color}15` }}>
                <Icon size={20} color={color} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: '900' }}>{value}</span>
            <span style={{ fontSize: '12px', color: color, fontWeight: '800' }}>TOTAL</span>
        </div>
    </div>
);

const Progress = () => {
    const { user } = useGame();

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
                    Análise de <span className="text-gradient">Evolução</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Métricas detalhadas do seu desempenho</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '48px' }}>
                <ProgressStat label="XP Acumulado" value={user.xp.toLocaleString()} color="var(--primary)" icon={Zap} />
                <ProgressStat label="Dias em Sequência" value={user.streak} color="var(--accent)" icon={Flame} />
                <ProgressStat label="Treinos Concluídos" value={user.completedWorkouts} color="var(--secondary)" icon={Activity} />
                <ProgressStat label="Missões Totais" value={Math.round(user.xp / 150)} color="#FFD700" icon={Target} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {/* Calendário de Atividade (Mockup) */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Calendar size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Frequência Mensal</h3>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                        {[...Array(31)].map((_, i) => (
                            <div key={i} style={{ 
                                aspectRatio: '1', 
                                borderRadius: '6px', 
                                background: Math.random() > 0.3 ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}></div>
                        ))}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                        Você manteve uma frequência de <strong style={{ color: '#fff' }}>84%</strong> este mês.
                    </p>
                </div>

                {/* Ranking do Nível */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <TrendingUp size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Ranking Global</h3>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--primary)', marginBottom: '4px' }}>#124</div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Entre 12.450 competidores</p>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span>Top 10% do Mundo</span>
                            <CheckCircle2 size={16} color="var(--primary)" />
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ width: '90%', height: '100%', background: 'var(--primary)' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '48px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>Projeção de Nível</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                        Mantendo seu ritmo atual de <strong>{Math.round(user.xp / user.streak || 1)} XP/dia</strong>, você atingirá o Nível 50 (Protocolo Elite) em aproximadamente <strong>45 dias</strong>.
                    </p>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={18} /> Ver Benefícios Elite
                    </button>
                </div>
                <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '8px solid rgba(0, 255, 136, 0.1)', borderTopColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span style={{ fontSize: '42px', fontWeight: '900' }}>68%</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>DA JORNADA</span>
                </div>
            </div>
        </div>
    );
};

const CheckCircle2 = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default Progress;
