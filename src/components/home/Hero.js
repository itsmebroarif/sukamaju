import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { useLangStore, useNavStore } from '../../lib/store';
import { locales } from '../../data/locales';
import { playHover, playClick } from '../../lib/sfx';
import RetroButton from '../ui/RetroButton';

export default function Hero() {
  const { lang } = useLangStore();
  const { setPage, openWizard } = useNavStore();
  const t = locales[lang];

  const handleNavClick = (dest) => {
    playClick();
    setPage(dest);
  };

  const handleWizardClick = (type) => {
    playClick();
    openWizard(type);
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-24 px-4 md:px-8 border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-100/50 to-white dark:from-black dark:to-[#1c1c1e]/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-600/10 dark:border-emerald-500/20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold tracking-tight">
              Sukamaju Hub Online
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-slate-900 dark:text-slate-50 tracking-tight">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
            {t.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-2 w-full sm:w-auto">
            <RetroButton
              variant="purple"
              size="lg"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
              onMouseEnter={playHover}
              onClick={() => handleNavClick('games')}
            >
              <Play className="w-4 h-4 fill-current" />
              {t.heroCTAExplore}
            </RetroButton>

            <RetroButton
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
              onMouseEnter={playHover}
              onClick={() => handleWizardClick('game')}
            >
              <Sparkles className="w-4 h-4 text-[#0071e3] dark:text-[#2997ff]" />
              {t.heroCTARequest}
            </RetroButton>
          </div>

        </div>

        {/* Right: Cupertino Glassmorphic Dashboard Display */}
        <div className="lg:col-span-5 flex justify-center w-full mt-4 lg:mt-0">
          <div className="w-full max-w-md bg-white/70 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg p-5">
            {/* Header with dots */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800/80 mb-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-[#ff5f56] rounded-full"></span>
                <span className="w-3 h-3 bg-[#ffbd2e] rounded-full"></span>
                <span className="w-3 h-3 bg-[#27c93f] rounded-full"></span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">sukamaju-dashboard.dmg</span>
            </div>
            {/* Dashboard contents */}
            <div className="flex flex-col gap-3.5 text-left font-sans text-xs text-slate-650 dark:text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                <span className="font-semibold text-slate-450 dark:text-slate-500">Primary Core</span>
                <span className="font-medium text-[#0071e3] dark:text-[#2997ff]">SaaS & Web Solutions</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                <span className="font-semibold text-slate-455 dark:text-slate-500">Community Assist</span>
                <span className="font-medium text-emerald-600">Sukamaju Hub [OK]</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                <span className="font-semibold text-slate-450 dark:text-slate-500">Framework Stack</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">React + Tailwind CSS</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                <span className="font-semibold text-slate-450 dark:text-slate-500">Localization</span>
                <span className="font-medium text-cyan-600 dark:text-cyan-400">EN, ID, JP [Active]</span>
              </div>
              <div className="mt-3 bg-[#0071e3]/5 dark:bg-[#2997ff]/5 border border-[#0071e3]/10 dark:border-[#2997ff]/10 rounded-2xl p-4 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                ⚙️ <strong className="text-slate-700 dark:text-slate-200">SaaS & IT Solution Specialists:</strong> We compose custom cloud-integrated portals, responsive databases, and interactive tools designed to scale local community outreach.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
