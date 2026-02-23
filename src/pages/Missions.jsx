import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Search, ChevronLeft, ChevronRight, Plus, Check, Trash2, Zap, Clock } from 'lucide-react';
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
    const filters = ['Foco do Dia', 'Todas', 'Pendentes', 'Concluídas'];

    const filteredMissions = missions.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Todos' || m.category === activeCategory;
        const matchesFilter = activeFilter === 'Todas' ||
            (activeFilter === 'Pendentes' && !m.completed) ||
            (activeFilter === 'Concluídas' && m.completed);
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
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#FF3366' }}>◎</span> Missões
                </h1>
                <button className="bonus-btn" onClick={() => setShowBonusForm(true)}>
                    <Plus size={24} />
                </button>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                {missions.filter(m => !m.completed).length} missões pendentes
            </p>

            {/* Date Nav */}
            <div className="glass-panel" style={{ padding: '4px', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="category-tab"><Search size={18} /></button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ChevronLeft size={18} color="#444" />
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>Hoje</span>
                    <ChevronRight size={18} color="#444" />
                </div>
                <div style={{ width: '40px' }}></div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
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
                        color: '#fff'
                    }}
                />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
                {filters.map(filter => (
                    <button
                        key={filter}
                        className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter === 'Foco do Dia' && '📅 '}
                        {filter === 'Concluídas' && '✅ '}
                        {filter}
                    </button>
                ))}
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '12px' }}>
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

            {/* Section: Flexível */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #00DDFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={16} color="#00DDFF" />
                </div>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#00DDFF' }}>Flexível / Qualquer Horário</h3>
                    <span style={{ fontSize: '13px', color: '#00DDFF', opacity: 0.8 }}>({filteredMissions.length})</span>
                </div>
            </div>

            {/* Mission List */}
            {filteredMissions.map(m => (
                <div key={m.id} className={`mission-card ${m.completed ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={`mission-dot ${m.completed ? 'green' : 'gray'}`}></div>
                            <div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{m.title}</h4>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#888', padding: '4px 10px' }}>
                                        💬 {m.type === 'diaria' ? 'Diária' : 'Extra'}
                                    </span>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#888', padding: '4px 10px' }}>
                                        {m.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Zap size={14} fill="var(--primary)" /> +{m.xp} XP
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => toggleMission(m.id)}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            background: m.completed ? 'var(--primary)' : 'linear-gradient(90deg, #00FFCC, #00FFEE)',
                            color: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '16px'
                        }}
                    >
                        {m.completed ? <Check size={20} /> : null}
                        {m.completed ? 'Concluída' : 'Completar'}
                    </button>
                </div>
            ))}

            {/* Bonus Missions Section */}
            {(bonusMissions.length > 0 || showBonusForm) && (
                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px', color: '#FF3366' }}>Missões Bônus</h3>

                    {bonusMissions.map(m => (
                        <div key={m.id} className={`mission-card ${m.completed ? 'completed' : ''}`} style={{ borderColor: '#FF3366' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="mission-dot orange"></div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{m.title}</h4>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => toggleBonusMission(m.id)}
                                        style={{ background: m.completed ? 'var(--primary)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', color: m.completed ? '#000' : '#fff' }}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteBonusMission(m.id)}
                                        style={{ background: 'rgba(255,51,102,0.1)', border: 'none', borderRadius: '8px', padding: '8px', color: '#FF3366' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showBonusForm && (
                        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Título da missão bônus..."
                                value={bonusTitle}
                                onChange={e => setBonusTitle(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '8px', color: '#fff', marginBottom: '12px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddBonus}>Adicionar</button>
                                <button className="btn-secondary" style={{ flex: 1, borderColor: '#444', color: '#888' }} onClick={() => setShowBonusForm(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Missions;
