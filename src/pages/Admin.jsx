import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Edit2, Trash2, Plus, Save, X, Users, Trophy, ChevronDown, Lock, Unlock, Settings, BarChart3, Bell, Send, Clock, Zap, MessageSquare, Calendar, Copy } from 'lucide-react';

const Admin = () => {
    const { challenges, addChallenge, updateChallenge, deleteChallenge, user } = useGame();
    const [activeTab, setActiveTab] = useState('challenges');
    const [showForm, setShowForm] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '', level: 1, xp: 100, locked: false, price: 0, description: ''
    });

    // === NOTIFICATION STATES ===
    const [notifTitle, setNotifTitle] = useState('');
    const [notifBody, setNotifBody] = useState('');
    const [scheduledNotifs, setScheduledNotifs] = useState([]);
    const [scheduleTime, setScheduleTime] = useState('08:00');
    const [scheduleRepeat, setScheduleRepeat] = useState('daily');
    const [notifSent, setNotifSent] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    const notifTemplates = [
        { title: '💪 Hora de treinar!', body: 'Seu corpo merece atenção hoje. Bora mover!', category: 'treino' },
        { title: '🔥 Não quebre o streak!', body: 'Você está indo bem. Mantenha a constância!', category: 'motivação' },
        { title: '⚡ Guerreiro, acorda!', body: 'Cada dia sem treinar é um dia que o boss fica mais forte.', category: 'motivação' },
        { title: '🏆 Falta pouco!', body: 'Você está mais perto do próximo nível. Continue!', category: 'progresso' },
        { title: '🎯 Missão do dia', body: 'Complete seu treino e ganhe XP. Vamos lá!', category: 'treino' },
        { title: '🐉 O boss te espera', body: 'A preguiça é seu maior inimigo. Derrote-a hoje!', category: 'motivação' },
        { title: '⭐ Bom dia, campeão!', body: 'Hoje é mais um dia para evoluir. Levanta e vai!', category: 'motivação' },
        { title: '🥇 Parabéns pelo esforço!', body: 'Cada treino conta. Você é mais forte do que pensa.', category: 'progresso' },
        { title: '🧠 Mente forte = Corpo forte', body: 'Disciplina supera motivação. Treine mesmo sem vontade.', category: 'mental' },
        { title: '🌟 Novo desafio disponível!', body: 'Confira os novos desafios esperando por você!', category: 'novidade' },
        { title: '📢 Novidade no app!', body: 'Tem coisa nova pra você. Abre o app e confere!', category: 'novidade' },
        { title: '💀 Treino hardcore hoje!', body: 'Dia de sair da zona de conforto. Bora encarar?', category: 'treino' },
    ];

    // Load scheduled notifications from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('admin_scheduled_notifications');
        if (saved) {
            try { setScheduledNotifs(JSON.parse(saved)); } catch (e) { /* ignore */ }
        }
    }, []);

    // Save scheduled notifications
    const saveScheduledNotifs = (notifs) => {
        setScheduledNotifs(notifs);
        localStorage.setItem('admin_scheduled_notifications', JSON.stringify(notifs));
    };

    // Send instant notification
    const sendInstantNotification = () => {
        if (!notifTitle.trim() || !notifBody.trim()) {
            alert('Preencha o título e a mensagem!');
            return;
        }

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification(notifTitle, {
                body: notifBody,
                icon: '/pwa-192x192.png',
                badge: '/pwa-192x192.png',
                vibrate: [200, 100, 200],
                tag: 'admin-notification-' + Date.now(),
            });
        }

        // Also broadcast to other tabs via BroadcastChannel
        try {
            const bc = new BroadcastChannel('admin_notifications');
            bc.postMessage({ type: 'INSTANT', title: notifTitle, body: notifBody, sentAt: new Date().toISOString() });
            bc.close();
        } catch (e) { /* BroadcastChannel not supported */ }

        setNotifSent(true);
        setTimeout(() => setNotifSent(false), 3000);
    };

    // Schedule a notification
    const scheduleNotification = () => {
        if (!notifTitle.trim() || !notifBody.trim()) {
            alert('Preencha o título e a mensagem!');
            return;
        }

        const newNotif = {
            id: Date.now(),
            title: notifTitle,
            body: notifBody,
            time: scheduleTime,
            repeat: scheduleRepeat,
            active: true,
            createdAt: new Date().toISOString()
        };

        const updated = [...scheduledNotifs, newNotif];
        saveScheduledNotifs(updated);
        setNotifTitle('');
        setNotifBody('');
        alert('✅ Notificação agendada para ' + scheduleTime + ' (' + (scheduleRepeat === 'daily' ? 'Diariamente' : scheduleRepeat === 'weekdays' ? 'Dias úteis' : 'Uma vez') + ')');
    };

    // Delete scheduled notification
    const deleteScheduledNotif = (id) => {
        const updated = scheduledNotifs.filter(n => n.id !== id);
        saveScheduledNotifs(updated);
    };

    // Toggle scheduled notification active/inactive
    const toggleScheduledNotif = (id) => {
        const updated = scheduledNotifs.map(n => n.id === id ? { ...n, active: !n.active } : n);
        saveScheduledNotifs(updated);
    };

    // Use template
    const useTemplate = (template) => {
        setNotifTitle(template.title);
        setNotifBody(template.body);
        setShowTemplates(false);
    };

    const handleSaveNew = () => {
        if (!newChallenge.title) return;
        addChallenge(newChallenge);
        setNewChallenge({ title: '', level: 1, xp: 100, locked: false, price: 0, description: '' });
        setShowForm(false);
    };

    const tabs = [
        { id: 'challenges', label: 'Desafios', icon: Trophy },
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'users', label: 'Alunos', icon: Users },
        { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    ];

    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isAdminAuth) {
        return (
            <div className="page-enter" style={{
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <Lock size={48} color="var(--accent)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Acesso Restrito</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Digite a senha de administrador para continuar.</p>

                    <input
                        type="password"
                        placeholder="Senha de acesso"
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setErrorMsg('');
                        }}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--border)',
                            color: '#fff',
                            marginBottom: '16px',
                            textAlign: 'center',
                            fontSize: '16px'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
                                if (passwordInput === adminPass) setIsAdminAuth(true);
                                else setErrorMsg('Senha incorreta! Tente novamente.');
                            }
                        }}
                    />

                    {errorMsg && <p style={{ color: 'var(--accent)', fontSize: '14px', marginBottom: '16px' }}>{errorMsg}</p>}

                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => {
                            const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
                            if (passwordInput === adminPass) setIsAdminAuth(true);
                            else setErrorMsg('Senha incorreta! Tente novamente.');
                        }}
                    >
                        Desbloquear Painel
                    </button>
                </div>
            </div>
        );
    }

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

            {/* === NOTIFICATIONS TAB === */}
            {activeTab === 'notifications' && (
                <div>
                    {/* Instant Send Section */}
                    <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.05))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Send size={22} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Disparar Notificação</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Envie uma mensagem agora ou agende para depois</p>
                            </div>
                        </div>

                        {/* Templates Button */}
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: showTemplates ? 'rgba(123, 47, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${showTemplates ? 'rgba(123, 47, 255, 0.4)' : 'var(--border)'}`,
                                borderRadius: '12px',
                                color: showTemplates ? 'var(--secondary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginBottom: '16px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Copy size={16} />
                            {showTemplates ? 'Fechar Templates' : '📋 Usar Template Pronto'}
                        </button>

                        {/* Templates Grid */}
                        {showTemplates && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '10px',
                                marginBottom: '20px',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                padding: '4px'
                            }}>
                                {notifTemplates.map((t, i) => (
                                    <button
                                        key={i}
                                        onClick={() => useTemplate(t)}
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease',
                                            color: '#fff'
                                        }}
                                        onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
                                    >
                                        <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{t.title}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{t.body}</div>
                                        <span style={{
                                            display: 'inline-block',
                                            marginTop: '8px',
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            padding: '3px 8px',
                                            borderRadius: '100px',
                                            background: t.category === 'treino' ? 'rgba(0,255,136,0.1)' :
                                                t.category === 'motivação' ? 'rgba(255,165,0,0.1)' :
                                                    t.category === 'progresso' ? 'rgba(65,105,225,0.1)' :
                                                        t.category === 'mental' ? 'rgba(155,89,182,0.1)' :
                                                            'rgba(255,51,102,0.1)',
                                            color: t.category === 'treino' ? '#00FF88' :
                                                t.category === 'motivação' ? '#FFA500' :
                                                    t.category === 'progresso' ? '#4169E1' :
                                                        t.category === 'mental' ? '#9B59B6' :
                                                            '#FF3366'
                                        }}>{t.category}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Title Input */}
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TÍTULO</label>
                            <input
                                placeholder="Ex: 💪 Hora de treinar!"
                                value={notifTitle}
                                onChange={e => setNotifTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid var(--border)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '15px'
                                }}
                            />
                        </div>

                        {/* Body Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MENSAGEM</label>
                            <textarea
                                placeholder="Ex: Seu corpo merece atenção hoje. Bora mover!"
                                value={notifBody}
                                onChange={e => setNotifBody(e.target.value)}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid var(--border)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.5'
                                }}
                            />
                        </div>

                        {/* Preview */}
                        {(notifTitle || notifBody) && (
                            <div style={{
                                padding: '16px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                marginBottom: '20px'
                            }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Preview</span>
                                <div style={{ marginTop: '10px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Bell size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{notifTitle || 'Título...'}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{notifBody || 'Mensagem...'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button
                                onClick={sendInstantNotification}
                                disabled={notifSent}
                                className="btn-primary"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    opacity: notifSent ? 0.7 : 1,
                                    background: notifSent ? '#00CC66' : undefined
                                }}
                            >
                                {notifSent ? <><Zap size={18} /> Enviada!</> : <><Send size={18} /> Disparar Agora</>}
                            </button>
                            <button
                                onClick={() => document.getElementById('schedule-section')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    padding: '14px 20px',
                                    background: 'rgba(123, 47, 255, 0.1)',
                                    border: '1px solid rgba(123, 47, 255, 0.3)',
                                    borderRadius: '12px',
                                    color: 'var(--secondary)',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <Calendar size={18} /> Agendar
                            </button>
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div id="schedule-section" className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, rgba(123,47,255,0.2), rgba(123,47,255,0.05))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Clock size={22} color="var(--secondary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Agendar Notificação</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure o horário e a repetição</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>HORÁRIO</label>
                                <input
                                    type="time"
                                    value={scheduleTime}
                                    onChange={e => setScheduleTime(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid var(--border)',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>REPETIÇÃO</label>
                                <select
                                    value={scheduleRepeat}
                                    onChange={e => setScheduleRepeat(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid var(--border)',
                                        color: '#fff',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        appearance: 'none'
                                    }}
                                >
                                    <option value="daily">Diariamente</option>
                                    <option value="weekdays">Dias úteis</option>
                                    <option value="once">Uma vez</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={scheduleNotification}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                background: 'linear-gradient(135deg, var(--secondary), #5B2FCC)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '15px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: '0 4px 15px rgba(123, 47, 255, 0.3)'
                            }}
                        >
                            <Calendar size={18} /> Agendar esta Notificação
                        </button>
                    </div>

                    {/* Scheduled Notifications List */}
                    <div className="glass-panel" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(255,165,0,0.2), rgba(255,165,0,0.05))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <MessageSquare size={22} color="#FFA500" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Programadas</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{scheduledNotifs.length} notificações agendadas</p>
                                </div>
                            </div>
                        </div>

                        {scheduledNotifs.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                color: 'var(--text-muted)'
                            }}>
                                <Bell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                <p style={{ fontSize: '15px', fontWeight: '600' }}>Nenhuma notificação agendada</p>
                                <p style={{ fontSize: '13px', marginTop: '4px' }}>Use o formulário acima para criar a primeira!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {scheduledNotifs.map(n => (
                                    <div key={n.id} style={{
                                        padding: '16px 20px',
                                        background: n.active ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                                        borderRadius: '14px',
                                        border: `1px solid ${n.active ? 'var(--border)' : 'rgba(255,255,255,0.03)'}`,
                                        opacity: n.active ? 1 : 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                        transition: 'all 0.2s'
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.body}</div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: '700',
                                                    padding: '3px 10px', borderRadius: '100px',
                                                    background: 'rgba(123,47,255,0.1)', color: 'var(--secondary)'
                                                }}>
                                                    🕐 {n.time}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px', fontWeight: '600',
                                                    padding: '3px 10px', borderRadius: '100px',
                                                    background: 'rgba(0,255,136,0.1)', color: 'var(--primary)'
                                                }}>
                                                    {n.repeat === 'daily' ? '📅 Diário' : n.repeat === 'weekdays' ? '📅 Dias úteis' : '1️⃣ Uma vez'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                            <button
                                                onClick={() => toggleScheduledNotif(n.id)}
                                                title={n.active ? 'Pausar' : 'Ativar'}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: n.active ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
                                                    border: `1px solid ${n.active ? 'rgba(0,255,136,0.3)' : 'var(--border)'}`,
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    color: n.active ? 'var(--primary)' : 'var(--text-muted)',
                                                    fontWeight: '600',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {n.active ? 'Ativa' : 'Pausada'}
                                            </button>
                                            <button
                                                onClick={() => deleteScheduledNotif(n.id)}
                                                style={{
                                                    padding: '8px 10px',
                                                    background: 'rgba(255, 51, 102, 0.1)',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    color: 'var(--accent)'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
