import { CardRecommendation, CreditCard, SpendingCategory } from '../types';

export function getCardRecommendations(
  cards: CreditCard[],
  amount: number,
  category: SpendingCategory,
  merchant: string = ''
): {
  bestPick: CardRecommendation | null;
  alternatives: CardRecommendation[];
  allScored: CardRecommendation[];
} {
  if (!cards || cards.length === 0 || amount <= 0) {
    return { bestPick: null, alternatives: [], allScored: [] };
  }

  const scoredCards: CardRecommendation[] = cards.map((card) => {
    const rate = card.rewardRates?.[category] ?? 1.0;
    const rewardValue = Number(((amount * rate) / 100).toFixed(2));
    const availableLimit = card.creditLimit - card.currentSpend;
    const isEligibleLimit = availableLimit >= amount;
    const remainingLimitAfter = Math.max(0, availableLimit - amount);
    const newSpend = card.currentSpend + amount;
    const newUtilization = Math.round((newSpend / card.creditLimit) * 100);

    const reasons: string[] = [];
    const perksHighlighted: string[] = [];

    // Reason 1: Rate and Yield
    reasons.push(`${rate}% rewards yield ($${rewardValue.toFixed(2)} return)`);

    // Reason 2: Utilization safety check
    if (newUtilization <= 30) {
      reasons.push(`Safe credit utilization: ${newUtilization}% (Well within <30% bureau standard)`);
    } else if (newUtilization <= 50) {
      reasons.push(`Moderate utilization: ${newUtilization}%`);
    } else {
      reasons.push(`High utilization alert: ${newUtilization}%`);
    }

    // Reason 3: Perks match check
    const merchantLower = merchant.toLowerCase();
    const categoryLower = category.toLowerCase();

    card.customPerks?.forEach((perk) => {
      const perkLower = perk.toLowerCase();
      if (
        perkLower.includes(categoryLower) ||
        (merchantLower && (perkLower.includes(merchantLower) || merchantLower.includes('uber') && perkLower.includes('uber') || merchantLower.includes('air') && perkLower.includes('travel')))
      ) {
        perksHighlighted.push(perk);
      }
    });

    if (perksHighlighted.length > 0) {
      reasons.push(`Bonus perk applied: ${perksHighlighted[0]}`);
    }

    if (!isEligibleLimit) {
      reasons.unshift(`⚠️ Transaction ($${amount}) exceeds remaining limit ($${availableLimit.toFixed(2)})`);
    }

    return {
      card,
      rank: 3, // Temporary placeholder
      rate,
      rewardValue,
      isEligibleLimit,
      remainingLimitAfter,
      newUtilization,
      reasons,
      verdict: isEligibleLimit ? 'Alternative' : 'Limit Exceeded',
      perksHighlighted,
    };
  });

  // Sort criteria:
  // 1. Eligible cards with enough limit come first
  // 2. Highest reward yield / rate
  // 3. Lower new utilization (healthier credit usage)
  // 4. Higher available limit
  const sorted = [...scoredCards].sort((a, b) => {
    if (a.isEligibleLimit && !b.isEligibleLimit) return -1;
    if (!a.isEligibleLimit && b.isEligibleLimit) return 1;

    // Highest reward
    if (b.rate !== a.rate) {
      return b.rate - a.rate;
    }

    // Healthier utilization
    if (a.newUtilization !== b.newUtilization) {
      return a.newUtilization - b.newUtilization;
    }

    return (b.card.creditLimit - b.card.currentSpend) - (a.card.creditLimit - a.card.currentSpend);
  });

  // Assign ranks
  const ranked = sorted.map((item, index) => {
    const rankNum = (index === 0 ? 1 : index === 1 ? 2 : 3) as 1 | 2 | 3;
    let verdict: CardRecommendation['verdict'] = 'Alternative';

    if (!item.isEligibleLimit) {
      verdict = 'Limit Exceeded';
    } else if (index === 0) {
      verdict = 'Best Pick';
    } else if (index === 1) {
      verdict = 'Runner Up';
    } else {
      verdict = 'Alternative';
    }

    return {
      ...item,
      rank: rankNum,
      verdict,
    };
  });

  const bestPick = ranked[0] || null;
  const alternatives = ranked.slice(1, 3);

  return {
    bestPick,
    alternatives,
    allScored: ranked,
  };
}
