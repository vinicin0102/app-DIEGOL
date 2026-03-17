import React from 'react';
import { useGame } from '../context/GameContext';
import { Gift, Lock, CheckCircle, Star, Trophy, Award, Medal, Crown } from 'lucide-react';

const RewardCard = ({ reward, isUnlocked }) => (
    <div className={`glass-panel ${!isUnlocked ? 'locked' : ''}`} style={{ 
        padding: '32px', 
        textAlign: 'center',
        opacity: isUnlocked ? 1 : 0.4,
        background: isUnlocked ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,0,0,0.5))' : 'rgba(0,0,0,0.2)',
        border: `1px solid ${isUnlocked ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'}`,
        position: 'relative'
    }}>
        {!isUnlocked && (
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <Lock size={16} color="#666" />
            </div>
        )}
        
        <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: isUnlocked ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '0 auto 24px',
            boxShadow: isUnlocked ? '0 0 20px rgba(255,215,0,0.2)' : 'none'
        }}>
            {reward.icon}
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '8px', color: isUnlocked ? '#FFD700' : '#888' }}>
            {reward.name}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
            {reward.description}
        </p>

        {isUnlocked ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary)', fontSize: '11px', fontWeight: '800' }}>
                <CheckCircle size={14} /> DESBLOQUEADO
            </div>
        ) : (
            <div style={{ fontSize: '10px', color: '#666', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Requisito: Nível {reward.reqLevel}
            </div>
        )}
    </div>
);

const Rewards = () => {
    const { user } = useGame();

    const rewards = [
        { id: 1, name: 'Título: Recruta', icon: '🔰', description: 'O primeiro passo na jornada dos vencedores.', reqLevel: 1 },
        { id: 2, name: 'Pack: Avatar Bronze', icon: '🥉', description: 'Desbloqueia novos visuais básicos.', reqLevel: 5 },
        { id: 3, name: 'Bônus: 1.2x XP', icon: '⚡', description: 'Aumenta permanentemente o ganho de XP.', reqLevel: 10 },
        { id: 4, name: 'Título: Guerreiro', icon: '⚔️', description: 'Reconhecimento por sua disciplina inicial.', reqLevel: 15 },
        { id: 5, name: 'Pack: Armas Épicas', icon: '🗡️', description: 'Equipamentos visuais de alto nível.', reqLevel: 25 },
        { id: 6, name: 'Acesso: Arena Elite', icon: '🏟️', description: 'Permite lutar em desafios especiais diários.', reqLevel: 35 },
        { id: 7, name: 'Badge: Mestre', icon: '💎', description: 'Uma medalha que brilha em seu perfil.', reqLevel: 50 },
        { id: 8, name: 'Pack: Rei Fitness', icon: '👑', description: 'O conjunto final de recompensas lendárias.', reqLevel: 80 },
    ];

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
                    Itens de <span className="text-gradient">Recompensa</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Sua trajetória marcada por grandes conquistas</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                {rewards.map(reward => (
                    <RewardCard 
                        key={reward.id} 
                        reward={reward} 
                        isUnlocked={user.level >= reward.reqLevel} 
                    />
                ))}
            </div>

            <div className="glass-panel" style={{ marginTop: '48px', padding: '32px', textAlign: 'center' }}>
                <Trophy size={48} color="#FFD700" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Mais recompensas em breve</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Continue subindo de nível para desbloquear surpresas exclusivas e itens limitados.
                </p>
            </div>
        </div>
    );
};

export default Rewards;
