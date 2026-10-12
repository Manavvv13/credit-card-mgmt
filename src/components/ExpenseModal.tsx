import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SpendingCategory, CreditCard } from '../types';
import { CATEGORY_INFO } from '../services/cardDefaults';
import { getCardRecommendations } from '../services/recommendation';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  DollarSign, 
  Store, 
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const ExpenseModal: React.FC = () => {
  const { 
    isExpenseModalOpen, 
    setIsExpenseModalOpen, 
    cards, 
    addTransaction 
  } = useApp();

  const [amountInput, setAmountInput] = useState<string>('85.00');
  const [category, setCategory] = useState<SpendingCategory>('dining');
  const [merchant, setMerchant] = useState<string>('Shake Shack');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const numAmount = parseFloat(amountInput) || 0;

  // Run recommendation engine dynamically as amount or category changes
  const { bestPick, alternatives, allScored } = useMemo(() => {
    return getCardRecommendations(cards, numAmount, category, merchant);
  }, [cards, numAmount, category, merchant]);

  // Default selected card to bestPick if not manually altered
  useEffect(() => {
    if (bestPick && (!selectedCardId || !cards.some((c) => c.id === selectedCardId))) {
      setSelectedCardId(bestPick.card.id);
    }
  }, [bestPick]);

  if (!isExpenseModalOpen) return null;

  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount <= 0) {
      setErrorMsg('Please enter an amount greater than $0.');
      return;
    }

    if (!selectedCardId) {
      setErrorMsg('Please select a credit card to log this purchase.');
      return;
    }

    const targetCard = cards.find((c) => c.id === selectedCardId);
    if (!targetCard) {
      setErrorMsg('Selected card not found.');
      return;
    }

    const available = targetCard.creditLimit - targetCard.currentSpend;
    if (numAmount > available) {
      const confirmOverlimit = window.confirm(
        `This expense ($${numAmount}) exceeds the card's available limit ($${available.toFixed(2)}). Do you still wish to proceed?`
      );
      if (!confirmOverlimit) return;
    }

    // Determine applied reward rate
    const rate = targetCard.rewardRates?.[category] ?? 1.0;
    const rewardEarned = Number(((numAmount * rate) / 100).toFixed(2));

    await addTransaction({
      cardId: targetCard.id,
      cardName: targetCard.cardName,
      cardLast4: targetCard.last4,
      amount: numAmount,
      category,
      merchant: merchant.trim() || 'General Merchant',
      date: new Date(date).toISOString(),
      rewardEarned,
      rewardRateApplied: rate,
      rewardNote: `${rate}% on ${CATEGORY_INFO[category].label}`,
    });

    // Confetti animation
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00DF81', '#10B981', '#FFFFFF'],
      });
    } catch (e) {}

    setIsExpenseModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto text-white">
      <div className="relative w-full max-w-2xl bg-[#0E1B15] rounded-3xl border border-[#1A3326] shadow-card-glow overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0A130E] border-b border-[#1A3326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center shadow-emerald-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Log Spend & Optimize Perks
              </h3>
              <p className="text-xs text-[#93A89C]">
                Smart engine automatically evaluates maximum reward yield and limits
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#12241C] text-[#93A89C] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Spending Amount & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Expense Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#00DF81]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#070E0A] border border-[#1A3326] text-white font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#00DF81] shadow-sm"
                />
              </div>
            </div>

            {/* Merchant */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Merchant / Store
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Whole Foods, Delta, Uber"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#070E0A] border border-[#1A3326] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00DF81] shadow-sm"
                />
              </div>
            </div>

          </div>

          {/* Category Chips Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-2">
              Spending Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_INFO) as SpendingCategory[]).map((catKey) => {
                const info = CATEGORY_INFO[catKey];
                const isSelected = category === catKey;

                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`p-2.5 rounded-2xl text-left border text-xs font-semibold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#00DF81] text-[#051C12] border-[#00DF81] shadow-emerald-glow scale-[1.02] font-extrabold'
                        : 'bg-[#070E0A] text-[#93A89C] border-[#1A3326] hover:bg-[#12241C] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RECOMMENDATION ENGINE SHOWCASE */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00DF81]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  AI-Free Perks Engine Recommendation
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#93A89C]">
                Calculated across {cards.length} cards
              </span>
            </div>

            {/* Rank 1: BEST CARD */}
            {bestPick ? (
              <div
                onClick={() => handleSelectCard(bestPick.card.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedCardId === bestPick.card.id
                    ? 'bg-[#0B1E15] border-[#00DF81] shadow-emerald-glow'
                    : 'bg-[#070E0A] border-[#1A3326] hover:border-[#00DF81]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00DF81] text-[#051C12] flex items-center justify-center font-extrabold text-xs shadow-sm">
                      #{bestPick.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">
                          {bestPick.card.cardName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00DF81] text-[#051C12]">
                          BEST CARD
                        </span>
                      </div>
                      <div className="text-xs text-[#93A89C] mt-0.5">
                        {bestPick.card.provider} •••• {bestPick.card.last4}
                      </div>
                    </div>
                  </div>

                  {/* Reward Return Amount */}
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#00DF81]">
                      +${bestPick.rewardValue.toFixed(2)} back
                    </div>
                    <div className="text-[11px] font-bold text-[#93A89C]">
                      {bestPick.rate}% reward rate
                    </div>
                  </div>
                </div>

                {/* Explanation points */}
                <div className="mt-3 pt-3 border-t border-[#1A3326] flex flex-wrap items-center gap-2 text-xs">
                  {bestPick.reasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#12241C] border border-[#1A3326] text-white text-[11px] font-medium"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                {selectedCardId === bestPick.card.id && (
                  <div className="absolute top-3 right-3 text-[#00DF81]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-[#070E0A] rounded-2xl border border-[#1A3326] text-xs text-[#93A89C]">
                Please add credit cards to receive perks recommendations.
              </div>
            )}

            {/* Alternatives (Rank #2 and Rank #3) */}
            {alternatives.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#93A89C]">
                  Alternative Card Options (Rank #2 & #3)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {alternatives.map((alt) => {
                    const isSelected = selectedCardId === alt.card.id;
                    const diff = bestPick ? (bestPick.rewardValue - alt.rewardValue).toFixed(2) : '0';

                    return (
                      <div
                        key={alt.card.id}
                        onClick={() => handleSelectCard(alt.card.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0B1E15] border-[#00DF81] shadow-sm'
                            : 'bg-[#070E0A] border-[#1A3326] hover:bg-[#12241C]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white truncate block max-w-[150px]">
                              {alt.card.cardName}
                            </span>
                            <span className="text-[10px] text-[#93A89C]">
                              •••• {alt.card.last4} ({alt.rate}%)
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#00DF81]">
                              +${alt.rewardValue.toFixed(2)}
                            </span>
                            {Number(diff) > 0 && (
                              <span className="block text-[10px] text-amber-400 font-medium">
                                -${diff} vs best
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 text-[10px] text-[#93A89C] truncate">
                          {alt.isEligibleLimit
                            ? `Remaining limit: $${alt.remainingLimitAfter.toFixed(0)}`
                            : '⚠️ Exceeds limit'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
              Transaction Date
            </label>
            <div className="relative max-w-xs">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7064]" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Security note & Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1A3326]">
            <div className="flex items-center gap-2 text-[11px] text-[#93A89C]">
              <ShieldCheck className="w-4 h-4 text-[#00DF81]" />
              <span>No credentials required. Pure limit & rewards tracking.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-[#1A3326] bg-[#12241C] text-xs font-semibold text-white hover:bg-[#1A3326]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm & Log Spend</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
