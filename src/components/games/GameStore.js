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
  const [activeTabType, setActiveTabType] = useState('all'); // 'all', 'game', 'app'

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
    <section className="py-12 md:py-16 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center flex flex-col items-center gap-2 mb-10">
          <h1 className="font-press text-lg md:text-xl uppercase tracking-wider text-slate-900 dark:text-slate-50">
            {t.storeTitle}
          </h1>
          <p className="font-inter text-xs md:text-sm text-slate-650 dark:text-slate-450 max-w-lg mt-2">
            {t.storeSubtitle}
          </p>
        </div>

        {/* Category Tabs: ALL / GAMES / APPLICATIONS */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: 'all', label: t.storeTabAll },
            { id: 'game', label: t.storeTabGames },
            { id: 'app', label: t.storeTabApps }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { playClick(); setActiveTabType(tab.id); }}
              onMouseEnter={playHover}
              className={`px-4 py-2 border-2 border-slate-950 dark:border-slate-100 font-press text-[8px] sm:text-[9px] uppercase tracking-wide shadow-retro-sm transition-all duration-100 active:translate-x-[1px] active:translate-y-[1px] ${
                activeTabType === tab.id
                  ? 'bg-purple-600 text-white shadow-none translate-x-[1px] translate-y-[1px]'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-205'
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
            <div className="absolute right-3.5 bottom-2.5 text-slate-400">
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
              className={`p-2.5 border-2 border-slate-950 dark:border-slate-100 shadow-retro-sm active:translate-x-[1px] active:translate-y-[1px] ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-205'}`}
              title={t.storeViewGrid}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { playClick(); setViewMode('list'); }}
              onMouseEnter={playHover}
              className={`p-2.5 border-2 border-slate-950 dark:border-slate-100 shadow-retro-sm active:translate-x-[1px] active:translate-y-[1px] ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-205'}`}
              title={t.storeViewList}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Games Catalog Grid */}
        {filteredGames.length === 0 ? (
          <div className="py-20 text-center border-4 border-dashed border-slate-300 dark:border-slate-800 p-8">
            <div className="font-press text-sm text-slate-500 uppercase">
              NO GAMES DETECTED IN ARCHIVE
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
                  className="flex flex-col justify-between h-full bg-white dark:bg-slate-950"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative border-4 border-slate-950 dark:border-slate-100 bg-slate-900 aspect-video overflow-hidden mb-4">
                      <img
                        src={game.image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-350 hover:scale-105"
                      />
                      {/* Genre badge */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 border-2 border-slate-950 dark:border-slate-100 bg-purple-600 text-white font-press text-[7px] uppercase shadow-retro-sm">
                        {game.genre}
                      </span>
                      {/* Type badge */}
                      <span className="absolute top-2 right-2 px-2 py-0.5 border-2 border-slate-950 dark:border-slate-100 bg-emerald-555 bg-emerald-500 text-slate-950 font-press text-[7px] uppercase shadow-retro-sm font-bold">
                        {game.type === 'app' ? t.itemApp : t.itemGame}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="text-left mb-6">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-press text-[10px] md:text-[11px] uppercase tracking-wide leading-relaxed truncate max-w-[80%] text-slate-900 dark:text-slate-100">
                          {title}
                        </h3>
                        <span className="font-press text-[9px] text-yellow-500 flex items-center gap-1 select-none whitespace-nowrap">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {game.rating}
                        </span>
                      </div>
                      
                      <p className="font-inter text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mt-1">
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

                      <div className="flex items-center justify-between mt-5 pt-3 border-t-2 border-slate-100 dark:border-slate-900">
                        <span className="font-press text-[8px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold shadow-retro-sm">
                          {t.storePriceFree}
                        </span>
                        <span className="font-press text-[8px] text-slate-400">
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
                    className={`border-4 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-retro select-none gap-3 ${
                      isExpanded ? 'border-b-4' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-press text-[10px] md:text-[11px] uppercase tracking-wide text-slate-900 dark:text-slate-100">
                        {title}
                      </h3>
                      <span className="font-press text-[7px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-purple-600 text-white shadow-retro-sm uppercase">
                        {game.platform || 'PC'}
                      </span>
                      <span className="font-press text-[7px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-emerald-500 text-slate-955 text-slate-950 shadow-retro-sm uppercase font-bold">
                        {game.type === 'app' ? t.itemApp : t.itemGame}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase hidden md:inline">
                        {game.genre}
                      </span>
                      <span className="font-press text-[9px] text-yellow-500 flex items-center gap-1 select-none whitespace-nowrap">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {game.rating}
                      </span>
                      <span className="font-press text-[9px] text-slate-900 dark:text-slate-100 font-bold select-none">
                        {isExpanded ? '[-]' : '[+]'}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Content (Inline Details Panel) */}
                  {isExpanded && (
                    <div className="border-4 border-t-0 border-slate-950 dark:border-slate-100 p-5 bg-slate-50 dark:bg-slate-900/50 shadow-retro flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-4 duration-200">
                      
                      {/* Media Block (Video / Image) */}
                      <div className="flex-1 md:max-w-md w-full">
                        {game.videoUrl ? (
                          <div className="border-4 border-slate-950 dark:border-slate-100 bg-black overflow-hidden shadow-retro-sm">
                            <video
                              src={game.videoUrl}
                              controls
                              className="w-full aspect-video object-contain"
                              playsInline
                            />
                          </div>
                        ) : (
                          <div className="border-4 border-slate-950 dark:border-slate-100 bg-slate-900 aspect-video overflow-hidden shadow-retro-sm">
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
                            <span className="font-press text-[7px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold shadow-retro-sm">
                              {t.storePriceFree}
                            </span>
                            <span className="font-press text-[7px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-retro-sm">
                              {game.releaseYear}
                            </span>
                            <span className="font-press text-[7px] border-2 border-slate-950 dark:border-slate-100 px-2 py-0.5 bg-cyan-500 text-slate-950 shadow-retro-sm">
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
