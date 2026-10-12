import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard as CreditCardIcon, 
  Plus, 
  Sparkles, 
  Database, 
  User as UserIcon, 
  LogOut, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'cards' | 'recommend' | 'transactions';
  setActiveTab: (tab: 'dashboard' | 'cards' | 'recommend' | 'transactions') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    user, 
    isFirebaseActive, 
    setIsCardModalOpen, 
    setEditingCard, 
    setIsExpenseModalOpen, 
    setIsRecommenderOpen,
    setIsFirebaseModalOpen,
    setIsAuthModalOpen,
    logout
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#0A130E]/90 backdrop-blur-md border-b border-[#1A3326]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#12241C] border border-[#1A3326] flex items-center justify-center shadow-emerald-glow transition-transform group-hover:scale-105">
                <div className="w-4 h-4 rounded-full bg-[#00DF81] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A130E]" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Finovia
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-[#00DF81]/15 text-[#00DF81] rounded-full border border-[#00DF81]/30">
                  Perks OS
                </span>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#0E1B15] p-1.5 rounded-full border border-[#1A3326]">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#00DF81] text-[#051C12] shadow-sm font-bold'
                    : 'text-[#93A89C] hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'cards'
                    ? 'bg-[#00DF81] text-[#051C12] shadow-sm font-bold'
                    : 'text-[#93A89C] hover:text-white'
                }`}
              >
                Card Portfolio
              </button>
              <button
                onClick={() => {
                  setActiveTab('recommend');
                  setIsRecommenderOpen(true);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'recommend'
                    ? 'bg-[#00DF81] text-[#051C12] shadow-sm font-bold'
                    : 'text-[#93A89C] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Perks Optimizer
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'transactions'
                    ? 'bg-[#00DF81] text-[#051C12] shadow-sm font-bold'
                    : 'text-[#93A89C] hover:text-white'
                }`}
              >
                Transactions
              </button>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Firebase sync indicator */}
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0E1B15] border border-[#1A3326] text-[#93A89C] hover:bg-[#12241C] transition-all shadow-sm"
              title="Configure Firebase or check status"
            >
              <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-[#00DF81] ring-2 ring-[#00DF81]/30' : 'bg-amber-400'}`} />
              <span>{isFirebaseActive ? 'Firestore Cloud' : 'Local Vault'}</span>
              <Database className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {/* Add Card Button */}
            <button
              onClick={() => {
                setEditingCard(null);
                setIsCardModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#12241C] border border-[#1A3326] text-white hover:bg-[#1A3326] shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-[#00DF81]" />
              <span className="hidden sm:inline">Add Card</span>
            </button>

            {/* Add Spending / Recommendation trigger */}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] shadow-emerald-glow transition-all group"
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>Log Spend</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* User Account / Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#1A3326]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#12241C] text-xs font-medium text-white transition-colors"
                    title="Account Settings"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#12241C] text-[#00DF81] border border-[#1A3326] flex items-center justify-center font-bold text-xs">
                      {user.displayName?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <span className="hidden xl:inline text-xs font-semibold max-w-[100px] truncate text-white">
                      {user.displayName}
                    </span>
                  </button>

                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-xs text-[#93A89C] hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Sign Out to Landing Page"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#12241C] border border-[#1A3326] text-white hover:bg-[#1A3326]"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
