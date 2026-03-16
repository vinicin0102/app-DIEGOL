import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import './Funnel.css';

const Particles = ({ color = '#00FF88', count = 40 }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -Math.random() * 1.5 - 0.3,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.speedX; p.y += p.speedY;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [color, count]);
  return <canvas ref={canvasRef} className="particles-canvas" />;
};


const Success = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'relative';
    document.documentElement.classList.add('funnel-active');
    return () => {
      document.documentElement.classList.remove('funnel-active');
      document.documentElement.style.overflowY = '';
      document.documentElement.style.height = '';
      document.body.style.overflowY = '';
      document.body.style.height = '';
      document.body.style.position = '';
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    
    // Attempt signup
    const { data, error } = await signUp(email, password, name);
    setAuthLoading(false);
    
    if (error) { 
      setError('Erro: ' + error.message); 
      return; 
    }
    
    // Success flow
    if (data?.user && !data?.session) {
      alert('Conta criada! 📧 Verifique seu e-mail para confirmar a conta e ter acesso ao app.');
      navigate('/');
    } else if (data?.session) {
      navigate('/app');
    }
  };
  return (
    <div className="fn-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Particles color="var(--primary)" count={30} />
      <div className="fn-modal" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <ShieldCheck size={64} color="var(--primary)" />
        </div>
        
        <h2 style={{ fontSize: '1.8rem' }}>PAGAMENTO CONFIRMADO!</h2>
        <p className="fn-modal-sub">
          Seja bem-vindo(a) ao Desafio dos Vencedores. Para liberar seu acesso imediato ao aplicativo, crie seus dados de login abaixo:
        </p>

        {error && <div className="fn-error">{error}</div>}

        <form onSubmit={handleSignup} className="fn-auth-form">
          <div className="fn-form-group">
            <label>Seu Nome ou Apelido de Herói</label>
            <input type="text" placeholder="Ex: João Silva" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="fn-form-group">
            <label>E-mail (O mesmo da compra)</label>
            <input type="email" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fn-form-group">
            <label>Senha de Acesso</label>
            <input type="password" placeholder="Minimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          
          <button type="submit" className="fn-auth-btn" disabled={authLoading}>
            {authLoading ? 'LIBERANDO ACESSO...' : 'CRIAR CONTA E ACESSAR O APP'}
          </button>
        </form>
        
        <p className="fn-switch">
          Já tem conta? <a onClick={() => navigate('/login')}>Fazer login</a>
        </p>
        
        <p style={{ marginTop: '20px', color: '#444', fontSize: '0.7rem', fontStyle: 'italic' }}>
          *Use o mesmo e-mail que você utilizou no pagamento para validação automática.
        </p>
      </div>
    </div>
  );
};

export default Success;
