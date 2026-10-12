import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onBackToLanding: () => void;
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'signin', 
  onBackToLanding, 
  onSuccess 
}) => {
  const { loginWithEmail, registerWithEmail, loginAsGuest } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A130E] text-white flex flex-col font-sans selection:bg-[#00DF81] selection:text-[#051C12] relative overflow-hidden">
      {/* Background glow and fintech grid */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00DF81]/[0.08] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed inset-0 fintech-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-bold text-[#93A89C] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        <div 
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#12241C] border border-[#1A3326] flex items-center justify-center shadow-emerald-glow">
            <div className="w-3.5 h-3.5 rounded-full bg-[#00DF81] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#0A130E]" />
            </div>
          </div>
          <span className="text-lg font-extrabold text-white">Finovia</span>
        </div>
      </header>

      {/* Main Auth Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0E1B15] rounded-3xl border border-[#1A3326] shadow-card-glow p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center mx-auto shadow-emerald-glow mb-3">
              <UserIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {mode === 'signin' ? 'Sign In to Your Dashboard' : 'Create Your Finovia Account'}
            </h2>
            <p className="text-xs text-[#93A89C]">
              {mode === 'signin' 
                ? 'Enter your credentials to access your credit portfolio' 
                : 'Start maximizing credit card rewards in seconds'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-[#070E0A] p-1 border border-[#1A3326]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-[#00DF81] text-[#051C12] shadow-sm'
                  : 'text-[#93A89C] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-[#00DF81] text-[#051C12] shadow-sm'
                  : 'text-[#93A89C] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Access (1-Click) */}
          <button
            type="button"
            onClick={handleGuestDemo}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#12241C] border border-[#1A3326] hover:bg-[#1A3326] text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#00DF81]" />
            <span>Instant Demo: Continue as Guest</span>
          </button>

          <div className="relative my-4 text-center">
            <span className="bg-[#0E1B15] px-3 text-[11px] text-[#5B7064] uppercase font-semibold relative z-10">
              Or with email & password
            </span>
            <div className="absolute inset-0 top-1/2 border-t border-[#1A3326]" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#93A89C] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexander Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white placeholder-[#5B7064] focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#93A89C] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@finovia.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white placeholder-[#5B7064] focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#93A89C] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white placeholder-[#5B7064] focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Create & Launch Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Note */}
          <div className="pt-2 border-t border-[#1A3326] flex items-center gap-2.5 text-[11px] text-[#93A89C]">
            <ShieldCheck className="w-4 h-4 text-[#00DF81] shrink-0" />
            <span>Zero-Knowledge: No CVV, PIN, or banking passwords stored.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-[#5B7064]">
        Finovia Non-Custodial Perks Operating System
      </footer>
    </div>
  );
};
