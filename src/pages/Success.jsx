import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import './Funnel.css';

const Success = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useGame();
  const navigate = useNavigate();

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
    <div className="fn-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="fn-auth-modal" style={{ position: 'relative', width: '100%', maxWidth: '500px', background: 'rgba(15, 15, 20, 0.95)', border: '1px solid #FF3366', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ShieldCheck size={64} color="#00FF88" />
        </div>
        
        <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.8rem' }}>PAGAMENTO CONFIRMADO!</h2>
        <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '0.95rem' }}>
          Seja bem-vindo(a) ao Desafio dos Vencedores. Para liberar seu acesso imediato ao aplicativo, crie seus dados de login abaixo:
        </p>

        {error && <div className="fn-error" style={{ color: '#ff4444', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="fn-input-group">
            <label>Seu Nome ou Apelido de Herói</label>
            <input 
              type="text" 
              placeholder="Ex: João Silva" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
          </div>
          <div className="fn-input-group">
            <label>E-mail (O mesmo da compra)</label>
            <input 
              type="email" 
              placeholder="seuemail@exemplo.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
          </div>
          <div className="fn-input-group">
            <label>Senha de Acesso</label>
            <input 
              type="password" 
              placeholder="Minimo 6 caracteres" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength={6}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={authLoading}
            style={{ 
              marginTop: '10px', 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(90deg, #FF3366, #FF6B35)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              cursor: authLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {authLoading ? 'LIBERANDO ACESSO...' : 'CRIAR CONTA E ACESSAR O APP'}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', color: '#666', fontSize: '0.8rem' }}>
          *Use o mesmo e-mail que você utilizou no pagamento para que possamos validar sua conta automaticamente no nosso sistema.
        </p>
      </div>
    </div>
  );
};

export default Success;
