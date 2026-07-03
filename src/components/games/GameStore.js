import React, { useState, useMemo } from 'react';
import { Star, Search, Play, LayoutGrid, List } from 'lucide-react';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';
import gamesData from '../../data/games.json';
import RetroCard from '../ui/RetroCard';
import RetroButton from '../ui/RetroButton';
import RetroInput from '../ui/RetroInput';
import { playHover, playSuccess, playClick } from '../../lib/sfx';
import Swal from 'sweetalert2';
import GameDetailsModal from './GameDetailsModal';

export default function GameStore() {
  const { lang } = useLangStore();
  const t = locales[lang];

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedGameForDetails, setSelectedGameForDetails] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [expandedGameId, setExpandedGameId] = useState(null);
  const [activeTabType, setActiveTabType] = useState('app'); // Rebranded: default to 'app' first!

  // Parse genres dynamically
  const genres = useMemo(() => {
    const list = gamesData.map((game) => game.genre.split(' / ')[0]);
    return ['all', ...new Set(list)];
  }, []);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return gamesData
      .filter((game) => {
        const title = (game.title[lang] || game.title['en'] || '').toLowerCase();
        const desc = (game.description[lang] || game.description['en'] || '').toLowerCase();
        const query = search.toLowerCase();
        const matchesSearch = title.includes(query) || desc.includes(query);

        const matchesGenre = genre === 'all' || game.genre.toLowerCase().includes(genre.toLowerCase());

        const matchesType = activeTabType === 'all'
          ? true
          : activeTabType === 'app'
            ? game.type === 'app'
            : game.type !== 'app';

        return matchesSearch && matchesGenre && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title-asc') {
          const tA = a.title[lang] || a.title['en'];
          const tB = b.title[lang] || b.title['en'];
          return tA.localeCompare(tB);
        }
        if (sortBy === 'title-desc') {
          const tA = a.title[lang] || a.title['en'];
          const tB = b.title[lang] || b.title['en'];
          return tB.localeCompare(tA);
        }
        if (sortBy === 'year') return b.releaseYear - a.releaseYear;
        return 0;
      });
  }, [search, genre, sortBy, lang, activeTabType]);

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
    <section className="py-12 md:py-16 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-10">
          <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-slate-900 dark:text-slate-50">
            {t.storeTitle}
          </h1>
          <p className="font-inter text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mt-2">
            {t.storeSubtitle}
          </p>
        </div>

        {/* Category Tabs: ALL / GAMES / APPLICATIONS */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: 'app', label: t.storeTabApps },
            { id: 'game', label: t.storeTabGames },
            { id: 'all', label: t.storeTabAll }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { playClick(); setActiveTabType(tab.id); }}
              onMouseEnter={playHover}
              className={`px-5 py-2 text-xs font-semibold rounded-full tracking-tight transition-all duration-200 active:scale-95 ${
                activeTabType === tab.id
                  ? 'bg-[#0071e3] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#1c1c1e] text-slate-600 dark:text-slate-300 hover:bg-slate-205 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <RetroInput
              id="search"
              placeholder={t.storeSearchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <div className="absolute right-3.5 bottom-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Genre select */}
          <div className="md:col-span-3">
            <RetroInput
              id="genre"
              type="select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              options={[
                { value: 'all', label: t.storeGenreAll },
                ...genres.filter(g => g !== 'all').map((g) => ({
                  value: g.toLowerCase(),
                  label: g.toUpperCase()
                }))
              ]}
            />
          </div>

          {/* Sort select */}
          <div className="md:col-span-3">
            <RetroInput
              id="sort"
              type="select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'rating', label: t.storeSortRating },
                { value: 'title-asc', label: t.storeSortPriceAsc },
                { value: 'title-desc', label: t.storeSortPriceDesc },
                { value: 'year', label: t.storeSortYear }
              ]}
            />
          </div>

          {/* Layout Toggle */}
          <div className="md:col-span-1 flex gap-2 items-center justify-end h-full mt-2 md:mt-0">
            <button
              type="button"
              onClick={() => { playClick(); setViewMode('grid'); }}
              onMouseEnter={playHover}
              className={`p-2.5 border rounded-xl transition-all active:scale-95 ${
                viewMode === 'grid' 
                  ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-[#1c1c1e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              title={t.storeViewGrid}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { playClick(); setViewMode('list'); }}
              onMouseEnter={playHover}
              className={`p-2.5 border rounded-xl transition-all active:scale-95 ${
                viewMode === 'list' 
                  ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-[#1c1c1e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              title={t.storeViewList}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Games Catalog Grid */}
        {filteredGames.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 bg-slate-50/50 dark:bg-[#1c1c1e]/10">
            <div className="font-semibold text-slate-500 text-base">
              NO PRODUCTS DETECTED IN ARCHIVE
            </div>
            <p className="font-inter text-xs text-slate-400 mt-2">
              Try adjusting your filters or search inputs.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => {
              const title = game.title[lang] || game.title['en'];
              const description = game.description[lang] || game.description['en'];

              return (
                <RetroCard
                  key={game.id}
                  variant="default"
                  hoverEffect
                  className="flex flex-col justify-between h-full bg-white dark:bg-[#1c1c1e]/60"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative border border-slate-200/50 dark:border-white/5 bg-slate-900 aspect-video rounded-2xl overflow-hidden mb-4">
                      <img
                        src={game.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-350 hover:scale-105"
                      />
                      {/* Genre badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0071e3]/90 backdrop-blur-md text-white text-[10px] font-semibold rounded-full shadow-sm">
                        {game.genre}
                      </span>
                      {/* Type badge */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-semibold rounded-full shadow-sm">
                        {game.type === 'app' ? t.itemApp : t.itemGame}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="text-left mb-6">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-semibold text-base tracking-tight truncate max-w-[80%] text-slate-900 dark:text-slate-100">
                          {title}
                        </h3>
                        <span className="text-xs text-amber-500 font-semibold flex items-center gap-1 select-none whitespace-nowrap">
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
                          className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] hover:underline transition-colors focus:outline-none"
                        >
                          {t.storeViewDetails}
                        </button>
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
                  </div>

                  {/* Play Button */}
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
        ) : (
          /* Accordion List View */
          <div className="flex flex-col gap-4">
            {filteredGames.map((game) => {
              const title = game.title[lang] || game.title['en'];
              const description = game.description[lang] || game.description['en'];
              const isExpanded = expandedGameId === game.id;

              return (
                <div key={game.id} className="flex flex-col w-full text-left">
                  {/* Accordion Header */}
                  <div
                    onClick={() => {
                      playClick();
                      setExpandedGameId(isExpanded ? null : game.id);
                    }}
                    onMouseEnter={playHover}
                    className={`border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#1c1c1e]/60 backdrop-blur-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all duration-200 select-none gap-3 ${
                      isExpanded ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-sm md:text-base tracking-tight text-slate-900 dark:text-slate-100">
                        {title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-805 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200/50 dark:border-white/5">
                        {game.platform || 'PC'}
                      </span>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {game.type === 'app' ? t.itemApp : t.itemGame}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
                        {game.genre}
                      </span>
                      <span className="text-xs text-amber-500 font-semibold flex items-center gap-1 select-none whitespace-nowrap">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        {game.rating}
                      </span>
                      <span className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] select-none w-6 text-center">
                        {isExpanded ? 'Collapse' : 'Detail'}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Content (Inline Details Panel) */}
                  {isExpanded && (
                    <div className="border border-slate-200 dark:border-white/10 border-t-0 p-6 bg-slate-50/50 dark:bg-[#1c1c1e]/30 backdrop-blur-xl rounded-b-2xl flex flex-col md:flex-row gap-6 shadow-sm animate-fade-in">
                      
                      {/* Media Block (Video / Image) */}
                      <div className="flex-1 md:max-w-md w-full">
                        {game.videoUrl ? (
                          <div className="border border-slate-200/60 dark:border-white/5 rounded-2xl bg-black overflow-hidden shadow-sm aspect-video">
                            <video
                              src={game.videoUrl}
                              controls
                              className="w-full h-full object-contain"
                              playsInline
                            />
                          </div>
                        ) : (
                          <div className="border border-slate-200/60 dark:border-white/5 rounded-2xl bg-slate-900 aspect-video overflow-hidden shadow-sm">
                            <img
                              src={game.image}
                              alt={title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Detail Info Block */}
                      <div className="flex-1 flex flex-col justify-between text-left">
                        <div>
                          {/* Specs Badge list */}
                          <div className="flex flex-wrap gap-2 mb-3.5">
                            <span className="text-[10px] font-semibold bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                              {t.storePriceFree}
                            </span>
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-805 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                              {game.releaseYear}
                            </span>
                            <span className="text-[10px] font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#2997ff]/20 dark:text-[#2997ff] px-2.5 py-0.5 rounded-full">
                              {game.genre}
                            </span>
                          </div>
                          <p className="font-inter text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify mt-1">
                            {description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end">
                          <RetroButton
                            variant="purple"
                            size="sm"
                            onMouseEnter={playHover}
                            onClick={() => handleLaunchGame(title, game.playUrl)}
                            className="w-full sm:w-auto"
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              <Play className="w-3.5 h-3.5 fill-current" />
                              {t.storePlayNow}
                            </span>
                          </RetroButton>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
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
