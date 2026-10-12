import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CardProvider, CardTheme, CreditCard, SpendingCategory } from '../types';
import { CARD_PRESETS, CATEGORY_INFO } from '../services/cardDefaults';
import { 
  X, 
  CreditCard as CardIcon, 
  Sparkles, 
  ShieldCheck, 
  Info,
  DollarSign,
  Palette,
  Check
} from 'lucide-react';

export const CardModal: React.FC = () => {
  const { 
    isCardModalOpen, 
    setIsCardModalOpen, 
    editingCard, 
    addCard, 
    updateCard 
  } = useApp();

  const [provider, setProvider] = useState<CardProvider>('Visa');
  const [cardName, setCardName] = useState<string>('');
  const [last4, setLast4] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('ALEXANDER MORGAN');
  const [creditLimit, setCreditLimit] = useState<number>(10000);
  const [theme, setTheme] = useState<CardTheme>('emerald-lime');
  const [billingCycleDay, setBillingCycleDay] = useState<number>(15);
  const [expiryMonth, setExpiryMonth] = useState<string>('12');
  const [expiryYear, setExpiryYear] = useState<string>('29');
  const [annualFee, setAnnualFee] = useState<number>(0);
  const [customPerksText, setCustomPerksText] = useState<string>('');
  const [rewardRates, setRewardRates] = useState<Record<SpendingCategory, number>>({
    dining: 3.0,
    groceries: 3.0,
    travel: 2.0,
    fuel: 3.0,
    shopping: 2.0,
    entertainment: 2.0,
    utilities: 1.0,
    general: 1.5,
  });

  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (editingCard) {
      setProvider(editingCard.provider);
      setCardName(editingCard.cardName);
      setLast4(editingCard.last4);
      setCardHolder(editingCard.cardHolder);
      setCreditLimit(editingCard.creditLimit);
      setTheme(editingCard.theme || 'emerald-lime');
      setBillingCycleDay(editingCard.billingCycleDay || 15);
      setExpiryMonth(editingCard.expiryMonth || '12');
      setExpiryYear(editingCard.expiryYear || '29');
      setAnnualFee(editingCard.annualFee || 0);
      setCustomPerksText(editingCard.customPerks?.join('\n') || '');
      setRewardRates({
        dining: editingCard.rewardRates?.dining ?? 1.0,
        groceries: editingCard.rewardRates?.groceries ?? 1.0,
        travel: editingCard.rewardRates?.travel ?? 1.0,
        fuel: editingCard.rewardRates?.fuel ?? 1.0,
        shopping: editingCard.rewardRates?.shopping ?? 1.0,
        entertainment: editingCard.rewardRates?.entertainment ?? 1.0,
        utilities: editingCard.rewardRates?.utilities ?? 1.0,
        general: editingCard.rewardRates?.general ?? 1.0,
      });
    } else {
      // Default clean state
      setProvider('Visa');
      setCardName('');
      setLast4('');
      setCardHolder('ALEXANDER MORGAN');
      setCreditLimit(10000);
      setTheme('emerald-lime');
      setBillingCycleDay(15);
      setExpiryMonth('12');
      setExpiryYear('29');
      setAnnualFee(0);
      setCustomPerksText('Zero Foreign Transaction Fees\nPurchase Protection');
      setRewardRates({
        dining: 3.0,
        groceries: 3.0,
        travel: 2.0,
        fuel: 3.0,
        shopping: 2.0,
        entertainment: 2.0,
        utilities: 1.0,
        general: 1.5,
      });
    }
  }, [editingCard, isCardModalOpen]);

  if (!isCardModalOpen) return null;

  const handleApplyPreset = (presetName: string) => {
    const preset = CARD_PRESETS.find((p) => p.cardName === presetName);
    if (!preset) return;

    setProvider(preset.provider);
    setCardName(preset.cardName);
    setTheme(preset.theme);
    setAnnualFee(preset.annualFee);
    setRewardRates({ ...preset.rewardRates });
    setCustomPerksText(preset.customPerks.join('\n'));
  };

  const handleRateChange = (cat: SpendingCategory, val: number) => {
    setRewardRates((prev) => ({
      ...prev,
      [cat]: Math.max(0, val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cardName.trim()) {
      setErrorMsg('Card name is required.');
      return;
    }

    const cleanLast4 = last4.replace(/\D/g, '');
    if (cleanLast4.length !== 4) {
      setErrorMsg('Please enter exactly the last 4 digits (e.g. 8492).');
      return;
    }

    if (creditLimit <= 0) {
      setErrorMsg('Credit limit must be greater than $0.');
      return;
    }

    const perksArray = customPerksText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingCard) {
      await updateCard({
        ...editingCard,
        provider,
        cardName: cardName.trim(),
        last4: cleanLast4,
        cardHolder: cardHolder.trim().toUpperCase(),
        creditLimit,
        theme,
        rewardRates,
        customPerks: perksArray,
        billingCycleDay,
        expiryMonth,
        expiryYear,
        annualFee,
      });
    } else {
      await addCard({
        provider,
        cardName: cardName.trim(),
        last4: cleanLast4,
        cardHolder: cardHolder.trim().toUpperCase(),
        creditLimit,
        theme,
        rewardRates,
        customPerks: perksArray,
        billingCycleDay,
        expiryMonth,
        expiryYear,
        annualFee,
      });
    }

    setIsCardModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0E1B15] rounded-3xl border border-[#1A3326] shadow-card-glow overflow-hidden my-8 max-h-[90vh] flex flex-col text-white">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#0A130E] border-b border-[#1A3326] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center shadow-emerald-glow">
              <CardIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {editingCard ? 'Configure Credit Card' : 'Add Credit Card'}
              </h3>
              <p className="text-xs text-[#93A89C]">
                Configure rewards benefits and credit line for optimal recommendations
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCardModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#12241C] text-[#93A89C] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Quick Preset Autocomplete */}
          {!editingCard && (
            <div className="p-3.5 rounded-2xl bg-[#070E0A] border border-[#1A3326] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00DF81] shrink-0" />
                <span className="text-xs font-bold text-white">Quick-Fill Card Preset:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CARD_PRESETS.map((preset) => (
                  <button
                    key={preset.cardName}
                    type="button"
                    onClick={() => handleApplyPreset(preset.cardName)}
                    className="px-2.5 py-1 rounded-lg bg-[#12241C] border border-[#1A3326] text-[11px] font-semibold text-white hover:bg-[#00DF81] hover:text-[#051C12] transition-colors"
                  >
                    {preset.cardName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Provider & Card Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Card Provider / Issuer
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as CardProvider)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="Discover">Discover</option>
                <option value="Chase">Chase</option>
                <option value="Capital One">Capital One</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Card Name / Product
              </label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. Sapphire Preferred, Gold Card"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              />
            </div>
          </div>

          {/* Last 4 Digits & Credit Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5 flex items-center justify-between">
                <span>Last 4 Digits</span>
                <span className="text-[10px] text-[#00DF81] font-semibold">Strictly Last 4 only</span>
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 8492"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] font-mono text-base font-bold text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Credit Limit ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#00DF81]">
                  $
                </span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  required
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>
            </div>
          </div>

          {/* Name on Card & Visual Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Name on Card (Embossed)
              </label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="FIRSTNAME LASTNAME"
                className="w-full px-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold uppercase text-white tracking-wide focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Physical Finish Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as CardTheme)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              >
                <option value="emerald-lime">Emerald Lime (Finovia Iconic)</option>
                <option value="obsidian-black">Obsidian Titanium Black</option>
                <option value="gold-luxury">Prestige Gold Brushed</option>
                <option value="sapphire-blue">Royal Sapphire Blue</option>
                <option value="forest-green">Deep Forest Green</option>
                <option value="slate-minimal">Slate Platinum Brushed</option>
              </select>
            </div>
          </div>

          {/* Category Reward Multipliers (% rate) */}
          <div className="p-4 rounded-2xl bg-[#070E0A] border border-[#1A3326] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00DF81]">
                Configured Reward Rates (% Cashback / Points Multiplier)
              </span>
              <span className="text-[11px] text-[#93A89C]">Used by recommendation engine</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(CATEGORY_INFO) as SpendingCategory[]).map((cat) => (
                <div key={cat} className="p-2.5 rounded-xl bg-[#0E1B15] border border-[#1A3326]">
                  <div className="text-[11px] font-semibold text-[#93A89C] truncate mb-1">
                    {CATEGORY_INFO[cat].label}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={rewardRates[cat] ?? 1.0}
                      onChange={(e) => handleRateChange(cat, parseFloat(e.target.value) || 0)}
                      className="w-full pr-6 pl-2 py-1.5 rounded-lg bg-[#070E0A] border border-[#1A3326] text-xs font-extrabold text-[#00DF81] focus:outline-none focus:ring-1 focus:ring-[#00DF81]"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5B7064]">
                      %
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Perks Bullet Points & Cycle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                Key Benefits & Perks (One per line)
              </label>
              <textarea
                rows={3}
                value={customPerksText}
                onChange={(e) => setCustomPerksText(e.target.value)}
                placeholder="4X on Restaurants Worldwide&#10;Complimentary Airport Lounge Access&#10;Trip Cancellation Insurance"
                className="w-full p-3 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                  Cycle Closing Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={billingCycleDay}
                  onChange={(e) => setBillingCycleDay(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#93A89C] mb-1.5">
                  Annual Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-bold text-white"
                />
              </div>
            </div>
          </div>

          {/* Security Assurance Warning */}
          <div className="p-3.5 rounded-2xl bg-[#070E0A] border border-[#1A3326] flex items-center gap-3 text-xs text-[#93A89C]">
            <ShieldCheck className="w-5 h-5 text-[#00DF81] shrink-0" />
            <div>
              <span className="font-bold text-white">Safe & Non-Custodial:</span> We never ask for CVV, PIN, or login credentials. Your card benefits are only used for mathematical perk recommendations.
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1A3326]">
            <button
              type="button"
              onClick={() => setIsCardModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-[#1A3326] bg-[#12241C] text-xs font-semibold text-white hover:bg-[#1A3326]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all"
            >
              {editingCard ? 'Save Configuration' : 'Save Credit Card'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
