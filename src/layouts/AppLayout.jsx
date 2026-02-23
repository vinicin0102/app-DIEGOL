import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Trophy, Users, User, ShieldCheck, Dumbbell } from 'lucide-react';
import InstallPWA from '../components/InstallPWA';
import './AppLayout.css';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useGame();

  const isHostAdmin = window.location.hostname.startsWith('admin.');
  const isSuperAdmin = session?.user?.email === 'vinicius6655000@gmail.com';

  const navItems = isHostAdmin
    ? [
      { path: '/', icon: ShieldCheck, label: 'Dashboard Admin' },
      { path: 'https://desafiodosvencedores.vercel.app', icon: User, label: 'Voltar p/ o App', isExternal: true },
    ]
    : [
      { path: '/app/profile', icon: User, label: 'Perfil' },
      { path: '/app/training', icon: Dumbbell, label: 'Treinos' },
      { path: '/app/challenges', icon: Trophy, label: 'Desafios' },
      { path: '/app/community', icon: Users, label: 'Comunidade' },
      { path: '/app/admin', icon: ShieldCheck, label: 'Painel Admin' }
    ];


  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-mark"></div>
          <span className="brand-text">VENCEDORES</span>
        </div>

        <nav className="nav-menu">
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
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="user-profile-preview" onClick={() => !session && navigate('/login')} style={{ cursor: 'pointer' }}>
          <div className="avatar" style={{
            background: session && user.photo ? `url(${user.photo})` : '#444',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {(!user.photo || !session) && user.avatar && user.avatar.helmet && user.avatar.helmet.emoji}
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <span>{session ? `Nível ${user.level}` : 'Clique para entrar'}</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="mobile-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isExternal) {
            return (
              <a
                key={item.path}
                href={item.path}
                className="nav-item"
                style={{ flexDirection: 'column', gap: '4px', fontSize: '10px', padding: '8px', border: 'none' }}
              >
                <item.icon size={24} />
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ flexDirection: 'column', gap: '4px', fontSize: '10px', padding: '8px', border: 'none' }}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <InstallPWA />
    </div>
  );
};

export default AppLayout;
