import React from 'react';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';
import RetroCard from '../ui/RetroCard';
import gamesData from '../../data/games.json';

export default function About() {
  const { lang } = useLangStore();
  const t = locales[lang];

  const totalGames = gamesData.filter(g => g.type !== 'app').length;
  const totalApps = gamesData.filter(g => g.type === 'app').length;
  const avgRating = gamesData.length > 0 
    ? (gamesData.reduce((acc, g) => acc + g.rating, 0) / gamesData.length).toFixed(1) 
    : "0.0";
  const genresCount = gamesData.length > 0
    ? new Set(gamesData.map(g => g.genre.split(' / ')[0])).size
    : 0;

  const statLabels = {
    en: {
      games: "Active Games",
      apps: "Active Apps",
      rating: "Avg Rating",
      genres: "Genre Count"
    },
    id: {
      games: "Game Aktif",
      apps: "Aplikasi Aktif",
      rating: "Rata-Rata Rating",
      genres: "Jumlah Genre"
    },
    jp: {
      games: "ゲーム数",
      apps: "アプリ数",
      rating: "平均評価",
      genres: "ジャンル数"
    }
  };

  const currentLabels = statLabels[lang] || statLabels['en'];

  const stats = [
    { label: currentLabels.apps, value: String(totalApps) }, // Rebranded prioritization
    { label: currentLabels.games, value: String(totalGames) },
    { label: currentLabels.rating, value: avgRating + " / 5.0" },
    { label: currentLabels.genres, value: String(genresCount) }
  ];

  return (
    <section className="py-16 px-4 md:px-8 border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-12">
          <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900 dark:text-slate-50">
            {t.aboutTitle}
          </h2>
        </div>

        {/* Content Layout: Text details */}
        <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed text-justify">
            {t.aboutText1}
          </p>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-350 leading-relaxed text-justify">
            {t.aboutText2}
          </p>
        </div>

        {/* Founder Card */}
        <div className="mt-12 p-6 md:p-8 bg-white/80 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
          {/* Cupertino rounded frame */}
          <div className="relative p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl flex-shrink-0 shadow-md">
            <img 
              src="https://miro.medium.com/v2/resize:fit:2400/1*99hHL9XJ7EzQeC6RB5_Qiw.jpeg" 
              alt="Arif Alexander" 
              className="w-32 h-32 md:w-36 md:h-36 object-cover bg-slate-800 rounded-xl block"
            />
          </div>
          <div className="text-left flex-1">
            <span className="text-xs font-semibold tracking-tight text-[#0071e3] dark:text-[#2997ff] block mb-1">
              Founder & Principal Developer
            </span>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              Arif Alexander
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              {lang === 'id' ? 
                'Sukamaju Hub didirikan dan dimiliki sepenuhnya oleh Arif Alexander. Sebagai pengembang utama dan arsitek teknis, beliau memimpin visi kreatif untuk menghadirkan arsitektur web modern yang andal, produk SaaS berdaya saing tinggi, dan game interaktif yang edukatif.' : 
                lang === 'jp' ?
                'Sukamaju Hubはアリフ・アレクサンダーによって設立され、完全所有されています。リード開発者およびテクニカルアーキテクトとして、彼は信頼性の高い最新のウェブシステムやSaaS製品、地域活動を支援するデジタル体験の創造を指揮しています。' :
                'Sukamaju Hub was founded and is fully owned by Arif Alexander. Serving as the principal developer and technical architect, he directs the creative vision of delivering world-class modern web architectures, SaaS platforms, and interactive digital systems.'
              }
            </p>
          </div>
        </div>

        {/* SYSTEM DIAGNOSTICS */}
        <div className="mt-12 max-w-4xl mx-auto w-full">
          <RetroCard 
            variant="default" 
            title="SYSTEM DIAGNOSTICS"
            className="bg-slate-50/50 dark:bg-[#1a1a1c]/40"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-white/60 dark:bg-black/60 border border-slate-200/50 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm"
                >
                  <span className="text-xl md:text-2xl text-[#0071e3] dark:text-[#2997ff] font-bold mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </RetroCard>
        </div>

      </div>
    </section>
  );
}
