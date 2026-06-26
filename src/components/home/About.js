import React from 'react';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';
import RetroCard from '../ui/RetroCard';
import gamesData from '../../data/games.json';

export default function About() {
  const { lang } = useLangStore();
  const t = locales[lang];

  const totalGames = gamesData.length;
  const avgRating = totalGames > 0 
    ? (gamesData.reduce((acc, g) => acc + g.rating, 0) / totalGames).toFixed(1) 
    : "0.0";
  const genresCount = totalGames > 0
    ? new Set(gamesData.map(g => g.genre.split(' / ')[0])).size
    : 0;
  const premiumGames = totalGames > 0
    ? gamesData.filter(g => g.price > 0).length
    : 0;

  const statLabels = {
    en: {
      games: "Active Games",
      rating: "Avg User Rating",
      genres: "Genre Count",
      premium: "Premium Titles"
    },
    id: {
      games: "Game Aktif",
      rating: "Rata-Rata Rating",
      genres: "Jumlah Genre",
      premium: "Judul Berbayar"
    },
    jp: {
      games: "アクティブゲーム",
      rating: "平均評価",
      genres: "ジャンル数",
      premium: "有料タイトル"
    }
  };

  const currentLabels = statLabels[lang] || statLabels['en'];

  const stats = [
    { label: currentLabels.games, value: String(totalGames) },
    { label: currentLabels.rating, value: avgRating + " / 5.0" },
    { label: currentLabels.genres, value: String(genresCount) },
    { label: currentLabels.premium, value: String(premiumGames) }
  ];

  return (
    <section className="py-16 px-4 md:px-8 border-b-4 border-slate-950 dark:border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-12">
          <h2 className="font-press text-lg md:text-xl uppercase tracking-wider text-slate-900 dark:text-slate-50">
            {t.aboutTitle}
          </h2>
        </div>

        {/* Content Layout: Text details */}
        <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
            {t.aboutText1}
          </p>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
            {t.aboutText2}
          </p>
        </div>

        {/* Founder Card */}
        <div className="mt-12 p-6 border-4 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 shadow-retro flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
          {/* Retro futuristic pixel-art style frame (Blue, Red, Green) */}
          <div className="relative p-1 bg-slate-950 dark:bg-slate-100 border-4 border-slate-950 dark:border-slate-100 shadow-[4px_4px_0_#ef4444,-4px_-4px_0_#3b82f6,0_0_0_4px_#22c55e] flex-shrink-0 mx-2 my-2">
            <img 
              src="https://miro.medium.com/v2/resize:fit:2400/1*99hHL9XJ7EzQeC6RB5_Qiw.jpeg" 
              alt="Arif Alexander" 
              className="w-32 h-32 md:w-36 md:h-36 object-cover bg-slate-800 block"
            />
          </div>
          <div className="text-left flex-1">
            <span className="font-press text-[9px] uppercase text-purple-600 dark:text-cyan-400 block mb-1">
              Founder & Principal Developer
            </span>
            <h3 className="font-press text-sm uppercase text-slate-900 dark:text-slate-100 mb-2">
              Arif Alexander
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              {lang === 'id' ? 
                'KafeinArts Studio didirikan dan dimiliki sepenuhnya oleh Arif Alexander. Sebagai pengembang utama dan arsitek teknis, beliau memimpin visi kreatif untuk menghadirkan game retro 16-bit berkelas dunia dan arsitektur web modern yang andal dan berdaya saing tinggi.' : 
                lang === 'jp' ?
                'KafeinArts Studioはアリフ・アレクサンダーによって設立され、完全所有されています。リード開発者およびテクニカルアーキテクトとして、彼は世界クラス of 16ビットレトロゲームと信頼性の高的最新のウェブシステムを提供する創造的なビジョンを指揮しています。' :
                'KafeinArts Studio was founded and is fully owned by Arif Alexander. Serving as the principal developer and technical architect, he directs the creative vision of delivering world-class 16-bit retro games and robust modern web architectures.'
              }
            </p>
          </div>
        </div>

        {/* SYSTEM_DIAGNOSTICS - Placed at the very bottom, full width inside max-w-4xl */}
        <div className="mt-12 max-w-4xl mx-auto w-full">
          <RetroCard 
            variant="default" 
            title="SYSTEM_DIAGNOSTICS"
            className="bg-slate-50 dark:bg-slate-900"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-3 border-2 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-center shadow-retro-sm"
                >
                  <span className="font-press text-[10px] md:text-xs text-purple-600 dark:text-cyan-400 font-bold mb-1">
                    {stat.value}
                  </span>
                  <span className="font-press text-[7px] uppercase tracking-tighter text-slate-500 dark:text-slate-400">
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
