import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit, Activity, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

const AIChat = () => {
    const { user } = useGame();
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: `Olá ${user.name}! Sou seu Mentor de Evolução. Estou aqui para analisar seu progresso no nível ${user.level} e te dar as melhores estratégias de treino e mentalidade. Como posso te ajudar hoje?` }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newUserMsg = { id: Date.now(), type: 'user', text: inputText };
        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulating AI Response based on context
        setTimeout(() => {
            let responseText = `Como você está no nível ${user.level}, você deve focar em constância. `;
            if (inputText.toLowerCase().includes('treino')) {
                responseText += "Sua série atual prioriza hipertrofia. Tente focar na conexão mente-músculo e na cadência do exercício.";
            } else if (inputText.toLowerCase().includes('dieta')) {
                responseText += "Lembre-se de bater sua meta de proteínas (aproximadamente 2g/kg) para sustentar sua evolução.";
            } else if (inputText.toLowerCase().includes('desânimo') || inputText.toLowerCase().includes('preguiça')) {
                responseText += "A motivação é passageira, a disciplina é eterna. Levante-se e faça o que deve ser feito. O Chefão está observando.";
            } else {
                responseText += "Continue firme na jornada. Cada missão cumprida te deixa 1% melhor.";
            }

            const newBotMsg = { id: Date.now() + 1, type: 'bot', text: responseText };
            setMessages(prev => [...prev, newBotMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="page-enter" style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '15px', background: 'linear-gradient(135deg, var(--primary), #00EEFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={28} color="#000" />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '900' }}>Mentor de <span className="text-gradient">Evolução</span></h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF88' }}></div>
                        <span style={{ fontSize: '12px', color: '#00FF88', fontWeight: '700' }}>ONLINE</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ 
                        display: 'flex', 
                        flexDirection: msg.type === 'bot' ? 'row' : 'row-reverse',
                        gap: '12px',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '10px', 
                            background: msg.type === 'bot' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {msg.type === 'bot' ? <Sparkles size={18} color="var(--primary)" /> : <User size={18} color="#fff" />}
                        </div>
                        <div style={{ 
                            maxWidth: '80%',
                            padding: '16px 20px',
                            borderRadius: msg.type === 'bot' ? '0 20px 20px 20px' : '20px 0 20px 20px',
                            background: msg.type === 'bot' ? 'rgba(0, 0, 0, 0.4)' : 'var(--primary)',
                            color: msg.type === 'bot' ? '#eee' : '#000',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            border: msg.type === 'bot' ? '1px solid rgba(0, 255, 136, 0.1)' : 'none',
                            fontWeight: msg.type === 'user' ? '600' : '400'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '48px', display: 'flex', gap: '4px' }}>
                        Digitando...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Pergunte sobre treinos, dieta ou mentalidade..."
                    style={{ 
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '15px',
                        padding: '16px 24px',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '14px'
                    }}
                />
                <button 
                    type="submit"
                    style={{ 
                        width: '56px',
                        height: '56px',
                        borderRadius: '15px',
                        background: 'var(--primary)',
                        border: 'none',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Send size={24} />
                </button>
            </form>
        </div>
    );
};

export default AIChat;
