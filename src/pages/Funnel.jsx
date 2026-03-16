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

      <div className="fn-showcase-grid">
        {/* Showcase Block 1 */}
        <div className="fn-showcase-block" style={{ '--sc-color': '#00FF88' }}>
          <div className="fn-sc-text">
            <h3><Target color="#00FF88" size={28} /> PÁGINA INICIAL</h3>
            <p>VEJA SEU PROGRESSO GERAL, ESTATÍSTICAS E NÍVEL</p>
            <span>Toda sua evolução visualizada de forma gráfica. Acompanhe seu rank, XP atual e metas semanais diretamente no painel.</span>
          </div>
          <div className="fn-sc-mockup">
            <div className="fn-fake-laptop">
              <div className="fn-fl-screen">
                <div className="fn-fl-header"></div>
                <div className="fn-fl-body">
                  <div className="fn-fl-card"></div>
                  <div className="fn-fl-card"></div>
                </div>
              </div>
              <div className="fn-fl-base"></div>
            </div>
          </div>
        </div>

        {/* Showcase Block 2 */}
        <div className="fn-showcase-block reverse" style={{ '--sc-color': '#FFD700' }}>
          <div className="fn-sc-text">
            <h3><Trophy color="#FFD700" size={28} /> CONQUISTAS</h3>
            <p>DESBLOQUEIE CONQUISTAS AVANÇANDO NO DESAFIO</p>
            <span>Colecione medalhas épicas e mostre para a comunidade quem é que manda. Torne suas conquistas visíveis no ranking global!</span>
          </div>
          <div className="fn-sc-mockup">
            <div className="fn-fake-phone">
               <div className="fn-fp-screen">
                  <div className="fn-fp-achievement"><div className="fn-fp-icon"></div><div className="fn-fp-lines"></div></div>
                  <div className="fn-fp-achievement"><div className="fn-fp-icon"></div><div className="fn-fp-lines"></div></div>
                  <div className="fn-fp-achievement"><div className="fn-fp-icon"></div><div className="fn-fp-lines"></div></div>
               </div>
            </div>
          </div>
        </div>

        {/* Showcase Block 3 */}
        <div className="fn-showcase-block" style={{ '--sc-color': '#FF3366' }}>
          <div className="fn-sc-text">
            <h3><TrendingUp color="#FF3366" size={28} /> HÁBITOS</h3>
            <p>REGISTRE E ACOMPANHE TODOS SEUS HÁBITOS</p>
            <span>Marque sua consistência diária, mantenha o seu streak de vitórias vivo e ganhe buffs de experiência.</span>
          </div>
          <div className="fn-sc-mockup">
            <div className="fn-fake-laptop">
              <div className="fn-fl-screen">
                <div className="fn-fl-header"></div>
                <div className="fn-fl-body" style={{ flexDirection: 'column', gap: '8px' }}>
                  <div className="fn-fl-row"></div>
                  <div className="fn-fl-row"></div>
                  <div className="fn-fl-row"></div>
                </div>
              </div>
              <div className="fn-fl-base"></div>
            </div>
          </div>
        </div>

        {/* Showcase Block 4 */}
        <div className="fn-showcase-block reverse" style={{ '--sc-color': '#7B2FFF' }}>
          <div className="fn-sc-text">
            <h3><Star color="#7B2FFF" size={28} /> LOJA DO TEMPO</h3>
            <p>GANHE MOEDAS CUMPRINDO HÁBITOS E TAREFAS</p>
            <span>Troque moedas ganhas por habilidades únicas, bônus de XP ou itens reais. O esforço literalmente paga.</span>
          </div>
          <div className="fn-sc-mockup">
             <div className="fn-fake-phone">
               <div className="fn-fp-screen">
                  <div className="fn-fp-grid">
                     <div className="fn-fp-item"></div><div className="fn-fp-item"></div>
                     <div className="fn-fp-item"></div><div className="fn-fp-item"></div>
                  </div>
               </div>
             </div>
          </div>
        </div>

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
           <button className="fn-price-btn" onClick={() => window.location.href = 'https://buy.stripe.com/aFa8wQbgS9ws9wycbqfrW01'}>ESCOLHER PLANO</button>
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
           <button className="fn-price-btn highlight" onClick={() => window.location.href = 'https://buy.stripe.com/5kQ9AUet48soaACa3ifrW02'}>ESCOLHER PLANO</button>
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
           <button className="fn-price-btn" onClick={() => window.location.href = 'https://buy.stripe.com/dRmeVe2KmaAwaACgrGfrW03'}>ESCOLHER PLANO</button>
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
           <button className="fn-price-btn best-value" onClick={() => window.location.href = 'https://buy.stripe.com/6oUaEYgBcbEA1022AQfrW00'}>ESCOLHER PLANO</button>
        </div>
      </div>

      <div className="fn-cta-footer" style={{ marginTop: '30px' }}>
          <p>Já tem conta? <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#FF3366', cursor: 'pointer', padding: '0', font: 'inherit', textDecoration: 'underline' }}>Fazer login</button></p>
          <p className="fn-guarantee">🔒 Ambiente 100% seguro com garantia de 7 dias.</p>
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
