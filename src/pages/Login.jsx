import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck, LogIn } from 'lucide-react';
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useGame();
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    try {
      const { error } = await login(email, password);
      if (error) setError('Credenciais inválidas. Tente novamente.');
      else navigate('/app');
    } catch {
      setError('Erro inesperado ao tentar fazer login.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fn-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Particles color="var(--primary)" count={30} />

      <div className="fn-modal" style={{ maxWidth: '450px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <div style={{ background: 'rgba(255, 51, 102, 0.1)', padding: '20px', borderRadius: '50%', border: '1px solid var(--secondary)' }}>
            <LogIn size={40} color="var(--secondary)" />
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.8rem' }}>BEM-VINDO DE VOLTA</h2>
        <p className="fn-modal-sub">
          Acesse sua conta para continuar sua jornada no Desafio dos Vencedores.
        </p>

        {error && <div className="fn-error">{error}</div>}

        <form onSubmit={handleLogin} className="fn-auth-form">
          <div className="fn-form-group">
            <label>E-mail</label>
            <input type="email" placeholder="seuemail@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fn-form-group">
            <label>Senha</label>
            <input type="password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="fn-auth-btn" disabled={authLoading} style={{ background: 'linear-gradient(90deg, #FF3366, #FF6B35)', color: '#fff' }}>
            {authLoading ? 'ENTRANDO...' : 'ENTRAR NO JOGO'}
          </button>
        </form>

        <p className="fn-switch">
          Ainda não é um Vencedor? <a onClick={() => navigate('/')}>Veja os planos</a>
        </p>
      </div>
    </div>
  );
};


export default Login;
