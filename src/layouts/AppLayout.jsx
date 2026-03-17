import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Trophy, Users, User, ShieldCheck, Dumbbell, LayoutGrid, Calendar as CalendarIcon, Target, Clock, Gift, Layout, TrendingUp, Brain, TreeDeciduous, Info, HelpCircle, LifeBuoy, AlertTriangle, Settings, LogOut, Edit2, Swords, Zap, Menu, X, Skull } from 'lucide-react';
import { AVATARS } from '../components/AvatarSelector';
import { getRank, getRankColor } from '../data/missionsData';
import InstallPWA from '../components/InstallPWA';
import NotificationModal from '../components/NotificationModal';
import './AppLayout.css';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session, signOut } = useGame();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isHostAdmin = window.location.hostname.startsWith('admin.');
  const isSuperAdmin = session?.user?.email === 'vinicius6655000@gmail.com';

  const navItems = isHostAdmin
    ? [
      { path: '/', icon: ShieldCheck, label: 'Dashboard Admin' },
      { path: 'https://desafiodosvencedores.vercel.app', icon: User, label: 'Voltar p/ o App', isExternal: true },
    ]
    : [
      { path: '/app/profile', icon: LayoutGrid, label: 'Painel' },
      { path: '/app/boss-global', icon: Skull, label: 'Desafio Coletivo' },
      { path: '/app/challenges', icon: Swords, label: 'Projeto Vencedores' },
      { path: '/app/missions', icon: Target, label: 'Missões' },
      { path: '/app/training', icon: Dumbbell, label: 'Treinos' },
      { path: '/app/missions#bonus', icon: Zap, label: 'Bônus' },
      { path: '/app/calendar', icon: CalendarIcon, label: 'Calendário' },
      { path: '/app/community', icon: Users, label: 'Comunidade' },
      { path: '/app/store', icon: Clock, label: 'Loja do Tempo' },
      { path: '/app/rewards', icon: Gift, label: 'Itens de Recompensa' },
      { path: '/app/avatars', icon: User, label: 'Avatares' },
      { path: '/app/priority', icon: Layout, label: 'Matriz de Prioridades' },
      { path: '/app/progress', icon: TrendingUp, label: 'Progresso' },
      { path: '/app/virtues', icon: Trophy, label: 'Virtudes' },
      { path: '/app/ai-chat', icon: Brain, label: 'Evolução Chat IA' },
      { path: '/app/evolution-tree', icon: TreeDeciduous, label: 'Árvore de Evolução' },
      { path: '/app/admin', icon: ShieldCheck, label: 'Painel Admin' }
    ];

  // Itens para a barra de navegação inferior no mobile (apenas os mais importantes)
  const mobileNavItems = isHostAdmin
    ? navItems
    : [
      { path: '/app/profile', icon: LayoutGrid, label: 'Painel' },
      { path: '/app/boss-global', icon: Skull, label: 'Desafio C.' },
      { path: '/app/challenges', icon: Swords, label: 'Projeto Vencedores' },
      { path: '/app/missions', icon: Target, label: 'Missões' },
      { path: '/app/training', icon: Dumbbell, label: 'Treinos' },
      { path: '#menu', icon: Menu, label: 'Mais', isMenuToggle: true }
    ];

  const rank = getRank(user.level);
  const rankColor = getRankColor(rank);

  const savedAvatarId = localStorage.getItem('vencedores_avatar_id');
  const avatar = savedAvatarId ? AVATARS.find(a => a.id === savedAvatarId) : AVATARS[0];
  const userAvatar = avatar || AVATARS[0];
  
  // Ouvinte de sons para notificações em primeiro plano (Foreground)
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event) => {
        if (event.data && event.data.type === 'PLAY_SOUND') {
          const audio = new Audio('/notification.mp3?v=5');
          audio.play().catch(e => console.log('Bloqueio de som pelo navegador:', e));
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }
  }, []);


  return (
    <div className="app-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button
          className="mobile-close-btn"
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'none' }}
        >
          <X size={24} />
        </button>
        <div className="brand" style={{ marginBottom: '24px' }}>
          <div className="logo-mark"></div>
          <div>
            <span className="brand-text" style={{ fontSize: '18px', display: 'block' }}>O SISTEMA</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Arquitetura da Evolução</span>
          </div>
        </div>

        <div className="user-profile-summary" style={{ marginBottom: '32px', padding: '0 8px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '15px', overflow: 'hidden', border: `2px solid ${rankColor}`, flexShrink: 0 }}>
            <img src={userAvatar.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#00DDEE', textTransform: 'uppercase', margin: 0 }}>{user.name.split(' ')[0] || 'JUNIO'}</h3>
              <Edit2 size={12} color="var(--text-muted)" onClick={() => navigate('/app/profile')} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>NÍVEL {user.level}</span>
            <span style={{ fontSize: '10px', color: rankColor, fontWeight: '800', display: 'block', marginBottom: '8px' }}>{rank}</span>

            <div className="xp-bar" style={{ height: '3px' }}>
              <div className="xp-bar-fill" style={{ width: `${(user.xp % 1000) / 10}%` }}></div>
            </div>
          </div>
        </div>

        <nav className="nav-menu" style={{ overflowY: 'auto', paddingRight: '4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app/');

            if (item.isExternal) {
              return (
                <a key={item.path} href={item.path} className="nav-item">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </a>
              );
            }

            return (
              <Link
                key={`${item.path}-${item.label}`}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ padding: '12px 16px' }}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '14px' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
          <span style={{ fontSize: '10px', color: '#00DDEE', fontWeight: '800', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Mensagem do Arquiteto IA</span>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>
            "A perfeição não é destino, é jornada constante."
          </p>
        </div>

        <button
          onClick={() => signOut()}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '14px',
            background: 'rgba(255,51,102,0.1)',
            border: '1px solid rgba(255,51,102,0.2)',
            borderRadius: '12px',
            color: '#FF3366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="mobile-nav">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path.split('#')[0]) && item.path === location.pathname;

          if (item.isExternal) {
            return (
              <a
                key={`mob-${item.path}-${item.label}`}
                href={item.path}
                className="nav-item"
                style={{ flexDirection: 'column', gap: '4px', fontSize: '10px', padding: '8px', border: 'none' }}
              >
                <item.icon size={24} />
                <span>{item.label}</span>
              </a>
            );
          }

          if (item.isMenuToggle) {
            return (
              <button
                key="mob-menu-toggle"
                onClick={() => setIsSidebarOpen(true)}
                className="nav-item"
                style={{ background: 'none', border: 'none', flexDirection: 'column', gap: '4px', fontSize: '10px', padding: '8px' }}
              >
                <item.icon size={24} color="var(--text-muted)" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={`mob-${item.path}-${item.label}`}
              to={item.path.split('#')[0]}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ flexDirection: 'column', gap: '4px', fontSize: '10px', padding: '8px', border: 'none' }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={24} color={isActive ? 'var(--primary)' : undefined} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <InstallPWA />
      <NotificationModal />
    </div>
  );
};

export default AppLayout;
