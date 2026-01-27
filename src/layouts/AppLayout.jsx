import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Home, Trophy, Users, User, ShieldCheck } from 'lucide-react';
import InstallPWA from '../components/InstallPWA';
import './AppLayout.css';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useGame();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/challenges', icon: Trophy, label: 'Desafios' },
    { path: '/community', icon: Users, label: 'Comunidade' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/admin', icon: ShieldCheck, label: 'Admin' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-mark"></div>
          <span className="brand-text">VENCEDORES</span>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="user-profile-preview" onClick={() => !session && navigate('/login')} style={{ cursor: 'pointer' }}>
          <div className="avatar" style={{ background: session ? `url(${user.photo})` : '#444' }}>
            {!user.photo && user.avatar && user.avatar.helmet && user.avatar.helmet.emoji}
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
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            style={{ flexDirection: 'column', gap: '4px', fontSize: '10px', padding: '8px', border: 'none' }}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <InstallPWA />
    </div>
  );
};

export default AppLayout;
