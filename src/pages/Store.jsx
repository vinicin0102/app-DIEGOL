import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingBag, Zap, Clock, Shield, Star, Lock, Heart, Flame, ShieldCheck } from 'lucide-react';

const StoreItem = ({ item, onBuy, canAfford }) => (
    <div className="glass-panel" style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        border: `1px solid ${item.rarityColor}44`,
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            fontSize: '10px', 
            fontWeight: '900', 
            color: item.rarityColor, 
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }}>
            {item.rarity}
        </div>

        <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            background: `${item.rarityColor}15`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '32px'
        }}>
            {item.icon}
        </div>

        <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{item.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{item.description}</p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#FFD700" fill="#FFD700" />
                <span style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>{item.price} XP</span>
            </div>
            <button 
                className="btn-primary" 
                disabled={!canAfford}
                onClick={() => onBuy(item)}
                style={{ 
                    padding: '8px 16px', 
                    fontSize: '12px', 
                    background: canAfford ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    opacity: canAfford ? 1 : 0.5
                }}
            >
                {canAfford ? 'Comprar' : 'Bloqueado'}
            </button>
        </div>
    </div>
);

const Store = () => {
    const { user, addXp } = useGame();
    const [boughtItems, setBoughtItems] = useState([]);

    const items = [
        { id: 'ext_1', name: 'Escudo de Foco', icon: '🛡️', price: 500, rarity: 'Raro', rarityColor: '#3498DB', description: 'Protege sua sequência por 24 horas se você esquecer um treino.' },
        { id: 'ext_2', name: 'Poção de Vigor', icon: '🧪', price: 300, rarity: 'Comum', rarityColor: '#2ECC71', description: 'Restaura sua energia visual instantaneamente.' },
        { id: 'ext_3', name: 'Manto Lendário', icon: '🧥', price: 2500, rarity: 'Lendário', rarityColor: '#FFD700', description: 'Um item cosmético exclusivo para seu avatar.' },
        { id: 'ext_4', name: 'Relógio do Destino', icon: '⏳', price: 1200, rarity: 'Épico', rarityColor: '#9B59B6', description: 'Permite completar retroativamente uma missão de ontem.' },
        { id: 'ext_5', name: 'Espada da Disciplina', icon: '🗡️', price: 800, rarity: 'Raro', rarityColor: '#3498DB', description: 'Aumenta o dano causado aos chefões em 10%.' },
        { id: 'ext_6', name: 'Aura de Ouro', icon: '✨', price: 5000, rarity: 'Lendário', rarityColor: '#FFD700', description: 'Um efeito visual permanente em seu perfil.' },
    ];

    const handleBuy = (item) => {
        if (user.xp >= item.price) {
            addXp(-item.price);
            setBoughtItems([...boughtItems, item.id]);
            alert(`Você adquiriu ${item.name}! 🚀`);
        }
    };

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
                    Loja do <span className="text-gradient">Tempo</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Use seu XP conquistado com suor para adquirir vantagens</p>
            </div>

            <div className="glass-panel" style={{ 
                padding: '20px 32px', 
                marginBottom: '40px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'linear-gradient(90deg, rgba(0,255,136,0.1), transparent)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,255,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={24} color="var(--primary)" fill="var(--primary)" />
                    </div>
                    <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Seu Saldo Atual</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '900' }}>{user.xp} <span style={{ color: 'var(--primary)', fontSize: '14px' }}>XP</span></h2>
                    </div>
                </div>
                <ShoppingBag size={32} color="rgba(255,255,255,0.1)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {items.map(item => (
                    <StoreItem 
                        key={item.id} 
                        item={item} 
                        onBuy={handleBuy} 
                        canAfford={user.xp >= item.price && !boughtItems.includes(item.id)} 
                    />
                ))}
            </div>

            <div style={{ marginTop: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <ShieldCheck size={20} color="var(--primary)" />
                    <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Seus Itens Ativos</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {boughtItems.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>Nenhum item comprado ainda.</p>
                    ) : (
                        boughtItems.map(id => {
                            const item = items.find(i => i.id === id);
                            return (
                                <div key={id} style={{ 
                                    padding: '12px 20px', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    borderRadius: '100px', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <span>{item.icon}</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{item.name}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Store;
