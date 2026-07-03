import React, { useState } from 'react';
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

  // Get featured games
  const featuredGames = gamesData.filter((game) => game.featured);

  const handleLaunchGame = (gameTitle, playUrl) => {
    playSuccess();
    
    Swal.fire({
      title: lang === 'id' ? 'Menjalankan Game...' : lang === 'jp' ? 'ゲームを起動中...' : 'Launching Game...',
      text: `${gameTitle} ${lang === 'id' ? 'sedang dimuat di sistem.' : lang === 'jp' ? 'がシステムにロードされています。' : 'is loading into systems.'}`,
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
      }
    }).then(() => {
      const targetUrl = playUrl || 'https://itch.io';
      window.open(targetUrl, '_blank');
    });
  };

  return (
    <section className="py-16 px-4 md:px-8 border-b-4 border-slate-950 dark:border-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Title Header */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <h2 className="font-press text-lg md:text-xl uppercase tracking-wider text-slate-900 dark:text-slate-50">
            {t.featuredTitle}
          </h2>
          <p className="font-inter text-xs md:text-sm text-slate-650 dark:text-slate-455 max-w-lg mt-2">
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
                className="flex flex-col justify-between h-full bg-white dark:bg-slate-950"
              >
                {/* Thumbnail Image */}
                <div className="relative border-4 border-slate-950 dark:border-slate-100 bg-slate-900 aspect-video overflow-hidden mb-4">
                  <img
                    src={game.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 border-2 border-slate-955 border-slate-950 dark:border-slate-100 bg-purple-600 text-white font-press text-[7px] uppercase shadow-retro-sm">
                    {game.genre}
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 px-2.5 py-1 border-2 border-slate-950 dark:border-slate-100 bg-emerald-500 text-slate-950 font-press text-[7px] uppercase shadow-retro-sm font-bold">
                    {game.type === 'app' ? t.itemApp : t.itemGame}
                  </div>
                </div>

                {/* Info Text */}
                <div className="text-left mb-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-press text-[11px] uppercase tracking-wide truncate max-w-[70%] text-slate-900 dark:text-slate-100">
                        {title}
                      </h3>
                      {/* Rating */}
                      <span className="font-press text-[9px] text-yellow-500 flex items-center gap-1 select-none">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {game.rating}
                      </span>
                    </div>

                    <p className="font-inter text-xs text-slate-650 dark:text-slate-400 line-clamp-3 leading-relaxed mt-1">
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
                        className="text-[9px] font-press text-purple-650 dark:text-cyan-400 hover:underline transition-colors cursor-pointer focus:outline-none"
                      >
                        [ {t.storeViewDetails} ]
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t-2 border-slate-100 dark:border-slate-900">
                    <span className="font-press text-[8px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold shadow-retro-sm">
                      {t.storePriceFree}
                    </span>
                    <span className="font-press text-[8px] text-slate-400">
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
