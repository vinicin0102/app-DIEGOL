import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Heart, MessageSquare, Share2, Send, Image, Smile, TrendingUp, Users, Award } from 'lucide-react';

const Community = () => {
    const { posts, addPost, user } = useGame();
    const [newPostContent, setNewPostContent] = useState('');

    const handlePost = () => {
        if (!newPostContent.trim()) return;
        addPost({
            user: user.name,
            content: newPostContent,
        });
        setNewPostContent('');
    };

    return (
        <div className="page-enter" style={{ paddingBottom: '100px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                {/* === HEADER === */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px' }}>
                        <span className="text-gradient">Comunidade</span> Global
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Compartilhe conquistas e inspire outros atletas</p>
                </div>

                {/* === QUICK STATS === */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <Users size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
                        <h4 style={{ fontSize: '24px', fontWeight: '800' }}>1,234</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Atletas Online</span>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <TrendingUp size={24} color="var(--secondary)" style={{ marginBottom: '8px' }} />
                        <h4 style={{ fontSize: '24px', fontWeight: '800' }}>567</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Desafios Hoje</span>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <Award size={24} color="#FFD700" style={{ marginBottom: '8px' }} />
                        <h4 style={{ fontSize: '24px', fontWeight: '800' }}>89</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Medalhas Ganhas</span>
                    </div>
                </div>

                {/* === POST INPUT === */}
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            boxShadow: '0 4px 15px rgba(123, 47, 255, 0.3)'
                        }}>
                            👤
                        </div>
                        <div style={{ flex: 1 }}>
                            <textarea
                                placeholder="Compartilhe sua conquista de hoje... 💪"
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    color: '#fff',
                                    fontSize: '15px',
                                    resize: 'none',
                                    outline: 'none',
                                    minHeight: '80px',
                                    lineHeight: '1.5'
                                }}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Image size={18} />
                                    </button>
                                    <button style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Smile size={18} />
                                    </button>
                                </div>
                                <button className="btn-primary" style={{ padding: '12px 28px' }} onClick={handlePost}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Send size={16} /> Publicar
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === FEED === */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="glass-panel"
                            style={{
                                padding: '24px',
                                animation: 'slide-up 0.4s ease-out',
                                animationDelay: `${index * 0.1}s`,
                                animationFillMode: 'both'
                            }}
                        >
                            {/* Post Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #333, #222)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    border: '2px solid rgba(255,255,255,0.1)'
                                }}>
                                    👤
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{post.user}</h4>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{post.time}</span>
                                </div>
                                <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                                    LVL 12
                                </span>
                            </div>

                            {/* Post Content */}
                            <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '20px', color: '#eee' }}>
                                {post.content}
                            </p>

                            {/* Mock Result Image */}
                            <div style={{
                                width: '100%',
                                height: '240px',
                                background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.1), rgba(0, 255, 136, 0.05))',
                                borderRadius: '16px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--border)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)',
                                    backgroundSize: '200% 200%',
                                    animation: 'shimmer 3s ease-in-out infinite'
                                }}></div>
                                <div style={{ textAlign: 'center', color: '#666' }}>
                                    <Image size={40} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                    <p style={{ fontStyle: 'italic', fontSize: '14px' }}>Foto do Resultado</p>
                                </div>
                            </div>

                            {/* Post Actions */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                borderTop: '1px solid var(--border)',
                                paddingTop: '16px'
                            }}>
                                <button style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <Heart size={18} /> {post.likes}
                                </button>
                                <button style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <MessageSquare size={18} /> Comentar
                                </button>
                                <button style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;
