import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SpendingCategory } from '../types';
import { CATEGORY_INFO } from '../services/cardDefaults';
import { getCardRecommendations } from '../services/recommendation';
import { 
  Sparkles, 
  ArrowUpRight, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartRecommender: React.FC = () => {
  const { cards, addTransaction } = useApp();

  const [amount, setAmount] = useState<number>(150);
  const [category, setCategory] = useState<SpendingCategory>('dining');
  const [merchant, setMerchant] = useState<string>('Capital Grille');
  const [loggedSuccess, setLoggedSuccess] = useState<string | null>(null);

  const { bestPick, alternatives, allScored } = useMemo(() => {
    return getCardRecommendations(cards, amount, category, merchant);
  }, [cards, amount, category, merchant]);

  const handleInstantSwipe = async (cardId: string) => {
    const cardRec = allScored.find((c) => c.card.id === cardId);
    if (!cardRec) return;

    await addTransaction({
      cardId: cardRec.card.id,
      cardName: cardRec.card.cardName,
      cardLast4: cardRec.card.last4,
      amount,
      category,
      merchant: merchant.trim() || 'Simulated Spend',
      date: new Date().toISOString(),
      rewardEarned: cardRec.rewardValue,
      rewardRateApplied: cardRec.rate,
      rewardNote: `Instant swipe recommendation (${cardRec.rate}%)`,
    });

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#00DF81', '#10B981', '#FFFFFF'],
      });
    } catch {}

    setLoggedSuccess(`Successfully recorded $${amount.toFixed(2)} on ${cardRec.card.cardName}!`);
    setTimeout(() => setLoggedSuccess(null), 4000);
  };

  return (
    <div className="bg-[#0E1B15] rounded-3xl p-6 sm:p-8 border border-[#1A3326] shadow-card-glow text-white">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1A3326]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center shadow-emerald-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Perks Optimizer & Swipe Simulator
            </h2>
            <p className="text-xs sm:text-sm text-[#93A89C]">
              Simulate any upcoming purchase to verify optimal rewards, cashback value, and limit impact
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12241C] border border-[#1A3326] text-xs font-semibold text-[#00DF81]">
          <Zap className="w-3.5 h-3.5 text-[#00DF81]" />
          <span>No AI hallucinations — Real mathematical rules</span>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        
        {/* Estimated Amount */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-2">
            Purchase Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#00DF81]">
              $
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#070E0A] border border-[#1A3326] text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-2">
            Spending Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SpendingCategory)}
            className="w-full px-4 py-3 rounded-2xl bg-[#070E0A] border border-[#1A3326] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
          >
            {(Object.keys(CATEGORY_INFO) as SpendingCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_INFO[cat].label}
              </option>
            ))}
          </select>
        </div>

        {/* Merchant Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-2">
            Target Merchant / Vendor
          </label>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Delta Air Lines, Uber, Target"
            className="w-full px-4 py-3 rounded-2xl bg-[#070E0A] border border-[#1A3326] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
          />
        </div>

      </div>

      {loggedSuccess && (
        <div className="mt-4 p-3 rounded-xl bg-[#00DF81]/15 border border-[#00DF81]/30 text-xs font-semibold text-[#00DF81] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#00DF81]" />
          <span>{loggedSuccess}</span>
        </div>
      )}

      {/* Comparison Results */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#93A89C]">
          Recommendation Hierarchy: Best Card vs 2 Alternatives
        </h3>

        {bestPick ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* CARD 1: BEST CARD */}
            <div className="lg:col-span-1 rounded-3xl p-6 bg-[#0B1E15] border-2 border-[#00DF81] shadow-emerald-glow flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-[#00DF81] text-[#051C12] font-black text-[10px] tracking-wide uppercase">
                  ⭐ BEST PICK
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-[#00DF81] uppercase tracking-wider">
                  Rank #1 Optimal Card
                </div>
                <h4 className="text-xl font-extrabold text-white mt-1">
                  {bestPick.card.cardName}
                </h4>
                <div className="text-xs text-[#93A89C] mt-0.5">
                  {bestPick.card.provider} •••• {bestPick.card.last4}
                </div>

                {/* Big Reward Display */}
                <div className="my-5 p-4 rounded-2xl bg-[#070E0A] border border-[#1A3326]">
                  <div className="text-xs text-[#93A89C] font-medium">Yield on ${amount}</div>
                  <div className="text-3xl font-extrabold text-[#00DF81] tracking-tight mt-0.5">
                    +${bestPick.rewardValue.toFixed(2)}
                  </div>
                  <div className="text-xs font-bold text-white mt-1">
                    {bestPick.rate}% Multiplier Rate
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-1.5 text-xs text-[#D1E0D7]">
                  {bestPick.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[#00DF81] font-bold">✔</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1A3326]">
                <button
                  onClick={() => handleInstantSwipe(bestPick.card.id)}
                  className="w-full py-3 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Swipe with Best Card</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2 & 3: ALTERNATIVES */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {alternatives.map((alt, idx) => {
                const diff = (bestPick.rewardValue - alt.rewardValue).toFixed(2);

                return (
                  <div
                    key={alt.card.id}
                    className="rounded-3xl p-6 bg-[#070E0A] border border-[#1A3326] flex flex-col justify-between hover:border-[#1A3326]/80 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#93A89C] uppercase tracking-wider">
                          Alternative #{idx + 1}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#12241C] text-[#00DF81] border border-[#1A3326]">
                          Rank #{alt.rank}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white mt-2">
                        {alt.card.cardName}
                      </h4>
                      <div className="text-xs text-[#93A89C]">
                        {alt.card.provider} •••• {alt.card.last4}
                      </div>

                      {/* Reward */}
                      <div className="my-4 p-3 rounded-2xl bg-[#0E1B15] border border-[#1A3326]">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-extrabold text-white">
                            +${alt.rewardValue.toFixed(2)}
                          </span>
                          <span className="text-xs font-bold text-[#00DF81]">
                            {alt.rate}%
                          </span>
                        </div>
                        {Number(diff) > 0 && (
                          <div className="text-[11px] text-amber-400 font-medium mt-1">
                            -${diff} vs best recommendation
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-[#93A89C]">
                        <div>• Remaining limit: ${alt.remainingLimitAfter.toFixed(0)}</div>
                        <div>• Utilization impact: {alt.newUtilization}%</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1A3326]">
                      <button
                        onClick={() => handleInstantSwipe(alt.card.id)}
                        className="w-full py-2.5 rounded-full bg-[#12241C] border border-[#1A3326] text-white hover:bg-[#1A3326] text-xs font-semibold transition-all"
                      >
                        Swipe with this Alternative
                      </button>
                    </div>
                  </div>
                );
              })}

              {alternatives.length === 0 && (
                <div className="col-span-2 p-8 bg-[#070E0A] rounded-3xl border border-[#1A3326] text-center text-xs text-[#93A89C] flex flex-col items-center justify-center">
                  <Info className="w-6 h-6 text-[#5B7064] mb-2" />
                  <p>Add 2 or more cards to your portfolio to view full alternative comparisons.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-[#93A89C] bg-[#070E0A] rounded-2xl border border-[#1A3326]">
            No credit cards currently registered. Add your cards above to start comparing.
          </div>
        )}
      </div>
    </div>
  );
};
