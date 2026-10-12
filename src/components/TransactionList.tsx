import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpendingCategory } from '../types';
import { CATEGORY_INFO } from '../services/cardDefaults';
import { 
  Search, 
  Filter, 
  Trash2, 
  Sparkles, 
  Store, 
  CreditCard as CardIcon,
  Plus
} from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { 
    transactions, 
    cards, 
    deleteTransaction, 
    setIsExpenseModalOpen 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCardId, setSelectedCardId] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.merchant.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesCard = selectedCardId === 'all' || t.cardId === selectedCardId;
    return matchesSearch && matchesCat && matchesCard;
  });

  return (
    <div className="bg-[#0E1B15] rounded-3xl p-6 sm:p-8 border border-[#1A3326] shadow-card-glow space-y-6 text-white">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recent Spending & Rewards Ledger
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30">
              {transactions.length}
            </span>
          </div>
          <p className="text-xs text-[#93A89C] mt-0.5">
            Verified rewards yields and card utilization breakdown
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold transition-all shadow-emerald-glow self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchants..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-medium text-white placeholder-[#5B7064] focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
          />
        </div>

        {/* Category filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
          >
            <option value="all">All Categories</option>
            {(Object.keys(CATEGORY_INFO) as SpendingCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_INFO[cat].label}
              </option>
            ))}
          </select>
        </div>

        {/* Card filter */}
        <div>
          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
          >
            <option value="all">All Cards in Portfolio</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cardName} (•••• {c.last4})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Transactions Table / List */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#93A89C] bg-[#070E0A] rounded-2xl border border-[#1A3326]">
            No transactions matching the selected filters.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1A3326] text-[11px] uppercase tracking-wider text-[#93A89C] font-bold">
                <th className="py-3 px-3">Merchant & Date</th>
                <th className="py-3 px-3">Card Used</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Reward Return</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3326]">
              {filteredTransactions.map((tx) => {
                const catInfo = CATEGORY_INFO[tx.category] || CATEGORY_INFO.general;
                const formattedDate = new Date(tx.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={tx.id} className="hover:bg-[#12241C] transition-colors group">
                    
                    {/* Merchant & Date */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81] shrink-0 font-bold text-xs">
                          {tx.merchant.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">
                            {tx.merchant}
                          </div>
                          <div className="text-[10px] text-[#93A89C] mt-0.5">
                            {formattedDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Card Used */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                        <CardIcon className="w-3.5 h-3.5 text-[#00DF81]" />
                        <span>{tx.cardName}</span>
                        <span className="text-[10px] text-[#93A89C] font-mono">
                          (•••• {tx.cardLast4})
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span
                        className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-[#12241C] border-[#1A3326] text-[#00DF81]"
                      >
                        {catInfo.label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-xs text-white">
                      ${tx.amount.toFixed(2)}
                    </td>

                    {/* Reward Return */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00DF81]/15 border border-[#00DF81]/30 text-[#00DF81] font-extrabold text-xs">
                        <Sparkles className="w-3 h-3 text-[#00DF81]" />
                        <span>+${tx.rewardEarned.toFixed(2)}</span>
                        <span className="text-[10px] font-normal text-white/70">
                          ({tx.rewardRateApplied}%)
                        </span>
                      </div>
                    </td>

                    {/* Delete action */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
