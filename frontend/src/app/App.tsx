import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

type Page = 'landing' | 'register' | 'login' | 'dashboard';

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Error inesperado' }));
      throw new Error(payload.error || 'Error inesperado');
    }

    const payload = await response.json();
    setUser({ name: payload.name, email: payload.email });
    setCurrentPage('dashboard');
    toast.success('¡Registro exitoso! Bienvenido a MindTrack');
  };

  const handleLogin = (email: string, password: string) => {
    const userName = email.split('@')[0];
    setUser({ name: userName, email });
    setCurrentPage('dashboard');
    toast.success('¡Bienvenido de nuevo!');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    toast.info('Sesión cerrada');
  };

  return (
    <div className="size-full">
      <Toaster position="top-right" richColors />

      {currentPage === 'landing' && (
        <LandingPage
          onLogin={() => setCurrentPage('login')}
          onRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onRegister={handleRegister}
          onBackToLanding={() => setCurrentPage('landing')}
          onGoToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onBackToLanding={() => setCurrentPage('landing')}
          onGoToRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <Dashboard userName={user.name} onLogout={handleLogout} />
      )}
    </div>
  );
}