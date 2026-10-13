import React from 'react';
import { CreditCard, CardTheme } from '../types';
import { Wifi, Sparkles, AlertCircle } from 'lucide-react';

interface CreditCardVisualProps {
  card: CreditCard;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: (card: CreditCard) => void;
  onDelete?: (cardId: string) => void;
  showActions?: boolean;
}

const THEME_STYLES: Record<
  CardTheme,
  {
    bg: string;
    text: string;
    border: string;
    chip: string;
    accent: string;
    badge: string;
  }
> = {
  'emerald-lime': {
    bg: 'bg-gradient-to-br from-[#122A0A] via-[#1A3A0F] to-[#0A1A05]',
    text: 'text-white',
    border: 'border-[#9FE870]/30 shadow-[0_15px_35px_rgba(20,44,10,0.3)]',
    chip: 'bg-gradient-to-br from-amber-200 to-amber-400 border-amber-300',
    accent: 'text-[#9FE870]',
    badge: 'bg-[#9FE870]/20 text-[#9FE870] border-[#9FE870]/40',
  },
  'obsidian-black': {
    bg: 'bg-gradient-to-br from-[#17171C] via-[#0E0E12] to-[#050507]',
    text: 'text-zinc-100',
    border: 'border-zinc-700/50 shadow-[0_15px_35px_rgba(0,0,0,0.4)]',
    chip: 'bg-gradient-to-br from-zinc-300 to-zinc-400 border-zinc-200',
    accent: 'text-zinc-300',
    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  },
  'gold-luxury': {
    bg: 'bg-gradient-to-br from-[#2E2412] via-[#211A0C] to-[#120E06]',
    text: 'text-amber-50',
    border: 'border-amber-500/40 shadow-[0_15px_35px_rgba(180,130,20,0.2)]',
    chip: 'bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-500 border-yellow-200',
    accent: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  'sapphire-blue': {
    bg: 'bg-gradient-to-br from-[#0B1E38] via-[#081528] to-[#040A14]',
    text: 'text-sky-50',
    border: 'border-sky-500/30 shadow-[0_15px_35px_rgba(14,50,90,0.25)]',
    chip: 'bg-gradient-to-br from-sky-200 to-sky-400 border-sky-200',
    accent: 'text-sky-300',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  'forest-green': {
    bg: 'bg-gradient-to-br from-[#0B2319] via-[#071912] to-[#030D09]',
    text: 'text-emerald-50',
    border: 'border-emerald-500/30 shadow-[0_15px_35px_rgba(10,50,30,0.25)]',
    chip: 'bg-gradient-to-br from-emerald-200 to-emerald-400 border-emerald-200',
    accent: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  'slate-minimal': {
    bg: 'bg-gradient-to-br from-[#272E36] via-[#1B2127] to-[#101418]',
    text: 'text-slate-100',
    border: 'border-slate-600/40 shadow-[0_15px_35px_rgba(30,40,50,0.25)]',
    chip: 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-300',
    accent: 'text-slate-300',
    badge: 'bg-slate-700/60 text-slate-300 border-slate-600',
  },
};

export const CreditCardVisual: React.FC<CreditCardVisualProps> = ({
  card,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const theme = THEME_STYLES[card.theme] || THEME_STYLES['emerald-lime'];
  const utilization = card.creditLimit > 0 ? Math.round((card.currentSpend / card.creditLimit) * 100) : 0;
  const available = Math.max(0, card.creditLimit - card.currentSpend);

  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-3xl p-5 sm:p-6 transition-all duration-300 select-none overflow-hidden border ${
        theme.bg
      } ${theme.border} ${
        isSelected
          ? 'ring-2 ring-[#00DF81] ring-offset-2 ring-offset-[#0E1B15] shadow-[0_0_25px_rgba(0,223,129,0.22)] scale-[1.01]'
          : 'hover:-translate-y-1'
      } cursor-pointer flex flex-col justify-between min-h-[200px] sm:min-h-[220px] aspect-[1.586/1]`}
    >
      {/* Subtle glossy card overlay sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-white/[0.12] pointer-events-none rounded-3xl" />
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />

      {/* Top Header: Provider & Contactless */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm sm:text-base font-bold tracking-tight text-white font-sans truncate">
            {card.cardName}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${theme.badge}`}
          >
            {card.provider}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 rotate-90" />
        </div>
      </div>

      {/* Middle: EMV Chip & Masked Number */}
      <div className="relative z-10 my-auto pt-1 sm:pt-2">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
          {/* Metallic Gold Chip */}
          <div
            className={`w-10 h-7 sm:w-11 sm:h-8 rounded-lg border flex items-center justify-center p-1 relative overflow-hidden shadow-sm shrink-0 ${theme.chip}`}
          >
            <div className="w-full h-full border border-black/20 rounded flex flex-col justify-between p-0.5 opacity-80">
              <div className="h-0.5 bg-black/20 rounded-full" />
              <div className="h-0.5 bg-black/20 rounded-full" />
              <div className="h-0.5 bg-black/20 rounded-full" />
            </div>
          </div>
          <span className="text-[10px] sm:text-xs text-white/60 font-mono tracking-wider">CREDIT</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 font-mono text-base sm:text-lg tracking-[0.18em] sm:tracking-[0.22em] text-white/90">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span className="font-bold text-white tracking-widest">{card.last4}</span>
        </div>
      </div>

      {/* Bottom: Cardholder, Expiry & Utilization Indicator */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-wider text-white/50 font-medium">
            Cardholder
          </div>
          <div className="text-[11px] sm:text-xs font-semibold text-white tracking-wide truncate max-w-[110px] sm:max-w-[140px]">
            {card.cardHolder || 'CARDMEMBER'}
          </div>
        </div>

        <div className="text-center shrink-0">
          <div className="text-[9px] uppercase tracking-wider text-white/50 font-medium">
            Expires
          </div>
          <div className="text-[11px] sm:text-xs font-mono font-medium text-white/90">
            {card.expiryMonth || '12'}/{card.expiryYear || '28'}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[9px] uppercase tracking-wider text-white/50 font-medium">
            Avail. Limit
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-white tracking-tight">
            ${available.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Floating Action Menu on hover */}
      {showActions && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="text-xs px-2.5 py-1 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="text-xs px-2.5 py-1 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
