import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Search, ChevronLeft, ChevronRight, Plus, Check, Trash2, Zap, Clock, Target, Trophy, Flame } from 'lucide-react';
import './Missions.css';

const Missions = () => {
    const {
        missions, toggleMission,
        bonusMissions, addBonusMission, toggleBonusMission, deleteBonusMission
    } = useGame();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [activeFilter, setActiveFilter] = useState('Todas');
    const [showBonusForm, setShowBonusForm] = useState(false);
    const [bonusTitle, setBonusTitle] = useState('');

    const categories = ['Todos', 'Corpo', 'Saúde', 'Finanças', 'Trabalho', 'Espiritual', 'Mente'];
    const filters = ['Todas', 'Foco do Dia', 'Pendentes', 'Concluídas'];

    const completedCount = missions.filter(m => m.completed).length;
    const progress = missions.length > 0 ? (completedCount / missions.length) * 100 : 0;

    const filteredMissions = missions.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Todos' || m.category === activeCategory;

        let matchesFilter = true;
        if (activeFilter === 'Pendentes') matchesFilter = !m.completed;
        else if (activeFilter === 'Concluídas') matchesFilter = m.completed;
        else if (activeFilter === 'Foco do Dia') matchesFilter = !m.completed && m.xp >= 15; // Missões de alto XP como foco

        return matchesSearch && matchesCategory && matchesFilter;
    });

    const handleAddBonus = () => {
        if (bonusTitle.trim()) {
            addBonusMission(bonusTitle);
            setBonusTitle('');
            setShowBonusForm(false);
        }
    };

    return (
        <div className="missions-page page-enter">
            {/* Upper Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>Minhas Missões</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Supere seus limites hoje</p>
                </div>
                <button className="bonus-btn" onClick={() => setShowBonusForm(true)}>
                    <Plus size={24} />
                </button>
            </div>

            {/* Progress Header */}
            <div className="progress-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trophy size={18} color="var(--primary)" />
                        <span style={{ fontWeight: '800', fontSize: '14px' }}>Progresso Diário</span>
                    </div>
                    <span style={{ fontWeight: '900', color: 'var(--primary)' }}>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>{completedCount} de {missions.length} concluídas</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>+{missions.filter(m => m.completed).reduce((acc, curr) => acc + curr.xp, 0)} XP hoje</span>
                </div>
            </div>

            {/* Date / Search Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    <input
                        type="text"
                        placeholder="Pesquisar missão..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 14px 14px 48px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            color: '#fff',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div className="glass-panel" style={{ padding: '4px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' }}>
                    <button className="category-tab" style={{ padding: '8px' }}><ChevronLeft size={18} /></button>
                    <span style={{ fontWeight: '800', fontSize: '12px' }}>HOJE</span>
                    <button className="category-tab" style={{ padding: '8px' }}><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Categories Horizontal Scroll */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '32px', paddingBottom: '4px' }}>
                {filters.map(filter => (
                    <button
                        key={filter}
                        className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Section Header */}
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'rgba(0, 221, 255, 0.1)', borderRadius: '10px' }}>
                    <Clock size={18} color="#00DDFF" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>Próximas Missões</h3>
            </div>

            {/* Mission List */}
            <div className="missions-list">
                {filteredMissions.length > 0 ? (
                    filteredMissions.map(m => (
                        <div key={m.id} className={`mission-card ${m.completed ? 'completed' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className={`mission-icon-container ${m.completed ? 'completed' : ''}`}>
                                        <span style={{ fontSize: '24px' }}>{m.icon || '🎯'}</span>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px', color: m.completed ? '#666' : '#fff' }}>
                                            {m.title}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span className="mission-type-badge">{m.type === 'diaria' ? 'Diária' : 'Extra'}</span>
                                            <span className="mission-category-tag">{m.category}</span>
                                            <div className="xp-badge">
                                                <Zap size={12} fill="var(--primary)" /> +{m.xp} XP
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {m.completed && (
                                    <div style={{ background: 'var(--primary)', padding: '4px', borderRadius: '50%' }}>
                                        <Check size={16} color="#000" strokeWidth={3} />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => toggleMission(m.id)}
                                className={`btn-complete ${m.completed ? 'completed' : ''}`}
                                style={{
                                    background: m.completed ? 'rgba(255,255,255,0.05)' : 'var(--primary)',
                                    color: m.completed ? '#aaa' : '#000'
                                }}
                            >
                                {m.completed ? 'Missão Cumprida' : 'Completar Missão'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Target size={48} style={{ marginBottom: '16px', opacity: 0.1, color: '#fff' }} />
                        <h4 style={{ color: '#aaa', fontWeight: '700' }}>Nenhuma missão encontrada</h4>
                        <p style={{ color: '#555', fontSize: '14px' }}>Tente mudar os filtros ou categorias</p>
                    </div>
                )}
            </div>

            {/* Bonus Missions Section */}
            {(bonusMissions.length > 0 || showBonusForm) && (
                <div style={{ marginTop: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ padding: '8px', background: 'rgba(255, 51, 102, 0.1)', borderRadius: '10px' }}>
                            <Flame size={18} color="#FF3366" />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>Missões Bônus</h3>
                    </div>

                    {bonusMissions.map(m => (
                        <div key={m.id} className={`mission-card ${m.completed ? 'completed' : ''}`} style={{ borderColor: m.completed ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,102,0.3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.completed ? 'var(--primary)' : '#FF3366' }}></div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: m.completed ? '#666' : '#fff' }}>{m.title}</h4>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => toggleBonusMission(m.id)}
                                        style={{ background: m.completed ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', padding: '10px', color: m.completed ? '#000' : '#fff', cursor: 'pointer' }}
                                    >
                                        <Check size={18} strokeWidth={3} />
                                    </button>
                                    <button
                                        onClick={() => deleteBonusMission(m.id)}
                                        style={{ background: 'rgba(255,51,102,0.05)', border: 'none', borderRadius: '10px', padding: '10px', color: '#FF3366', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showBonusForm && (
                        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,51,102,0.2)' }}>
                            <h4 style={{ marginBottom: '16px', fontWeight: '800' }}>Nova Missão Bônus</h4>
                            <input
                                type="text"
                                placeholder="Ex: Caminhada de 15 min..."
                                value={bonusTitle}
                                onChange={e => setBonusTitle(e.target.value)}
                                style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,51,102,0.1)', borderRadius: '12px', color: '#fff', marginBottom: '16px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-complete" style={{ flex: 1, padding: '14px', background: '#FF3366', color: '#fff' }} onClick={handleAddBonus}>Adicionar</button>
                                <button className="category-tab" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={() => setShowBonusForm(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Missions;
