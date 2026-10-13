import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle,
  Award,
  Wallet,
  PieChart
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { 
    user,
    cards, 
    totalLimit, 
    totalSpent, 
    availableLimit, 
    utilizationRate, 
    totalRewardsEarned,
    setIsExpenseModalOpen,
    setIsRecommenderOpen
  } = useApp();

  // Utilization health assessment
  let utilizationStatus = 'Optimal';
  let utilizationColor = 'text-[#00DF81] bg-[#00DF81]/15 border-[#00DF81]/30';
  let barColor = 'bg-[#00DF81]';

  if (utilizationRate > 50) {
    utilizationStatus = 'High Risk';
    utilizationColor = 'text-red-400 bg-red-950/60 border-red-800';
    barColor = 'bg-red-500';
  } else if (utilizationRate > 30) {
    utilizationStatus = 'Moderate';
    utilizationColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
    barColor = 'bg-amber-400';
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Top Greeting Header */}
      <div className="relative pt-1 pb-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12241C] border border-[#1A3326] text-xs font-semibold text-[#00DF81] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#00DF81] animate-pulse" />
          <span>Real-Time Credit Limit & Perks Intelligence</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-[#00DF81]">{user?.displayName || 'Member'}</span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#93A89C] max-w-xl font-normal leading-normal">
              Consolidated portfolio limits, utilization health monitoring, and instant AI-free algorithmic
              recommendations to swipe the highest-yielding card every single time.
            </p>
          </div>

          {/* Quick Perks Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsRecommenderOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] font-extrabold text-xs shadow-emerald-glow transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Swipe Advisor</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Available Limit */}
        <div className="bg-[#0E1B15] rounded-2xl p-5 border border-[#1A3326] shadow-card-glow flex flex-col justify-between relative overflow-hidden group hover:border-[#00DF81]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#93A89C]">
              Available Limit
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ${availableLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#93A89C]">
              <span className="font-semibold text-[#00DF81]">{cards.length} Active Cards</span>
              <span>• ${totalLimit.toLocaleString()} total cap</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Current Spending */}
        <div className="bg-[#0E1B15] rounded-2xl p-5 border border-[#1A3326] shadow-card-glow flex flex-col justify-between relative overflow-hidden group hover:border-[#00DF81]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#93A89C]">
              Current Spending
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#93A89C]">
              <span>Active billing cycle balance</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Credit Utilization Rate */}
        <div className="bg-[#0E1B15] rounded-2xl p-5 border border-[#1A3326] shadow-card-glow flex flex-col justify-between relative overflow-hidden group hover:border-[#00DF81]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#93A89C]">
              Utilization Rate
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${utilizationColor}`}>
              {utilizationStatus}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {utilizationRate}%
              </span>
              <span className="text-[11px] font-medium text-[#5B7064]">
                Target &lt; 30%
              </span>
            </div>

            {/* Visual utilization bar */}
            <div className="w-full h-2 bg-[#070E0A] rounded-full overflow-hidden mt-2.5 p-0.5 border border-[#1A3326]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(100, Math.max(4, utilizationRate))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Total Rewards Accumulated */}
        <div className="bg-[#0E1B15] rounded-2xl p-5 border border-[#1A3326] shadow-card-glow flex flex-col justify-between relative overflow-hidden group hover:border-[#00DF81]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#93A89C]">
              Rewards Earned
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#00DF81] tracking-tight flex items-baseline gap-1.5">
              <span>+${totalRewardsEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-xs font-normal text-[#93A89C]">cashback</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#93A89C]">
              <Sparkles className="w-3.5 h-3.5 text-[#00DF81]" />
              <span>Optimized card perks return</span>
            </div>
          </div>
        </div>

      </div>

      {/* Security & Non-Custodial Assurance Badge */}
      <div className="bg-[#0E1B15] rounded-xl p-3.5 border border-[#1A3326]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#93A89C]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Zero-Credential Architecture:</span>{' '}
            No CVV, PIN, passwords, or full card numbers are stored. Strictly last 4 digits and credit limits.
          </div>
        </div>
        <div className="text-[11px] font-medium text-[#5B7064] shrink-0">
          Client-side Vault + Firebase Sync
        </div>
      </div>
    </div>
  );
};
