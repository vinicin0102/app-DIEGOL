import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { INITIAL_MISSIONS } from '../data/missionsData';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const [missions, setMissions] = useState(() => {
        const saved = localStorage.getItem('gameMissions');
        return saved ? JSON.parse(saved) : INITIAL_MISSIONS.map(m => ({ ...m, completed: false }));
    });

    const [bonusMissions, setBonusMissions] = useState(() => {
        const saved = localStorage.getItem('gameBonusMissions');
        return saved ? JSON.parse(saved) : [];
    });

    const [calendarData, setCalendarData] = useState(() => {
        const saved = localStorage.getItem('gameCalendarData');
        return saved ? JSON.parse(saved) : {};
    });

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
        try {
            const saved = localStorage.getItem('gameUser');
            return saved ? JSON.parse(saved) : defaultUser;
        } catch (e) {
            console.error("Erro ao carregar user do localstorage:", e);
            return defaultUser;
        }
    });

    const [challenges, setChallenges] = useState(() => {
        try {
            const saved = localStorage.getItem('gameChallenges');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Erro ao carregar challenges:", e);
        }
        return [
            { id: 1, title: 'Iniciante: Flexões', level: 1, xp: 100, locked: false, price: 0, description: 'Faça 10 flexões seguidas.' },
            { id: 2, title: 'Iniciante: Agachamentos', level: 1, xp: 150, locked: false, price: 0, description: 'Faça 20 agachamentos.' },
            { id: 3, title: 'Intermediário: Burpees', level: 5, xp: 500, locked: true, price: 100, description: 'Série de 3x10 Burpees.' },
            { id: 4, title: 'Elite: Iron Man', level: 10, xp: 2000, locked: true, price: 500, description: 'Corrida 5km + 100 Flexões.' },
        ];
    });

    const [posts, setPosts] = useState(() => {
        try {
            const saved = localStorage.getItem('gamePosts');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Erro ao carregar posts:", e);
        }
        return [
            { id: 1, user: 'Maria Silva', content: 'Acabei de completar o desafio Iron Man! Foi insano! 🦾', likes: 24, time: '2h atrás', badge: '🏆' },
            { id: 2, user: 'João Souza', content: 'Começando a jornada hoje. Foco total! 🚀', likes: 12, time: '4h atrás', badge: '🌟' },
        ];
    });

    // Auth & Data Fetching Effect
    useEffect(() => {
        let mounted = true;

        // Timeout de segurança: se o Supabase não responder em 5s, libera o app
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Supabase session check timed out. Forcing app load.");
                setLoading(false);
            }
        }, 5000);

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted) return;
            setSession(session);
            if (session) fetchProfile(session.user.id);
            fetchChallenges();
            fetchPosts();
        }).catch(err => {
            console.error("Erro ao iniciar sessão:", err);
        }).finally(() => {
            if (mounted) {
                clearTimeout(safetyTimeout);
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setSession(session);
                if (session) {
                    fetchProfile(session.user.id);
                } else {
                    // Reset to local/default if logged out
                    const saved = localStorage.getItem('gameUser');
                    setUser(saved ? JSON.parse(saved) : defaultUser);
                }
            }
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
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
                    defeatedBosses: data.defeated_bosses || [],
                    isAdmin: data.is_admin || false
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

    // Helper para timeout
    const withTimeout = (promise, ms = 30000) => {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Tempo limite excedido. Verifique sua conexão.')), ms))
        ]);
    };

    // --- Authentication Actions ---
    const signUp = async (email, password, name) => {
        try {
            const { data, error } = await withTimeout(supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            }));
            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));
            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    };

    const signOut = () => supabase.auth.signOut();

    // Compatibility aliases
    const isAuthenticated = !!session;
    const login = signIn;
    const logout = signOut;


    // --- State Modifiers (Wrapped to Sync) ---

    useEffect(() => {
        if (!session) {
            localStorage.setItem('gameUser', JSON.stringify(user));
        }
    }, [user, session]);

    useEffect(() => {
        localStorage.setItem('gameMissions', JSON.stringify(missions));
    }, [missions]);

    useEffect(() => {
        localStorage.setItem('gameBonusMissions', JSON.stringify(bonusMissions));
    }, [bonusMissions]);

    useEffect(() => {
        localStorage.setItem('gameCalendarData', JSON.stringify(calendarData));
    }, [calendarData]);

    // Daily reset for missions
    useEffect(() => {
        const checkReset = () => {
            const lastReset = localStorage.getItem('gameLastMissionsReset');
            const today = new Date().toLocaleDateString('pt-BR');
            if (lastReset !== today) {
                setMissions(INITIAL_MISSIONS.map(m => ({ ...m, completed: false })));
                setBonusMissions([]);
                localStorage.setItem('gameLastMissionsReset', today);
            }
        };
        checkReset();
        // Check again every hour
        const interval = setInterval(checkReset, 3600000);
        return () => clearInterval(interval);
    }, []);

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
            if (data) setChallenges(prev => [...prev, data[0]]);
        } else {
            setChallenges(prev => [...prev, { ...challenge, id: Date.now() }]);
        }
    };

    const updateChallenge = async (id, updated) => {
        if (session) {
            const { error } = await supabase.from('challenges').update(updated).eq('id', id);
            if (!error) setChallenges(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
        } else {
            setChallenges(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
        }
    };

    const deleteChallenge = async (id) => {
        if (session) {
            const { error } = await supabase.from('challenges').delete().eq('id', id);
            if (!error) setChallenges(prev => prev.filter(c => c.id !== id));
        } else {
            setChallenges(prev => prev.filter(c => c.id !== id));
        }
    }

    const addPost = async (post) => {
        if (session) {
            const { data, error } = await supabase.from('posts').insert([{
                content: post.content,
                image_url: post.image_url || null,
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
                setPosts(prev => [newPost, ...prev]);
            }
        } else {
            setPosts(prev => [{
                ...post,
                id: Date.now(),
                likes: 0,
                time: 'Agora',
                image_url: post.image_url || null,
                userLevel: user.level,
                userBadge: user.badges.length > 0 ? user.badges[user.badges.length - 1].icon : '🌟'
            }, ...prev]);
        }
    };

    const likePost = async (id) => {
        if (session) {
            const { error } = await supabase.rpc('increment_likes', { post_id: id });
            if (!error) {
                setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
            }
        } else {
            setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        }
    };

    const toggleMission = (id) => {
        setMissions(prev => {
            const mission = prev.find(m => m.id === id);
            if (!mission) return prev;

            const isCompleting = !mission.completed;

            // Recompensar com XP
            if (isCompleting) {
                addXp(mission.xp || 5);
            } else {
                addXp(-(mission.xp || 5));
            }

            const newMissions = prev.map(m => m.id === id ? { ...m, completed: isCompleting } : m);

            // Check if all missions for today are completed
            const allDone = newMissions.every(m => m.completed);
            const today = new Date().toISOString().split('T')[0];

            if (allDone) {
                setCalendarData(prevCal => ({
                    ...prevCal,
                    [today]: {
                        completed: true,
                        count: `${newMissions.length}/${newMissions.length}`,
                        timestamp: new Date().toISOString()
                    }
                }));
            } else {
                setCalendarData(prevCal => ({
                    ...prevCal,
                    [today]: {
                        completed: false,
                        count: `${newMissions.filter(m => m.completed).length}/${newMissions.length}`,
                        timestamp: new Date().toISOString()
                    }
                }));
            }

            return newMissions;
        });
    };

    const addBonusMission = (title) => {
        if (bonusMissions.length >= 2) return;
        setBonusMissions(prev => [...prev, {
            id: Date.now(),
            title,
            completed: false,
            xp: 1,
            category: 'Bônus'
        }]);
    };

    const toggleBonusMission = (id) => {
        setBonusMissions(prev => {
            const updated = prev.map(m => {
                if (m.id === id && !m.completed) {
                    addXp(1);
                    return { ...m, completed: true };
                }
                return m;
            });
            return updated;
        });
    };

    const deleteBonusMission = (id) => {
        setBonusMissions(prev => prev.filter(m => m.id !== id));
    };

    return (
        <GameContext.Provider value={{
            user,
            setUser,
            isAuthenticated,
            login,
            logout,
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
            // Missions
            missions,
            toggleMission,
            bonusMissions,
            addBonusMission,
            toggleBonusMission,
            deleteBonusMission,
            calendarData,
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
