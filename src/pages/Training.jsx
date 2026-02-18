import React, { useState } from 'react';
import {
    Play, Clock, Repeat, Dumbbell, ChevronRight, Utensils,
    Flame, User, Info, Trophy, Zap, Activity
} from 'lucide-react';
import './Training.css';

const Training = () => {
    const [activeTab, setActiveTab] = useState('male'); // 'male', 'female', 'hiit', 'diet'

    // Dados do Treino Masculino
    const maleWorkouts = {
        title: "Protocolo Masculino",
        subtitle: "Foco em Hipertrofia e Força",
        color: "#FF5500",
        protocol: {
            series: "4 séries por exercício",
            reps: "10 a 12 repetições",
            rest: "1:30 min descanso",
            sequence: "A → B → C (Repetir)"
        },
        days: [
            {
                id: 'A',
                title: 'TREINO A',
                subtitle: 'Segunda-feira',
                focus: 'PEITO • TRÍCEPS • OMBRO',
                mobility: [
                    'Mobilidade de ombro (elástico/bastão) – 2x12',
                    'Mobilidade dinâmica ajoelhado – 2x12'
                ],
                exercises: [
                    { name: 'Supino com halteres', muscle: 'Peito', sets: '4', reps: '10-12' },
                    { name: 'Elevação frontal', muscle: 'Ombro', sets: '4', reps: '10-12' },
                    { name: 'Tríceps corda', muscle: 'Tríceps', sets: '4', reps: '10-12' },
                    { name: 'Encolhimento', muscle: 'Trapézio', sets: '4', reps: '10-12' },
                    { name: 'Agachamento sumô', muscle: 'Pernas (Estímulo)', sets: '4', reps: '10-12' }
                ],
                final: '20min Cardio ou HIIT'
            },
            {
                id: 'B',
                title: 'TREINO B',
                subtitle: 'Terça-feira',
                focus: 'COSTAS • BÍCEPS',
                mobility: [
                    'Mobilidade de ombro – 2x12',
                    'Gato e Vaca (Coluna) – 2x15'
                ],
                exercises: [
                    { name: 'Remada baixa triângulo', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Pulley frente', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Rosca direta halteres', muscle: 'Bíceps', sets: '4', reps: '10-12' },
                    { name: 'Rosca martelo', muscle: 'Bíceps', sets: '4', reps: '10-12' },
                    { name: 'Leg Press', muscle: 'Pernas (Estímulo)', sets: '4', reps: '10-12' }
                ],
                final: '20min Cardio ou HIIT'
            },
            {
                id: 'C',
                title: 'TREINO C',
                subtitle: 'Quarta-feira',
                focus: 'PERNAS COMPLETO',
                mobility: [
                    'Mobilidade de quadril – 2x15',
                    'Agachamento profundo (só peso corpo) – 2x15'
                ],
                exercises: [
                    { name: 'Agachamento Livre/Smith', muscle: 'Quadríceps', sets: '4', reps: '10-12' },
                    { name: 'Cadeira Extensora', muscle: 'Quadríceps', sets: '4', reps: 'Falha' },
                    { name: 'Mesa Flexora', muscle: 'Posterior', sets: '4', reps: '10-12' },
                    { name: 'Panturrilha em pé', muscle: 'Panturrilha', sets: '5', reps: '15-20' },
                    { name: 'Abdominal Supra', muscle: 'Abdômen', sets: '4', reps: '20' }
                ],
                final: 'Alongamento Completo'
            }
        ]
    };

    // Dados do Treino Feminino
    const femaleWorkouts = {
        title: "Protocolo Feminino",
        subtitle: "Foco em Glúteos e Definição",
        color: "#FF00CC",
        protocol: {
            series: "4 séries por exercício",
            reps: "10-12 reps (12/perna unilaterais)",
            rest: "45s a 60s descanso",
            obs: "Intensidade alta, descanso curto."
        },
        days: [
            {
                id: 'A',
                title: 'TREINO A',
                subtitle: 'Segunda-feira',
                focus: 'POSTERIOR E GLÚTEO',
                mobility: [
                    'Mobilidade de quadril – 2x15',
                    'Ativação de glúteo (elástico) – 2x20'
                ],
                exercises: [
                    { name: 'Agachamento Sumô', muscle: 'Glúteo/Interno', sets: '4', reps: '10-12' },
                    { name: 'Stiff com Barra', muscle: 'Posterior', sets: '4', reps: '10-12' },
                    { name: 'Elevação Pélvica', muscle: 'Glúteo (Foco)', sets: '4', reps: '12-15' },
                    { name: 'Mesa Flexora', muscle: 'Posterior', sets: '4', reps: '10-12' },
                    { name: 'Cadeira Abdutora', muscle: 'Glúteo Médio', sets: '4', reps: '15-20' }
                ],
                final: '20min Cardio Moderado'
            },
            {
                id: 'B',
                title: 'TREINO B',
                subtitle: 'Terça-feira',
                focus: 'SUPERIORES E ABDÔMEN',
                mobility: [
                    'Mobilidade de ombro – 2x12'
                ],
                exercises: [
                    { name: 'Puxada Frontal', muscle: 'Costas', sets: '4', reps: '12' },
                    { name: 'Remada Baixa', muscle: 'Costas', sets: '4', reps: '12' },
                    { name: 'Desenvolvimento Halter', muscle: 'Ombro', sets: '3', reps: '12' },
                    { name: 'Elevação Lateral', muscle: 'Ombro', sets: '3', reps: '15' },
                    { name: 'Tríceps Corda', muscle: 'Tríceps', sets: '3', reps: '12' },
                    { name: 'Prancha Abdominal', muscle: 'Core', sets: '3', reps: '40s' }
                ],
                final: 'HIIT 15min'
            },
            {
                id: 'C',
                title: 'TREINO C',
                subtitle: 'Quarta-feira',
                focus: 'QUADRÍCEPS',
                mobility: [
                    'Mobilidade de tornozelo – 2x15',
                    'Agachamento bodyweight – 2x20'
                ],
                exercises: [
                    { name: 'Agachamento Livre', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Leg Press 45', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Afundo Búlgaro', muscle: 'Glúteo/Perna', sets: '3', reps: '10/perna' },
                    { name: 'Cadeira Extensora', muscle: 'Quadríceps', sets: '4', reps: 'Falha' },
                    { name: 'Panturrilha Sentado', muscle: 'Panturrilha', sets: '4', reps: '15' }
                ],
                final: 'Alongamento'
            }
        ]
    };

    const renderWorkoutList = (data) => (
        <div className="content-section">
            <div className="info-card">
                <div className="card-title" style={{ color: data.color }}>
                    <Info size={20} /> Protocolo Geral
                </div>
                <ul className="list-styled">
                    <li><span className="bullet" style={{ color: data.color }}>•</span> {data.protocol.series}</li>
                    <li><span className="bullet" style={{ color: data.color }}>•</span> {data.protocol.reps}</li>
                    <li><span className="bullet" style={{ color: data.color }}>•</span> {data.protocol.rest}</li>
                    {data.protocol.sequence && <li><span className="bullet" style={{ color: data.color }}>•</span> {data.protocol.sequence}</li>}
                    {data.protocol.obs && <li><span className="bullet" style={{ color: data.color }}>•</span> {data.protocol.obs}</li>}
                </ul>
            </div>

            <div className="workout-grid">
                {data.days.map((day) => (
                    <div key={day.id} className="workout-card">
                        <div className="workout-header">
                            <h2 className="workout-title">{day.title}</h2>
                            <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>{day.subtitle}</p>
                            <span className="workout-focus" style={{ color: data.color, background: `${data.color}22` }}>
                                {day.focus}
                            </span>
                        </div>

                        <div className="workout-body">
                            {day.mobility && (
                                <div className="exercise-group">
                                    <h4 className="group-title">Mobilidade (Aquecimento)</h4>
                                    {day.mobility.map((item, idx) => (
                                        <div key={idx} style={{ fontSize: '13px', color: '#ccc', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                                            <span style={{ color: data.color }}>•</span> {item}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="exercise-group">
                                <h4 className="group-title">Exercícios</h4>
                                {day.exercises.map((ex, idx) => (
                                    <div key={idx} className="exercise-item">
                                        <div className="exercise-info">
                                            <h4>{ex.name}</h4>
                                            <p>{ex.muscle}</p>
                                        </div>
                                        <div className="exercise-meta">
                                            <div className="meta-chip">
                                                <Repeat size={10} /> {ex.sets}x
                                            </div>
                                            <div className="meta-chip">
                                                <Dumbbell size={10} /> {ex.reps}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {day.final && (
                                <div className="final-card" style={{
                                    background: `${data.color}11`,
                                    borderColor: `${data.color}33`,
                                    color: data.color
                                }}>
                                    🔥 {day.final}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderHIIT = () => (
        <div className="content-section">
            <div className="info-card">
                <div className="card-title" style={{ color: '#FFD700' }}>
                    <Flame size={20} /> Protocolo HIIT
                </div>
                <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
                    <p>• <strong>Formato:</strong> 40s Execução / 10s Descanso</p>
                    <p>• <strong>Round:</strong> 3 exercícios sequenciais = 1 Volta</p>
                    <p>• <strong>Total:</strong> 3 Voltas (1 min descanso entre voltas)</p>
                </div>
            </div>

            <div className="workout-grid">
                {[
                    { day: 'Segunda', ex: ['Swing Kettlebell', 'Skip Alto', 'Deslocamento Lateral'] },
                    { day: 'Terça', ex: ['Agachamento Press', 'Avanço Alternado', 'Prancha Frontal'] },
                    { day: 'Quarta', ex: ['Skip Alto', 'Agachamento Sumô', 'Swing Unilateral'] },
                    { day: 'Quinta', ex: ['Burpee Adaptado', 'Agachamento Isométrico', 'Deslocamento + Agach.'] },
                    { day: 'Sexta', ex: ['Skip Alto', 'Agachamento Salto', 'Prancha Lateral'] }
                ].map((item, idx) => (
                    <div key={idx} className="workout-card">
                        <div className="workout-header">
                            <h2 className="workout-title">{item.day}</h2>
                        </div>
                        <div className="workout-body">
                            <div className="hiit-list">
                                <div className="timeline-line"></div>
                                {item.ex.map((ex, i) => (
                                    <div key={i} className="hiit-item">
                                        <div className="hiit-number">{i + 1}</div>
                                        <div className="hiit-text">{ex}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDiet = () => (
        <div className="content-section">
            <div className="info-card">
                <div className="card-title" style={{ color: '#00FF88' }}>
                    <Utensils size={20} /> Guia Nutricional
                </div>
                <p style={{ color: '#ccc', fontSize: '14px' }}>
                    O segredo está na constância. Evite açúcar, frituras e processados. Beba 35ml de água por kg corporal.
                </p>
            </div>

            <div className="workout-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                {[
                    { title: 'Café da Manhã', time: '7h - 8h', icon: '☕', options: ['Pão c/ ovo mexido + Fruta', 'Crepioca de frango', 'Iogurte natural + Aveia + Fruta'] },
                    { title: 'Almoço', time: '12h - 13h', icon: '🥗', options: ['Arroz, Feijão, Frango/Carne, Legumes', 'Batata Doce, Peixe, Salada', 'Macarrão Integral, Carne Moída'] },
                    { title: 'Café da Tarde', time: '16h - 17h', icon: '🥪', options: ['Sanduíche natural frango', 'Omelete rápido', 'Whey Protein + Fruta'] },
                    { title: 'Jantar', time: '20h', icon: '🍽️', options: ['Repetir almoço (menor qtde)', 'Omelete de forno', 'Salada completa c/ Proteína'] },
                    { title: 'Ceia', time: '22h', icon: '🌙', options: ['Chá de Camomila', '1 Ovo cozido', 'Abacate (pedaço)'] }
                ].map((meal, idx) => (
                    <div key={idx} className="meal-card">
                        <div className="meal-header">
                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: '20px' }}>{meal.icon}</span>
                                <h3 className="meal-title">{meal.title}</h3>
                            </div>
                            <span className="meal-time">{meal.time}</span>
                        </div>
                        <ul className="meal-options">
                            {meal.options.map((opt, i) => (
                                <li key={i}>
                                    <span className="meal-dot">•</span> {opt}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="training-page">
            <div className="training-background"></div>

            <div className="training-header">
                <div>
                    <h1 className="page-title">Central de <span className="text-gradient-training">Treinos</span></h1>
                    <p className="page-subtitle">Seu guia definitivo de exercícios e nutrição.</p>
                </div>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab-btn male ${activeTab === 'male' ? 'active' : ''}`}
                    onClick={() => setActiveTab('male')}
                >
                    <User size={18} /> Protocolo M
                </button>
                <button
                    className={`tab-btn female ${activeTab === 'female' ? 'active' : ''}`}
                    onClick={() => setActiveTab('female')}
                >
                    <User size={18} /> Protocolo F
                </button>
                <button
                    className={`tab-btn hiit ${activeTab === 'hiit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hiit')}
                >
                    <Flame size={18} /> HIIT
                </button>
                <button
                    className={`tab-btn diet ${activeTab === 'diet' ? 'active' : ''}`}
                    onClick={() => setActiveTab('diet')}
                >
                    <Utensils size={18} /> Dieta
                </button>
            </div>

            {activeTab === 'male' && renderWorkoutList(maleWorkouts)}
            {activeTab === 'female' && renderWorkoutList(femaleWorkouts)}
            {activeTab === 'hiit' && renderHIIT()}
            {activeTab === 'diet' && renderDiet()}
        </div>
    );
};

export default Training;
