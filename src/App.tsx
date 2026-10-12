import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

const AppNavigator: React.FC = () => {
  const { user, loginAsGuest, logout } = useApp();
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard'>(() => {
    // If user is already stored and logged in, start on dashboard; otherwise landing page
    return user ? 'dashboard' : 'landing';
  });
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Keep view synchronized with user authentication status
  useEffect(() => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      // If user logs out, go back to landing page
      if (currentView === 'dashboard') {
        setCurrentView('landing');
      }
    }
  }, [user]);

  const handleNavigateAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDemo = async () => {
    await loginAsGuest();
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onNavigateAuth={handleNavigateAuth} 
        onQuickDemo={handleQuickDemo} 
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPage 
        initialMode={authMode} 
        onBackToLanding={() => setCurrentView('landing')}
        onSuccess={() => setCurrentView('dashboard')}
      />
    );
  }

  // Dashboard (Protected view)
  return (
    <DashboardPage onSignOut={handleSignOut} />
  );
};

export function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

export default App;
