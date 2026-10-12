# Finovia — Premium Credit Card Management & Perks Recommendation Platform

A modern, high-production fintech web application built with **React 18 + Vite + TypeScript + Tailwind CSS + Firebase Auth/Firestore**.

Inspired by premium fintech UI designs, Finovia is designed for everyday cardholders to consolidate their credit lines, protect their credit score through smart utilization tracking, and automatically identify the **highest-yielding credit card** for every purchase.

---

## 🌟 Core Features

### 1. Zero-Credential Non-Custodial Card Portfolio
- **Security-First Architecture**: Strictly stores non-sensitive portfolio metadata:
  - Card Provider (Visa, Mastercard, American Express, Chase, Discover, Capital One)
  - Card Product Name
  - Last 4 Digits only (e.g. `8492`)
  - Name on Card
  - Credit Limit ($)
  - Configured Reward Rates by Category (% cashback or points multiplier)
  - Key Perks & Benefits (e.g. `$120 Dining Credit`, `Lounge Access`, `Trip Insurance`)
  - Billing Cycle Closing Day & Display Expiration Date
- **Strictly No Sensitive Credentials**: No CVV, PIN, OTP, or account logins are ever requested or stored.

### 2. Smart Perks & Recommendation Engine (AI-Free & Deterministic)
Whenever you log a spend or use the interactive **Perks Optimizer**:
- Evaluates your purchase amount, merchant, and spending category.
- Validates each card's available credit line (`Available Limit >= Expense`).
- Ranks your wallet:
  - **⭐ Best Card (Rank #1)**: Maximum cashback yield + safe credit score utilization impact (< 30% standard) + matching merchant perks.
  - **Alternative #1 (Rank #2)**: Comparison yield with exact difference (e.g., `-$1.50 vs Best`).
  - **Alternative #2 (Rank #3)**: Comparison yield and remaining credit balance.
- 1-Click "Swipe & Log" to record the transaction with the recommended card.

### 3. Comprehensive Credit Health & Portfolio Dashboard
- **Total Available Limit**: Real-time aggregate across all cards.
- **Current Cycle Spending**: Track ongoing card balances.
- **Credit Utilization Rate Indicator**: Live status gauge (`Optimal < 30%`, `Moderate`, `High Risk`) to protect your credit score.
- **Total Rewards Accumulated**: Live dollar calculation of rewards earned.
- **Category Spending Distribution**: Visual progress breakdown across Dining, Travel, Groceries, Fuel, Retail, Utilities, etc.
- **Recent Transactions Ledger**: Searchable, filterable by card and category, with reward yield badges.

### 4. Firebase Auth & Firestore Sync (with Graceful Local Vault)
- **Firebase Authentication**: Email/Password login and 1-click **Guest / Anonymous Demo Mode**.
- **Firestore Cloud Sync**: Synchronizes user credit cards and transactions to `users/{uid}/cards` and `users/{uid}/transactions`.
- **Offline / Local Storage Vault**: Automatically persists locally when running without Firebase credentials, allowing instant zero-friction evaluation.
- **Custom Firebase Config UI**: Easily connect your own Firebase project keys from the app settings modal.

---

## 🎨 Design System

- **Palette**:
  - Primary Brand: Finovia Signature Fresh Lime (`#9FE870`)
  - Primary Dark: Deep Obsidian Forest (`#142C0A`, `#0B1A00`)
  - Card Surfaces: Crisp Pure White (`#FFFFFF`) with soft borders (`#E2E8DC`)
  - Background: Neutral warm tint (`#F7F9F6`) with subtle geometric grid
- **Card Finishes**: Realistic titanium card representations:
  - Emerald Lime (Finovia Iconic)
  - Obsidian Titanium Black
  - Prestige Brushed Gold
  - Royal Sapphire Blue
  - Deep Forest Green
  - Slate Platinum Brushed

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm 9+

### Installation & Run
```bash
# Clone or navigate to the directory
cd CCMS

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```

---

## 🔒 Security Summary
This application is strictly an analytical portfolio tracker and recommendation engine. It does not initiate financial transfers, charge bank accounts, or require bank account credentials.
