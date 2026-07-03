import React, { useState, useMemo } from 'react';
import { Star, Play } from 'lucide-react';
import { useLangStore, useNavStore } from '../../lib/store';
import { locales } from '../../data/locales';
import gamesData from '../../data/games.json';
import RetroCard from '../ui/RetroCard';
import RetroButton from '../ui/RetroButton';
import { playHover, playClick, playSuccess } from '../../lib/sfx';
import Swal from 'sweetalert2';
import GameDetailsModal from '../games/GameDetailsModal';

export default function FeaturedGames() {
  const { lang } = useLangStore();
  const { setPage } = useNavStore();
  const t = locales[lang];
  
  const [selectedGameForDetails, setSelectedGameForDetails] = useState(null);

  // Get featured items, sorting Apps (SaaS) first, then Games
  const featuredGames = useMemo(() => {
    return gamesData
      .filter((game) => game.featured)
      .sort((a, b) => {
        const aIsApp = a.type === 'app';
        const bIsApp = b.type === 'app';
        if (aIsApp && !bIsApp) return -1;
        if (!aIsApp && bIsApp) return 1;
        return 0;
      });
  }, []);

  const handleLaunchGame = (gameTitle, playUrl) => {
    playSuccess();
    
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
      title: lang === 'id' ? 'Menjalankan...' : lang === 'jp' ? '起動中...' : 'Launching...',
      text: `${gameTitle} ${lang === 'id' ? 'sedang dimuat.' : lang === 'jp' ? 'がロードされています。' : 'is loading.'}`,
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      background: isDark ? '#1c1c1e' : '#ffffff',
      color: isDark ? '#f5f5f7' : '#1d1d1f',
      customClass: {
        popup: 'rounded-2xl border border-slate-200 dark:border-white/10 font-sans text-sm shadow-xl',
      }
    }).then(() => {
      const targetUrl = playUrl || 'https://itch.io';
      window.open(targetUrl, '_blank');
    });
  };

  return (
    <section className="py-16 px-4 md:px-8 border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Title Header */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900 dark:text-slate-50">
            {t.featuredTitle}
          </h2>
          <p className="font-inter text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mt-2">
            {t.featuredSubtitle}
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch mb-10">
          {featuredGames.map((game) => {
            const title = game.title[lang] || game.title['en'];
            const description = game.description[lang] || game.description['en'];

            return (
              <RetroCard
                key={game.id}
                variant="default"
                hoverEffect
                className="flex flex-col justify-between h-full bg-white dark:bg-[#1c1c1e]/60"
              >
                {/* Thumbnail Image */}
                <div className="relative border border-slate-200 dark:border-white/5 bg-slate-900 aspect-video rounded-2xl overflow-hidden mb-4">
                  <img
                    src={game.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {/* Genre Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0071e3]/90 backdrop-blur-md text-white text-[10px] font-semibold rounded-full shadow-sm">
                    {game.genre}
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-semibold rounded-full shadow-sm">
                    {game.type === 'app' ? t.itemApp : t.itemGame}
                  </div>
                </div>

                {/* Info Text */}
                <div className="text-left mb-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-base tracking-tight truncate max-w-[70%] text-slate-900 dark:text-slate-100">
                        {title}
                      </h3>
                      {/* Rating */}
                      <span className="text-xs text-amber-500 font-semibold flex items-center gap-1 select-none">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        {game.rating}
                      </span>
                    </div>

                    <p className="font-inter text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mt-1">
                      {description}
                    </p>
                    
                    <div className="mt-2 text-left">
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setSelectedGameForDetails(game);
                        }}
                        onMouseEnter={playHover}
                        className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] hover:underline transition-colors cursor-pointer focus:outline-none"
                      >
                        {t.storeViewDetails}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">
                      {t.storePriceFree}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {game.releaseYear}
                    </span>
                  </div>
                </div>

                {/* Launch Game Button */}
                <RetroButton
                  variant="purple"
                  fullWidth
                  size="sm"
                  onMouseEnter={playHover}
                  onClick={() => handleLaunchGame(title, game.playUrl)}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {t.storePlayNow}
                  </span>
                </RetroButton>
              </RetroCard>
            );
          })}
        </div>

        {/* View All Games CTA */}
        <div>
          <RetroButton
            variant="outline"
            size="md"
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              setPage('games');
            }}
          >
            {t.viewAllGames}
          </RetroButton>
        </div>
        
        {selectedGameForDetails && (
          <GameDetailsModal
            game={selectedGameForDetails}
            onClose={() => setSelectedGameForDetails(null)}
            onPlay={handleLaunchGame}
            lang={lang}
          />
        )}

      </div>
    </section>
  );
}
