import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCardVisual } from './CreditCardVisual';
import { CreditCard, SpendingCategory } from '../types';
import { CATEGORY_INFO } from '../services/cardDefaults';
import { 
  Plus, 
  CreditCard as CardIcon, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Calendar, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CardListProps {
  onSelectCardForSpend?: (card: CreditCard) => void;
}

export const CardList: React.FC<CardListProps> = ({ onSelectCardForSpend }) => {
  const { 
    cards, 
    setIsCardModalOpen, 
    setEditingCard, 
    deleteCard, 
    setIsExpenseModalOpen,
    resetDemoData
  } = useApp();

  const [activeCardId, setActiveCardId] = useState<string>(cards[0]?.id || '');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selectedCard = cards.find((c) => c.id === activeCardId) || cards[0];

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const handleDelete = (cardId: string) => {
    deleteCard(cardId);
    setDeleteConfirmId(null);
  };

  if (cards.length === 0) {
    return (
      <div className="relative overflow-hidden bg-[#0E1B15] rounded-3xl p-8 sm:p-12 border border-[#1A3326] text-center max-w-lg mx-auto shadow-card-glow text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00DF81]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81] mx-auto mb-4 shadow-emerald-glow">
          <CardIcon className="w-8 h-8" />
        </div>
        <h3 className="relative z-10 text-xl font-extrabold text-white tracking-tight">No Credit Cards Registered</h3>
        <p className="relative z-10 mt-2 text-xs text-[#93A89C] leading-relaxed max-w-sm mx-auto">
          Add your credit cards with their credit limit and rewards configuration to start receiving instant smart swipe recommendations.
        </p>
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setEditingCard(null);
              setIsCardModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#00DF81] text-[#051C12] font-extrabold text-xs shadow-emerald-glow hover:bg-[#00F08B] transition-all hover:scale-105"
          >
            + Add First Card
          </button>
          <button
            onClick={resetDemoData}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#12241C] text-white font-semibold text-xs border border-[#1A3326] hover:bg-[#1A3326] hover:border-[#00DF81]/30 transition-all"
          >
            Load Premium Presets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Credit Cards Portfolio
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#00DF81]/15 text-[#00DF81] border border-[#00DF81]/30">
            {cards.length} Cards
          </span>
        </div>

        <button
          onClick={() => {
            setEditingCard(null);
            setIsCardModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00DF81] text-[#051C12] text-xs font-extrabold hover:bg-[#00F08B] transition-all shadow-emerald-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Cards Grid / Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const utilization = card.creditLimit > 0 ? Math.round((card.currentSpend / card.creditLimit) * 100) : 0;
          const available = Math.max(0, card.creditLimit - card.currentSpend);

          // Get top 3 reward categories
          const topRewards = Object.entries(card.rewardRates || {})
            .map(([cat, rate]) => ({ category: cat as SpendingCategory, rate }))
            .sort((a, b) => b.rate - a.rate)
            .slice(0, 3);

          return (
            <div
              key={card.id}
              className="bg-[#0E1B15] rounded-3xl p-5 border border-[#1A3326] shadow-card-glow flex flex-col justify-between hover:border-[#00DF81]/40 transition-all group"
            >
              {/* The Physical Card Rendering */}
              <div>
                <CreditCardVisual
                  card={card}
                  isSelected={card.id === activeCardId}
                  onSelect={() => setActiveCardId(card.id)}
                  onEdit={handleEdit}
                  onDelete={() => setDeleteConfirmId(card.id)}
                  showActions={false}
                />

                {/* Card Limit & Utilization Stats */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#93A89C]">
                      Spent / Limit
                    </span>
                    <div className="font-mono text-xs">
                      <span className="font-bold text-white">${card.currentSpend.toLocaleString()}</span>
                      <span className="text-[#5B7064] font-medium"> / </span>
                      <span className="text-[#93A89C] font-medium">${card.creditLimit.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div>
                    <div className="w-full h-2 bg-[#070E0A] rounded-full overflow-hidden p-0.5 border border-[#1A3326]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          utilization > 50
                            ? 'bg-red-500'
                            : utilization > 30
                            ? 'bg-amber-400'
                            : 'bg-[#00DF81]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, utilization))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[11px]">
                      <span className="text-[#93A89C]">
                        <span
                          className={`font-bold ${
                            utilization > 50
                              ? 'text-red-400'
                              : utilization > 30
                              ? 'text-amber-400'
                              : 'text-[#00DF81]'
                          }`}
                        >
                          {utilization}%
                        </span>{' '}
                        utilized
                      </span>
                      <span className="text-[#93A89C]">
                        <span className="font-semibold text-white">${available.toLocaleString()}</span> available
                      </span>
                    </div>
                  </div>

                  {/* Reward Highlights */}
                  <div className="pt-2.5 border-t border-[#1A3326]/80">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-[#93A89C] mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#00DF81]" />
                      <span>Top Perk Multipliers</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {topRewards.map((item) => (
                        <span
                          key={item.category}
                          className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-lg bg-[#12241C] border border-[#1A3326] hover:border-[#00DF81]/30 transition-colors"
                        >
                          <span className="capitalize text-zinc-300 font-medium">{item.category}</span>
                          <span className="font-mono font-bold text-[#00DF81]">{item.rate}%</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Billing Cycle Day */}
                  <div className="flex items-center justify-between text-[11px] text-[#93A89C] pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5B7064]" />
                      <span>
                        Cycle closes <span className="font-semibold text-white">{card.billingCycleDay || 15}th</span>
                      </span>
                    </span>
                    {card.annualFee !== undefined && card.annualFee > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#12241C] border border-[#1A3326] text-zinc-300">
                        ${card.annualFee}/yr fee
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-[#1A3326]/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEdit(card)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#1A3326] bg-[#12241C] text-zinc-100 hover:text-white hover:bg-[#183023] hover:border-[#00DF81]/40 font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group/btn"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#00DF81] group-hover/btn:scale-110 transition-transform" />
                  <span>Configure</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(card.id)}
                  className="w-9 h-9 rounded-xl border border-red-900/40 bg-red-950/20 text-red-400 hover:text-red-300 hover:bg-red-950/50 hover:border-red-700/60 font-semibold text-xs transition-all duration-200 flex items-center justify-center shrink-0"
                  title="Delete Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* In-place Delete Confirmation */}
              {deleteConfirmId === card.id && (
                <div className="mt-3 p-3.5 rounded-2xl bg-red-950/40 border border-red-900/60 text-xs text-red-200 space-y-2.5 shadow-subtle-dark">
                  <p className="font-medium text-red-100">
                    Delete <span className="font-bold text-white">{card.cardName}</span>? This cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center shadow-sm"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="py-1.5 px-3 bg-[#12241C] hover:bg-[#1A3326] border border-[#1A3326] text-zinc-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
