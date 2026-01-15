import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    // Carregar usuário do localStorage ou usar valores padrão
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('gameUser');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            name: 'Atleta Exemplo',
            level: 12,
            xp: 2450,
            streak: 12,
            completedWorkouts: 48,
            badges: [
                { id: 1, name: 'Primeiros Passos', icon: '🥉', description: 'Completou o primeiro desafio' },
                { id: 2, name: 'Fogo Constante', icon: '🔥', description: '7 dias de sequência' },
                { id: 3, name: 'Guerreiro', icon: '⚔️', description: 'Completou um desafio Elite' },
            ],
            photo: null,
            // Novos campos para o perfil de gladiador
            avatar: {
                helmet: { id: 1, emoji: '⛑️', name: 'Elmo Básico', color: '#8B4513' },
                armor: { id: 1, emoji: '🛡️', name: 'Escudo de Ferro', color: '#708090' },
                weapon: { id: 1, emoji: '🗡️', name: 'Espada Curta', color: '#C0C0C0' },
                background: { id: 1, name: 'Arena Clássica', gradient: 'linear-gradient(135deg, #2c1810, #4a3020)' }
            },
            // Stats do guerreiro
            stats: {
                strength: 50,
                endurance: 60,
                discipline: 45,
                power: 55
            },
            // Perfil do desafio
            challengeProfile: null,
            // Bosses derrotados
            defeatedBosses: []
        };
    });

    const [challenges, setChallenges] = useState(() => {
        const saved = localStorage.getItem('gameChallenges');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            { id: 1, title: 'Iniciante: Flexões', level: 1, xp: 100, locked: false, price: 0, description: 'Faça 10 flexões seguidas.' },
            { id: 2, title: 'Iniciante: Agachamentos', level: 1, xp: 150, locked: false, price: 0, description: 'Faça 20 agachamentos.' },
            { id: 3, title: 'Intermediário: Burpees', level: 5, xp: 500, locked: true, price: 100, description: 'Série de 3x10 Burpees.' },
            { id: 4, title: 'Elite: Iron Man', level: 10, xp: 2000, locked: true, price: 500, description: 'Corrida 5km + 100 Flexões.' },
        ];
    });

    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('gamePosts');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            { id: 1, user: 'Maria Silva', content: 'Acabei de completar o desafio Iron Man! Foi insano! 🦾', likes: 24, time: '2h atrás', badge: '🏆' },
            { id: 2, user: 'João Souza', content: 'Começando a jornada hoje. Foco total! 🚀', likes: 12, time: '4h atrás', badge: '🌟' },
        ];
    });

    // Salvar no localStorage quando mudar
    useEffect(() => {
        localStorage.setItem('gameUser', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('gameChallenges', JSON.stringify(challenges));
    }, [challenges]);

    useEffect(() => {
        localStorage.setItem('gamePosts', JSON.stringify(posts));
    }, [posts]);

    // Adicionar XP e calcular nível
    const addXp = (amount) => {
        setUser(prev => {
            const newXp = prev.xp + amount;
            const newLevel = Math.floor(newXp / 1000) + 1;
            return {
                ...prev,
                xp: newXp,
                level: newLevel
            };
        });
    };

    // Adicionar medalha
    const addBadge = (badge) => {
        setUser(prev => ({
            ...prev,
            badges: [...prev.badges, {
                ...badge,
                id: Date.now(),
                earnedAt: new Date().toISOString()
            }]
        }));
    };

    // Derrotar um boss
    const defeatBoss = (bossId, rewards) => {
        setUser(prev => ({
            ...prev,
            xp: prev.xp + rewards.xp,
            level: Math.floor((prev.xp + rewards.xp) / 1000) + 1,
            defeatedBosses: [...prev.defeatedBosses, bossId],
            badges: [...prev.badges, {
                id: Date.now(),
                name: rewards.badge,
                icon: rewards.badge.split(' ')[0],
                description: `Conquistado ao derrotar o boss`,
                earnedAt: new Date().toISOString()
            }]
        }));
    };

    // Atualizar avatar
    const updateAvatar = (newAvatar) => {
        setUser(prev => ({
            ...prev,
            avatar: { ...prev.avatar, ...newAvatar }
        }));
    };

    // Atualizar stats do guerreiro
    const updateStats = (statKey, value) => {
        setUser(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [statKey]: Math.min(100, Math.max(0, value))
            }
        }));
    };

    // Registrar treino
    const logWorkout = () => {
        setUser(prev => ({
            ...prev,
            completedWorkouts: prev.completedWorkouts + 1,
            streak: prev.streak + 1,
            stats: {
                ...prev.stats,
                strength: Math.min(100, prev.stats.strength + 2),
                endurance: Math.min(100, prev.stats.endurance + 1)
            }
        }));
    };

    // Salvar perfil do desafio
    const saveChallengeProfile = (profile) => {
        setUser(prev => ({
            ...prev,
            challengeProfile: profile
        }));
    };

    const addChallenge = (challenge) => {
        setChallenges([...challenges, { ...challenge, id: Date.now() }]);
    };

    const updateChallenge = (id, updated) => {
        setChallenges(challenges.map(c => c.id === id ? { ...c, ...updated } : c));
    };

    const deleteChallenge = (id) => {
        setChallenges(challenges.filter(c => c.id !== id));
    }

    const addPost = (post) => {
        setPosts([{
            ...post,
            id: Date.now(),
            likes: 0,
            time: 'Agora',
            userLevel: user.level,
            userBadge: user.badges.length > 0 ? user.badges[user.badges.length - 1].icon : '🌟'
        }, ...posts]);
    };

    const likePost = (postId) => {
        setPosts(posts.map(p =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
        ));
    };

    return (
        <GameContext.Provider value={{
            user,
            setUser,
            challenges,
            addChallenge,
            updateChallenge,
            deleteChallenge,
            posts,
            addPost,
            likePost,
            // Novas funções
            addXp,
            addBadge,
            defeatBoss,
            updateAvatar,
            updateStats,
            logWorkout,
            saveChallengeProfile
        }}>
            {children}
        </GameContext.Provider>
    );
};
