import React from 'react';
import { useApp } from '../context/AppContext';
import { SpendingCategory } from '../types';
import { CATEGORY_INFO } from '../services/cardDefaults';
import { PieChart, TrendingUp, Award } from 'lucide-react';

export const CategoryBreakdown: React.FC = () => {
  const { transactions, totalSpent } = useApp();

  // Aggregate spending and rewards by category
  const categoryData = (Object.keys(CATEGORY_INFO) as SpendingCategory[]).map((cat) => {
    const catTransactions = transactions.filter((t) => t.category === cat);
    const spent = catTransactions.reduce((acc, t) => acc + t.amount, 0);
    const rewards = catTransactions.reduce((acc, t) => acc + t.rewardEarned, 0);
    const percentage = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;

    return {
      category: cat,
      info: CATEGORY_INFO[cat],
      spent,
      rewards,
      percentage,
      txCount: catTransactions.length,
    };
  })
  .filter((c) => c.spent > 0)
  .sort((a, b) => b.spent - a.spent);

  if (categoryData.length === 0) return null;

  return (
    <div className="bg-[#0E1B15] rounded-3xl p-6 sm:p-8 border border-[#1A3326] shadow-card-glow space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Spending Distribution & Yield
            </h3>
            <p className="text-xs text-[#93A89C]">
              Where your capital flows and which categories generate max rewards
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-[#93A89C]">Active Total</span>
          <div className="text-sm font-extrabold text-[#00DF81]">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-4">
        {categoryData.map((item) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00DF81]" />
                <span className="font-bold text-white">{item.info.label}</span>
                <span className="text-[11px] text-[#93A89C]">({item.txCount} swipes)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-white">
                  ${item.spent.toFixed(2)}
                </span>
                <span className="text-[11px] font-semibold text-[#00DF81] bg-[#00DF81]/15 px-2 py-0.5 rounded-md border border-[#00DF81]/30">
                  +${item.rewards.toFixed(2)} rewards
                </span>
                <span className="text-[#93A89C] font-mono w-9 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Bar */}
            <div className="w-full h-2 bg-[#070E0A] rounded-full overflow-hidden p-0.5 border border-[#1A3326]">
              <div
                className="h-full rounded-full bg-[#00DF81] transition-all duration-500 shadow-emerald-glow"
                style={{ width: `${Math.max(4, item.percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
