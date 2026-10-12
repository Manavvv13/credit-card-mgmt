import React, { createContext, useContext, useState, useEffect } from 'react';
import { CreditCard, Transaction, UserProfile, SpendingCategory } from '../types';
import { INITIAL_CARDS, INITIAL_TRANSACTIONS } from '../services/cardDefaults';
import { 
  auth, 
  isConfigured, 
  initFirebase, 
  getStoredFirebaseConfig, 
  saveStoredFirebaseConfig, 
  FirebaseConfigOptions,
  fetchCards,
  upsertCardToCloud,
  removeCardFromCloud,
  fetchTransactions,
  upsertTransactionToCloud,
  removeTransactionFromCloud
} from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';

interface AppContextType {
  cards: CreditCard[];
  transactions: Transaction[];
  user: UserProfile | null;
  isLoading: boolean;
  isFirebaseActive: boolean;
  firebaseConfig: FirebaseConfigOptions | null;
  
  // Modals
  isCardModalOpen: boolean;
  setIsCardModalOpen: (open: boolean) => void;
  editingCard: CreditCard | null;
  setEditingCard: (card: CreditCard | null) => void;
  isExpenseModalOpen: boolean;
  setIsExpenseModalOpen: (open: boolean) => void;
  isRecommenderOpen: boolean;
  setIsRecommenderOpen: (open: boolean) => void;
  isFirebaseModalOpen: boolean;
  setIsFirebaseModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Actions
  addCard: (cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt' | 'currentSpend'>) => Promise<void>;
  updateCard: (card: CreditCard) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  addTransaction: (txData: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (txId: string) => Promise<void>;
  
  // Auth
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  saveFirebaseCredentials: (config: FirebaseConfigOptions) => void;
  clearFirebaseCredentials: () => void;
  resetDemoData: () => void;

  // Computed Portfolio Metrics
  totalLimit: number;
  totalSpent: number;
  availableLimit: number;
  utilizationRate: number;
  totalRewardsEarned: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_CARDS = 'finovia_cards_v1';
const LOCAL_STORAGE_TX = 'finovia_transactions_v1';
const LOCAL_STORAGE_USER = 'finovia_local_user';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CreditCard[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CARDS);
      return saved ? JSON.parse(saved) : INITIAL_CARDS;
    } catch {
      return INITIAL_CARDS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TX);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState(isConfigured);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfigOptions | null>(getStoredFirebaseConfig());

  // Modal controls
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CARDS, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TX, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER);
    }
  }, [user]);

  // Auth state listener if Firebase auth is initialized
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
          isAnonymous: fbUser.isAnonymous,
        };
        setUser(profile);

        // Fetch from Firestore
        setIsLoading(true);
        const cloudCards = await fetchCards(fbUser.uid);
        const cloudTx = await fetchTransactions(fbUser.uid);

        if (cloudCards && cloudCards.length > 0) {
          setCards(cloudCards);
        }
        if (cloudTx && cloudTx.length > 0) {
          setTransactions(cloudTx);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isFirebaseActive]);

  // Recalculate card spends whenever transactions change
  useEffect(() => {
    setCards((prevCards) =>
      prevCards.map((card) => {
        const cardTxSum = transactions
          .filter((t) => t.cardId === card.id)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          ...card,
          currentSpend: Number(cardTxSum.toFixed(2)),
        };
      })
    );
  }, [transactions]);

  // Portfolio aggregates
  const totalLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalSpent = cards.reduce((sum, c) => sum + c.currentSpend, 0);
  const availableLimit = Math.max(0, totalLimit - totalSpent);
  const utilizationRate = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  const totalRewardsEarned = Number(
    transactions.reduce((sum, t) => sum + (t.rewardEarned || 0), 0).toFixed(2)
  );

  // Actions
  const addCard = async (
    cardData: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt' | 'currentSpend'>
  ) => {
    const newCard: CreditCard = {
      ...cardData,
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      currentSpend: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setCards((prev) => [newCard, ...prev]);

    if (user && isFirebaseActive) {
      await upsertCardToCloud(user.uid, newCard);
    }
  };

  const updateCard = async (updatedCard: CreditCard) => {
    const modified = { ...updatedCard, updatedAt: Date.now() };
    setCards((prev) => prev.map((c) => (c.id === modified.id ? modified : c)));

    if (user && isFirebaseActive) {
      await upsertCardToCloud(user.uid, modified);
    }
  };

  const deleteCard = async (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    // Also remove or unlink transactions if needed
    setTransactions((prev) => prev.filter((t) => t.cardId !== cardId));

    if (user && isFirebaseActive) {
      await removeCardFromCloud(user.uid, cardId);
    }
  };

  const addTransaction = async (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (user && isFirebaseActive) {
      await upsertTransactionToCloud(user.uid, newTx);
    }
  };

  const deleteTransaction = async (txId: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txId));

    if (user && isFirebaseActive) {
      await removeTransactionFromCloud(user.uid, txId);
    }
  };

  // Auth methods
  const loginWithEmail = async (email: string, pass: string) => {
    if (!auth) {
      // Local fallback login
      setUser({
        uid: 'user_' + Math.random().toString(36).substr(2, 8),
        email,
        displayName: email.split('@')[0],
        isAnonymous: false,
      });
      return;
    }
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    setUser({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || email.split('@')[0],
      isAnonymous: false,
    });
  };

  const registerWithEmail = async (email: string, pass: string) => {
    if (!auth) {
      setUser({
        uid: 'user_' + Math.random().toString(36).substr(2, 8),
        email,
        displayName: email.split('@')[0],
        isAnonymous: false,
      });
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    setUser({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || email.split('@')[0],
      isAnonymous: false,
    });
  };

  const loginAsGuest = async () => {
    if (auth) {
      try {
        const cred = await signInAnonymously(auth);
        setUser({
          uid: cred.user.uid,
          email: null,
          displayName: 'Guest Demo User',
          isAnonymous: true,
        });
        return;
      } catch (e) {
        console.warn('Anonymous auth in Firebase failed, fallback to local guest session', e);
      }
    }
    setUser({
      uid: 'guest_' + Math.random().toString(36).substr(2, 8),
      email: null,
      displayName: 'Guest Member',
      isAnonymous: true,
    });
  };

  const logout = async () => {
    if (auth) {
      await fbSignOut(auth);
    }
    setUser(null);
  };

  const saveFirebaseCredentials = (config: FirebaseConfigOptions) => {
    saveStoredFirebaseConfig(config);
    setFirebaseConfig(config);
    const success = initFirebase(config);
    setIsFirebaseActive(success);
  };

  const clearFirebaseCredentials = () => {
    saveStoredFirebaseConfig(null);
    setFirebaseConfig(null);
    setIsFirebaseActive(false);
  };

  const resetDemoData = () => {
    setCards(INITIAL_CARDS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem(LOCAL_STORAGE_CARDS);
    localStorage.removeItem(LOCAL_STORAGE_TX);
  };

  return (
    <AppContext.Provider
      value={{
        cards,
        transactions,
        user,
        isLoading,
        isFirebaseActive,
        firebaseConfig,

        isCardModalOpen,
        setIsCardModalOpen,
        editingCard,
        setEditingCard,
        isExpenseModalOpen,
        setIsExpenseModalOpen,
        isRecommenderOpen,
        setIsRecommenderOpen,
        isFirebaseModalOpen,
        setIsFirebaseModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,

        addCard,
        updateCard,
        deleteCard,
        addTransaction,
        deleteTransaction,

        loginWithEmail,
        registerWithEmail,
        loginAsGuest,
        logout,
        saveFirebaseCredentials,
        clearFirebaseCredentials,
        resetDemoData,

        totalLimit,
        totalSpent,
        availableLimit,
        utilizationRate,
        totalRewardsEarned,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
