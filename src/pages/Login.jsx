import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck } from 'lucide-react';
import './Funnel.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useGame();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    
    try {
      const { error } = await login(email, password);
      if (error) {
        setError('Credenciais inválidas. Tente novamente.');
      } else {
        navigate('/app');
      }
    } catch {
      setError('Erro inesperado ao tentar fazer login.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fn-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="fn-auth-modal" style={{ position: 'relative', width: '100%', maxWidth: '400px', background: 'rgba(15, 15, 20, 0.95)', border: '1px solid #FF3366', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ShieldCheck size={50} color="#FF3366" />
        </div>
        
        <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.5rem' }}>BEM-VINDO DE VOLTA</h2>
        <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '0.9rem' }}>
          Acesse sua conta para continuar sua jornada no Desafio dos Vencedores.
        </p>

        {error && <div className="fn-error" style={{ color: '#ff4444', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="fn-input-group" style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px', display: 'block' }}>E-mail</label>
            <input 
              type="email" 
              placeholder="seuemail@exemplo.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
          </div>
          <div className="fn-input-group" style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px', display: 'block' }}>Senha</label>
            <input 
              type="password" 
              placeholder="Sua senha" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={authLoading}
            style={{ 
              marginTop: '10px', 
              width: '100%', 
              padding: '14px', 
              background: 'linear-gradient(90deg, #FF3366, #FF6B35)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              cursor: authLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {authLoading ? 'ENTRANDO...' : 'ACESSAR CONTA'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#888', fontSize: '0.85rem' }}>
          Ainda não é um Vencedor? <a href="/" style={{ color: '#FF3366', textDecoration: 'none' }}>Veja os planos</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
