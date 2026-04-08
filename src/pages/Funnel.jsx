import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ChevronRight, Target, Shield, Zap, Swords, Trophy, Star, Lock, Crown, CheckCircle, Users, Flame, Award, TrendingUp, MessageCircle, ShieldCheck } from 'lucide-react';
import './Funnel.css';

/* ─── SOCIAL PROOF DATA ─── */
const SOCIAL_PROOF_TOASTS = [
  { name: 'Lucas M.', action: 'acabou de criar sua conta', time: 'agora', emoji: '🔥' },
  { name: 'Ana C.', action: 'subiu para o nível 8', time: '2 min atrás', emoji: '⚡' },
  { name: 'Pedro H.', action: 'completou 30 dias seguidos', time: '5 min atrás', emoji: '🏆' },
  { name: 'Mariana S.', action: 'derrotou o Desafio Coletivo', time: '8 min atrás', emoji: '💀' },
  { name: 'Felipe R.', action: 'desbloqueou tema Fogo Infernal', time: '12 min atrás', emoji: '🔥' },
  { name: 'Camila L.', action: 'entrou na guilda Top 1', time: '15 min atrás', emoji: '👑' },
  { name: 'Gabriel T.', action: 'atingiu 10.000 XP', time: '18 min atrás', emoji: '💎' },
  { name: 'Isabela F.', action: 'completou missão lendária', time: '20 min atrás', emoji: '⭐' },
  { name: 'Rafael N.', action: 'acabou de criar sua conta', time: '22 min atrás', emoji: '🎮' },
  { name: 'Juliana P.', action: 'subiu para nível 15', time: '25 min atrás', emoji: '🚀' },
];

const TESTIMONIALS = [
  {
    name: 'Lucas M.',
    avatar: '🧑‍💻',
    text: 'Eu já tinha usado vários apps de treino e métodos famosos, mas nada foi igual ao FitQuest! Esse sistema foi a primeira coisa que não dependeu da minha força de vontade pra usar! Simplesmente genial.',
    rating: 5,
    level: 'Nível 12',
  },
  {
    name: 'Ana Carolina',
    avatar: '👩‍🦰',
    text: 'Foi muito fácil de instalar no celular, e a gamificação ajuda MUITO! Ter ali na tela inicial sem contar que dá pra usar em qualquer dispositivo. Melhor investimento do ano COM CERTEZA 😄',
    rating: 5,
    level: 'Nível 8',
  },
  {
    name: 'Pedro Henrique',
    avatar: '🧔',
    text: 'Fiquei com receio de ser muito complexa, mas me surpreendi! Nunca tive contato com nada do tipo, o sistema de batalha contra chefões é simplesmente VICIANTE!',
    rating: 5,
    level: 'Nível 15',
  },
  {
    name: 'Mariana S.',
    avatar: '👩',
    text: 'Sinceramente eu não sabia que eu tinha que transformar minha rotina em algo divertido. Agora eu QUERO treinar pra subir de nível. Nunca pensei que ia funcionar assim!',
    rating: 5,
    level: 'Nível 10',
  },
];

const COUNTER_STATS = { users: 2847, bosses: 156, missions: 48920 };

/* ─── THEMES DATA ─── */
const THEMES = [
  { id: 'sakura', name: 'Sakura Cerejeira', emoji: '🌸', rarity: 'Épico', rarityColor: '#FF69B4', desc: 'Tons de rosa suave e pétalas flutuantes', bg: '#2d0a1e', accent: '#FF69B4', particles: '#FF69B4' },
  { id: 'fire', name: 'Fogo Infernal', emoji: '🔥', rarity: 'Lendário', rarityColor: '#FFD700', desc: 'Chamas ardentes e cores de fogo intenso', bg: '#2d1500', accent: '#FF4500', particles: '#FF4500' },
  { id: 'neon', name: 'Galáxia Neon', emoji: '⭐', rarity: 'Épico', rarityColor: '#00C8FF', desc: 'Cores neon vibrantes e estrelas brilhantes', bg: '#0a1a2d', accent: '#00C8FF', particles: '#00C8FF' },
  { id: 'metal', name: 'Metal Líquido', emoji: '⚙️', rarity: 'Épico', rarityColor: '#C0C0C0', desc: 'Estética industrial elegante e minimalista', bg: '#1a1a1a', accent: '#888', particles: '#FFFFFF' },
  { id: 'aurora', name: 'Aurora Boreal', emoji: '💜', rarity: 'Épico', rarityColor: '#7B2FFF', desc: 'Cores especiais das luzes do norte', bg: '#0a0a1a', accent: '#7B2FFF', particles: '#7B2FFF' },
  { id: 'eclipse', name: 'Eclipse Sombrio', emoji: '🌑', rarity: 'Lendário', rarityColor: '#FFD700', desc: 'Estética do vazio cósmico profundo', bg: '#050508', accent: '#FFD700', particles: '#FFD700' },
];

/* ─── PARTICLES COMPONENT ─── */
const Particles = ({ color = '#FFD700', count = 40 }) => {
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
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [color, count]);
  
  return <canvas ref={canvasRef} className="particles-canvas" />;
};

/* ─── SOCIAL TOAST COMPONENT ─── */
const SocialToast = ({ toast, visible }) => (
  <div className={`social-toast ${visible ? 'toast-visible' : 'toast-hidden'}`}>
    <div className="toast-emoji">{toast.emoji}</div>
    <div className="toast-info">
      <strong>{toast.name}</strong> {toast.action}
      <span className="toast-time">{toast.time}</span>
    </div>
  </div>
);

/* ─── ANIMATED COUNTER ─── */
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  
  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>;
};

/* ─── TYPING EFFECT ─── */
const TypingText = ({ texts, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return <span className="typing-text">{displayText}<span className="typing-cursor">|</span></span>;
};


/* ═══════════════════════════════════════════
   ██  MAIN FUNNEL COMPONENT  ██
   ═══════════════════════════════════════════ */
const Funnel = () => {
  const navigate = useNavigate();
  const { login, signUp } = useGame();

  /* ─── ENABLE SCROLL: override global overflow:hidden ─── */
  useEffect(() => {
    document.documentElement.classList.add('funnel-active');
    return () => document.documentElement.classList.remove('funnel-active');
  }, []);
  const [funnelState, setFunnelState] = useState('start');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([
    { text: 'VERIFICANDO SINAIS VITAIS...', done: false },
    { text: 'INICIALIZANDO MOTOR DE GAMIFICAÇÃO...', done: false },
    { text: 'SINCRONIZANDO CONQUISTAS...', done: false },
    { text: 'CARREGANDO DESAFIOS COLETIVOS...', done: false },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [maxTabReached, setMaxTabReached] = useState(1);
  const [currentToast, setCurrentToast] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [showUnlockScreen, setShowUnlockScreen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState('fire');

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[1];

  // Auth modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redireciona se já for um usuário conhecido
    const hasAccount = localStorage.getItem('vencedores_has_account');
    if (hasAccount && funnelState === 'start') {
       // navigate('/login'); // Opcional: Descomente para forçar o login se já tiver conta
    }
    window.scrollTo(0,0);
  }, [funnelState]);

  useEffect(() => {
    // Force scroll enablement
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

  /* ─── SOCIAL PROOF TOASTS ─── */
  useEffect(() => {
    if (funnelState !== 'presentation') return;
    const interval = setInterval(() => {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        setTimeout(() => setCurrentToast(prev => (prev + 1) % SOCIAL_PROOF_TOASTS.length), 500);
      }, 4000);
    }, 7000);
    // Show first toast quickly
    setTimeout(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
    }, 2000);
    return () => clearInterval(interval);
  }, [funnelState]);

  /* ─── LOADING SEQUENCE ─── */
  useEffect(() => {
    if (funnelState !== 'loading') return;
    let progress = 0;
    let stepIdx = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 3;
      if (progress > 25 && stepIdx === 0) { stepIdx = 1; updateStep(0); }
      if (progress > 50 && stepIdx === 1) { stepIdx = 2; updateStep(1); }
      if (progress > 75 && stepIdx === 2) { stepIdx = 3; updateStep(2); }
      if (progress >= 100) {
        progress = 100;
        updateStep(3);
        clearInterval(interval);
        setTimeout(() => setFunnelState('presentation'), 1000);
      }
      setLoadingProgress(progress);
    }, 250);
    return () => clearInterval(interval);
  }, [funnelState]);

  const updateStep = (idx) => {
    setLoadingSteps(prev => prev.map((s, i) => i === idx ? { ...s, done: true } : s));
  };

  /* ─── AUTH HANDLERS ─── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    try {
      const { error } = await login(email, password);
      if (error) setError('Credenciais inválidas. Tente novamente.');
      else navigate('/app');
    } catch { setError('Erro inesperado.'); }
    finally { setAuthLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    const { data, error } = await signUp(email, password, name);
    setAuthLoading(false);
    if (error) { setError('Erro: ' + error.message); return; }
    if (data?.user && !data?.session) {
      alert('Conta criada! 📧 Verifique seu e-mail para confirmar.');
      setShowSignup(false);
      setShowLogin(true);
    } else if (data?.session) {
      navigate('/app');
    }
  };

  /* ─── TAB / LEVEL NAVIGATION ─── */
  const nextTab = () => {
    if (activeTab < 5) {
      const next = activeTab + 1;
      // If going to level 5, show unlock cinematics first
      if (next === 5) {
        setShowUnlockScreen(true);
        setTimeout(() => {
          setShowUnlockScreen(false);
          setActiveTab(5);
          setMaxTabReached(5);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3500);
      } else {
        setActiveTab(next);
        if (next > maxTabReached) setMaxTabReached(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId <= maxTabReached) {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ═══════════════════════════════════════════
     ██  RENDER SCREENS  ██
     ═══════════════════════════════════════════ */

  /* ─── START SCREEN ─── */
  const renderStartScreen = () => (
    <div className="fn-start">
      <Particles color="#00FF88" count={30} />
      
      <div className="fn-start-content">
        <div className="fn-hero-image-wrap">
          <img src="/assets/funnel/hero.png" alt="Plataforma Vencedores" className="fn-hero-image" />
        </div>

        <h1 className="fn-glitch">SISTEMA <span style={{color: 'var(--primary)'}}>VENCEDORES</span></h1>
        
        <div className="fn-start-stats">
          <div className="fn-live-dot"></div>
          <span><strong><AnimatedCounter end={COUNTER_STATS.users} /></strong> jogadores treinando agora</span>
        </div>
        
        <button className="fn-start-btn" onClick={() => setFunnelState('loading')}>
          <span>COMEÇAR JORNADA</span>
          <ChevronRight size={22} className="fn-chevron-pulse" />
        </button>
        <p className="fn-start-sub">Toque para desbloquear seu potencial máximo</p>
        
        <div className="fn-hero-login" style={{marginTop:'30px', opacity:'0.7'}}>
          <p>Já é um Vencedor? <a onClick={() => navigate('/login')} style={{color:'var(--primary)', cursor:'pointer', fontWeight:'bold', textDecoration:'underline'}}>Entrar em minha conta</a></p>
        </div>
      </div>
    </div>
  );

  /* ─── LOADING SCREEN ─── */
  const renderLoadingScreen = () => (
    <div className="fn-loading">
      <div className="fn-loading-box">
        {loadingSteps.map((step, i) => (
          <div key={i} className={`fn-load-step ${step.done ? 'done' : i === loadingSteps.findIndex(s => !s.done) ? 'active' : ''}`}>
            {step.done ? <CheckCircle size={18} className="fn-check" /> : <div className="fn-spinner-mini" />}
            <span>{step.text}</span>
          </div>
        ))}
        
        <div className="fn-progress-wrap">
          <div className="fn-progress-track">
            <div className="fn-progress-bar" style={{ width: `${loadingProgress}%` }}>
              <div className="fn-progress-glow"></div>
            </div>
          </div>
          <span className="fn-progress-pct">{loadingProgress}%</span>
        </div>
      </div>
    </div>
  );

  /* ─── UNLOCK CINEMATIC ─── */
  const renderUnlockScreen = () => (
    <div className="fn-unlock-screen">
      <div className="fn-unlock-content">
        <Crown size={80} className="fn-crown-icon" />
        <h2 className="fn-unlock-title">NÍVEL FINAL</h2>
        <h3 className="fn-unlock-sub">DESBLOQUEADO!</h3>
        <p className="fn-unlock-desc">Você completou a jornada. Prepare-se para a recompensa final...</p>
        <div className="fn-unlock-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );

  /* ─── PRESENTATION SCREEN ─── */
  const tabs = [
    { id: 1, title: 'NÍVEL 1', subtitle: 'O Despertar', icon: Star, color: '#00FF88' },
    { id: 2, title: 'NÍVEL 2', subtitle: 'O Sistema', icon: Target, color: '#00C8FF' },
    { id: 3, title: 'NÍVEL 3', subtitle: 'Os Temas', icon: Swords, color: activeTab === 3 ? currentTheme.accent : '#FF3366' },
    { id: 4, title: 'NÍVEL 4', subtitle: 'Os Forjados', icon: MessageCircle, color: '#FFD700' },
    { id: 5, title: 'NÍVEL 5', subtitle: 'A Decisão', icon: Crown, color: '#7B2FFF' },
  ];

  const renderPresentation = () => (
    <div className="fn-present">
      {/* Social Proof Toast */}
      <SocialToast toast={SOCIAL_PROOF_TOASTS[currentToast]} visible={toastVisible} />

      {/* Tab Navigation */}
      <div className="fn-tabs-wrap">
        <div className="fn-tabs">
          {tabs.map((tab) => {
            const unlocked = tab.id <= maxTabReached;
            const active = tab.id === activeTab;
            const Icon = unlocked ? tab.icon : Lock;
            return (
              <button
                key={tab.id}
                className={`fn-tab ${active ? 'fn-tab-active' : ''} ${!unlocked ? 'fn-tab-locked' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                style={active ? { '--tab-color': tab.color } : {}}
              >
                <Icon size={18} />
                <div className="fn-tab-text">
                  <span className="fn-tab-title">{tab.title}</span>
                  <span className="fn-tab-sub">{tab.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="fn-global-bar">
          <div className="fn-global-fill" style={{ width: `${(maxTabReached / 5) * 100}%`, background: tabs[activeTab - 1].color }}></div>
        </div>
        <span className="fn-global-pct" style={{ color: tabs[activeTab - 1].color }}>{activeTab * 20}% concluído</span>
      </div>

      {/* Step Content */}
      <div className="fn-content" key={activeTab}>
        {activeTab === 1 && renderStep1()}
        {activeTab === 2 && renderStep2()}
        {activeTab === 3 && renderStep3()}
        {activeTab === 4 && renderStep4()}
        {activeTab === 5 && renderStep5()}
      </div>

      {/* Next Button */}
      {activeTab < 5 && (
        <div className="fn-nav-bottom">
          <button className="fn-next-btn" style={{ '--btn-color': tabs[activeTab - 1].color }} onClick={nextTab}>
            PRÓXIMO NÍVEL <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

  /* ─── STEP 1: O DESPERTAR ─── */
  const renderStep1 = () => (
    <div className="fn-step fn-fade-in">
      <div className="fn-text-side">
        <h2 className="fn-big-title">
          SEU TREINO NUNCA MAIS SERÁ <span style={{color: 'var(--secondary)'}}>O MESMO</span>
        </h2>
        <p className="fn-desc">
          O Sistema Vencedores não é apenas um guia de exercícios. É a ponte entre quem você é hoje e o 
          <TypingText texts={[' HERÓI que você nasceu para ser.', ' VENCEDOR que está adormecido.', ' EXEMPLO para todos ao seu redor.']} speed={80} />
        </p>

        <div className="fn-vs-row">
          <div className="fn-vs-good">
            <span className="fn-vs-check">✔</span>
            Psicologia aplicada à gamificação.
          </div>
          <div className="fn-vs-good">
            <span className="fn-vs-check">✔</span>
            Consistência forçada pelo entretenimento.
          </div>
        </div>
      </div>

      <div className="fn-visual-side">
        <img src="/assets/funnel/evolution.png" alt="Evolução Fitness" className="fn-premium-image fn-float" />
      </div>
    </div>
  );

  /* ─── STEP 2: O SISTEMA ─── */
  const renderStep2 = () => (
    <div className="fn-step fn-fade-in">
      <div className="fn-text-side">
        <h2 className="fn-big-title" style={{ color: '#00C8FF' }}>BATALHE CONTRA<br/>SEUS LIMITES</h2>
        <p className="fn-desc">Cada repetição no mundo real causa dano aos chefões globais. Una-se a milhares de jogadores para derrotar monstros que representam a procrastinação.</p>
        
        <div className="fn-features-list">
           <div className="fn-feat-item" style={{display:'flex', gap:'15px', marginBottom:'20px'}}>
              <Swords size={32} color="#FF3366" />
              <div>
                <h4 style={{margin:0, fontSize:'1.1rem'}}>Arena Global</h4>
                <p style={{margin:0, fontSize:'0.9rem', color:'#888'}}>Todos batendo no mesmo boss ao mesmo tempo.</p>
              </div>
           </div>
           <div className="fn-feat-item" style={{display:'flex', gap:'15px'}}>
              <Trophy size={32} color="#FFD700" />
              <div>
                <h4 style={{margin:0, fontSize:'1.1rem'}}>Ranking Mundial</h4>
                <p style={{margin:0, fontSize:'0.9rem', color:'#888'}}>Suba de patente e seja reconhecido na elite.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="fn-visual-side">
        <img src="/assets/funnel/boss-arena.png" alt="Arena de Boss" className="fn-premium-image" />
      </div>
    </div>
  );

  /* ─── STEP 3: OS TEMAS ─── */
  const renderStep3 = () => (
    <div className="fn-step fn-fade-in">
      <div className="fn-themes-header">
        <h2 className="fn-big-title" style={{ color: currentTheme.accent, textShadow: `0 0 20px ${currentTheme.accent}44` }}>PERSONALIZE SUA EXPERIÊNCIA</h2>
        <p className="fn-desc">Escolha um tema para ver a transformação em tempo real. No app, você poderá desbloquear centenas de combinações.</p>
      </div>

      <div className="fn-themes-grid">
        {THEMES.map((t, i) => {
          const isSelected = selectedThemeId === t.id;
          return (
            <div 
              key={t.id} 
              className={`fn-theme-card ${isSelected ? 'fn-theme-equipped' : ''}`} 
              onClick={() => setSelectedThemeId(t.id)}
              style={{ 
                background: isSelected ? `linear-gradient(135deg, ${t.bg}, #000)` : 'rgba(255,255,255,0.03)',
                '--stagger-delay': `${i * 0.1}s`,
                borderColor: isSelected ? t.accent : 'rgba(255,255,255,0.08)'
              }}
            >
              {isSelected && <div className="fn-equipped-badge" style={{ background: t.accent }}><CheckCircle size={14} /> EQUIPADO</div>}
              <span className="fn-theme-rarity" style={{ color: t.rarityColor }}>★ {t.rarity}</span>
              <div className="fn-theme-emoji">{t.emoji}</div>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ─── STEP 4: OS FORJADOS (SOCIAL PROOF) ─── */
  const renderStep4 = () => (
    <div className="fn-step fn-fade-in">
      <div className="fn-text-side">
        <h2 className="fn-big-title" style={{ color: '#FFD700' }}>UMA LEGIÃO DE<br/>VENCEDORES</h2>
        <p className="fn-desc">Não lute sozinho. Faça parte da guilda mais forte do Brasil e compartilhe sua jornada com quem tem os mesmos objetivos.</p>

        <div className="fn-testimonials-v2" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={i} className="fn-mini-testi" style={{background:'var(--surface)', padding:'15px', borderRadius:'12px', border:'1px solid var(--border)'}}>
              <div className="fn-mt-avatar" style={{fontSize:'1.2rem', marginBottom:'5px'}}>{t.avatar} <strong>{t.name}</strong></div>
              <p style={{margin:0, fontSize:'0.85rem', color:'#aaa', fontStyle:'italic'}}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fn-visual-side">
        <img src="/assets/funnel/ranking.png" alt="Ranking da Comunidade" className="fn-premium-image" />
      </div>
    </div>
  );

  /* ─── STEP 5: A DECISÃO ─── */
  const renderStep5 = () => (
    <div className="fn-step fn-fade-in">
      <Particles color="#FF3366" count={25} />
      <h2 className="fn-big-title" style={{ color: '#FFF' }}>ESCOLHA SEU <span style={{color: '#FF3366'}}>PLANO</span></h2>
      <p className="fn-desc">Comece sua jornada de transformação hoje mesmo</p>

      <div className="fn-pricing-wrap fn-pricing-wrap-4">
        {/* MENSAL */}
        <div className="fn-pricing-card basic">
           <Zap size={28} className="fn-price-icon" />
           <h4>MENSAL</h4>
           <div className="fn-price-amount">
              <span className="fn-currency">R$</span>
              <span className="fn-number">32,90</span>
              <span className="fn-month">/mês</span>
           </div>
           <ul className="fn-price-features">
             <li><CheckCircle size={14} color="#00FF88" /> Acesso completo por 1 mês</li>
             <li><CheckCircle size={14} color="#00FF88" /> Todas as funcionalidades desbloqueadas</li>
             <li><CheckCircle size={14} color="#00FF88" /> Atualizações futuras incluídas</li>
             <li><CheckCircle size={14} color="#00FF88" /> Suporte via WhatsApp</li>
             <li><CheckCircle size={14} color="#00FF88" /> Acesso grátis ao grupo de membros</li>
             <li><CheckCircle size={14} color="#00FF88" /> Cancele quando quiser</li>
           </ul>
           <button className="fn-price-btn" onClick={() => setShowSignup(true)}>CRIAR CONTA GRÁTIS</button>
        </div>

        {/* SEMESTRAL (Destaque) */}
        <div className="fn-pricing-card premium">
           <div className="fn-offer-badge">🔥 OFERTA POR TEMPO LIMITADO</div>
           <Flame size={28} className="fn-price-icon" color="#FF3366" />
           <h4 style={{ color: '#FF3366' }}>SEMESTRAL</h4>
           <p className="fn-price-sub">4 meses grátis comparado ao plano mensal</p>
           <div className="fn-price-strike">De R$ 197,00</div>
           <div className="fn-price-amount" style={{ color: '#FF3366' }}>
              <span className="fn-currency">R$</span>
              <span className="fn-number">12,90</span>
              <span className="fn-month">/mês</span>
           </div>
           <div className="fn-price-cash">ou R$ 68,75 à vista</div>
           
           <div className="fn-urgency-box">
             <div className="fn-urgency-header">
               <span>Vagas restantes:</span>
               <span style={{color: '#FF3366', fontWeight: 'bold'}}>27</span>
             </div>
             <div className="fn-progress-bar"><div className="fn-progress-fill" style={{width: '27%'}}></div></div>
             <p className="fn-urgency-text">Após esgotar, preço volta para R$ 197,00</p>
           </div>

           <ul className="fn-price-features">
             <li><CheckCircle size={14} color="#FF3366" /> Acesso completo por 6 meses</li>
             <li><CheckCircle size={14} color="#FF3366" /> Todas as funcionalidades desbloqueadas</li>
             <li><CheckCircle size={14} color="#FF3366" /> Atualizações futuras incluídas</li>
             <li><CheckCircle size={14} color="#FF3366" /> Suporte via WhatsApp</li>
             <li><CheckCircle size={14} color="#FF3366" /> Acesso grátis ao grupo de membros</li>
           </ul>
           <button className="fn-price-btn highlight" onClick={() => setShowSignup(true)}>CRIAR CONTA GRÁTIS</button>
        </div>

        {/* ANUAL */}
        <div className="fn-pricing-card basic">
           <Crown size={28} className="fn-price-icon" />
           <h4>ANUAL</h4>
           <div className="fn-tag-popular">MAIS POPULAR</div>
           <div className="fn-price-strike">De R$ 397,00</div>
           <div className="fn-price-amount">
              <span className="fn-currency">R$</span>
              <span className="fn-number">13,90</span>
              <span className="fn-month">/mês</span>
           </div>
           <div className="fn-price-cash">ou R$ 137,00 à vista</div>
           <ul className="fn-price-features">
             <li><CheckCircle size={14} color="#00FF88" /> Acesso completo por 1 ano</li>
             <li><CheckCircle size={14} color="#00FF88" /> Todas as funcionalidades desbloqueadas</li>
             <li><CheckCircle size={14} color="#00FF88" /> Atualizações futuras incluídas</li>
             <li><CheckCircle size={14} color="#00FF88" /> Suporte via WhatsApp</li>
             <li><CheckCircle size={14} color="#00FF88" /> Acesso grátis ao grupo de membros</li>
             <li><CheckCircle size={14} color="#00FF88" /> Economia de R$ 250 por ano vs mensal</li>
           </ul>
           <button className="fn-price-btn" onClick={() => setShowSignup(true)}>CRIAR CONTA GRÁTIS</button>
        </div>

        {/* VITALÍCIO */}
        <div className="fn-pricing-card lifetime">
           <Crown size={28} className="fn-price-icon" color="#7B2FFF" />
           <h4 style={{ color: '#fff' }}>VITALÍCIO</h4>
           <div className="fn-tag-exclusive">EXCLUSIVO</div>
           <div className="fn-price-strike">De R$ 497,00</div>
           <div className="fn-price-amount">
              <span className="fn-currency">R$</span>
              <span className="fn-number">14,90</span>
              <span className="fn-month">/mês</span>
           </div>
           <div className="fn-price-cash">ou R$ 146,90 à vista</div>
           <ul className="fn-price-features">
             <li><CheckCircle size={14} color="#7B2FFF" /> Acesso vitalício completo</li>
             <li><CheckCircle size={14} color="#7B2FFF" /> Todas as funcionalidades desbloqueadas</li>
             <li><CheckCircle size={14} color="#7B2FFF" /> Todas as atualizações futuras</li>
             <li><CheckCircle size={14} color="#7B2FFF" /> Suporte prioritário VIP via whatsapp</li>
             <li><CheckCircle size={14} color="#7B2FFF" /> Acesso grátis ao grupo de membros</li>
             <li><CheckCircle size={14} color="#7B2FFF" /> Pague uma vez, use para sempre</li>
           </ul>
           <button className="fn-price-btn best-value" onClick={() => setShowSignup(true)}>CRIAR CONTA GRÁTIS</button>
        </div>
      </div>

       <div className="fn-cta-footer" style={{ marginTop: '50px', paddingBottom: '100px' }}>
          <p style={{fontSize:'1.1rem'}}>Já é um aluno? <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0', font: 'inherit', fontWeight:'bold', textDecoration: 'underline' }}>Entrar em minha conta</button></p>
          <div className="fn-guarantee-badge">
             <ShieldCheck size={40} color="var(--primary)" />
             <div>
               <strong>Garantia Blindada de 7 Dias</strong>
               <p>Se você não sentir a evolução, devolvemos 100% do seu dinheiro sem perguntas.</p>
             </div>
          </div>
      </div>

    </div>
  );

  /* ═══════════════════════════════════════════
     ██  MAIN RETURN  ██
     ═══════════════════════════════════════════ */
  return (
    <div className={`fn-container theme-${selectedThemeId}`} style={{ 
      background: `radial-gradient(circle at 50% 30%, ${currentTheme.bg}, #030304)`, 
      transition: 'background 1.2s cubic-bezier(0.23, 1, 0.32, 1)' 
    }}>
      <Particles key={selectedThemeId} color={currentTheme.particles} count={funnelState === 'presentation' ? 60 : 40} />
      
      {funnelState === 'start' && renderStartScreen()}
      {funnelState === 'loading' && renderLoadingScreen()}
      {funnelState === 'presentation' && !showUnlockScreen && renderPresentation()}
      {showUnlockScreen && renderUnlockScreen()}

      {/* Login Modal */}
      {showLogin && (
        <div className="fn-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="fn-modal" onClick={e => e.stopPropagation()}>
            <button className="fn-modal-close" onClick={() => setShowLogin(false)}>×</button>
            <h2>Bem-vindo de volta</h2>
            <p className="fn-modal-sub">Continue sua jornada lendária</p>
            <form onSubmit={handleLogin} className="fn-auth-form">
              <div className="fn-form-group">
                <label>Email</label>
                <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="fn-form-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <p className="fn-error">{error}</p>}
              <button type="submit" className="fn-auth-btn" disabled={authLoading}>
                {authLoading ? 'Entrando...' : 'Entrar no Jogo'}
              </button>
            </form>
            <p className="fn-switch">Não tem conta? <a onClick={() => { setShowLogin(false); setShowSignup(true); }}>Criar agora</a></p>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fn-modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="fn-modal" onClick={e => e.stopPropagation()}>
            <button className="fn-modal-close" onClick={() => setShowSignup(false)}>×</button>
            <h2>Crie sua Lenda</h2>
            <p className="fn-modal-sub">Seu primeiro passo para a glória</p>
            <form onSubmit={handleSignup} className="fn-auth-form">
              <div className="fn-form-group">
                <label>Nome do Herói</label>
                <input type="text" placeholder="Como quer ser chamado?" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="fn-form-group">
                <label>Email</label>
                <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="fn-form-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <p className="fn-error">{error}</p>}
              <button type="submit" className="fn-auth-btn" disabled={authLoading}>
                {authLoading ? 'Criando Conta...' : 'Iniciar Aventura'}
              </button>
            </form>
            <p className="fn-switch">Já tem conta? <a onClick={() => { setShowSignup(false); setShowLogin(true); }}>Fazer login</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funnel;
