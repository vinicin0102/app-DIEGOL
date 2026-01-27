import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Dumbbell, Trophy, Swords, UserPlus, LogIn, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import InstallPWA from '../components/InstallPWA';

const Home = () => {
  const navigate = useNavigate();
  const { login, signUp } = useGame();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await login(email, password);
    setLoading(false);

    if (error) {
      setError('Erro ao entrar. Verifique suas credenciais.');
      console.error(error);
    } else {
      // Successful login will trigger auth state change and redirect via App.jsx
      // But we can also push to /app to be sure
      navigate('/app');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Use signUp from context
    const { error } = await signUp(email, password, name);
    setLoading(false);

    if (error) {
      setError('Erro ao criar conta: ' + error.message);
    } else {
      alert('Conta criada! Verifique seu email se necessário.');
      // Usually Supabase auto-logs in unless email confirm is on.
      // If auto-login, we navigate.
      navigate('/app');
    }
  };

  // Unlock scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    return () => {
      // Revert when leaving if necessary, but usually we want auto
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="brand">
          <div className="logo-icon">⚡</div>
          <span className="brand-text">FITQUEST</span>
        </div>
        <div className="nav-actions">
          <button onClick={() => setShowLogin(true)} className="btn-text">Entrar</button>
          <button onClick={() => setShowSignup(true)} className="btn-primary-sm">Criar Conta</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">
            <span className="badge-dot"></span>
            Nova Era Fitness
          </div>
          <h1 className="hero-title">
            Transforme seu <br />
            <span className="text-gradient">Treino em Jogo</span>
          </h1>
          <p className="hero-subtitle">
            Evolua seu personagem real a cada gota de suor. Complete missões, derrote chefes e conquiste o corpo que você sempre quis.
          </p>
          <div className="hero-buttons">
            <button onClick={() => setShowSignup(true)} className="btn-hero-primary">
              Começar Aventura <ChevronRight size={20} />
            </button>
            <button className="btn-hero-secondary">
              Ver Trailer
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <strong>12k+</strong>
              <span>Atletas</span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <strong>500+</strong>
              <span>Missões</span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <strong>4.9</strong>
              <span>Avaliação</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Element (Abstract Phone/Game UI) */}
        <div className="hero-visual">
          <div className="phone-mockup floating">
            <div className="screen-content">
              <div className="game-card">
                <div className="card-header">
                  <Shield size={24} color="#FFD700" />
                  <span>Missão Diária</span>
                </div>
                <h3>Derrotar o Preguiça</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="xp-badge">+500 XP</div>
              </div>
              <div className="stats-row">
                <div className="mini-stat">
                  <Zap size={16} color="#00FF88" />
                  <span>Força</span>
                </div>
                <div className="mini-stat">
                  <Swords size={16} color="#7B2FFF" />
                  <span>Combate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">O Jogo Começou</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-green"><Trophy size={32} /></div>
            <h3>Gamificação Real</h3>
            <p>Seus exercícios viram XP. Suba de nível na vida real e no app simultaneamente.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-purple"><Swords size={32} /></div>
            <h3>Batalhas de Chefes</h3>
            <p>Use seus exercícios para causar dano. A preguiça é seu maior inimigo.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-blue"><UserPlus size={32} /></div>
            <h3>Comunidade Guilda</h3>
            <p>Entre em clãs, participe de raids em grupo e conquiste territórios.</p>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel slide-up">
            <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
            <h2>Bem-vindo de volta</h2>
            <p className="modal-subtitle">Continue sua jornada lendária</p>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
              <button type="submit" className="btn-primary full-width" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar no Jogo'}
              </button>
            </form>
            <p className="switch-auth">
              Não tem conta? <a onClick={() => { setShowLogin(false); setShowSignup(true) }}>Criar agora</a>
            </p>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel slide-up">
            <button className="close-btn" onClick={() => setShowSignup(false)}>×</button>
            <h2>Crie sua Lenda</h2>
            <p className="modal-subtitle">Seu primeiro passo para a glória</p>

            <form onSubmit={handleSignup} className="auth-form">
              <div className="form-group">
                <label>Nome do Herói</label>
                <input
                  type="text"
                  placeholder="Como quer ser chamado?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary full-width">
                Iniciar Aventura
              </button>
            </form>
            <p className="switch-auth">
              Já tem conta? <a onClick={() => { setShowSignup(false); setShowLogin(true) }}>Fazer login</a>
            </p>
          </div>
        </div>
      )}

      <InstallPWA />

      {/* Internal Styles */}
      <style>{`
        .landing-container {
          min-height: 100vh;
          height: auto;
          background-color: #030304;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(0, 255, 136, 0.05), transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(123, 47, 255, 0.08), transparent 40%);
          color: #fff;
          font-family: var(--font-main, sans-serif);
          overflow-y: auto !important;
          overflow-x: hidden;
          position: relative;
        }

        /* Nav */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 48px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          backdrop-filter: blur(10px);
          background: rgba(3, 3, 4, 0.8);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary), #00DDAA);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .brand-text {
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -1px;
        }
        
        .nav-actions {
          display: flex;
          gap: 16px;
        }

        .btn-text {
          background: none;
          border: none;
          color: #ccc;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .btn-text:hover { color: #fff; }

        .btn-primary-sm {
          background: var(--primary);
          color: #000;
          border: none;
          padding: 8px 16px;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-primary-sm:hover { transform: scale(1.05); }

        /* Hero */
        .hero-section {
          padding: 160px 48px 80px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 100vh;
        }

        .hero-title {
          font-size: 64px;
          line-height: 1.1;
          font-weight: 900;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #8A8A99;
          line-height: 1.6;
          max-width: 480px;
          margin-bottom: 40px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.2);
          color: var(--primary);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--primary);
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 60px;
        }

        .btn-hero-primary {
          background: linear-gradient(135deg, var(--primary) 0%, #00DDAA 100%);
          color: #000;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 16px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
        }

        .btn-hero-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 255, 136, 0.3);
        }

        .btn-hero-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .stat-item strong {
          display: block;
          font-size: 24px;
          color: #fff;
        }
        
        .stat-item span {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-separator {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, #00FFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Mockup */
        .phone-mockup {
          width: 300px;
          height: 600px;
          background: #000;
          border-radius: 40px;
          border: 8px solid #222;
          box-shadow: 
            0 0 0 2px #333,
            0 50px 100px rgba(0,0,0,0.5);
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        .screen-content {
          height: 100%;
          background: #111;
          background-image: radial-gradient(circle at 50% 0%, #222, #111);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }

        .game-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 20px;
          text-align: left;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #FFD700;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          margin: 12px 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #FFD700;
        }

        /* Features */
        .features-section {
          padding: 80px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 36px;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 32px;
          border-radius: 24px;
          transition: transform 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          background: rgba(255,255,255,0.04);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .icon-green { background: rgba(0,255,136,0.1); color: var(--primary); }
        .icon-purple { background: rgba(123,47,255,0.1); color: var(--secondary); }
        .icon-blue { background: rgba(0,200,255,0.1); color: #00C8FF; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          background: #111;
          border: 1px solid #333;
          border-radius: 24px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #666;
          font-size: 24px;
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #888;
        }

        .form-group input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #333;
          padding: 12px;
          border-radius: 12px;
          color: #fff;
          font-size: 16px;
        }

        .form-group input:focus {
          border-color: var(--primary);
          outline: none;
        }

        .full-width {
          width: 100%;
          margin-top: 10px;
        }

        .switch-auth {
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }

        .switch-auth a {
          color: var(--primary);
          cursor: pointer;
          font-weight: 600;
          margin-left: 5px;
        }
        
        .switch-auth a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
          .landing-container {
             overflow-y: auto;
             height: auto;
             position: relative;
          }

          .landing-nav {
            padding: 16px 20px;
            background: rgba(3, 3, 4, 0.9);
          }

          .hero-section {
            grid-template-columns: 1fr;
            padding: 100px 20px 60px;
            text-align: center;
            gap: 40px;
            min-height: auto;
          }
          
          .hero-title {
            font-size: 42px;
          }

          .hero-subtitle {
            font-size: 16px;
            margin: 0 auto 32px;
          }

          .hero-buttons {
            justify-content: center;
            flex-direction: column;
            width: 100%;
          }

          .hero-buttons button {
            width: 100%;
            justify-content: center;
          }
          
          .hero-stats {
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
          }

          .hero-visual {
            transform: scale(0.9);
            margin-top: -20px;
          }

          .features-section {
            padding: 60px 20px 100px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .hidden-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// Mobile optimizations applied
export default Home;
