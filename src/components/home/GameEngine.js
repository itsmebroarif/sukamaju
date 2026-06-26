import React from 'react';
import { Gamepad2, ShieldCheck, Hammer, Sparkles } from 'lucide-react';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';
import { playHover, playClick, playSuccess, playFail } from '../../lib/sfx';
import RetroCard from '../ui/RetroCard';
import RetroButton from '../ui/RetroButton';

export default function GameEngine() {
  const { lang } = useLangStore();
  const t = locales[lang];

  const features = [
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-500" />,
      label: t.engineFeature1
    },
    {
      icon: <Hammer className="w-5 h-5 text-cyan-500" />,
      label: t.engineFeature2
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      label: t.engineFeature3
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      label: t.engineFeature4
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 border-b-4 border-slate-950 dark:border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-12">
          <h2 className="font-press text-lg md:text-xl uppercase tracking-wider text-slate-900 dark:text-slate-50">
            {t.engineTitle}
          </h2>
          <p className="font-inter text-xs md:text-sm text-slate-650 dark:text-slate-450 max-w-lg mt-2">
            {t.engineSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Technical features list */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, idx) => (
                <div 
                  key={idx}
                  className="p-4 border-2 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 shadow-retro-sm flex items-center gap-3"
                >
                  <div className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 shadow-retro-sm">
                    {feat.icon}
                  </div>
                  <span className="font-inter text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Interactive Chiptune Audio Synth Soundboard */}
          <div className="lg:col-span-6 w-full">
            <RetroCard 
              variant="default"
              title="8BIT_AUDIO_SYNTH_TESTER"
              className="bg-slate-50 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-4 mt-2">
                <p className="font-mono text-xs text-slate-600 dark:text-slate-400 text-left">
                  &gt;&gt; TEST AUDIO SYSTEM: Click triggers local synthesizer waveform oscillators.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <RetroButton
                    variant="purple"
                    size="sm"
                    onMouseEnter={playHover}
                    onClick={playHover}
                  >
                    HOVER BLIP
                  </RetroButton>
                  <RetroButton
                    variant="cyan"
                    size="sm"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    CLICK TONE
                  </RetroButton>
                  <RetroButton
                    variant="green"
                    size="sm"
                    onMouseEnter={playHover}
                    onClick={playSuccess}
                  >
                    SUCCESS FANFARE
                  </RetroButton>
                  <RetroButton
                    variant="red"
                    size="sm"
                    onMouseEnter={playHover}
                    onClick={playFail}
                  >
                    FAIL BUZZ
                  </RetroButton>
                </div>
              </div>
            </RetroCard>
          </div>

        </div>

      </div>
    </section>
  );
}
