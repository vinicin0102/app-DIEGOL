import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { UserPlus, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Funnel.css';

const Particles = ({ color = '#00D4FF', count = 40 }) => {
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
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 1.2 - 0.2,
      opacity: Math.random() * 0.5 + 0.2,
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
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    animate();
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    };
  }, [color, count]);
  return <canvas ref={canvasRef} className="particles-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('funnel-active');
    return () => document.documentElement.classList.remove('funnel-active');
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    setLoading(true);

    try {
      // 1. Verificar se o e-mail está na whitelist (REMOVIDO A PEDIDO DO CLIENTE PARA DEIXAR GRATUITO POR ENQUANTO)
      /* 
      const { data: whitelistData, error: whitelistError } = await supabase
        .from('authorized_emails')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (whitelistError || !whitelistData) {
        setError('Este e-mail não está autorizado para acesso gratuito. Verifique com o administrador.');
        setLoading(false);
        return;
      }
      */

      // 2. Tentar criar a conta
      const { data, error: signUpError } = await signUp(email.toLowerCase().trim(), password, name);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
            setError('Este e-mail já possui uma conta.');
        } else {
            setError('Erro ao criar conta: ' + signUpError.message);
        }
      } else {
        setSuccess(true);
        // Opcional: redirecionar após alguns segundos ou mostrar mensagem
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="fn-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Particles color="#00FF88" count={50} />
            <div className="fn-modal" style={{ maxWidth: '450px', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                    <ShieldCheck size={64} color="#00FF88" />
                </div>
                <h2 style={{ fontSize: '2rem', color: '#00FF88' }}>CONTA CRIADA!</h2>
                <p className="fn-modal-sub">
                    Sua conta foi criada com sucesso e seu acesso já está liberado.
                </p>
                <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                    Redirecionando para o login...
                </p>
                <button 
                  onClick={() => navigate('/login')}
                  className="fn-auth-btn" 
                  style={{ background: 'var(--primary)', marginTop: '20px' }}
                >
                    IR PARA LOGIN
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fn-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <Particles color="var(--primary)" count={30} />

      <div className="fn-modal" style={{ maxWidth: '450px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(0, 212, 255, 0.1)', padding: '15px', borderRadius: '50%', border: '1px solid var(--primary)' }}>
            <UserPlus size={40} color="var(--primary)" />
          </div>
        </div>
        
        <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>CRIAR CONTA GRATUITA</h2>
        <p className="fn-modal-sub">
          Reserve seu lugar no Desafio dos Vencedores (Acesso Autorizado).
        </p>

        {error && (
            <div className="fn-error" style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid #FF3366', borderRadius: '8px', fontSize: '13px', color: '#FF3366' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="fn-auth-form">
          <div className="fn-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={14} /> Nome Completo
            </label>
            <input 
              type="text" 
              placeholder="Como quer ser chamado?" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="fn-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} /> Seu E-mail
            </label>
            <input 
              type="email" 
              placeholder="seuemail@exemplo.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="fn-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} /> Escolha uma Senha
            </label>
            <input 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="fn-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} /> Confirme sua Senha
            </label>
            <input 
              type="password" 
              placeholder="Repita a senha" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="fn-auth-btn" 
            disabled={loading} 
            style={{ 
                background: 'linear-gradient(90deg, #00D4FF, #7B2FFF)', 
                color: '#fff',
                marginTop: '10px'
            }}
          >
            {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'}
          </button>
        </form>

        <p className="fn-switch" style={{ marginTop: '20px', fontSize: '14px' }}>
          Já tem acesso? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Fazer Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
