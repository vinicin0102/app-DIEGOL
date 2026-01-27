import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import { useGame } from './context/GameContext';

const App = () => {
  const { isAuthenticated } = useGame();

  return (
    <Routes>
      {/* If authenticated, redirect to /app (Dashboard), else show Home (Landing/Login) */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/app" /> : <Home />} />

      {/* Direct access to independent login page if needed, or use Home */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/app" element={isAuthenticated ? <AppLayout /> : <Navigate to="/" />}>
        <Route index element={<Dashboard />} />
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
