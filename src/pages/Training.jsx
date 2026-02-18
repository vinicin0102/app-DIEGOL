import React, { useState } from 'react';
import {
    Play,
    Clock,
    Repeat,
    Dumbbell,
    ChevronRight,
    Utensils,
    Flame,
    User,
    Users,
    Info
} from 'lucide-react';

const Training = () => {
    const [activeTab, setActiveTab] = useState('male'); // 'male', 'female', 'hiit', 'diet'

    // Dados do Treino Masculino
    const maleWorkouts = {
        protocol: {
            series: "4 séries por exercício",
            reps: "10 a 12 repetições",
            rest: "1 minuto e 30 segundos entre séries e exercícios",
            sequence: "A → B → C → repetir após concluir os três treinos"
        },
        days: [
            {
                id: 'A',
                title: 'Treino A - Segunda-feira',
                focus: 'Full Body',
                mobility: [
                    'Mobilidade de ombro com elástico ou bastão – 2x12',
                    'Mobilidade dinâmica ajoelhado (avança e volta) – 2x12'
                ],
                exercises: [
                    { name: 'Supino com halteres', muscle: 'Peito', sets: '4', reps: '10-12' },
                    { name: 'Remada baixa com triângulo', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Rosca direta com halteres', muscle: 'Bíceps', sets: '4', reps: '10-12' },
                    { name: 'Elevação frontal com halteres', muscle: 'Ombro', sets: '4', reps: '10-12' },
                    { name: 'Tríceps corda na polia', muscle: 'Tríceps', sets: '4', reps: '10-12' },
                    { name: 'Encolhimento com halteres', muscle: 'Trapézio', sets: '4', reps: '10-12' },
                    { name: 'Agachamento sumô', muscle: 'Pernas', sets: '4', reps: '10-12' }
                ],
                final: 'Cardio aeróbico (20min+) ou HIIT do Desafio'
            },
            {
                id: 'B',
                title: 'Treino B - Terça-feira',
                focus: 'Full Body',
                mobility: [
                    'Mobilidade de ombro com elástico ou bastão – 2x12',
                    'Mobilidade dinâmica ajoelhado (avança e volta) – 2x12'
                ],
                exercises: [
                    { name: 'Voador (peck deck)', muscle: 'Peito', sets: '4', reps: '10-12' },
                    { name: 'Pulley frente', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Rosca direta na polia', muscle: 'Bíceps', sets: '4', reps: '10-12' },
                    { name: 'Desenvolvimento máq. ou halteres', muscle: 'Ombro', sets: '4', reps: '10-12' },
                    { name: 'Tríceps testa ou mergulho máq.', muscle: 'Tríceps', sets: '4', reps: '10-12' },
                    { name: 'Encolhimento máq. ou barra', muscle: 'Trapézio', sets: '4', reps: '10-12' },
                    { name: 'Leg press', muscle: 'Pernas', sets: '4', reps: '10-12' }
                ],
                final: 'Cardio aeróbico (20min+) ou HIIT do Desafio'
            },
            {
                id: 'C',
                title: 'Treino C - Quarta-feira',
                focus: 'Full Body',
                mobility: [
                    'Mobilidade de ombro com elástico ou bastão – 2x12',
                    'Mobilidade dinâmica ajoelhado (avança e volta) – 2x12'
                ],
                exercises: [
                    { name: 'Flexão de braço', muscle: 'Peito', sets: '4', reps: 'Falha' },
                    { name: 'Remada na máquina', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Rosca direta com barra', muscle: 'Bíceps', sets: '4', reps: '10-12' },
                    { name: 'Elevação lateral com halteres', muscle: 'Ombro', sets: '4', reps: '10-12' },
                    { name: 'Tríceps pulley com barra V', muscle: 'Tríceps', sets: '4', reps: '10-12' },
                    { name: 'Remada alta com barra ou halteres', muscle: 'Trapézio', sets: '4', reps: '10-12' },
                    { name: 'Cadeira extensora', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Cadeira flexora', muscle: 'Pernas', sets: '4', reps: '10-12' }
                ],
                final: 'Cardio aeróbico (20min+) ou HIIT do Desafio'
            }
        ]
    };

    // Dados do Treino Feminino
    const femaleWorkouts = {
        protocol: {
            series: "4 séries por exercício",
            reps: "10 a 12 repetições (exceto onde indicado)",
            rest: "1 min e 30 seg entre séries",
            obs: "Unilaterais: 12 reps/perna, 40s descanso entre pernas, 2min entre séries."
        },
        days: [
            {
                id: 'A',
                title: 'Treino A - Pernas',
                focus: 'Posterior e Glúteo',
                mobility: [
                    'Mobilidade de ombro com elástico ou bastão – 2x12',
                    'Mobilidade dinâmica ajoelhado (avança e volta) – 2x12'
                ],
                exercises: [
                    { name: 'Agachamento sumô', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Afundo (normal)', muscle: 'Pernas', sets: '4', reps: '12/perna' },
                    { name: 'Mesa flexora', muscle: 'Posterior', sets: '4', reps: '10-12' },
                    { name: 'Stiff', muscle: 'Posterior', sets: '4', reps: '10-12' },
                    { name: 'Leg press', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Elevação de quadril', muscle: 'Glúteo', sets: '4', reps: '10-12' }
                ],
                final: 'Cardio aeróbico (20min+) ou HIIT do Desafio'
            },
            {
                id: 'B',
                title: 'Treino B - Superiores',
                focus: 'Full Body Braços',
                mobility: [
                    'Mobilidade de ombro com elástico ou bastão – 2x12'
                ],
                exercises: [
                    { name: 'Voador (peck deck)', muscle: 'Peito', sets: '4', reps: '10-12' },
                    { name: 'Supino inclinado com halteres', muscle: 'Peito', sets: '4', reps: '10-12' },
                    { name: 'Remada baixa com triângulo', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Pulley frente', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Puxada pronada', muscle: 'Costas', sets: '4', reps: '10-12' },
                    { name: 'Desenvolvimento com halteres', muscle: 'Ombro', sets: '4', reps: '10-12' },
                    { name: 'Elevação lateral', muscle: 'Ombro', sets: '4', reps: '10-12' },
                    { name: 'Tríceps corda', muscle: 'Tríceps', sets: '4', reps: '10-12' },
                    { name: 'Rosca direta com halteres', muscle: 'Bíceps', sets: '4', reps: '10-12' }
                ],
                final: 'Cardio aeróbico (20min+) ou HIIT do Desafio'
            },
            {
                id: 'C',
                title: 'Treino C - Pernas',
                focus: 'Quadril e Potência',
                mobility: [
                    'Mobilidade de ombro com elástico ou bastão – 2x12',
                    'Mobilidade dinâmica ajoelhado (avança e volta) – 2x12'
                ],
                exercises: [
                    { name: 'Agachamento barra guiada/rack', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Afundo búlgaro', muscle: 'Pernas', sets: '4', reps: '12/perna' },
                    { name: 'Leg press', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Cadeira extensora', muscle: 'Pernas', sets: '4', reps: '10-12' },
                    { name: 'Passada andando', muscle: 'Pernas', sets: '3', reps: '20 passos' },
                    { name: 'Agachamento frontal/taça', muscle: 'Pernas', sets: '4', reps: '10-12' }
                ],
                final: 'Cardio aeróbico (20min+) ou HIIT do Desafio'
            }
        ]
    };

    // Dados do HIIT
    const hiitWorkouts = {
        protocol: {
            format: "40s exercício / 10s descanso",
            round: "3 exercícios em sequência = 1 volta",
            total: "3 voltas com 1 min descanso entre voltas"
        },
        days: [
            {
                id: 'mon',
                day: 'Segunda-feira',
                exercises: ['Swing com kettlebell', 'Skip no jump', 'Deslocamento lateral']
            },
            {
                id: 'tue',
                day: 'Terça-feira',
                exercises: ['Agachamento com desenvolvimento', 'Avanço alternado halteres', 'Prancha frontal']
            },
            {
                id: 'wed',
                day: 'Quarta-feira',
                exercises: ['Skip no jump', 'Agachamento sumô', 'Swing unilateral kettlebell']
            },
            {
                id: 'thu',
                day: 'Quinta-feira',
                exercises: ['Burpee adaptado', 'Agachamento isométrico', 'Deslocamento lateral c/ agach.']
            },
            {
                id: 'fri',
                day: 'Sexta-feira',
                exercises: ['Skip no jump', 'Agachamento com salto', 'Prancha lateral (20s/lado)']
            }
        ],
        descriptions: [
            { name: 'Swing com kettlebell', desc: 'Movimento de quadril explosivo, mantendo coluna neutra.' },
            { name: 'Skip no jump', desc: 'Corrida sobre o jump ou estacionada elevando bem os joelhos.' },
            { name: 'Deslocamento lateral', desc: 'Movimento contínuo para os lados, mantendo base baixa.' },
            { name: 'Agachamento com desenvolvimento', desc: 'Agachar e ao subir empurrar a carga acima da cabeça.' },
            { name: 'Burpee adaptado', desc: 'Agachamento, mãos no chão, pernas para trás e retorno sem salto.' }
        ]
    };

    // Dados da Dieta
    const dietPlan = {
        obs: "Foco na constância. Evitar frituras, doces e açúcar.",
        meals: [
            {
                time: '7h – 8h',
                name: 'Café da manhã',
                options: [
                    '1 pão francês/forma, 2 ovos mexidos, 1 fatia muçarela',
                    'Omelete (2 ovos) e 1 fruta'
                ]
            },
            {
                time: '12h – 13h',
                name: 'Almoço',
                options: [
                    'Arroz, feijão, frango/carne/ovo, salada à vontade'
                ]
            },
            {
                time: '16h – 17h',
                name: 'Café da tarde',
                options: [
                    '1 pão com ovo mexido ou omelete',
                    'Pão com frango desfiado',
                    'Repetir café da manhã'
                ]
            },
            {
                time: '19h – 20h',
                name: 'Jantar',
                options: [
                    'Arroz ou batata, frango/carne/ovo e salada',
                    'Omelete reforçado (2 a 3 ovos) com salada',
                    'Hambúrguer artesanal fit (carne moída, pão, salada)'
                ]
            },
            {
                time: 'Se tiver fome',
                name: 'Ceia',
                options: [
                    '1 fruta',
                    'Chá (camomila, erva-doce ou hortelã)',
                    '1 ovo cozido OU 1 copo leite/iogurte natural'
                ]
            }
        ]
    };

    const renderWorkoutList = (workoutData) => (
        <div className="space-y-6">
            <div className="bg-[#1E1E24] p-4 rounded-xl border border-[#333]">
                <h3 className="text-[#FF5500] font-bold mb-2 flex items-center gap-2">
                    <Info size={18} /> Protocolo Geral
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {workoutData.protocol.series}</li>
                    <li>• {workoutData.protocol.reps}</li>
                    <li>• {workoutData.protocol.rest}</li>
                    {workoutData.protocol.sequence && <li>• {workoutData.protocol.sequence}</li>}
                    {workoutData.protocol.obs && <li>• {workoutData.protocol.obs}</li>}
                </ul>
            </div>

            <div className="grid gap-4">
                {workoutData.days.map((day) => (
                    <div key={day.id} className="bg-[#151518] rounded-xl overflow-hidden border border-[#2A2A30]">
                        <div className="bg-[#222] p-4 border-b border-[#333]">
                            <h2 className="text-lg font-bold text-white mb-1">{day.title}</h2>
                            {day.focus && <p className="text-xs text-[#00FF88] uppercase tracking-wider">{day.focus}</p>}
                        </div>

                        <div className="p-4 space-y-4">
                            {day.mobility && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase mb-2 font-bold">Mobilidade</p>
                                    {day.mobility.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-300 mb-1 flex items-start gap-2">
                                            <span className="text-[#FF5500]">•</span> {item}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3">
                                {day.exercises.map((ex, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1E1E24] p-3 rounded-lg border border-[#333]">
                                        <div className="flex-1">
                                            <p className="font-medium text-white">{ex.name}</p>
                                            <p className="text-xs text-gray-500">{ex.muscle}</p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 flex items-center gap-3 text-sm text-[#00FF88]">
                                            <span className="flex items-center gap-1 bg-[#2A2A30] px-2 py-1 rounded">
                                                <Repeat size={12} /> {ex.sets}x
                                            </span>
                                            <span className="flex items-center gap-1 bg-[#2A2A30] px-2 py-1 rounded">
                                                <Dumbbell size={12} /> {ex.reps}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {day.final && (
                                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-sm text-blue-200 text-center">
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
        <div className="space-y-6">
            <div className="bg-[#1E1E24] p-4 rounded-xl border border-[#333]">
                <h3 className="text-[#FF5500] font-bold mb-2 flex items-center gap-2">
                    <Flame size={18} /> Protocolo HIIT
                </h3>
                <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {hiitWorkouts.protocol.format}</li>
                    <li>• {hiitWorkouts.protocol.round}</li>
                    <li>• {hiitWorkouts.protocol.total}</li>
                </ul>
            </div>

            <div className="grid gap-4">
                {hiitWorkouts.days.map((day) => (
                    <div key={day.id} className="bg-[#151518] rounded-xl p-4 border border-[#2A2A30]">
                        <h2 className="text-lg font-bold text-white mb-3 border-b border-[#333] pb-2">{day.day}</h2>
                        <div className="space-y-4 relative">
                            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#333]"></div>
                            {day.exercises.map((ex, idx) => (
                                <div key={idx} className="relative flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#FF5500] flex items-center justify-center text-[10px] font-bold z-10 text-white shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 bg-[#1E1E24] p-3 rounded-lg border border-[#333]">
                                        <span className="text-white font-medium">{ex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#1E1E24] p-4 rounded-xl border border-[#333]">
                <h4 className="text-white font-bold mb-3">Descrição dos Exercícios</h4>
                <div className="space-y-2">
                    {hiitWorkouts.descriptions.map((desc, idx) => (
                        <p key={idx} className="text-xs text-gray-400">
                            <strong className="text-[#00FF88]">{desc.name}:</strong> {desc.desc}
                        </p>
                    ))}
                </div>
            </div>

        </div>
    );

    const renderDiet = () => (
        <div className="space-y-6">
            <div className="bg-[#1E1E24] p-4 rounded-xl border border-[#333] mb-6">
                <h3 className="text-[#00FF88] font-bold mb-2 flex items-center gap-2">
                    <Utensils size={18} /> Dieta Base
                </h3>
                <p className="text-sm text-gray-400">{dietPlan.obs}</p>
            </div>

            <div className="space-y-4">
                {dietPlan.meals.map((meal, idx) => (
                    <div key={idx} className="bg-[#151518] rounded-xl p-4 border border-[#2A2A30]">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-white">{meal.name}</h3>
                            <span className="text-xs bg-[#333] text-gray-300 px-2 py-1 rounded-full">{meal.time}</span>
                        </div>
                        <ul className="space-y-2">
                            {meal.options.map((option, optIdx) => (
                                <li key={optIdx} className="flex items-start gap-2 text-sm text-gray-300 bg-[#1E1E24] p-2 rounded">
                                    <span className="text-[#00FF88] mt-1">•</span>
                                    <span>{option}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto text-white">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Central de Treinos</h1>
                <p className="text-gray-400 text-sm">Selecione seu programa abaixo</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 select-none scrollbar-hide">
                <button
                    onClick={() => setActiveTab('male')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === 'male'
                            ? 'bg-[#FF5500] text-white font-bold shadow-lg shadow-orange-900/20'
                            : 'bg-[#1E1E24] text-gray-400 border border-[#333]'
                        }`}
                >
                    <User size={18} />
                    Masc. ABC
                </button>
                <button
                    onClick={() => setActiveTab('female')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === 'female'
                            ? 'bg-[#FF00CC] text-white font-bold shadow-lg shadow-pink-900/20'
                            : 'bg-[#1E1E24] text-gray-400 border border-[#333]'
                        }`}
                >
                    <User size={18} />
                    Fem. ABC
                </button>
                <button
                    onClick={() => setActiveTab('hiit')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === 'hiit'
                            ? 'bg-yellow-500 text-black font-bold'
                            : 'bg-[#1E1E24] text-gray-400 border border-[#333]'
                        }`}
                >
                    <Flame size={18} />
                    HIIT
                </button>
                <button
                    onClick={() => setActiveTab('diet')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeTab === 'diet'
                            ? 'bg-[#00FF88] text-black font-bold'
                            : 'bg-[#1E1E24] text-gray-400 border border-[#333]'
                        }`}
                >
                    <Utensils size={18} />
                    Dieta
                </button>
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'male' && renderWorkoutList(maleWorkouts)}
                {activeTab === 'female' && renderWorkoutList(femaleWorkouts)}
                {activeTab === 'hiit' && renderHIIT()}
                {activeTab === 'diet' && renderDiet()}
            </div>

            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Training;
