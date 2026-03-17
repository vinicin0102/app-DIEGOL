import React, { useState } from 'react';
import { Target, AlertCircle, Clock, CheckCircle2, Plus, Trash2, Calendar } from 'lucide-react';

const MatrixQuadrant = ({ title, subtitle, color, tasks, onAddTask, onRemoveTask, type }) => (
    <div className="glass-panel" style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        border: `1px solid ${color}33`,
        background: `linear-gradient(135deg, ${color}08, transparent)`,
        minHeight: '250px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: color }}>{title}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{subtitle}</p>
            </div>
            <button 
                onClick={() => onAddTask(type)}
                style={{ 
                    padding: '6px', 
                    borderRadius: '8px', 
                    background: `${color}22`, 
                    border: 'none', 
                    cursor: 'pointer',
                    color: color
                }}
            >
                <Plus size={18} />
            </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#444', fontStyle: 'italic', marginTop: '20px', textAlign: 'center' }}>Vazio...</p>
            ) : (
                tasks.map((task, idx) => (
                    <div key={idx} style={{ 
                        padding: '12px 16px', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '13px', color: '#eee' }}>{task}</span>
                        <button 
                            onClick={() => onRemoveTask(type, idx)}
                            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))
            )}
        </div>
    </div>
);

const PriorityMatrix = () => {
    const [tasks, setTasks] = useState({
        important_urgent: ['Treino A', 'Beber 2L Água'],
        important_not_urgent: ['Planejar semana', 'Leitura 20min'],
        not_important_urgent: ['Responder e-mails', 'Limpar área'],
        not_important_not_urgent: ['Redes sociais', 'TV'],
    });

    const handleAddTask = (type) => {
        const text = prompt('O que você precisa fazer?');
        if (text) {
            setTasks({ ...tasks, [type]: [...tasks[type], text] });
        }
    };

    const handleRemoveTask = (type, idx) => {
        const newTasks = [...tasks[type]];
        newTasks.splice(idx, 1);
        setTasks({ ...tasks, [type]: newTasks });
    };

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
                    Matriz de <span className="text-gradient">Prioridades</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Mantenha o foco no que realmente importa na sua evolução</p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px' 
            }}>
                <MatrixQuadrant 
                    type="important_urgent"
                    title="Fazer Agora"
                    subtitle="IMPORTANTE + URGENTE"
                    color="#FF3366"
                    tasks={tasks.important_urgent}
                    onAddTask={handleAddTask}
                    onRemoveTask={handleRemoveTask}
                />
                <MatrixQuadrant 
                    type="important_not_urgent"
                    title="Programar"
                    subtitle="IMPORTANTE + NÃO URGENTE"
                    color="#00EEFF"
                    tasks={tasks.important_not_urgent}
                    onAddTask={handleAddTask}
                    onRemoveTask={handleRemoveTask}
                />
                <MatrixQuadrant 
                    type="not_important_urgent"
                    title="Delegar"
                    subtitle="URGENTE + NÃO IMPORTANTE"
                    color="#FFBB00"
                    tasks={tasks.not_important_urgent}
                    onAddTask={handleAddTask}
                    onRemoveTask={handleRemoveTask}
                />
                <MatrixQuadrant 
                    type="not_important_not_urgent"
                    title="Eliminar"
                    subtitle="NÃO URGENTE + NÃO IMPORTANTE"
                    color="#888888"
                    tasks={tasks.not_important_not_urgent}
                    onAddTask={handleAddTask}
                    onRemoveTask={handleRemoveTask}
                />
            </div>

            <div className="glass-panel" style={{ marginTop: '48px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <Calendar size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Dica de Produtividade</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
                    Guerreiros de elite focam 80% do seu tempo no quadrante <strong style={{ color: '#00EEFF' }}>Programar</strong>. 
                    Isso evita que tarefas importantes se tornem urgentes e gerem estresse. 
                    O que você pode planejar hoje para facilitar seu amanhã?
                </p>
            </div>
        </div>
    );
};

export default PriorityMatrix;
