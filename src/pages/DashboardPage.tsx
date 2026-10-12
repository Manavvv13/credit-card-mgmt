import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { DashboardOverview } from '../components/DashboardOverview';
import { CardList } from '../components/CardList';
import { SmartRecommender } from '../components/SmartRecommender';
import { TransactionList } from '../components/TransactionList';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { CardModal } from '../components/CardModal';
import { ExpenseModal } from '../components/ExpenseModal';
import { FirebaseSettingsModal } from '../components/FirebaseSettingsModal';
import { AuthModal } from '../components/AuthModal';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowLeft 
} from 'lucide-react';

interface DashboardPageProps {
  onSignOut: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSignOut }) => {
  const { user, setIsExpenseModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cards' | 'recommend' | 'transactions'>('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A130E] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-[#0E1B15] rounded-3xl p-8 border border-[#1A3326] shadow-card-glow text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#12241C] text-[#00DF81] flex items-center justify-center mx-auto border border-[#1A3326]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-xs text-[#93A89C]">
            The credit card portfolio and recommendation engine is strictly accessible after logging in or starting a guest demo session.
          </p>
          <button
            onClick={onSignOut}
            className="w-full py-3 rounded-full bg-[#00DF81] text-[#051C12] font-extrabold text-xs shadow-emerald-glow"
          >
            Go to Login / Demo Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A130E] text-white flex flex-col font-sans selection:bg-[#00DF81] selection:text-[#051C12]">
      {/* Background Fintech Grid */}
      <div className="fixed inset-0 fintech-grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#00DF81]/[0.05] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Render Tab Contents */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Top KPI Metrics */}
            <DashboardOverview />

            {/* Quick Interactive Spend Callout Banner */}
            <div className="bg-[#0E1B15] border border-[#1A3326] rounded-3xl p-6 sm:p-8 text-white shadow-card-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#00DF81]/15 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12241C] text-[#00DF81] text-xs font-bold border border-[#1A3326]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time Perks Intelligence</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight pt-1 text-white">
                  Ready to swipe? Maximize your cash return now
                </h3>
                <p className="text-xs sm:text-sm text-[#93A89C] max-w-xl">
                  Log your expense amount and merchant. Our algorithm ranks your Best Card and 2 Alternatives
                  instantly based on your configured reward benefits and safe credit limits.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] font-extrabold text-xs shadow-emerald-glow transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#051C12]" />
                  <span>Log Spend & Optimize</span>
                </button>
              </div>
            </div>

            {/* Credit Card Portfolio Section */}
            <CardList />

            {/* Spending Simulator / Perks Recommender */}
            <SmartRecommender />

            {/* Spending Breakdown & Recent Transactions Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <CategoryBreakdown />
              </div>
              <div className="lg:col-span-2">
                <TransactionList />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-8">
            <CardList />
          </div>
        )}

        {activeTab === 'recommend' && (
          <div className="space-y-8">
            <SmartRecommender />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-8">
            <TransactionList />
            <CategoryBreakdown />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1A3326] bg-[#070E0A] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#93A89C]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#12241C] border border-[#1A3326] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#00DF81]" />
            </div>
            <span className="font-bold text-white">Finovia</span>
            <span>— Non-Custodial Credit Card Portfolio & Perks Intelligence</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#00DF81] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero-Credentials Safe
            </span>
            <span>•</span>
            <button 
              onClick={onSignOut}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CardModal />
      <ExpenseModal />
      <FirebaseSettingsModal />
      <AuthModal />
    </div>
  );
};
