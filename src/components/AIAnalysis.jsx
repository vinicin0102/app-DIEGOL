import React, { useState } from 'react';
import { Camera, Scan, CheckCircle, BrainCircuit, Sparkles, Target, Dumbbell } from 'lucide-react';
import { useGame } from '../context/GameContext';

const AIAnalysis = ({ onComplete }) => {
    const [step, setStep] = useState('upload');
    const [scanProgress, setScanProgress] = useState(0);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const startScan = () => {
        setStep('scanning');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 3;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => setStep('questions'), 500);
            }
        }, 60);
    };

    const handleGoalSet = () => {
        setStep('measuring');
        setTimeout(() => {
            setStep('complete');
        }, 2500);
    };

    const goals = [
        {
            id: 'muscle',
            icon: '💪',
            title: 'Ganhar Massa Muscular',
            desc: 'Foco em hipertrofia e força máxima.',
            color: 'var(--primary)'
        },
        {
            id: 'fat',
            icon: '🔥',
            title: 'Perder Gordura',
            desc: 'Foco em cardio e déficit calórico.',
            color: 'var(--accent)'
        },
        {
            id: 'athletic',
            icon: '⚡',
            title: 'Performance Atlética',
            desc: 'Foco em resistência e agilidade.',
            color: 'var(--secondary)'
        },
    ];

    if (step === 'upload') {
        return (
            <div className="glass-panel" style={{
                padding: '48px',
                textAlign: 'center',
                maxWidth: '520px',
                margin: '0 auto',
                background: 'linear-gradient(180deg, rgba(123, 47, 255, 0.08) 0%, transparent 100%)'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, var(--secondary), #9B59FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px',
                    boxShadow: '0 15px 40px rgba(123, 47, 255, 0.4)'
                }}>
                    <BrainCircuit size={48} color="#fff" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '12px' }}>
                    Análise Corporal <span className="text-gradient">IA</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '36px', lineHeight: '1.6', fontSize: '15px' }}>
                    Nossa inteligência artificial vai analisar sua composição corporal e criar um plano de treino personalizado.
                </p>

                <div
                    onClick={startScan}
                    className="upload-area"
                    style={{
                        border: '2px dashed rgba(123, 47, 255, 0.4)',
                        borderRadius: '24px',
                        padding: '48px 32px',
                        cursor: 'pointer',
                        marginBottom: '24px',
                        background: 'rgba(0,0,0,0.2)'
                    }}
                >
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(123, 47, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Camera size={36} color="var(--secondary)" />
                    </div>
                    <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>Toque para tirar foto</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ou selecione da galeria</p>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', opacity: 0.7 }}>
                    🔒 Suas fotos são processadas localmente e nunca são salvas.
                </p>
            </div>
        );
    }

    if (step === 'scanning') {
        return (
            <div className="glass-panel" style={{
                padding: '56px',
                textAlign: 'center',
                maxWidth: '520px',
                margin: '0 auto',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(0, 255, 136, 0.05) 0%, transparent 100%)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${scanProgress}%`,
                    background: 'linear-gradient(90deg, rgba(0, 255, 136, 0.08), rgba(0, 255, 136, 0.02))',
                    zIndex: 0,
                    transition: 'width 0.1s linear'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(0, 255, 136, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 28px',
                        position: 'relative'
                    }}>
                        <Scan size={48} color="var(--primary)" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                        <div style={{
                            position: 'absolute',
                            inset: '-8px',
                            borderRadius: '50%',
                            border: '2px solid var(--primary)',
                            opacity: 0.3,
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}></div>
                    </div>

                    <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '12px' }}>
                        Analisando Biometria...
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        Mapeando pontos musculares e composição corporal
                    </p>

                    <div style={{ marginBottom: '16px' }}>
                        <div className="xp-bar" style={{ height: '10px' }}>
                            <div className="xp-bar-fill" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)' }}>{scanProgress}%</p>
                </div>
            </div>
        );
    }

    if (step === 'questions') {
        return (
            <div className="glass-panel" style={{ padding: '40px', maxWidth: '520px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
                    <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '8px' }}>Análise Concluída!</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Agora defina seu objetivo principal</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {goals.map(goal => (
                        <button
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal.id)}
                            className="glass-panel"
                            style={{
                                padding: '20px 24px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                border: selectedGoal === goal.id ? `2px solid ${goal.color}` : '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                background: selectedGoal === goal.id ? `${goal.color}11` : 'transparent'
                            }}
                        >
                            <div style={{
                                width: '56px', height: '56px',
                                borderRadius: '16px',
                                background: `${goal.color}22`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px'
                            }}>
                                {goal.icon}
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{goal.title}</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{goal.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', opacity: selectedGoal ? 1 : 0.5 }}
                    onClick={handleGoalSet}
                    disabled={!selectedGoal}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Target size={18} /> Confirmar & Gerar Plano
                    </div>
                </button>
            </div>
        );
    }

    if (step === 'measuring') {
        return (
            <div className="glass-panel" style={{ padding: '56px', textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px',
                    animation: 'spin 2s linear infinite'
                }}>
                    <Dumbbell size={44} color="#fff" />
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '12px' }}>Criando Desafios...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Personalizando dificuldade baseada no seu nível atual</p>
            </div>
        );
    }

    if (step === 'complete') {
        return (
            <div className="glass-panel neon-glow" style={{
                padding: '56px',
                textAlign: 'center',
                maxWidth: '520px',
                margin: '0 auto',
                background: 'linear-gradient(180deg, rgba(0, 255, 136, 0.1) 0%, transparent 100%)',
                border: '1px solid rgba(0, 255, 136, 0.3)'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), #00DDAA)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px',
                    boxShadow: '0 15px 40px var(--primary-glow)'
                }}>
                    <CheckCircle size={48} color="#000" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '12px' }}>
                    Plano <span className="text-gradient">Pronto!</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '36px', lineHeight: '1.6' }}>
                    Seus desafios personalizados foram gerados com base na sua análise corporal e objetivo.
                </p>
                <button className="btn-primary" style={{ padding: '16px 40px' }} onClick={onComplete}>
                    Ver Meus Desafios
                </button>
            </div>
        );
    }

    return null;
};

export default AIAnalysis;
