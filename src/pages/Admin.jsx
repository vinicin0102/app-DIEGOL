import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Edit2, Trash2, Plus, Save, X, Users, Trophy, ChevronDown, Lock, Unlock, Settings, BarChart3 } from 'lucide-react';

const Admin = () => {
    const { challenges, addChallenge, updateChallenge, deleteChallenge, user } = useGame();
    const [activeTab, setActiveTab] = useState('challenges');
    const [showForm, setShowForm] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '', level: 1, xp: 100, locked: false, price: 0, description: ''
    });

    const handleSaveNew = () => {
        if (!newChallenge.title) return;
        addChallenge(newChallenge);
        setNewChallenge({ title: '', level: 1, xp: 100, locked: false, price: 0, description: '' });
        setShowForm(false);
    };

    const tabs = [
        { id: 'challenges', label: 'Desafios', icon: Trophy },
        { id: 'users', label: 'Alunos', icon: Users },
        { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    ];

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            {/* === HEADER === */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Settings size={20} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Área Restrita</span>
                </div>
                <h1 style={{ fontSize: '42px', fontWeight: '900' }}>
                    Painel de <span className="text-gradient">Comando</span>
                </h1>
            </div>

            {/* === TABS === */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                                color: activeTab === tab.id ? '#000' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Icon size={18} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* === CHALLENGES TAB === */}
            {activeTab === 'challenges' && (
                <div>
                    {/* Add Button */}
                    <button
                        className={showForm ? 'btn-secondary' : 'btn-primary'}
                        style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? <X size={18} /> : <Plus size={18} />}
                        {showForm ? 'Cancelar' : 'Novo Desafio'}
                    </button>

                    {/* Add Form */}
                    {showForm && (
                        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
                            <h3 style={{ marginBottom: '20px', fontWeight: '700', fontSize: '18px' }}>Criar Novo Desafio</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>TÍTULO</label>
                                    <input
                                        placeholder="Ex: Corrida de 5km"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: '1px solid var(--border)',
                                            color: '#fff',
                                            borderRadius: '12px',
                                            fontSize: '14px'
                                        }}
                                        value={newChallenge.title}
                                        onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>DESCRIÇÃO</label>
                                    <input
                                        placeholder="Descrição do desafio..."
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: '1px solid var(--border)',
                                            color: '#fff',
                                            borderRadius: '12px',
                                            fontSize: '14px'
                                        }}
                                        value={newChallenge.description}
                                        onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>NÍVEL</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: 'rgba(0,0,0,0.4)',
                                                border: '1px solid var(--border)',
                                                color: '#fff',
                                                borderRadius: '12px',
                                                fontSize: '14px'
                                            }}
                                            value={newChallenge.level}
                                            onChange={e => setNewChallenge({ ...newChallenge, level: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>XP</label>
                                        <input
                                            type="number"
                                            min="10"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: 'rgba(0,0,0,0.4)',
                                                border: '1px solid var(--border)',
                                                color: '#fff',
                                                borderRadius: '12px',
                                                fontSize: '14px'
                                            }}
                                            value={newChallenge.xp}
                                            onChange={e => setNewChallenge({ ...newChallenge, xp: parseInt(e.target.value) || 100 })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>PREÇO</label>
                                        <input
                                            type="number"
                                            min="0"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                background: 'rgba(0,0,0,0.4)',
                                                border: '1px solid var(--border)',
                                                color: '#fff',
                                                borderRadius: '12px',
                                                fontSize: '14px'
                                            }}
                                            value={newChallenge.price}
                                            onChange={e => setNewChallenge({ ...newChallenge, price: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        cursor: 'pointer',
                                        padding: '14px 20px',
                                        background: newChallenge.locked ? 'rgba(255, 51, 102, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                                        border: `1px solid ${newChallenge.locked ? 'var(--accent)' : 'var(--primary)'}`,
                                        borderRadius: '12px',
                                        color: newChallenge.locked ? 'var(--accent)' : 'var(--primary)',
                                        fontWeight: '600'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newChallenge.locked}
                                            onChange={e => setNewChallenge({ ...newChallenge, locked: e.target.checked })}
                                            style={{ display: 'none' }}
                                        />
                                        {newChallenge.locked ? <Lock size={18} /> : <Unlock size={18} />}
                                        {newChallenge.locked ? 'Bloqueado' : 'Desbloqueado'}
                                    </label>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ marginTop: '24px' }} onClick={handleSaveNew}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={18} /> Salvar Desafio
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Challenges List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {challenges.map(c => (
                            <div key={c.id} className="glass-panel" style={{
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        borderRadius: '14px',
                                        background: c.locked ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 136, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {c.locked ? <Lock size={22} color="#666" /> : <Trophy size={22} color="var(--primary)" />}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{c.title}</h4>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Level {c.level}</span>
                                            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{c.xp} XP</span>
                                            {c.price > 0 && <span style={{ fontSize: '13px', color: 'var(--accent)' }}>${c.price}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => updateChallenge(c.id, { locked: !c.locked })}
                                        style={{
                                            padding: '10px 16px',
                                            background: c.locked ? 'rgba(255, 51, 102, 0.1)' : 'rgba(0, 255, 136, 0.1)',
                                            border: `1px solid ${c.locked ? 'var(--accent)' : 'var(--primary)'}`,
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            color: c.locked ? 'var(--accent)' : 'var(--primary)',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        {c.locked ? <Lock size={14} /> : <Unlock size={14} />}
                                        {c.locked ? 'Trancado' : 'Aberto'}
                                    </button>
                                    <button
                                        onClick={() => deleteChallenge(c.id)}
                                        style={{
                                            padding: '10px 12px',
                                            background: 'rgba(255, 51, 102, 0.1)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            color: 'var(--accent)'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* === USERS TAB === */}
            {activeTab === 'users' && (
                <div className="glass-panel" style={{ padding: '28px', overflow: 'auto' }}>
                    <h3 style={{ marginBottom: '24px', fontWeight: '700' }}>Alunos Cadastrados</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', minWidth: '500px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Atleta</th>
                                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nível</th>
                                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>XP Total</th>
                                <th style={{ padding: '16px', fontWeight: '600', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), var(--accent))' }}></div>
                                        <span style={{ fontWeight: '600' }}>{user.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}><span className="level-badge">LVL {user.level}</span></td>
                                <td style={{ padding: '16px', fontWeight: '700' }}>{user.xp.toLocaleString()} XP</td>
                                <td style={{ padding: '16px' }}><span className="badge badge-primary">Ativo</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #333, #222)' }}></div>
                                        <span style={{ fontWeight: '600' }}>Carlos Mendes</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}><span className="level-badge">LVL 8</span></td>
                                <td style={{ padding: '16px', fontWeight: '700' }}>1,200 XP</td>
                                <td style={{ padding: '16px' }}><span className="badge badge-primary">Ativo</span></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #444, #333)' }}></div>
                                        <span style={{ fontWeight: '600' }}>Maria Oliveira</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}><span className="level-badge">LVL 5</span></td>
                                <td style={{ padding: '16px', fontWeight: '700' }}>650 XP</td>
                                <td style={{ padding: '16px' }}><span className="badge badge-secondary">Inativo</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* === STATS TAB === */}
            {activeTab === 'stats' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>TOTAL ALUNOS</h4>
                            <p style={{ fontSize: '40px', fontWeight: '900' }}>156</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>DESAFIOS ATIVOS</h4>
                            <p style={{ fontSize: '40px', fontWeight: '900', color: 'var(--primary)' }}>{challenges.length}</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>MEDALHAS GANHAS</h4>
                            <p style={{ fontSize: '40px', fontWeight: '900', color: '#FFD700' }}>89</p>
                        </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '28px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>📊 Gráficos de engajamento em breve...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
