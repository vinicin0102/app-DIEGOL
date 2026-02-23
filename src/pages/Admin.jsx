import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { supabase } from '../lib/supabaseClient';
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
        { title: '🍎 Disciplina na dieta!', body: 'O treino é 30%, a dieta é 70%. Mantenha o foco!', category: 'dieta' },
        { title: '💧 Hidratação é vida!', body: 'Já bebeu água hoje? Seu corpo precisa para render mais.', category: 'saúde' },
        { title: '🛌 Descanso também é treino', body: 'Não esqueça de dormir bem. É no sono que você evolui.', category: 'saúde' },
        { title: '🧘‍♂️ Momento de foco', body: 'Tire 5 minutos para meditar e visualizar seus objetivos.', category: 'mental' },
    ];

    // Load scheduled notifications and FCM token count
    useEffect(() => {
        const fetchData = async () => {
            // Scheduled notifications
            const { data: schedData, error: schedError } = await supabase.from('scheduled_notifications').select('*');
            if (!schedError && schedData) {
                setScheduledNotifs(schedData.map(n => ({
                    id: n.id,
                    title: n.title,
                    body: n.body,
                    time: n.schedule_time,
                    repeat: n.repeat,
                    active: n.is_active
                })));
            }

            // FCM Tokens Count
            const { count, error: countError } = await supabase
                .from('user_push_tokens')
                .select('*', { count: 'exact', head: true });
            if (!countError) setFcmTokensCount(count || 0);
        };
        fetchData();
    }, []);

    // Send instant mass notification via Realtime/Broadcast
    const sendInstantNotification = async () => {
        if (!notifTitle || !notifBody) return;

        // 1. Send via Supabase Broadcast (Realtime)
        const channel = supabase.channel('mass-notifications');
        await channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.send({
                    type: 'broadcast',
                    event: 'admin-notification',
                    payload: { title: notifTitle, body: notifBody }
                });
            }
        });

        // 2. Log in DB for reference
        await supabase.from('admin_broadcasts').insert([{ title: notifTitle, body: notifBody }]);

        setNotifSent(true);
        setTimeout(() => setNotifSent(false), 3000);
        setNotifTitle('');
        setNotifBody('');
    };

    // Schedule a new notification
    const scheduleNotification = async () => {
        if (!notifTitle || !notifBody) return;

        const { data, error } = await supabase.from('scheduled_notifications').insert([{
            title: notifTitle,
            body: notifBody,
            schedule_time: scheduleTime,
            repeat: scheduleRepeat
        }]).select();

        if (!error && data) {
            setScheduledNotifs(prev => [...prev, {
                id: data[0].id,
                title: notifTitle,
                body: notifBody,
                time: scheduleTime,
                repeat: scheduleRepeat,
                active: true
            }]);
            setNotifTitle('');
            setNotifBody('');
            alert('Notificação agendada com sucesso!');
        }
    };

    // Delete scheduled notification
    const deleteScheduledNotif = async (id) => {
        const { error } = await supabase.from('scheduled_notifications').delete().eq('id', id);
        if (!error) {
            setScheduledNotifs(prev => prev.filter(n => n.id !== id));
        }
    };

    // Toggle scheduled notification active/inactive
    const toggleScheduledNotif = async (id) => {
        const notif = scheduledNotifs.find(n => n.id === id);
        if (!notif) return;

        const { error } = await supabase.from('scheduled_notifications')
            .update({ is_active: !notif.active })
            .eq('id', id);

        if (!error) {
            setScheduledNotifs(prev => prev.map(n => n.id === id ? { ...n, active: !n.active } : n));
        }
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
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '32px',
                background: 'rgba(0,0,0,0.3)',
                padding: '6px',
                borderRadius: '16px',
                width: '100%',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                <style>{`
                    .admin-tabs::-webkit-scrollbar { display: none; }
                `}</style>
                <div className="admin-tabs" style={{ display: 'flex', gap: '8px' }}>
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
                            <p style={{ fontSize: '40px', fontWeight: '900' }}>1</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>DESAFIOS ATIVOS</h4>
                            <p style={{ fontSize: '40px', fontWeight: '900', color: 'var(--primary)' }}>{challenges.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* === NOTIFICATIONS TAB === */}
            {activeTab === 'notifications' && (
                <div>
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
                                <h3 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>Notificações em Massa</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Comunique-se com todos os seus guerreiros</p>
                                    <span style={{
                                        padding: '2px 8px',
                                        background: 'rgba(0, 255, 136, 0.1)',
                                        color: 'var(--primary)',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        border: '1px solid rgba(0, 255, 136, 0.2)'
                                    }}>
                                        {fcmTokensCount} DISPOSITIVOS
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: showTemplates ? 'linear-gradient(135deg, rgba(123, 47, 255, 0.2), rgba(123, 47, 255, 0.1))' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${showTemplates ? 'var(--secondary)' : 'var(--border)'}`,
                                borderRadius: '16px',
                                color: showTemplates ? '#fff' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '20px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: showTemplates ? '0 0 20px rgba(123, 47, 255, 0.2)' : 'none'
                            }}
                        >
                            <Copy size={20} />
                            {showTemplates ? 'Ocultar Sugestões' : '📋 Ver Mensagens Predefinidas'}
                        </button>

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
                                            background: 'rgba(0,255,136,0.1)',
                                            color: '#00FF88'
                                        }}>{t.category}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>TÍTULO</label>
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

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase' }}>MENSAGEM</label>
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
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button
                                onClick={sendInstantNotification}
                                disabled={notifSent || !notifTitle || !notifBody}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                {notifSent ? 'Enviada!' : <><Send size={18} /> Disparar Agora</>}
                            </button>
                            <button
                                onClick={scheduleNotification}
                                disabled={!notifTitle || !notifBody}
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
                    <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, rgba(123,47,255,0.2), rgba(123,47,255,0.05))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Clock size={22} color="var(--secondary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Configurações de Agendamento</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Horário padrão para as mensagens agendadas</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>HORÁRIO</label>
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
                                        borderRadius: '12px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: '600' }}>REPETIÇÃO</label>
                                <select
                                    value={scheduleRepeat}
                                    onChange={e => setScheduleRepeat(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid var(--border)',
                                        color: '#fff',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <option value="daily">Diário</option>
                                    <option value="weekdays">Dias úteis</option>
                                    <option value="once">Uma vez</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Scheduled List */}
                    <div className="glass-panel" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Mensagens Agendadas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {scheduledNotifs.map(n => (
                                <div key={n.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '14px' }}>{n.title}</h4>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{n.time} - {n.repeat}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => toggleScheduledNotif(n.id)} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: n.active ? 'var(--primary)' : '#666' }}>
                                            {n.active ? <Bell size={16} /> : <Bell size={16} style={{ opacity: 0.5 }} />}
                                        </button>
                                        <button onClick={() => deleteScheduledNotif(n.id)} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 51, 102, 0.1)', border: 'none', color: 'var(--accent)' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {scheduledNotifs.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Nenhum agendamento ativo.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
