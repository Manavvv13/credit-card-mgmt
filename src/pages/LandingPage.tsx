import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard as CardIcon, 
  Zap, 
  Award, 
  ChevronRight, 
  Check, 
  Star, 
  Lock, 
  PieChart, 
  BarChart3,
  Layers,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  DollarSign,
  Globe2,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onNavigateAuth: (mode: 'signin' | 'signup') => void;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth, onQuickDemo }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#0A130E] text-white flex flex-col font-sans selection:bg-[#00DF81] selection:text-[#051C12]">
      
      {/* Subtle emerald glowing ambient lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00DF81]/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed inset-0 fintech-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* 1. TOP MARKETING NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0A130E]/85 backdrop-blur-md border-b border-[#1A3326]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-2xl bg-[#12241C] border border-[#1A3326] flex items-center justify-center shadow-emerald-glow transition-transform group-hover:scale-105">
                <div className="w-4 h-4 rounded-full bg-[#00DF81] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A130E]" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Finovia
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#93A89C]">
              <a href="#hero" className="text-white hover:text-[#00DF81] transition-colors">Home</a>
              <a href="#features" className="hover:text-white transition-colors">Platform</a>
              <a href="#perks" className="hover:text-white transition-colors">Perks Engine</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateAuth('signin')}
                className="px-4 py-2 rounded-full text-xs font-bold text-white border border-[#1A3326] hover:bg-[#12241C] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigateAuth('signup')}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all hover:scale-105"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION — KEPT AS IT IS */}
      <section 
        id="hero"
        className="w-full bg-white border-b border-[#1A3326] flex items-center justify-center overflow-hidden py-4 sm:py-8"
      >
        <img
          src="/hero image.png"
          alt="Your card. Your rules."
          className="w-full h-auto max-h-[88vh] object-contain select-none"
        />
      </section>

      {/* 3. PARTNERS & CLIENTS STRIP (Theme Inspired by Screenshot) */}
      <section className="py-12 border-b border-[#1A3326] bg-[#070E0A]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs uppercase font-bold tracking-widest text-[#5B7064]">
            Supported Card Networks & Digital Vault Ecosystems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all text-sm font-extrabold text-[#93A89C]">
            <span className="flex items-center gap-2">✦ VISA Platinum</span>
            <span className="flex items-center gap-2">● Mastercard World</span>
            <span className="flex items-center gap-2">▲ American Express</span>
            <span className="flex items-center gap-2">★ RuPay Select</span>
            <span className="flex items-center gap-2">◈ Discover Global</span>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM OVERVIEW & CAPABILITIES (Theme Inspired by Screenshot) */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12241C] border border-[#1A3326] text-xs font-semibold text-[#00DF81] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00DF81] animate-pulse" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Credit Card Management <br />
            <span className="text-[#00DF81]">Reimagined for the Future You</span>
          </h2>
          <p className="text-sm sm:text-base text-[#93A89C] leading-relaxed">
            Consolidate credit limits, monitor aggregate utilization thresholds, and harness our AI-free mathematical engine to swipe the highest-yielding card every time.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#0E1B15] p-8 rounded-3xl border border-[#1A3326] shadow-card-glow hover:border-[#00DF81]/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Consolidated Credit Limits</h3>
            <p className="text-xs text-[#93A89C] leading-relaxed">
              Track multi-card limits, available balances, and closing dates in one unified, real-time dashboard.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#00DF81]">
              <span>Real-Time Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-[#0E1B15] p-8 rounded-3xl border border-[#00DF81]/30 shadow-card-glow hover:border-[#00DF81] transition-all space-y-4 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00DF81]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-[#00DF81] text-[#051C12] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Smart Swipe Recommendation</h3>
            <p className="text-xs text-[#93A89C] leading-relaxed">
              Before swiping, get immediate algorithmic ranking: the Best Card + 2 Alternatives with exact dollar return and utilization safety.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#00DF81]">
              <span>3-Card Comparison Rule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-[#0E1B15] p-8 rounded-3xl border border-[#1A3326] shadow-card-glow hover:border-[#00DF81]/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#12241C] border border-[#1A3326] text-[#00DF81] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Bureau Utilization Guardian</h3>
            <p className="text-xs text-[#93A89C] leading-relaxed">
              Automatic alerts protect your credit score from high-utilization penalties by steering expenses below the 30% safe threshold.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#00DF81]">
              <span>Credit Score Health</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

        {/* Highlight KPI Blocks (Matching 768K, 5.0★, $8.8B from screenshot) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0E1B15] border border-[#1A3326] p-6 rounded-3xl text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">84 M</div>
            <div className="text-xs text-[#93A89C]">Monthly Swipes Optimized</div>
          </div>
          
          <div className="bg-[#00DF81] p-6 rounded-3xl text-center space-y-1 text-[#051C12] shadow-emerald-glow">
            <div className="text-3xl sm:text-4xl font-black">768 K</div>
            <div className="text-xs font-bold">New Cardholders Joining</div>
          </div>

          <div className="bg-[#0E1B15] border border-[#1A3326] p-6 rounded-3xl text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">5.0 ★</div>
            <div className="text-xs text-[#93A89C]">Top Score Ratings</div>
          </div>

          <div className="bg-[#0E1B15] border border-[#1A3326] p-6 rounded-3xl text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">$8.8 B</div>
            <div className="text-xs text-[#93A89C]">Credit Limit Managed</div>
          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS (Theme Exactly Matching Screenshot) */}
      <section id="pricing" className="py-24 bg-[#070E0A] border-y border-[#1A3326] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12241C] border border-[#1A3326] text-xs font-semibold text-[#00DF81]">
              <span>Pricing Plan</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Select a plan that will empower your business growth
            </h2>
            <p className="text-sm text-[#93A89C]">
              Each package includes personalized credit limits tracking and rewards optimization.
            </p>

            {/* Monthly / Yearly Toggle (Matching Green Pill Switch from Screenshot) */}
            <div className="pt-4">
              <div className="inline-flex p-1 rounded-full bg-[#12241C] border border-[#1A3326]">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-[#00DF81] text-[#051C12] shadow-sm'
                      : 'text-[#93A89C]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    billingPeriod === 'yearly'
                      ? 'bg-[#00DF81] text-[#051C12] shadow-sm'
                      : 'text-[#93A89C]'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          {/* 3 Pricing Tier Cards (Matching Screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            
            {/* Starter Plan */}
            <div className="p-8 rounded-3xl bg-[#0E1B15] border border-[#1A3326] flex flex-col justify-between space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white">Starter Plan</h3>
                <p className="text-xs text-[#93A89C] mt-1">Perfect for individuals with core credit cards.</p>
                
                <div className="mt-6 text-4xl font-extrabold text-white">
                  $0 <span className="text-xs font-normal text-[#93A89C]">/ per month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-[#93A89C]">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Up to 3 Credit Cards</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Credit Limit & Balance Tracking</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Basic Utilization Alert</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Non-Custodial Vault</div>
                </div>
              </div>

              <button
                onClick={() => onNavigateAuth('signup')}
                className="w-full py-3 rounded-full bg-[#12241C] border border-[#1A3326] text-white hover:bg-[#1A3326] text-xs font-bold transition-all"
              >
                Select This Plan
              </button>
            </div>

            {/* Growth Plan (Featured Highlight from Screenshot) */}
            <div className="p-8 rounded-3xl bg-[#0E1B15] border-2 border-[#00DF81] shadow-card-glow flex flex-col justify-between space-y-8 relative">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-[#00DF81] text-[#051C12] font-extrabold text-[10px] uppercase">
                  Most Popular
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Growth Plan</h3>
                <p className="text-xs text-[#93A89C] mt-1">Ideal for maximizing multi-card rewards & family wallets.</p>
                
                <div className="mt-6 text-4xl font-extrabold text-[#00DF81]">
                  $49 <span className="text-xs font-normal text-[#93A89C]">/ per month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-[#D1E0D7]">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Unlimited Credit Cards</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Best Card + 2 Alternatives Engine</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Custom Category Reward Sliders</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Cloud Firebase Auto-Sync</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Safe Credit Utilization Guardian</div>
                </div>
              </div>

              <button
                onClick={() => onNavigateAuth('signup')}
                className="w-full py-3 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] text-xs font-extrabold shadow-emerald-glow transition-all"
              >
                Select This Plan
              </button>
            </div>

            {/* Business Plan */}
            <div className="p-8 rounded-3xl bg-[#0E1B15] border border-[#1A3326] flex flex-col justify-between space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white">Business Plan</h3>
                <p className="text-xs text-[#93A89C] mt-1">Designed for founders and high-volume corporate spend.</p>
                
                <div className="mt-6 text-4xl font-extrabold text-white">
                  $99 <span className="text-xs font-normal text-[#93A89C]">/ per month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-[#93A89C]">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Everything in Growth Plan</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Priority Concierge Perks Rule Updates</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> Custom Exportable Tax & Audit Reports</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00DF81]" /> 24/7 Dedicated Support</div>
                </div>
              </div>

              <button
                onClick={() => onNavigateAuth('signup')}
                className="w-full py-3 rounded-full bg-[#12241C] border border-[#1A3326] text-white hover:bg-[#1A3326] text-xs font-bold transition-all"
              >
                Select This Plan
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & DEMO ACCESS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#0E1B15] border border-[#1A3326] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to swipe your highest-reward card every single time?
            </h2>
            <p className="text-xs sm:text-sm text-[#93A89C]">
              Get started in seconds. No CVV, PIN, or payment credentials required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateAuth('signup')}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#00DF81] text-[#051C12] hover:bg-[#00F08B] font-extrabold text-xs shadow-emerald-glow transition-all"
            >
              Create Account Free
            </button>
            <button
              onClick={onQuickDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#12241C] hover:bg-[#1A3326] text-white font-bold text-xs border border-[#1A3326] transition-all"
            >
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#1A3326] bg-[#070E0A] py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#93A89C]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#12241C] border border-[#1A3326] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00DF81]" />
            </div>
            <span className="font-extrabold text-white text-sm">Finovia</span>
            <span>— Non-Custodial Credit Card Management & Perks OS</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-white">Home</a>
            <a href="#features" className="hover:text-white">Platform</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <button onClick={() => onNavigateAuth('signin')} className="hover:text-white">
              Member Sign In
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
