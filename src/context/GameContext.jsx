import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial default user state (fallback)
    const defaultUser = {
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
        avatar: {
            helmet: { id: 1, emoji: '⛑️', name: 'Elmo Básico', color: '#8B4513' },
            armor: { id: 1, emoji: '🛡️', name: 'Escudo de Ferro', color: '#708090' },
            weapon: { id: 1, emoji: '🗡️', name: 'Espada Curta', color: '#C0C0C0' },
            background: { id: 1, name: 'Arena Clássica', gradient: 'linear-gradient(135deg, #2c1810, #4a3020)' }
        },
        stats: {
            strength: 50,
            endurance: 60,
            discipline: 45,
            power: 55
        },
        challengeProfile: null,
        defeatedBosses: []
    };

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('gameUser');
        return saved ? JSON.parse(saved) : defaultUser;
    });

    const [challenges, setChallenges] = useState(() => {
        const saved = localStorage.getItem('gameChallenges');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, title: 'Iniciante: Flexões', level: 1, xp: 100, locked: false, price: 0, description: 'Faça 10 flexões seguidas.' },
            { id: 2, title: 'Iniciante: Agachamentos', level: 1, xp: 150, locked: false, price: 0, description: 'Faça 20 agachamentos.' },
            { id: 3, title: 'Intermediário: Burpees', level: 5, xp: 500, locked: true, price: 100, description: 'Série de 3x10 Burpees.' },
            { id: 4, title: 'Elite: Iron Man', level: 10, xp: 2000, locked: true, price: 500, description: 'Corrida 5km + 100 Flexões.' },
        ];
    });

    const [posts, setPosts] = useState(() => {
        const saved = localStorage.getItem('gamePosts');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, user: 'Maria Silva', content: 'Acabei de completar o desafio Iron Man! Foi insano! 🦾', likes: 24, time: '2h atrás', badge: '🏆' },
            { id: 2, user: 'João Souza', content: 'Começando a jornada hoje. Foco total! 🚀', likes: 12, time: '4h atrás', badge: '🌟' },
        ];
    });

    // Auth & Data Fetching Effect
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            fetchChallenges();
            fetchPosts();
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
            } else {
                // Reset to local/default if logged out
                const saved = localStorage.getItem('gameUser');
                setUser(saved ? JSON.parse(saved) : defaultUser);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setUser({
                    ...data,
                    // Use database fields, ensure JSON fields are handled
                    badges: data.badges || defaultUser.badges,
                    avatar: data.avatar || defaultUser.avatar,
                    stats: data.stats || defaultUser.stats,
                    challengeProfile: data.challenge_profile,
                    defeatedBosses: data.defeated_bosses || []
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchChallenges = async () => {
        const { data } = await supabase.from('challenges').select('*').order('level', { ascending: true });
        if (data && data.length > 0) setChallenges(data);
    };

    const fetchPosts = async () => {
        const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
            const mappedPosts = data.map(p => ({
                ...p,
                user: p.user_name || 'Usuário',
                badge: p.user_badge || '🌟',
                time: new Date(p.created_at).toLocaleDateString() // Simplification
            }));
            setPosts(mappedPosts);
        }
    };

    const syncUserToSupabase = async (updatedUser) => {
        if (!session) return;
        try {
            const { error } = await supabase.from('profiles').update({
                level: updatedUser.level,
                xp: updatedUser.xp,
                streak: updatedUser.streak,
                completed_workouts: updatedUser.completedWorkouts,
                avatar: updatedUser.avatar,
                stats: updatedUser.stats,
                badges: updatedUser.badges,
                challenge_profile: updatedUser.challengeProfile,
                defeated_bosses: updatedUser.defeatedBosses
            }).eq('id', session.user.id);

            if (error) console.error('Error syncing user:', error);
        } catch (e) {
            console.error(e);
        }
    };

    // --- Authentication Actions ---
    const signUp = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });
        return { data, error };
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data, error };
    };

    const signOut = () => supabase.auth.signOut();


    // --- State Modifiers (Wrapped to Sync) ---

    // Initial Sync Effect for LocalStorage (only if not logged in)
    useEffect(() => {
        if (!session) {
            localStorage.setItem('gameUser', JSON.stringify(user));
        }
    }, [user, session]);

    useEffect(() => {
        if (!session) {
            localStorage.setItem('gameChallenges', JSON.stringify(challenges));
        }
    }, [challenges, session]);

    // Note: Posts mostly read-only from server if connected, or local if not.

    const addXp = (amount) => {
        setUser(prev => {
            const newXp = prev.xp + amount;
            const newLevel = Math.floor(newXp / 1000) + 1;
            const newState = { ...prev, xp: newXp, level: newLevel };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    const addBadge = (badge) => {
        setUser(prev => {
            const newState = {
                ...prev,
                badges: [...prev.badges, {
                    ...badge,
                    id: Date.now(),
                    earnedAt: new Date().toISOString()
                }]
            };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    const defeatBoss = (bossId, rewards) => {
        setUser(prev => {
            const newState = {
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
            };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    const updateAvatar = (newAvatar) => {
        setUser(prev => {
            const newState = { ...prev, avatar: { ...prev.avatar, ...newAvatar } };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    const updateStats = (statKey, value) => {
        setUser(prev => {
            const newState = {
                ...prev,
                stats: {
                    ...prev.stats,
                    [statKey]: Math.min(100, Math.max(0, value))
                }
            };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    const logWorkout = () => {
        setUser(prev => {
            const newState = {
                ...prev,
                completedWorkouts: prev.completedWorkouts + 1,
                streak: prev.streak + 1,
                stats: {
                    ...prev.stats,
                    strength: Math.min(100, prev.stats.strength + 2),
                    endurance: Math.min(100, prev.stats.endurance + 1)
                }
            };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    const saveChallengeProfile = (profile) => {
        setUser(prev => {
            const newState = { ...prev, challengeProfile: profile };
            if (session) syncUserToSupabase(newState);
            return newState;
        });
    };

    // Challenges and Posts (Basic Ops)
    const addChallenge = async (challenge) => {
        if (session) {
            const { data, error } = await supabase.from('challenges').insert([challenge]).select();
            if (data) setChallenges([...challenges, data[0]]);
        } else {
            setChallenges([...challenges, { ...challenge, id: Date.now() }]);
        }
    };

    const updateChallenge = async (id, updated) => {
        if (session) {
            const { error } = await supabase.from('challenges').update(updated).eq('id', id);
            if (!error) setChallenges(challenges.map(c => c.id === id ? { ...c, ...updated } : c));
        } else {
            setChallenges(challenges.map(c => c.id === id ? { ...c, ...updated } : c));
        }
    };

    const deleteChallenge = async (id) => {
        if (session) {
            const { error } = await supabase.from('challenges').delete().eq('id', id);
            if (!error) setChallenges(challenges.filter(c => c.id !== id));
        } else {
            setChallenges(challenges.filter(c => c.id !== id));
        }
    }

    const addPost = async (post) => {
        if (session) {
            const { data, error } = await supabase.from('posts').insert([{
                content: post.content,
                user_id: session.user.id,
                user_name: user.name,
                user_badge: user.badges.length > 0 ? user.badges[user.badges.length - 1].icon : '🌟',
                user_level: user.level
            }]).select();

            if (data) {
                const newPost = {
                    ...data[0],
                    user: user.name,
                    badge: user.badges.length > 0 ? user.badges[user.badges.length - 1].icon : '🌟',
                    time: 'Agora'
                };
                setPosts([newPost, ...posts]);
            }
        } else {
            setPosts([{
                ...post,
                id: Date.now(),
                likes: 0,
                time: 'Agora',
                userLevel: user.level,
                userBadge: user.badges.length > 0 ? user.badges[user.badges.length - 1].icon : '🌟'
            }, ...posts]);
        }
    };

    const likePost = async (postId) => {
        // Optimistic update
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));

        if (session) {
            // In a real app we would check if user already liked
            // For now just increment counter in DB
            // Note: using rpc or just simplified update
            // Need the current likes from the post?
            // Not implemented safely for concurrency without RPC 'increment', but simple implementation:
            const post = posts.find(p => p.id === postId);
            if (post) {
                await supabase.from('posts').update({ likes: post.likes + 1 }).eq('id', postId);
            }
        }
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
            addXp,
            addBadge,
            defeatBoss,
            updateAvatar,
            updateStats,
            logWorkout,
            saveChallengeProfile,
            // Auth
            session,
            loading,
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </GameContext.Provider>
    );
};
