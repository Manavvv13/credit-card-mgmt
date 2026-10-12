import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';
import { CreditCard, Transaction } from '../types';

export interface FirebaseConfigOptions {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const LOCAL_STORAGE_FIREBASE_CONFIG_KEY = 'finovia_firebase_config';

export function getStoredFirebaseConfig(): FirebaseConfigOptions | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FIREBASE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading custom firebase config', e);
  }
  return null;
}

export function saveStoredFirebaseConfig(config: FirebaseConfigOptions | null) {
  if (config) {
    localStorage.setItem(LOCAL_STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_FIREBASE_CONFIG_KEY);
  }
}

// Fallback config or env config
const defaultEnvConfig: FirebaseConfigOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isConfigured = false;

export function initFirebase(customConfig?: FirebaseConfigOptions) {
  const activeConfig = customConfig || getStoredFirebaseConfig() || defaultEnvConfig;

  if (activeConfig.apiKey && activeConfig.projectId) {
    try {
      if (getApps().length > 0) {
        app = getApp();
      } else {
        app = initializeApp(activeConfig);
      }
      auth = getAuth(app);
      db = getFirestore(app);
      isConfigured = true;
      console.log('Firebase initialized successfully with project:', activeConfig.projectId);
      return true;
    } catch (err) {
      console.warn('Firebase init error, operating in local fallback mode:', err);
      isConfigured = false;
      return false;
    }
  } else {
    console.log('No Firebase credentials provided. Running in high-performance local demo mode.');
    isConfigured = false;
    return false;
  }
}

// Try auto-initializing
initFirebase();

export { auth, db, isConfigured };

// Firestore CRUD operations with local fallback
export async function fetchCards(userId: string): Promise<CreditCard[] | null> {
  if (!db || !isConfigured) return null;
  try {
    const cardsCol = collection(db, 'users', userId, 'cards');
    const snapshot = await getDocs(cardsCol);
    return snapshot.docs.map((docSnap) => docSnap.data() as CreditCard);
  } catch (error) {
    console.error('Error fetching cards from Firestore:', error);
    return null;
  }
}

export async function upsertCardToCloud(userId: string, card: CreditCard): Promise<boolean> {
  if (!db || !isConfigured) return false;
  try {
    const cardRef = doc(db, 'users', userId, 'cards', card.id);
    await setDoc(cardRef, card, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving card to Firestore:', error);
    return false;
  }
}

export async function removeCardFromCloud(userId: string, cardId: string): Promise<boolean> {
  if (!db || !isConfigured) return false;
  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId);
    await deleteDoc(cardRef);
    return true;
  } catch (error) {
    console.error('Error deleting card from Firestore:', error);
    return false;
  }
}

export async function fetchTransactions(userId: string): Promise<Transaction[] | null> {
  if (!db || !isConfigured) return null;
  try {
    const txCol = collection(db, 'users', userId, 'transactions');
    const q = query(txCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data() as Transaction);
  } catch (error) {
    console.error('Error fetching transactions from Firestore:', error);
    return null;
  }
}

export async function upsertTransactionToCloud(userId: string, tx: Transaction): Promise<boolean> {
  if (!db || !isConfigured) return false;
  try {
    const txRef = doc(db, 'users', userId, 'transactions', tx.id);
    await setDoc(txRef, tx, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving transaction to Firestore:', error);
    return false;
  }
}

export async function removeTransactionFromCloud(userId: string, txId: string): Promise<boolean> {
  if (!db || !isConfigured) return false;
  try {
    const txRef = doc(db, 'users', userId, 'transactions', txId);
    await deleteDoc(txRef);
    return true;
  } catch (error) {
    console.error('Error deleting transaction from Firestore:', error);
    return false;
  }
}
