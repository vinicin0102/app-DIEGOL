import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
    Edit2, Trash2, Plus, Save, X, Users, Trophy,
    ChevronDown, Lock, Unlock, Settings, BarChart3,
    Bell, Send, Calendar, Clock, Loader
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Admin = ({ superMail }) => {
    const { challenges, addChallenge, updateChallenge, deleteChallenge, user, session } = useGame();
    const [activeTab, setActiveTab] = useState('challenges');
    const [showForm, setShowForm] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '', level: 1, xp: 100, locked: false, price: 0, description: ''
    });

    // Notification States
    const [notifTitle, setNotifTitle] = useState('');
    const [notifBody, setNotifBody] = useState('');
    const [notifSent, setNotifSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [deviceCount, setDeviceCount] = useState(0);

    const handleSaveNew = () => {
        if (!newChallenge.title) return;
        addChallenge(newChallenge);
        setNewChallenge({ title: '', level: 1, xp: 100, locked: false, price: 0, description: '' });
        setShowForm(false);
    };

    const tabs = [
        { id: 'challenges', label: 'Desafios', icon: Trophy },
        { id: 'users', label: 'Alunos', icon: Users },
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    ];

    // Contagem de dispositivos inscritos via Supabase
    useEffect(() => {
        const fetchDevices = async () => {
            if (activeTab === 'notifications') {
                const { count, error } = await supabase
                    .from('notification_subscriptions')
                    .select('*', { count: 'exact', head: true });
                if (!error) setDeviceCount(count || 0);
            }
        };
        fetchDevices();
    }, [activeTab]);

    const sendInstantNotification = async () => {
        if (!notifTitle || !notifBody) return;
        setSending(true);

        try {
            // 1. Tentar chamar a Edge Function (produção)
            let edgeFunctionWorked = false;
            try {
                const { data, error: functionError } = await supabase.functions.invoke('mass-push', {
                    body: { title: notifTitle, body: notifBody }
                });
                if (!functionError) {
                    edgeFunctionWorked = true;
                    console.log('Edge Function respondeu:', data);
                }
            } catch (e) {
                console.warn('Edge Function não disponível, usando fallback local:', e.message);
            }

            // 2. Fallback: Enviar notificação local via Service Worker (teste direto)
            if (!edgeFunctionWorked) {
                if ('serviceWorker' in navigator && Notification.permission === 'granted') {
                    const registration = await navigator.serviceWorker.ready;
                    await registration.showNotification(notifTitle, {
                        body: notifBody,
                        icon: '/pwa-192x192.png',
                        badge: '/pwa-192x192.png',
                        vibrate: [200, 100, 200],
                        tag: 'admin-test-' + Date.now()
                    });
                    console.log('Notificação de teste enviada via Service Worker local.');
                } else {
                    // Último recurso: Notification API direta
                    new Notification(notifTitle, { body: notifBody });
                }
            }

            // 3. Registrar no histórico (ignora erros de tabela inexistente)
            try {
                await supabase.from('mass_notifications').insert([{
                    title: notifTitle,
                    body: notifBody
                }]);
            } catch (dbErr) {
                console.warn('Histórico não salvo (tabela pode não existir):', dbErr.message);
            }

            setNotifSent(true);
            setTimeout(() => {
                setNotifSent(false);
                setNotifTitle('');
                setNotifBody('');
            }, 3000);

            alert(edgeFunctionWorked
                ? '✅ Notificação enviada para TODOS os dispositivos!'
                : '✅ Notificação de teste enviada localmente! (Para envio em massa, implante a Edge Function no Supabase)');
        } catch (err) {
            console.error("Erro ao enviar:", err);
            alert("Erro ao disparar notificações: " + err.message);
        } finally {
            setSending(false);
        }
    };


    // Verificação de Admin: Segurança Máxima via Email Hardcoded + Banco
    const isSuperAdmin = session?.user?.email === superMail;
    const hasAdminAccess = isSuperAdmin || (user && user.isAdmin);

    if (!hasAdminAccess) {
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
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Esta área é exclusiva para administradores verificados.
                    </p>

                    <div style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        fontSize: '13px',
                        color: '#888',
                        textAlign: 'left'
                    }}>
                        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Como acessar?</p>
                        <ol style={{ paddingLeft: '20px' }}>
                            <li>Certifique-se de estar logado.</li>
                            <li>Sua conta deve ter a permissão <code>is_admin</code> no banco de dados.</li>
                        </ol>
                    </div>

                    <button
                        className="btn-secondary"
                        style={{ width: '100%', marginTop: '24px' }}
                        onClick={() => window.history.back()}
                    >
                        Voltar
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '16px', width: 'fit-content', overflowX: 'auto', maxWidth: '100%' }}>
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
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
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
                            {/* Static examples for UI */}
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
                        </tbody>
                    </table>
                </div>
            )}

            {/* === NOTIFICATIONS TAB === */}
            {activeTab === 'notifications' && (
                <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                    <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, var(--primary), #00DDAA)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 20px var(--primary-glow)'
                                }}>
                                    <Send size={24} color="#000" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>Notificações em Massa</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Comunique-se com todos os seus guerreiros</p>
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(0, 255, 136, 0.1)',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(0, 255, 136, 0.2)',
                                textAlign: 'center'
                            }}>
                                <span style={{ display: 'block', fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>{deviceCount}</span>
                                <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Dispositivos</span>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Título da Mensagem</label>
                            <input
                                placeholder="Ex: 🔋 Hora de treinar!"
                                value={notifTitle}
                                onChange={e => setNotifTitle(e.target.value)}
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

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Conteúdo da Mensagem</label>
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
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            disabled={sending || !notifTitle || !notifBody}
                            onClick={sendInstantNotification}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px' }}
                        >
                            {sending ? <Loader size={20} className="spin" /> : notifSent ? 'MENSAGEM ENVIADA!' : <><Send size={18} /> DISPARAR PARA TODOS</>}
                        </button>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.1)' }}>
                        <h4 style={{ color: '#FFA500', fontSize: '14px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Atenção: Sistema PWA
                        </h4>
                        <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
                            As notificações serão entregues a todos os usuários que habilitaram os incentivos diários em seus perfis e instalaram o aplicativo na tela inicial.
                        </p>
                    </div>
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
