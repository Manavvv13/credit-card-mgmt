export type CardProvider = 
  | 'Visa' 
  | 'Mastercard' 
  | 'American Express' 
  | 'Discover' 
  | 'Chase' 
  | 'Capital One';

export type CardTheme = 
  | 'forest-green' 
  | 'emerald-lime' 
  | 'obsidian-black' 
  | 'gold-luxury' 
  | 'sapphire-blue' 
  | 'slate-minimal';

export type SpendingCategory = 
  | 'dining' 
  | 'groceries' 
  | 'travel' 
  | 'fuel' 
  | 'shopping' 
  | 'entertainment' 
  | 'utilities' 
  | 'general';

export interface CategoryReward {
  category: SpendingCategory;
  rate: number; // e.g. 4.0 for 4%
  description?: string; // e.g. "4x Membership Rewards"
}

export interface CreditCard {
  id: string;
  provider: CardProvider;
  cardName: string;
  last4: string;
  cardHolder: string;
  creditLimit: number;
  currentSpend: number;
  theme: CardTheme;
  rewardRates: Record<SpendingCategory, number>; // Category to rate in %
  customPerks: string[];
  billingCycleDay: number;
  expiryMonth?: string;
  expiryYear?: string;
  annualFee?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Transaction {
  id: string;
  cardId: string;
  cardName: string;
  cardLast4: string;
  amount: number;
  category: SpendingCategory;
  merchant: string;
  date: string; // ISO date string
  rewardEarned: number; // in $ or points equivalent
  rewardRateApplied: number; // in %
  rewardNote?: string;
  createdAt: number;
}

export interface CardRecommendation {
  card: CreditCard;
  rank: 1 | 2 | 3;
  rate: number;
  rewardValue: number;
  isEligibleLimit: boolean;
  remainingLimitAfter: number;
  newUtilization: number;
  reasons: string[];
  verdict: 'Best Pick' | 'Runner Up' | 'Alternative' | 'Limit Exceeded';
  perksHighlighted?: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}
