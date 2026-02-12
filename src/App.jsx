import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
// import Dashboard from './pages/Dashboard'; // Removido
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import { useGame } from './context/GameContext';
import './App.css';

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

  React.useEffect(() => {
    console.log("App State -> Loading:", loading, "Authenticated:", isAuthenticated);
  }, [loading, isAuthenticated]);

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

  return (
    <Routes>
      {/* If authenticated, redirect to /app (Dashboard), else show Home (Landing/Login) */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/app" /> : <Home />} />

      {/* Direct access to independent login page if needed, or use Home */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/app" element={isAuthenticated ? <AppLayout /> : <Navigate to="/" />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<Admin />} />
      </Route>

      {/* Legacy/Fallback routes handling */}
      <Route path="/challenges" element={<Navigate to="/app/challenges" />} />
      <Route path="/community" element={<Navigate to="/app/community" />} />
      <Route path="/profile" element={<Navigate to="/app/profile" />} />
      <Route path="/admin" element={<Navigate to="/app/admin" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
