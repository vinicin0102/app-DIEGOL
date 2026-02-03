import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { supabase } from '../lib/supabaseClient';
import { Heart, MessageSquare, Share2, Send, Image, Smile, TrendingUp, Users, Award, MessageCircle, X, ChevronDown, ChevronUp, Zap, Camera, Paperclip, Loader } from 'lucide-react';
import { AVATARS } from '../components/AvatarSelector';

// Helper para obter avatar do localStorage
const getUserAvatar = () => {
    const savedAvatarId = localStorage.getItem('userSelectedAvatarId');
    if (savedAvatarId) {
        const avatar = AVATARS.find(a => a.id === savedAvatarId);
        return avatar || AVATARS[0];
    }
    return AVATARS[0];
};

const Community = () => {
    const { posts, addPost, user, likePost, session } = useGame();
    const [newPostContent, setNewPostContent] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [expandedComments, setExpandedComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [postComments, setPostComments] = useState({});
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Carregar avatar do usuário
    useEffect(() => {
        setCurrentUserAvatar(getUserAvatar());
    }, []);

    // Scroll to bottom of chat when new messages arrive
    useEffect(() => {
        if (chatEndRef.current && showChat) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, showChat]);

    // Subscribe to real-time chat messages
    useEffect(() => {
        // Load initial chat messages
        const loadChatMessages = async () => {
            try {
                const { data } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .order('created_at', { ascending: true })
                    .limit(100);

                if (data) {
                    setChatMessages(data);
                }
            } catch (error) {
                // Modo offline - carregar do localStorage
                const saved = localStorage.getItem('chatMessages');
                if (saved) {
                    setChatMessages(JSON.parse(saved));
                }
            }
        };

        loadChatMessages();

        // Real-time subscription
        const channel = supabase
            .channel('public:chat_messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages'
            }, (payload) => {
                setChatMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        // Simulated online users (increase from base)
        const baseOnline = Math.floor(Math.random() * 50) + 30;
        setOnlineUsers(baseOnline);

        const interval = setInterval(() => {
            setOnlineUsers(prev => {
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                return Math.max(10, prev + change);
            });
        }, 10000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, []);

    // Load comments for posts
    useEffect(() => {
        const loadComments = async () => {
            try {
                const { data } = await supabase
                    .from('comments')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (data) {
                    const commentsByPost = {};
                    data.forEach(comment => {
                        if (!commentsByPost[comment.post_id]) {
                            commentsByPost[comment.post_id] = [];
                        }
                        commentsByPost[comment.post_id].push(comment);
                    });
                    setPostComments(commentsByPost);
                }
            } catch (error) {
                // Modo offline
                const saved = localStorage.getItem('postComments');
                if (saved) {
                    setPostComments(JSON.parse(saved));
                }
            }
        };

        loadComments();

        // Real-time subscription for comments
        const channel = supabase
            .channel('public:comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments'
            }, (payload) => {
                setPostComments(prev => ({
                    ...prev,
                    [payload.new.post_id]: [...(prev[payload.new.post_id] || []), payload.new]
                }));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Salvar mensagens localmente quando mudar
    useEffect(() => {
        if (chatMessages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(chatMessages.slice(-100)));
        }
    }, [chatMessages]);

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verify it's an image
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas imagens!');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB!');
                return;
            }

            setSelectedImage(file);

            // Create preview (base64)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setShowImageOptions(false);
        }
    };

    // Upload image - tries Supabase Storage first, falls back to base64
    const uploadImage = async (file) => {
        // Primeiro, tenta usar o Supabase Storage
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `chat-images/${fileName}`;

            const { data, error } = await supabase.storage
                .from('community')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (!error && data) {
                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('community')
                    .getPublicUrl(filePath);
                return publicUrl;
            }
        } catch (error) {
            console.log('Storage not available, using base64');
        }

        // Fallback: usar base64 (funciona sem Storage configurado)
        return imagePreview;
    };

    // Clear selected image
    const clearSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const handlePost = () => {
        if (!newPostContent.trim()) return;
        addPost({
            user: user.name,
            content: newPostContent,
        });
        setNewPostContent('');
    };

    const handleSendChatMessage = async () => {
        if (!newMessage.trim() && !selectedImage) return;

        setUploadingImage(true);

        try {
            let imageUrl = null;

            // Upload image if selected
            if (selectedImage) {
                imageUrl = await uploadImage(selectedImage);
            }

            const avatar = getUserAvatar();
            const messageData = {
                content: newMessage || '',
                user_name: user.name || 'Atleta Anônimo',
                user_level: user.level || 1,
                user_avatar_id: avatar.id,
                image_url: imageUrl,
                created_at: new Date().toISOString()
            };

            // If connected to Supabase
            if (session) {
                try {
                    await supabase.from('chat_messages').insert([{
                        ...messageData,
                        user_id: session.user.id
                    }]);
                } catch (error) {
                    // Fallback local
                    setChatMessages(prev => [...prev, { ...messageData, id: Date.now() }]);
                }
            } else {
                // Local mode
                setChatMessages(prev => [...prev, { ...messageData, id: Date.now() }]);
            }

            setNewMessage('');
            clearSelectedImage();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleToggleComments = (postId) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleAddComment = async (postId) => {
        const content = commentInputs[postId];
        if (!content?.trim()) return;

        const avatar = getUserAvatar();
        const commentData = {
            post_id: postId,
            content: content,
            user_name: user.name || 'Atleta Anônimo',
            user_level: user.level || 1,
            user_avatar_id: avatar.id,
            created_at: new Date().toISOString()
        };

        if (session) {
            try {
                await supabase.from('comments').insert([{
                    ...commentData,
                    user_id: session.user.id
                }]);
            } catch (error) {
                // Local mode fallback
                setPostComments(prev => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), { ...commentData, id: Date.now() }]
                }));
            }
        } else {
            // Local mode
            setPostComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), { ...commentData, id: Date.now() }]
            }));
        }

        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    const handleLike = (postId) => {
        if (likedPosts.has(postId)) return;
        likePost(postId);
        setLikedPosts(prev => new Set([...prev, postId]));
    };

    // Componente de Avatar do Usuário
    const UserAvatarImage = ({ avatarId, size = 32 }) => {
        const avatar = avatarId ? AVATARS.find(a => a.id === avatarId) : getUserAvatar();
        const avatarData = avatar || AVATARS[0];

        return (
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.2)',
                flexShrink: 0
            }}>
                <img
                    src={avatarData.image}
                    alt={avatarData.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        );
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
                        <h4 style={{ fontSize: '24px', fontWeight: '800' }}>{onlineUsers}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                background: '#00FF88',
                                borderRadius: '50%',
                                marginRight: '6px',
                                animation: 'pulse 2s infinite'
                            }}></span>
                            Online Agora
                        </span>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <TrendingUp size={24} color="var(--secondary)" style={{ marginBottom: '8px' }} />
                        <h4 style={{ fontSize: '24px', fontWeight: '800' }}>{posts.length}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Posts Hoje</span>
                    </div>
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <MessageCircle size={24} color="#00D4FF" style={{ marginBottom: '8px' }} />
                        <h4 style={{ fontSize: '24px', fontWeight: '800' }}>{chatMessages.length}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mensagens</span>
                    </div>
                </div>

                {/* === LIVE CHAT BUTTON === */}
                <div
                    onClick={() => setShowChat(!showChat)}
                    className="glass-panel"
                    style={{
                        padding: '16px 24px',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: showChat ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(123, 47, 255, 0.2))' : undefined,
                        border: showChat ? '1px solid rgba(0, 212, 255, 0.3)' : undefined,
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Zap size={20} color="#fff" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '2px' }}>💬 Chat ao Vivo da Guilda</h4>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {onlineUsers} atletas conversando agora
                            </span>
                        </div>
                    </div>
                    {showChat ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>

                {/* === LIVE CHAT PANEL === */}
                {showChat && (
                    <div
                        className="glass-panel"
                        style={{
                            marginBottom: '32px',
                            overflow: 'hidden',
                            animation: 'slide-up 0.3s ease-out'
                        }}
                    >
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    background: '#00FF88',
                                    borderRadius: '50%',
                                    animation: 'pulse 2s infinite',
                                    boxShadow: '0 0 10px #00FF88'
                                }}></span>
                                <span style={{ fontWeight: '600', color: '#00FF88' }}>AO VIVO</span>
                            </div>
                            <button
                                onClick={() => setShowChat(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={chatContainerRef}
                            style={{
                                height: '350px',
                                overflowY: 'auto',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            {chatMessages.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    color: 'var(--text-muted)',
                                    padding: '40px'
                                }}>
                                    <MessageCircle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                    <p>Seja o primeiro a mandar uma mensagem!</p>
                                    <p style={{ fontSize: '14px', marginTop: '8px' }}>Comece conversando com outros atletas 💪</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            animation: 'slide-up 0.2s ease-out'
                                        }}
                                    >
                                        <UserAvatarImage avatarId={msg.user_avatar_id} size={32} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{msg.user_name}</span>
                                                <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                                    LVL {msg.user_level || 1}
                                                </span>
                                            </div>
                                            <div style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '10px 14px',
                                                borderRadius: '0 12px 12px 12px'
                                            }}>
                                                {msg.content && (
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#eee',
                                                        lineHeight: '1.5',
                                                        marginBottom: msg.image_url ? '10px' : 0
                                                    }}>
                                                        {msg.content}
                                                    </p>
                                                )}
                                                {msg.image_url && (
                                                    <img
                                                        src={msg.image_url}
                                                        alt="Imagem enviada"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '200px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            objectFit: 'cover'
                                                        }}
                                                        onClick={() => window.open(msg.image_url, '_blank')}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div style={{
                                padding: '12px 16px',
                                borderTop: '1px solid var(--border)',
                                background: 'rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid var(--primary)'
                                        }}
                                    />
                                    <button
                                        onClick={clearSelectedImage}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: '#FF4B4B',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <X size={14} color="#fff" />
                                    </button>
                                </div>
                                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    📷 Imagem pronta para enviar
                                </span>
                            </div>
                        )}

                        {/* Chat Input */}
                        <div style={{
                            padding: '16px',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {/* Image Options */}
                            {showImageOptions && (
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    padding: '12px',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '12px',
                                    animation: 'slide-up 0.2s ease-out'
                                }}>
                                    <button
                                        onClick={() => cameraInputRef.current?.click()}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #00D4FF, #00A8CC)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <Camera size={18} /> Câmera
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #7B2FFF, #9B4DFF)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <Image size={18} /> Galeria
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #00FF88, #00CC6A)',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: '#000',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <Paperclip size={18} /> Arquivo
                                    </button>
                                </div>
                            )}

                            {/* Hidden Inputs */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />
                            <input
                                type="file"
                                ref={cameraInputRef}
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />

                            {/* Input Row */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setShowImageOptions(!showImageOptions)}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: showImageOptions ? 'linear-gradient(135deg, #00D4FF, #7B2FFF)' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Image size={20} color={showImageOptions ? '#fff' : 'var(--text-muted)'} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !uploadingImage && handleSendChatMessage()}
                                    disabled={uploadingImage}
                                    style={{
                                        flex: 1,
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        padding: '14px 16px',
                                        color: '#fff',
                                        fontSize: '14px',
                                        outline: 'none',
                                        opacity: uploadingImage ? 0.6 : 1
                                    }}
                                />
                                <button
                                    onClick={handleSendChatMessage}
                                    disabled={uploadingImage || (!newMessage.trim() && !selectedImage)}
                                    style={{
                                        background: uploadingImage ? 'rgba(123, 47, 255, 0.5)' : 'linear-gradient(135deg, #00D4FF, #7B2FFF)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '14px 20px',
                                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: (!newMessage.trim() && !selectedImage) ? 0.5 : 1
                                    }}
                                >
                                    {uploadingImage ? (
                                        <Loader size={18} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                                    ) : (
                                        <Send size={18} color="#fff" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* === POST INPUT === */}
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <UserAvatarImage size={52} />
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
                    {posts.map((post, index) => {
                        const comments = postComments[post.id] || [];
                        const isExpanded = expandedComments[post.id];
                        const isLiked = likedPosts.has(post.id);

                        return (
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
                                    <UserAvatarImage avatarId={post.user_avatar_id} size={48} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>{post.user}</h4>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{post.time}</span>
                                    </div>
                                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                                        {post.badge || '🌟'}
                                    </span>
                                </div>

                                {/* Post Content */}
                                <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '20px', color: '#eee' }}>
                                    {post.content}
                                </p>

                                {/* Post Actions */}
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    borderTop: '1px solid var(--border)',
                                    paddingTop: '16px'
                                }}>
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        style={{
                                            flex: 1,
                                            background: isLiked ? 'rgba(255, 75, 75, 0.15)' : 'rgba(255,255,255,0.03)',
                                            border: isLiked ? '1px solid rgba(255, 75, 75, 0.3)' : '1px solid var(--border)',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            color: isLiked ? '#FF4B4B' : 'var(--text-muted)',
                                            cursor: isLiked ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Heart size={18} fill={isLiked ? '#FF4B4B' : 'none'} /> {post.likes || 0}
                                    </button>
                                    <button
                                        onClick={() => handleToggleComments(post.id)}
                                        style={{
                                            flex: 1,
                                            background: isExpanded ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                                            border: isExpanded ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid var(--border)',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            color: isExpanded ? '#00D4FF' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <MessageSquare size={18} /> {comments.length} Comentários
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

                                {/* Comments Section */}
                                {isExpanded && (
                                    <div style={{
                                        marginTop: '16px',
                                        paddingTop: '16px',
                                        borderTop: '1px solid var(--border)',
                                        animation: 'slide-up 0.3s ease-out'
                                    }}>
                                        {/* Existing Comments */}
                                        {comments.length > 0 && (
                                            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {comments.map((comment, cIndex) => (
                                                    <div
                                                        key={comment.id || cIndex}
                                                        style={{
                                                            display: 'flex',
                                                            gap: '10px',
                                                            padding: '12px',
                                                            background: 'rgba(0,0,0,0.2)',
                                                            borderRadius: '12px'
                                                        }}
                                                    >
                                                        <UserAvatarImage avatarId={comment.user_avatar_id} size={32} />
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                <span style={{ fontWeight: '600', fontSize: '13px' }}>{comment.user_name}</span>
                                                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LVL {comment.user_level || 1}</span>
                                                            </div>
                                                            <p style={{ fontSize: '14px', color: '#ddd', lineHeight: '1.5' }}>{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Comment */}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="Escreva um comentário..."
                                                value={commentInputs[post.id] || ''}
                                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                style={{
                                                    flex: 1,
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '12px',
                                                    padding: '12px 16px',
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    outline: 'none'
                                                }}
                                            />
                                            <button
                                                onClick={() => handleAddComment(post.id)}
                                                style={{
                                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    padding: '12px 16px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Send size={16} color="#fff" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CSS for spin animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Community;
