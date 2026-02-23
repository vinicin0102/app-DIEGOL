import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Training from './pages/Training';
import Home from './pages/Home';
import { useGame } from './context/GameContext';
import './App.css';
import LGPDBanner from './components/LGPDBanner';

const App = () => {
  // Verificação de segurança das variáveis de ambiente
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="app-loading-screen" style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{ color: '#ff4444', marginBottom: '10px' }}>Erro de Configuração</h2>
        <p style={{ color: '#fff' }}>As variáveis de ambiente do Supabase não foram encontradas.</p>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '20px' }}>
          Se você está na Vercel, certifique-se de adicionar:<br />
          VITE_SUPABASE_URL<br />
          VITE_SUPABASE_ANON_KEY<br />
          nas configurações do projeto.
        </p>
      </div>
    );
  }

  const { isAuthenticated, loading } = useGame();

  // Detecção de subdomínio
  const isHostAdmin = window.location.hostname.startsWith('admin.');

  React.useEffect(() => {
    console.log("App State -> Subdomain Admin:", isHostAdmin, "Auth:", isAuthenticated);
  }, [loading, isAuthenticated, isHostAdmin]);

  // Mostrar tela de carregamento enquanto verifica sessão
  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="app-loading-text">Carregando...</p>
      </div>
    );
  }

  // --- ROTEAMENTO PARA SUBDOMÍNIO ADMIN ---
  if (isHostAdmin) {
    return (
      <>
        <Routes>
          <Route path="/" element={isAuthenticated ? <AppLayout /> : <Home />}>
            <Route index element={<Admin superMail="vinicius6655000@gmail.com" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
        <LGPDBanner />
      </>
    );
  }

  // --- ROTEAMENTO PARA DOMÍNIO PRINCIPAL (APP) ---
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/app" /> : <Home />} />
        <Route path="/login" element={<Navigate to="/" />} />

        {/* Base App Route with Sidebar Layout */}
        <Route path="/app" element={<AppLayout />}>
          {/* Public Admin Access */}
          <Route path="admin" element={<Admin superMail="vinicius6655000@gmail.com" />} />

          {/* Protected Content */}
          <Route element={isAuthenticated ? <Outlet /> : <Navigate to="/" />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="training" element={<Training />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="community" element={<Community />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <LGPDBanner />
    </>
  );

};

export default App;
