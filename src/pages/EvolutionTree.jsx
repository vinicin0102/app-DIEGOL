import React from 'react';
import { useGame } from '../context/GameContext';
import { GitBranch, Star, Lock, Zap, Shield, Heart, Activity, Trophy } from 'lucide-react';

const SkillNode = ({ id, label, icon: Icon, level, userLevel, color, isActive }) => {
    const isLocked = level > userLevel;
    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '12px',
            position: 'relative'
        }}>
            <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: isLocked ? 'rgba(255,255,255,0.05)' : `${color}22`,
                border: `3px solid ${isLocked ? 'rgba(255,255,255,0.1)' : color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLocked ? 'none' : `0 0 20px ${color}44`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2
            }}>
                <Icon size={32} color={isLocked ? '#444' : color} />
                {isLocked && <Lock size={14} color="#666" style={{ position: 'absolute' }} />}
            </div>
            <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: isLocked ? '#666' : '#fff' }}>{label}</h4>
                <span style={{ fontSize: '10px', fontWeight: '900', color: isLocked ? '#444' : color, textTransform: 'uppercase' }}>
                    {isLocked ? `Nível ${level}` : 'ATIVO'}
                </span>
            </div>
        </div>
    );
};

const EvolutionTree = () => {
    const { user } = useGame();

    const branches = [
        {
            title: 'Força & Corpo',
            color: '#FF3366',
            skills: [
                { id: 1, label: 'Base Sólida', icon: Activity, level: 1 },
                { id: 2, label: 'Resistência Muscular', icon: Zap, level: 10 },
                { id: 3, label: 'Hipertrofia Elite', icon: Trophy, level: 30 }
            ]
        },
        {
            title: 'Mente & Foco',
            color: '#00EEFF',
            skills: [
                { id: 4, label: 'Clareza Inicial', icon: GitBranch, level: 1 },
                { id: 5, label: 'Blindagem Mental', icon: Shield, level: 15 },
                { id: 6, label: 'Mestre do Foco', icon: Star, level: 40 }
            ]
        },
        {
            title: 'Espírito & Hábito',
            color: '#FFD700',
            skills: [
                { id: 7, label: 'Despertar', icon: Heart, level: 1 },
                { id: 8, label: 'Disciplina Inabalável', icon: Shield, level: 20 },
                { id: 9, label: 'Puro Vigor', icon: Zap, level: 50 }
            ]
        }
    ];

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
                    Árvore de <span className="text-gradient">Evolução</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Desbloqueie novas capacidades conforme sobe de nível</p>
            </div>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                flexWrap: 'wrap', 
                gap: '60px',
                position: 'relative'
            }}>
                {branches.map((branch, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px', minWidth: '200px' }}>
                        <div style={{ 
                            padding: '12px 24px', 
                            borderRadius: '12px', 
                            background: `${branch.color}15`, 
                            border: `1px solid ${branch.color}44`,
                            color: branch.color,
                            fontWeight: '900',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '10px'
                        }}>
                            {branch.title}
                        </div>
                        
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '60px' }}>
                            {/* SVG Conector Vertical */}
                            <svg style={{ position: 'absolute', top: '72px', left: '50%', transform: 'translateX(-50%)', height: '180px', width: '4px', zIndex: 1 }}>
                                <line x1="2" y1="0" x2="2" y2="180" stroke="#333" strokeWidth="2" strokeDasharray="8,4" />
                            </svg>

                            {branch.skills.map((skill) => (
                                <SkillNode 
                                    key={skill.id} 
                                    {...skill} 
                                    userLevel={user.level} 
                                    color={branch.color} 
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ marginTop: '80px', padding: '32px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Como evoluir sua árvore?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                    Cada nível alcançado libera passivamente novos nós na sua árvore. Em breve, você poderá gastar pontos de habillidade para personalizar seus buffs.
                </p>
            </div>
        </div>
    );
};

export default EvolutionTree;
