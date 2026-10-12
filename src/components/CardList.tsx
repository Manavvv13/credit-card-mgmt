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
      <div className="bg-[#0E1B15] rounded-3xl p-12 border border-[#1A3326] text-center max-w-lg mx-auto shadow-card-glow text-white">
        <div className="w-16 h-16 rounded-2xl bg-[#12241C] border border-[#1A3326] flex items-center justify-center text-[#00DF81] mx-auto mb-4">
          <CardIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No Credit Cards Registered</h3>
        <p className="mt-2 text-xs text-[#93A89C] leading-relaxed">
          Add your credit cards with their credit limit and rewards configuration to start receiving instant smart swipe recommendations.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setEditingCard(null);
              setIsCardModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#00DF81] text-[#051C12] font-bold text-xs shadow-emerald-glow hover:bg-[#00F08B]"
          >
            + Add First Card
          </button>
          <button
            onClick={resetDemoData}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#12241C] text-white font-semibold text-xs border border-[#1A3326] hover:bg-[#1A3326]"
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
                    <span className="text-[#93A89C] font-medium">Spent / Limit</span>
                    <span className="font-bold text-white">
                      ${card.currentSpend.toLocaleString()} / ${card.creditLimit.toLocaleString()}
                    </span>
                  </div>

                  {/* Utilization Bar */}
                  <div>
                    <div className="w-full h-2 bg-[#070E0A] rounded-full overflow-hidden p-0.5 border border-[#1A3326]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          utilization > 50
                            ? 'bg-red-500'
                            : utilization > 30
                            ? 'bg-amber-400'
                            : 'bg-[#00DF81]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, utilization))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-[#93A89C]">
                      <span>{utilization}% utilized</span>
                      <span>${available.toLocaleString()} available</span>
                    </div>
                  </div>

                  {/* Reward Highlights */}
                  <div className="pt-2 border-t border-[#1A3326]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#5B7064] mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#00DF81]" />
                      <span>Top Perk Multipliers</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {topRewards.map((item) => (
                        <span
                          key={item.category}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-[#12241C] border border-[#1A3326] text-white"
                        >
                          <span className="capitalize">{item.category}</span>
                          <span className="font-extrabold text-[#00DF81]">{item.rate}%</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Billing Cycle Day */}
                  <div className="flex items-center justify-between text-[11px] text-[#93A89C] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#5B7064]" />
                      Cycle closes {card.billingCycleDay || 15}th
                    </span>
                    {card.annualFee !== undefined && card.annualFee > 0 && (
                      <span className="font-semibold text-zinc-400">
                        ${card.annualFee}/yr fee
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-[#1A3326] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEdit(card)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#1A3326] bg-[#12241C] text-white hover:bg-[#1A3326] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#00DF81]" />
                  <span>Configure</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(card.id)}
                  className="p-2 rounded-xl border border-red-900/50 text-red-400 hover:bg-red-950/40 font-semibold text-xs transition-colors"
                  title="Delete Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* In-place Delete Confirmation */}
              {deleteConfirmId === card.id && (
                <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 space-y-2">
                  <p className="font-medium">Delete {card.cardName}? This cannot be undone.</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 text-xs"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-[#12241C] border border-[#1A3326] text-white rounded-lg text-xs"
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
