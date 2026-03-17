import React from 'react';
import { Shield, Heart, Zap, Target, Star, Anchor, Sun, Wind } from 'lucide-react';

const VirtueCard = ({ icon: Icon, title, description, color }) => (
    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', transition: 'transform 0.3s' }}>
        <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '20px', 
            background: `${color}15`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            border: `1px solid ${color}33`
        }}>
            <Icon size={32} color={color} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '12px', color: color }}>{title}</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
    </div>
);

const Virtues = () => {
    const list = [
        { icon: Shield, title: 'Disciplina', color: '#FF3366', description: 'Fazer o que precisa ser feito, especialmente quando não há vontade. É a base de todo sucesso.' },
        { icon: Heart, title: 'Resiliência', color: '#00FF88', description: 'A capacidade de voltar à forma original após ser pressionado por grandes desafios e falhas.' },
        { icon: Zap, title: 'Foco', color: '#FFD700', description: 'Dizer não para as distrações irrelevantes para que o sim para o seu objetivo tenha força.' },
        { icon: Target, title: 'Propósito', color: '#3498DB', description: 'O "porquê" que te faz levantar cedo e enfrentar o desconforto sem reclamar.' },
        { icon: Star, title: 'Integridade', color: '#9B59B6', description: 'Manter a palavra dada a si mesmo. Ser honesto nos treinos e na dieta quando ninguém olha.' },
        { icon: Anchor, title: 'Constância', color: '#FF9900', description: 'A força da gota que fura a pedra. Pequenas ações repetidas por longos períodos de tempo.' },
        { icon: Sun, title: 'Coragem', color: '#FF5500', description: 'Não é a ausência de medo, mas agir apesar dele. Enfrentar o julgamento alheio e o próprio cansaço.' },
        { icon: Wind, title: 'Liberdade', color: '#FFFFFF', description: 'O resultado final da disciplina. O poder de escolher quem você quer ser de verdade.' },
    ];

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '12px' }}>
                    O Código das <span className="text-gradient">Virtudes</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '18px' }}>
                    Os pilares que sustentam o verdadeiro Guerreiro de Elite na sua jornada diária.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {list.map((v, i) => (
                    <VirtueCard key={i} {...v} />
                ))}
            </div>

            <div className="glass-panel" style={{ marginTop: '60px', padding: '48px', textAlign: 'center', border: '1px solid var(--primary)' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '24px' }}>Qual virtude você treinou hoje?</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 32px', fontSize: '16px', lineHeight: '1.7' }}>
                    A musculação e a dieta são apenas ferramentas para treinar o espírito. Cada repetição forçada e cada tentação negada é um tijolo na construção do seu novo eu.
                </p>
                <div style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>
                    "Vença a si mesmo e vencerá o mundo."
                </div>
            </div>
        </div>
    );
};

export default Virtues;
