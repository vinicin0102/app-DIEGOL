import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
    Edit2, Trash2, Plus, Save, X, Users, Trophy,
    ChevronDown, Lock, Unlock, Settings, BarChart3,
    Bell, Send, Calendar, Clock, Loader
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { BOSS_MESSAGES, MOTIVATIONAL_MESSAGES, WATER_MESSAGES, getScheduledMessage } from '../data/notificationMessages';

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
    const [scheduleDate, setScheduleDate] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduledList, setScheduledList] = useState([]);
    const [scheduleBatch, setScheduleBatch] = useState([]);
    const [notifTemplates, setNotifTemplates] = useState([]);
    const [whitelist, setWhitelist] = useState([]);
    const [newWhitelistEmail, setNewWhitelistEmail] = useState('');

    const handleSaveNew = () => {
        if (!newChallenge.title) return;
        addChallenge(newChallenge);
        setNewChallenge({ title: '', level: 1, xp: 100, locked: false, price: 0, description: '' });
        setShowForm(false);
    };

    const tabs = [
        { id: 'challenges', label: 'Desafios', icon: Trophy },
        { id: 'users', label: 'Alunos', icon: Users },
        { id: 'whitelist', label: 'Acessos', icon: Unlock },
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    ];

    // Contagem de dispositivos e lista de agendados
    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === 'notifications') {
                // Contagem de dispositivos
                const { count } = await supabase
                    .from('notification_subscriptions')
                    .select('*', { count: 'exact', head: true });
                setDeviceCount(count || 0);

                // Lista de agendamentos pendentes
                const { data: scheduled } = await supabase
                    .from('scheduled_notifications')
                    .select('*')
                    .eq('status', 'pending')
                    .order('schedule_at', { ascending: true });
                setScheduledList(scheduled || []);

                const { data: templates } = await supabase
                    .from('notification_templates')
                    .select('*')
                    .order('created_at', { ascending: true });
                setNotifTemplates(templates || []);
            }

            if (activeTab === 'whitelist') {
                // Carregar Whitelist
                const { data: authList } = await supabase
                    .from('authorized_emails')
                    .select('*')
                    .order('created_at', { descending: true });
                setWhitelist(authList || []);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // Atualiza a cada 30s
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleScheduleNotification = async () => {
        if (!notifTitle || !notifBody || scheduleBatch.length === 0) {
            alert('Preencha título, corpo e adicione pelo menos um horário.');
            return;
        }

        setSending(true);
        try {
            const nowIso = new Date().toISOString();
            
            // 1. Limpar conflitos exatos para as datas que estamos inserindo
            const scheduleDates = scheduleBatch.map(dt => new Date(dt).toISOString());
            await supabase.from('scheduled_notifications')
                .delete()
                .eq('status', 'pending')
                .in('schedule_at', scheduleDates);

            const rows = scheduleBatch.map(dt => ({
                title: notifTitle,
                body: notifBody,
                schedule_at: new Date(dt).toISOString(),
                status: 'pending'
            }));

            const { error } = await supabase
                .from('scheduled_notifications')
                .insert(rows);

            if (error) throw error;

            alert(`✅ ${rows.length} agendamento(s) criado(s) com sucesso!`);
            setNotifTitle('');
            setNotifBody('');
            setScheduleDate('');
            setScheduleBatch([]);
            setIsScheduling(false);

            // Recarregar lista
            const { data } = await supabase
                .from('scheduled_notifications')
                .select('*')
                .eq('status', 'pending')
                .order('schedule_at', { ascending: true });
            setScheduledList(data || []);

        } catch (err) {
            alert('Erro ao agendar: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    const deleteScheduled = async (id) => {
        if (!confirm('Deseja cancelar este agendamento?')) return;
        const { error } = await supabase.from('scheduled_notifications').delete().eq('id', id);
        if (!error) {
            setScheduledList(prev => prev.filter(n => n.id !== id));
        }
    };

    const handleAutoSchedule = async (days = 7) => {
        if (!confirm(`Isso irá agendar notificações de hora em hora (06h às 00h) pelos próximos ${days} dias. Confirmar?`)) return;
        
        setSending(true);
        try {
            const newRows = [];
            const now = new Date();
            
            // Limpar agendamentos AUTOMÁTICOS futuros para evitar duplicatas
            const startRange = new Date(now);
            const endRange = new Date(now);
            endRange.setDate(now.getDate() + days);
            
            await supabase.from('scheduled_notifications')
                .delete()
                .eq('status', 'pending')
                .gte('schedule_at', startRange.toISOString())
                .lte('schedule_at', endRange.toISOString());
            
            for (let d = 0; d < days; d++) {
                const targetDay = new Date(now);
                targetDay.setDate(now.getDate() + d);
                
                // Horários de 06:00 até 00:00 (próximo dia)
                for (let h = 6; h <= 24; h++) {
                    const scheduleTime = new Date(targetDay);
                    scheduleTime.setHours(h === 24 ? 0 : h, 0, 0, 0);
                    if (h === 24) scheduleTime.setDate(scheduleTime.getDate() + 1);

                    // Pular horários que já passaram hoje
                    if (scheduleTime <= now) continue;

                    const msgData = getScheduledMessage(h === 24 ? 0 : h);
                    if (!msgData) continue;

                    newRows.push({
                        title: `${msgData.icon} ${msgData.type}`,
                        body: msgData.message,
                        schedule_at: scheduleTime.toISOString(),
                        status: 'pending'
                    });

                    // Adicionar lembrete de água a cada 2 horas (horas pares) - DESLOCADO :30 para não duplicar no visor
                    if (h % 2 === 0) {
                        const waterIndex = Math.floor(h / 2) % WATER_MESSAGES.length;
                        const waterTime = new Date(scheduleTime);
                        waterTime.setMinutes(30);

                        newRows.push({
                            title: `💧 HIDRATAÇÃO`,
                            body: WATER_MESSAGES[waterIndex],
                            schedule_at: waterTime.toISOString(),
                            status: 'pending'
                        });
                    }
                }
            }

            if (newRows.length === 0) {
                alert('Nenhum horário futuro encontrado para agendar.');
                return;
            }

            const { error } = await supabase
                .from('scheduled_notifications')
                .insert(newRows);

            if (error) throw error;

            alert(`✅ ${newRows.length} notificações agendadas com sucesso para os próximos ${days} dias!`);
            
            // Recarregar lista
            const { data } = await supabase
                .from('scheduled_notifications')
                .select('*')
                .eq('status', 'pending')
                .order('schedule_at', { ascending: true });
            setScheduledList(data || []);

        } catch (err) {
            console.error(err);
            alert('Erro ao agendar automaticamente: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    const sendInstantNotification = async () => {
        if (!notifTitle || !notifBody) return;
        setSending(true);

        try {
            // 1. Buscar todas as inscrições do banco de dados
            const { data: subscriptions, error: subError } = await supabase
                .from('notification_subscriptions')
                .select('subscription');

            const totalSubs = subscriptions?.length || 0;
            console.log(`Total de inscrições encontradas: ${totalSubs}`);

            // 2. Tentar enviar via Edge Function
            let edgeFunctionWorked = false;
            let edgeResult = null;

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mass-push`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                        },
                        body: JSON.stringify({ title: notifTitle, body: notifBody })
                    }
                );

                if (response.ok) {
                    edgeResult = await response.json();
                    edgeFunctionWorked = edgeResult?.sent > 0;
                    console.log('Edge Function respondeu:', edgeResult);
                } else {
                    const errorText = await response.text();
                    console.warn(`Edge Function respondeu com status ${response.status}:`, errorText);
                }
            } catch (e) {
                console.warn('Edge Function indisponível:', e.message);
            }

            // 3. Sempre enviar notificação local para o admin (como feedback)
            if ('serviceWorker' in navigator && Notification.permission === 'granted') {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(notifTitle, {
                    body: notifBody,
                    icon: '/pwa-192x192.png',
                    badge: '/pwa-192x192.png',
                    vibrate: [200, 100, 200],
                    tag: 'admin-broadcast-' + Date.now()
                });
            }

            // 4. Registrar no histórico
            try {
                await supabase.from('mass_notifications').insert([{
                    title: notifTitle,
                    body: notifBody
                }]);
            } catch (dbErr) {
                console.warn('Histórico não salvo:', dbErr.message);
            }

            setNotifSent(true);
            setTimeout(() => {
                setNotifSent(false);
                setNotifTitle('');
                setNotifBody('');
            }, 3000);

            if (edgeFunctionWorked) {
                alert(`✅ Notificação enviada para ${edgeResult?.sent || totalSubs} dispositivo(s)!`);
            } else {
                alert(`✅ Notificação enviada localmente!\n\n📊 ${totalSubs} dispositivo(s) inscritos no banco.\n\n⚠️ O envio push em massa requer que a Edge Function esteja funcionando. Verifique os logs no Dashboard do Supabase.`);
            }
        } catch (err) {
            console.error("Erro ao enviar:", err);
            alert("Erro ao disparar notificações: " + err.message);
        } finally {
            setSending(false);
        }
    };


    // Verificação de Admin: Desativada para tornar o painel público
    const hasAdminAccess = true;

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
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                className="btn-secondary"
                                style={{ flex: 1, padding: '12px', fontSize: '13px' }}
                                onClick={async () => {
                                    if(confirm('Isso vai tentar reenviar todas as notificações que falharam hoje. Continuar?')) {
                                        const { error } = await supabase
                                            .from('scheduled_notifications')
                                            .update({ status: 'pending' })
                                            .eq('status', 'failed')
                                            .gte('schedule_at', new Date().toISOString());
                                        
                                        if(!error) alert('Notificações resetadas para pendente! O servidor tentará enviar na próxima execução.');
                                        else alert('Erro ao resetar: ' + error.message);
                                    }
                                }}
                            >
                                Reenviar Falhas de Hoje
                            </button>
                            <button
                                className="btn-hero-primary"
                                style={{ flex: 1, padding: '12px', fontSize: '13px' }}
                                onClick={handleAutoSchedule}
                            >
                                Gerar Próximos 7 Dias
                            </button>
                        </div>
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

            {/* === WHITELIST TAB === */}
            {activeTab === 'whitelist' && (
                <div className="glass-panel" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontWeight: '700' }}>Controle de Acessos (Whitelist)</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                             <input 
                                placeholder="E-mail do aluno..."
                                style={{ 
                                    padding: '10px 14px', 
                                    background: 'rgba(0,0,0,0.4)', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '10px', 
                                    color: '#fff',
                                    fontSize: '13px'
                                }}
                                value={newWhitelistEmail}
                                onChange={e => setNewWhitelistEmail(e.target.value)}
                             />
                             <button className="btn-primary" 
                                style={{ padding: '8px 16px', fontSize: '13px' }}
                                onClick={async () => {
                                 if (!newWhitelistEmail) return;
                                 const normalizedEmail = newWhitelistEmail.toLowerCase().trim();
                                 const { error } = await supabase.from('authorized_emails').insert([{ email: normalizedEmail }]);
                                 if(!error) {
                                     setWhitelist([{ email: normalizedEmail, created_at: new Date().toISOString() }, ...whitelist]);
                                     setNewWhitelistEmail('');
                                     alert('E-mail autorizado com sucesso!');
                                 } else {
                                     if (error.code === '23505') alert('Este e-mail já está na lista!');
                                     else alert('Erro ao adicionar: ' + error.message);
                                 }
                             }}>Liberar</button>
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="custom-scroll">
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>E-mail Autorizado</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Data de Liberação</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {whitelist.length === 0 && (
                                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum e-mail liberado manualmente ainda.</td></tr>
                                )}
                                {whitelist.map(w => (
                                    <tr key={w.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{w.email}</td>
                                        <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(w.created_at || new Date()).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            <button 
                                                onClick={async () => {
                                                    if(confirm(`Revogar acesso de ${w.email}?`)) {
                                                        const { error } = await supabase.from('authorized_emails').delete().eq('email', w.email);
                                                        if(!error) setWhitelist(prev => prev.filter(x => x.email !== w.email));
                                                    }
                                                }}
                                                style={{ background: 'rgba(255,51,102,0.1)', border: 'none', borderRadius: '6px', color: 'var(--accent)', cursor: 'pointer', padding: '6px' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Mande incentivos aos seus guerreiros</p>
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

                        {/* Biblioteca de Frases Preprontas */}
                        <div style={{ marginBottom: '32px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>📚 Biblioteca de Frases (Pre-prontas)</h4>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                {/* Chefão */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '18px' }}>💀</span>
                                        <span style={{ fontWeight: '800', fontSize: '12px', color: 'var(--accent)' }}>FRASES DO CHEFÃO</span>
                                    </div>
                                    <div style={{ height: '150px', overflowY: 'auto', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }} className="custom-scroll">
                                        {BOSS_MESSAGES.map((msg, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setNotifTitle('💀 MENSAGEM DO CHEFÃO'); setNotifBody(msg); }}
                                                style={{ textAlign: 'left', padding: '8px 12px', background: 'rgba(255,51,102,0.05)', border: '1px solid rgba(255,51,102,0.1)', borderRadius: '8px', color: '#eee', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Motivacional */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '18px' }}>⚡</span>
                                        <span style={{ fontWeight: '800', fontSize: '12px', color: 'var(--primary)' }}>FRASES MOTIVACIONAIS</span>
                                    </div>
                                    <div style={{ height: '150px', overflowY: 'auto', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }} className="custom-scroll">
                                        {MOTIVATIONAL_MESSAGES.map((msg, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setNotifTitle('⚡ INCENTIVO DIÁRIO'); setNotifBody(msg); }}
                                                style={{ textAlign: 'left', padding: '8px 12px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: '8px', color: '#eee', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Hidratação */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '18px' }}>💧</span>
                                        <span style={{ fontWeight: '800', fontSize: '12px', color: '#00D4FF' }}>LEMBRETES DE ÁGUA</span>
                                    </div>
                                    <div style={{ height: '150px', overflowY: 'auto', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }} className="custom-scroll">
                                        {WATER_MESSAGES.map((msg, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setNotifTitle('💧 BEBA ÁGUA!'); setNotifBody(msg); }}
                                                style={{ textAlign: 'left', padding: '8px 12px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '8px', color: '#eee', fontSize: '11px', cursor: 'pointer' }}
                                            >
                                                {msg}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Predefined Templates */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '800', textTransform: 'uppercase' }}>💡 Modelos Salvos</label>
                                <button
                                    onClick={async () => {
                                        if (!notifTitle || !notifBody) return alert('Escreva um título e corpo primeiro!');
                                        const { data, error } = await supabase.from('notification_templates').insert([{ title: notifTitle, body: notifBody }]).select();
                                        if (!error) {
                                            setNotifTemplates(prev => [...prev, data[0]]);
                                            alert('Modelo salvo com sucesso!');
                                        }
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}
                                >
                                    + SALVAR ATUAL COMO MODELO
                                </button>
                                <button
                                    onClick={() => handleAutoSchedule(7)}
                                    disabled={sending}
                                    style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '10px', fontWeight: '800', cursor: 'pointer', padding: '4px 10px', borderRadius: '6px' }}
                                >
                                    🚀 GERAR AUTOMÁTICO (7 DIAS)
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {notifTemplates.length === 0 && (
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Nenhum modelo salvo ainda.</span>
                                )}
                                {notifTemplates.map((temp) => (
                                    <div key={temp.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <button
                                            onClick={() => { setNotifTitle(temp.title); setNotifBody(temp.body); }}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                background: 'rgba(255,255,255,0.05)',
                                                color: '#fff',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                paddingRight: '25px'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        >
                                            {temp.title}
                                        </button>
                                        <span
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (confirm('Excluir este modelo?')) {
                                                    await supabase.from('notification_templates').delete().eq('id', temp.id);
                                                    setNotifTemplates(prev => prev.filter(t => t.id !== temp.id));
                                                }
                                            }}
                                            style={{ position: 'absolute', right: '8px', color: '#ff4444', fontSize: '12px', cursor: 'pointer', fontWeight: '900' }}
                                        >
                                            ×
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Título da Mensagem</label>
                            <input
                                placeholder="Título chamativo..."
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

                        <div className="form-group" style={{ marginBottom: '25px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Conteúdo da Mensagem</label>
                            <textarea
                                placeholder="Conteúdo da notificação..."
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(180px, 0.8fr)', gap: '12px', marginBottom: '24px' }}>
                            <button
                                className="btn-primary"
                                disabled={sending || !notifTitle || !notifBody}
                                onClick={sendInstantNotification}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px' }}
                            >
                                {sending && !isScheduling ? <Loader size={20} className="spin" /> : notifSent ? 'ENVIADO!' : <><Send size={18} /> DISPARAR AGORA</>}
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={() => setIsScheduling(!isScheduling)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px',
                                    background: isScheduling ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    border: isScheduling ? '1px solid var(--primary)' : '1px dashed rgba(255,255,255,0.2)'
                                }}
                            >
                                <Clock size={18} /> {isScheduling ? 'CANCELAR AGEND.' : 'AGENDAR...'}
                            </button>
                        </div>

                        {isScheduling && (
                            <div style={{
                                animation: 'fadeIn 0.3s ease',
                                padding: '20px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                border: '1px solid var(--primary-glow)',
                                marginBottom: '24px'
                            }}>
                                <label style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '8px', display: 'block', fontWeight: '800' }}>
                                    📅 ADICIONE HORÁRIOS:
                                </label>

                                {/* Quick Combos */}
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Hoje (Lembretes)', times: ['08:00', '13:00', '20:00'], dayOffset: 0 },
                                        { label: 'Amanhã (Manhã)', times: ['07:00'], dayOffset: 1 },
                                        { label: 'Semana (08:00)', times: ['08:00'], days: 7 }
                                    ].map((combo, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const now = new Date();
                                                const newTimes = [];
                                                if (combo.days) {
                                                    for (let i = 1; i <= combo.days; i++) {
                                                        const d = new Date(); d.setDate(d.getDate() + i);
                                                        combo.times.forEach(t => {
                                                            const [h, m] = t.split(':');
                                                            d.setHours(parseInt(h), parseInt(m), 0, 0);
                                                            newTimes.push(d.toISOString().slice(0, 16));
                                                        });
                                                    }
                                                } else {
                                                    const d = new Date(); d.setDate(d.getDate() + combo.dayOffset);
                                                    combo.times.forEach(t => {
                                                        const [h, m] = t.split(':');
                                                        const specificDate = new Date(d);
                                                        specificDate.setHours(parseInt(h), parseInt(m), 0, 0);
                                                        newTimes.push(specificDate.toISOString().slice(0, 16));
                                                    });
                                                }
                                                setScheduleBatch(prev => [...new Set([...prev, ...newTimes])]);
                                            }}
                                            style={{
                                                fontSize: '10px', padding: '5px 10px', borderRadius: '20px',
                                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)',
                                                color: '#aaa', cursor: 'pointer'
                                            }}
                                        >
                                            ⚡ {combo.label}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <input
                                        type="datetime-local"
                                        value={scheduleDate}
                                        onChange={e => setScheduleDate(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: '#000',
                                            border: '1px solid var(--border)',
                                            color: '#fff',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (!scheduleDate) return;
                                            setScheduleBatch(prev => [...prev, scheduleDate]);
                                            setScheduleDate('');
                                        }}
                                        style={{
                                            padding: '12px 18px',
                                            background: 'var(--primary)',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '800',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + ADD
                                    </button>
                                </div>

                                {scheduleBatch.length > 0 && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
                                            {scheduleBatch.length} horário(s) adicionado(s):
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {scheduleBatch.map((dt, i) => (
                                                <span key={i} style={{
                                                    padding: '4px 10px',
                                                    background: 'rgba(0,255,136,0.1)',
                                                    border: '1px solid rgba(0,255,136,0.2)',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    color: 'var(--primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {new Date(dt).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                    <span
                                                        onClick={() => setScheduleBatch(prev => prev.filter((_, j) => j !== i))}
                                                        style={{ cursor: 'pointer', color: '#ff4444', fontWeight: '900' }}
                                                    >×</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="btn-primary"
                                    disabled={sending || scheduleBatch.length === 0 || !notifTitle || !notifBody}
                                    onClick={handleScheduleNotification}
                                    style={{ width: '100%', background: 'var(--primary)', color: '#000' }}
                                >
                                    {sending ? <Loader size={18} className="spin" /> : `AGENDAR ${scheduleBatch.length} NOTIFICAÇÃO(ÕES)`}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Scheduled List - Grouped by Day */}
                    {scheduledList.length > 0 && (() => {
                        const grouped = {};
                        scheduledList.forEach(n => {
                            const d = new Date(n.schedule_at);
                            const key = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
                            if (!grouped[key]) grouped[key] = [];
                            grouped[key].push(n);
                        });

                        return (
                            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} color="var(--primary)" /> PROGRAMADAS ({scheduledList.length})
                                </h4>
                                {Object.entries(grouped).map(([dayLabel, notifs]) => (
                                    <div key={dayLabel} style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '12px', fontWeight: '800', color: 'var(--primary)',
                                            marginBottom: '8px', textTransform: 'capitalize',
                                            paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            📅 {dayLabel}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {notifs.map(notif => (
                                                <div key={notif.id} style={{
                                                    padding: '10px 14px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{
                                                            fontSize: '13px', fontWeight: '800', color: '#fff',
                                                            background: 'rgba(0,255,136,0.15)', padding: '3px 8px', borderRadius: '6px',
                                                            minWidth: '50px', textAlign: 'center'
                                                        }}>
                                                            {new Date(notif.schedule_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <div>
                                                            <div style={{ fontWeight: '700', fontSize: '12px' }}>{notif.title}</div>
                                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{notif.body.length > 50 ? notif.body.substring(0, 50) + '...' : notif.body}</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteScheduled(notif.id)}
                                                        style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '5px' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

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
