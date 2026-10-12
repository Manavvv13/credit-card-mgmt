import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FirebaseConfigOptions } from '../services/firebase';
import { 
  X, 
  Database, 
  Cloud, 
  HardDrive, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Key, 
  RefreshCw 
} from 'lucide-react';

export const FirebaseSettingsModal: React.FC = () => {
  const { 
    isFirebaseModalOpen, 
    setIsFirebaseModalOpen, 
    isFirebaseActive, 
    firebaseConfig, 
    saveFirebaseCredentials, 
    clearFirebaseCredentials,
    resetDemoData
  } = useApp();

  const [apiKey, setApiKey] = useState(firebaseConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(firebaseConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(firebaseConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(firebaseConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(firebaseConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(firebaseConfig?.appId || '');

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  if (!isFirebaseModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      setStatusMsg({
        type: 'error',
        text: 'API Key and Project ID are required to initialize Firebase.',
      });
      return;
    }

    const config: FirebaseConfigOptions = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseCredentials(config);
    setStatusMsg({
      type: 'success',
      text: 'Firebase credentials saved and connection initialized!',
    });
  };

  const handleClear = () => {
    clearFirebaseCredentials();
    setApiKey('');
    setAuthDomain('');
    setProjectId('');
    setStorageBucket('');
    setMessagingSenderId('');
    setAppId('');
    setStatusMsg({
      type: 'info',
      text: 'Switched back to client-side offline storage vault.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto text-white">
      <div className="relative w-full max-w-xl bg-[#0E1B15] rounded-3xl border border-[#1A3326] shadow-card-glow overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0A130E] border-b border-[#1A3326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center shadow-emerald-glow">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Firebase Firestore & Auth Sync
              </h3>
              <p className="text-xs text-[#93A89C]">
                Configure cloud persistence or use local client-side storage
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFirebaseModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#12241C] text-[#93A89C] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Current Status Pill */}
          <div className="p-4 rounded-2xl bg-[#070E0A] border border-[#1A3326] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isFirebaseActive
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border-[#00DF81]/30'
                    : 'bg-[#12241C] text-[#93A89C] border-[#1A3326]'
                }`}
              >
                {isFirebaseActive ? <Cloud className="w-5 h-5" /> : <HardDrive className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isFirebaseActive ? 'Connected to Firebase Cloud' : 'Operating in Local Storage Vault'}
                </div>
                <div className="text-[11px] text-[#93A89C]">
                  {isFirebaseActive
                    ? 'All cards & expenses are synced live to Firestore.'
                    : 'Fast offline mode. Cards and data persist in browser localStorage.'}
                </div>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                isFirebaseActive
                  ? 'bg-[#00DF81]/15 text-[#00DF81] border-[#00DF81]/30'
                  : 'bg-amber-950/60 text-amber-400 border-amber-800'
              }`}
            >
              {isFirebaseActive ? 'Live Cloud' : 'Local Mode'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#00DF81] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Custom Firebase Project Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#93A89C] mb-1">
                  API Key *
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#93A89C] mb-1">
                  Project ID *
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-fintech-project"
                  className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#93A89C] mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="my-fintech-project.firebaseapp.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#93A89C] mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:12345:web:abcd"
                  className="w-full px-3 py-2 rounded-xl bg-[#070E0A] border border-[#1A3326] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#00DF81]"
                />
              </div>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  statusMsg.type === 'success'
                    ? 'bg-[#00DF81]/15 text-[#00DF81] border-[#00DF81]/30'
                    : statusMsg.type === 'error'
                    ? 'bg-red-950/60 text-red-200 border-red-800'
                    : 'bg-[#12241C] text-white border-[#1A3326]'
                }`}
              >
                {statusMsg.type === 'success' ? (
                  <Check className="w-4 h-4 text-[#00DF81] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-full border border-[#1A3326] bg-[#12241C] text-xs font-semibold text-white hover:bg-[#1A3326]"
              >
                Revert to Local Storage
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="px-4 py-2 rounded-full border border-[#1A3326] bg-[#12241C] text-xs font-semibold text-white hover:bg-[#1A3326] flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#00DF81]" />
                  <span>Reset Demo Data</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
