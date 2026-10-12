import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    loginWithEmail, 
    registerWithEmail, 
    loginAsGuest, 
    logout 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

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
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Guest sign-in error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto text-white">
      <div className="relative w-full max-w-md bg-[#0E1B15] rounded-3xl border border-[#1A3326] shadow-card-glow overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0A130E] border-b border-[#1A3326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center shadow-emerald-glow">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {user ? 'Account Management' : mode === 'signin' ? 'Sign In to Finovia' : 'Create Account'}
              </h3>
              <p className="text-xs text-[#93A89C]">
                {user ? 'Your authenticated profile' : 'Sync portfolio across devices'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#12241C] text-[#93A89C] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {user ? (
            /* Logged in view */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#070E0A] border border-[#1A3326] flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#12241C] text-[#00DF81] font-extrabold text-base flex items-center justify-center border border-[#1A3326]">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {user.displayName || 'Finovia User'}
                  </div>
                  <div className="text-xs text-[#93A89C]">
                    {user.email || 'Guest Anonymous Account'}
                  </div>
                  <div className="text-[10px] text-[#00DF81] font-semibold mt-0.5">
                    User UID: {user.uid.slice(0, 12)}...
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  await logout();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2.5 rounded-full border border-red-800 bg-red-950/40 text-red-300 hover:bg-red-950/70 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Not logged in form */
            <div className="space-y-4">
              {/* Tab selector */}
              <div className="flex rounded-xl bg-[#070E0A] p-1 border border-[#1A3326]">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-[#00DF81] text-[#051C12] shadow-sm'
                      : 'text-[#93A89C] hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-[#00DF81] text-[#051C12] shadow-sm'
                      : 'text-[#93A89C] hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Instant Guest Demo Option */}
              <button
                type="button"
                onClick={handleGuest}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-full bg-[#12241C] border border-[#1A3326] hover:bg-[#1A3326] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#00DF81]" />
                <span>Quick Demo: Continue as Guest</span>
              </button>

              <div className="relative my-2 text-center">
                <span className="bg-[#0E1B15] px-3 text-[11px] text-[#5B7064] uppercase font-semibold relative z-10">
                  Or with email
                </span>
                <div className="absolute inset-0 top-1/2 border-t border-[#1A3326]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#93A89C] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@finovia.io"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs text-white placeholder-[#5B7064] focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#93A89C] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs text-white placeholder-[#5B7064] focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
