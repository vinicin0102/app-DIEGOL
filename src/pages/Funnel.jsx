import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ChevronRight, Target, Shield, Zap, Swords, Trophy, Star, Lock, Crown, CheckCircle, Users, Flame, Award, TrendingUp, MessageCircle } from 'lucide-react';
import './Funnel.css';

/* ─── SOCIAL PROOF DATA ─── */
const SOCIAL_PROOF_TOASTS = [
  { name: 'Lucas M.', action: 'acabou de criar sua conta', time: 'agora', emoji: '🔥' },
  { name: 'Ana C.', action: 'subiu para o nível 8', time: '2 min atrás', emoji: '⚡' },
  { name: 'Pedro H.', action: 'completou 30 dias seguidos', time: '5 min atrás', emoji: '🏆' },
  { name: 'Mariana S.', action: 'derrotou o Boss Global', time: '8 min atrás', emoji: '💀' },
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
  const [funnelState, setFunnelState] = useState('start');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([
    { text: 'VERIFICANDO SINAIS VITAIS...', done: false },
    { text: 'INICIALIZANDO MOTOR DE GAMIFICAÇÃO...', done: false },
    { text: 'SINCRONIZANDO CONQUISTAS...', done: false },
    { text: 'CARREGANDO CHEFÕES GLOBAIS...', done: false },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [maxTabReached, setMaxTabReached] = useState(1);
  const [currentToast, setCurrentToast] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [showUnlockScreen, setShowUnlockScreen] = useState(false);

  // Auth modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

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
        }, 3500);
      } else {
        setActiveTab(next);
        if (next > maxTabReached) setMaxTabReached(next);
      }
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId <= maxTabReached) setActiveTab(tabId);
  };

  /* ═══════════════════════════════════════════
     ██  RENDER SCREENS  ██
     ═══════════════════════════════════════════ */

  /* ─── START SCREEN ─── */
  const renderStartScreen = () => (
    <div className="fn-start">
      <Particles color="#00FF88" count={30} />
      <div className="fn-corner tl"></div>
      <div className="fn-corner tr"></div>
      <div className="fn-corner bl"></div>
      <div className="fn-corner br"></div>
      
      <div className="fn-start-content">
        <div className="fn-glitch-wrapper">
          <h1 className="fn-glitch" data-text="SISTEMA FITQUEST">SISTEMA FITQUEST</h1>
        </div>
        
        <div className="fn-start-stats">
          <div className="fn-live-dot"></div>
          <span><AnimatedCounter end={COUNTER_STATS.users} /> jogadores online agora</span>
        </div>
        
        <button className="fn-start-btn" onClick={() => setFunnelState('loading')}>
          <ChevronRight size={22} className="fn-chevron-pulse" />
          <span>INICIAR SISTEMA</span>
        </button>
        <p className="fn-start-sub">Clique para liberar seu acesso</p>
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
      <Particles color="#FFD700" count={60} />
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
    { id: 3, title: 'NÍVEL 3', subtitle: 'Os Temas', icon: Swords, color: '#FF3366' },
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
      <h2 className="fn-big-title">
        APRESENTANDO: <span className="fn-glow-green">SISTEMA FITQUEST</span>
      </h2>
      <p className="fn-desc">
        O primeiro sistema de produtividade fitness que transforma sua rotina de treinos em um
        <TypingText texts={[' jogo épico.', ' RPG da vida real.', ' aventura diária.']} speed={80} />
      </p>

      <div className="fn-vs-row">
        <div className="fn-vs-bad">
          <span className="fn-vs-x">✕</span>
          Não é mais um app de treinos genérico.
        </div>
        <div className="fn-vs-good">
          <span className="fn-vs-check">✔</span>
          É um sistema pessoal onde o personagem principal é <strong>VOCÊ</strong>.
        </div>
      </div>

      {/* Live Stats */}
      <div className="fn-live-stats">
        <div className="fn-live-stat">
          <Users size={28} className="fn-stat-icon" />
          <strong><AnimatedCounter end={COUNTER_STATS.users} /></strong>
          <span>Jogadores Ativos</span>
        </div>
        <div className="fn-live-divider"></div>
        <div className="fn-live-stat">
          <Flame size={28} className="fn-stat-icon" />
          <strong><AnimatedCounter end={COUNTER_STATS.bosses} /></strong>
          <span>Chefões Derrotados</span>
        </div>
        <div className="fn-live-divider"></div>
        <div className="fn-live-stat">
          <Trophy size={28} className="fn-stat-icon" />
          <strong><AnimatedCounter end={COUNTER_STATS.missions} /></strong>
          <span>Missões Completas</span>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="fn-mockup-wrap">
        <div className="fn-phone fn-float">
          <div className="fn-screen">
            <div className="fn-screen-header">
              <Zap color="#00FF88" size={20} />
              <span>Level 1 — Novato</span>
              <div className="fn-xp-pill">+500 XP</div>
            </div>
            <div className="fn-screen-card">
              <Shield color="#FFD700" size={20} />
              <span>Missão Diária</span>
              <h4>Derrotar a Preguiça</h4>
              <div className="fn-mini-bar"><div className="fn-mini-fill" style={{ width: '75%' }}></div></div>
            </div>
            <div className="fn-screen-stats-row">
              <div><Zap size={14} color="#00FF88" /> Força</div>
              <div><Swords size={14} color="#7B2FFF" /> Combate</div>
              <div><Shield size={14} color="#FFD700" /> Defesa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── STEP 2: O SISTEMA ─── */
  const renderStep2 = () => (
    <div className="fn-step fn-fade-in">
      <h2 className="fn-big-title" style={{ color: '#00C8FF' }}>A GAMIFICAÇÃO QUE FUNCIONA</h2>
      <p className="fn-desc">Cada repetição conta. Transforme suor em XP e suba de nível na vida real.</p>

      <div className="fn-features-row">
        {[
          { icon: Target, title: 'Missões Diárias', desc: 'Objetivos personalizados que se adaptam ao seu progresso.', color: '#00C8FF' },
          { icon: Trophy, title: 'Conquistas', desc: 'Desbloqueie medalhas e exiba no ranking global da comunidade.', color: '#FFD700' },
          { icon: TrendingUp, title: 'Evolução Real', desc: 'Seus atributos (Força, Resistência, Agilidade) evoluem com você.', color: '#00FF88' },
          { icon: Swords, title: 'Batalhas de Boss', desc: 'Use seus treinos diários para causar dano aos chefões globais.', color: '#FF3366' },
        ].map((f, i) => (
          <div key={i} className="fn-feature-card fn-stagger" style={{ '--stagger-delay': `${i * 0.1}s`, '--feature-color': f.color }}>
            <f.icon size={36} style={{ color: f.color }} />
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── STEP 3: OS TEMAS ─── */
  const renderStep3 = () => (
    <div className="fn-step fn-fade-in">
      <h2 className="fn-big-title" style={{ color: '#FF3366' }}>PERSONALIZE SUA EXPERIÊNCIA</h2>
      <p className="fn-desc">Desbloqueie temas épicos e lendários que transformam todo o visual do app.</p>

      <div className="fn-themes-grid">
        {[
          { name: 'Sakura Cerejeira', emoji: '🌸', rarity: 'Épico', rarityColor: '#FF69B4', desc: 'Tons de rosa suave e pétalas flutuantes', bg: 'linear-gradient(135deg, #2d0a1e, #1a0510)' },
          { name: 'Fogo Infernal', emoji: '🔥', rarity: 'Lendário', rarityColor: '#FFD700', desc: 'Chamas ardentes e cores de fogo intenso', bg: 'linear-gradient(135deg, #2d1500, #1a0a00)', equipped: true },
          { name: 'Galáxia Neon', emoji: '⭐', rarity: 'Épico', rarityColor: '#00C8FF', desc: 'Cores neon vibrantes e estrelas brilhantes', bg: 'linear-gradient(135deg, #0a1a2d, #050a1a)' },
          { name: 'Metal Líquido', emoji: '⚙️', rarity: 'Épico', rarityColor: '#C0C0C0', desc: 'Estética industrial elegante e minimalista', bg: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)' },
          { name: 'Aurora Boreal', emoji: '💜', rarity: 'Épico', rarityColor: '#7B2FFF', desc: 'Cores especiais das luzes do norte', bg: 'linear-gradient(135deg, #0a1a2d, #1a052d)' },
          { name: 'Eclipse Sombrio', emoji: '🌑', rarity: 'Lendário', rarityColor: '#FFD700', desc: 'Estética do vazio cósmico profundo', bg: 'linear-gradient(135deg, #0d0d1a, #050510)' },
        ].map((t, i) => (
          <div key={i} className={`fn-theme-card ${t.equipped ? 'fn-theme-equipped' : ''}`} style={{ background: t.bg, '--stagger-delay': `${i * 0.08}s` }}>
            {t.equipped && <div className="fn-equipped-badge"><CheckCircle size={14} /> Equipado</div>}
            <span className="fn-theme-rarity" style={{ color: t.rarityColor }}>✦ {t.rarity}</span>
            <div className="fn-theme-emoji">{t.emoji}</div>
            <h4>{t.name}</h4>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── STEP 4: OS FORJADOS (SOCIAL PROOF) ─── */
  const renderStep4 = () => (
    <div className="fn-step fn-fade-in">
      <h2 className="fn-big-title" style={{ color: '#FFD700' }}>O QUE DIZEM OS FORJADOS</h2>
      <p className="fn-desc">Jogadores reais. Resultados reais. Veja o que a comunidade tem a dizer.</p>

      <div className="fn-testimonials">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="fn-testimonial-card fn-stagger" style={{ '--stagger-delay': `${i * 0.15}s` }}>
            <div className="fn-testi-header">
              <div className="fn-testi-avatar">{t.avatar}</div>
              <div>
                <strong>{t.name}</strong>
                <span className="fn-testi-level">{t.level}</span>
              </div>
              <div className="fn-testi-stars">{'⭐'.repeat(t.rating)}</div>
            </div>
            <p className="fn-testi-text">"{t.text}"</p>
          </div>
        ))}
      </div>

      {/* Social Proof Counter */}
      <div className="fn-social-counter">
        <div className="fn-sc-live-dot"></div>
        <span><strong><AnimatedCounter end={347} /></strong> pessoas visualizando esta página agora</span>
      </div>
    </div>
  );

  /* ─── STEP 5: A DECISÃO ─── */
  const renderStep5 = () => (
    <div className="fn-step fn-fade-in">
      <Particles color="#7B2FFF" count={20} />
      <h2 className="fn-big-title" style={{ color: '#7B2FFF' }}>A DECISÃO É SUA</h2>
      <p className="fn-desc">O jogo já começou na vida real. Você vai ficar parado no Nível 1 para sempre?</p>

      <div className="fn-cta-epic">
        <div className="fn-cta-badge">🔥 ACESSO LIBERADO</div>
        <h3 className="fn-cta-title">Destrave seu Acesso Total</h3>
        
        <ul className="fn-cta-benefits">
          <li><CheckCircle size={18} color="#00FF88" /> Acesso completo ao Sistema FitQuest</li>
          <li><CheckCircle size={18} color="#00FF88" /> Missões, Chefões e Conquistas ilimitadas</li>
          <li><CheckCircle size={18} color="#00FF88" /> Comunidade exclusiva e Guildas rankeadas</li>
          <li><CheckCircle size={18} color="#00FF88" /> Temas épicos e lendários desbloqueáveis</li>
          <li><CheckCircle size={18} color="#00FF88" /> Suporte direto dos desenvolvedores</li>
          <li><CheckCircle size={18} color="#00FF88" /> Todas as atualizações futuras incluídas</li>
        </ul>

        <button className="fn-cta-button" onClick={() => setShowSignup(true)}>
          CRIAR MINHA CONTA AGORA <ChevronRight size={20} />
        </button>
        
        <div className="fn-cta-footer">
          <p>Já tem conta? <a onClick={() => setShowLogin(true)}>Fazer login</a></p>
          <p className="fn-guarantee">🔒 Ambiente 100% seguro</p>
        </div>
      </div>

      {/* Urgency */}
      <div className="fn-urgency-bar">
        <Flame size={16} color="#FF3366" />
        <span><strong><AnimatedCounter end={23} /></strong> vagas preenchidas nas últimas 2 horas</span>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     ██  MAIN RETURN  ██
     ═══════════════════════════════════════════ */
  return (
    <div className="fn-container">
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
