import React, { useState, useRef, useEffect } from 'react';
import { Star, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { locales } from '../../data/locales';
import RetroButton from '../ui/RetroButton';
import { playHover, playClick } from '../../lib/sfx';

export default function GameDetailsModal({ game, onClose, onPlay, lang }) {
  const t = locales[lang];
  const title = game.title[lang] || game.title['en'];
  const description = game.description[lang] || game.description['en'];

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (game) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [game]);

  // Handle play / pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    playClick();
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  // Handle mute / unmute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    playClick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    if (newMuted) {
      videoRef.current.volume = 0;
    } else {
      videoRef.current.volume = volume > 0 ? volume : 0.5;
      if (volume === 0) setVolume(0.5);
    }
  };

  // Update play state if video ends or is paused natively
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onEnded = () => setIsPlaying(false);

    videoEl.addEventListener('pause', onPause);
    videoEl.addEventListener('play', onPlay);
    videoEl.addEventListener('ended', onEnded);

    return () => {
      videoEl.removeEventListener('pause', onPause);
      videoEl.removeEventListener('play', onPlay);
      videoEl.removeEventListener('ended', onEnded);
    };
  }, [game]);

  if (!game) return null;

  // Handle backdrop click to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      playClick();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-950 border-4 border-slate-950 dark:border-slate-100 shadow-retro flex flex-col relative max-h-[95vh] md:max-h-[90vh] overflow-hidden animate-in zoom-in duration-200"
      >
        {/* Header bar */}
        <div className="flex justify-between items-center px-4 py-3 border-b-4 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-905 bg-slate-900">
          <h2 className="font-press text-[10px] md:text-xs uppercase font-bold tracking-wide truncate max-w-[80%] text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            onMouseEnter={playHover}
            className="text-slate-900 dark:text-slate-100 hover:text-rose-500 dark:hover:text-rose-400 p-1 focus:outline-none transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 text-left">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Media Column (Widescreen Video/Image) */}
            <div className="md:col-span-7 flex flex-col gap-2">
              {game.videoUrl ? (
                <div className="flex flex-col border-4 border-slate-950 dark:border-slate-100 bg-black shadow-retro-sm overflow-hidden">
                  {/* Video Player */}
                  <div className="relative aspect-video w-full bg-slate-950">
                    <video
                      ref={videoRef}
                      src={game.videoUrl}
                      className="w-full h-full object-contain"
                      playsInline
                    />
                  </div>

                  {/* Retro Custom Controls Tray */}
                  <div className="flex items-center justify-between px-3 py-2 border-t-2 border-slate-950 dark:border-slate-100 bg-slate-100 dark:bg-slate-900 gap-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      onMouseEnter={playHover}
                      className="p-1 text-slate-900 dark:text-slate-100 hover:text-purple-650 hover:text-purple-600 dark:hover:text-cyan-400 focus:outline-none cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    {/* Volume Slider & Mute Toggle */}
                    <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                      <button
                        onClick={toggleMute}
                        onMouseEnter={playHover}
                        className="p-1 text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-cyan-400 focus:outline-none cursor-pointer"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-700 rounded-none border border-slate-950 dark:border-slate-500 appearance-none"
                      />
                    </div>

                    {/* Label Status */}
                    <span className="font-press text-[7px] text-slate-500 uppercase tracking-widest hidden sm:inline">
                      {isPlaying ? 'PLAYING_TRAILER' : 'TRAILER_PAUSED'}
                    </span>
                  </div>
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

            {/* Spec Details Column */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Grid Specs */}
                <div className="grid grid-cols-2 gap-3 border-4 border-slate-955 border-slate-950 dark:border-slate-100 p-4 bg-slate-50 dark:bg-slate-900/50 shadow-retro-sm">
                  
                  {/* Platform Badge */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase">
                      {t.gamePlatform}:
                    </span>
                    <span className="font-press text-[8px] border-2 border-slate-950 dark:border-slate-100 px-2 py-1 bg-purple-600 text-white font-bold text-center uppercase tracking-wide">
                      {game.platform || 'PC'}
                    </span>
                  </div>

                  {/* Genre */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase">
                      {t.gameGenre}:
                    </span>
                    <span className="font-press text-[8px] text-slate-800 dark:text-slate-200">
                      {game.genre}
                    </span>
                  </div>

                  {/* Release Year */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase">
                      {t.gameYear}:
                    </span>
                    <span className="font-press text-[8px] text-slate-800 dark:text-slate-200">
                      {game.releaseYear}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase">
                      {t.gameRating}:
                    </span>
                    <span className="font-press text-[8px] text-yellow-500 flex items-center gap-1 select-none">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {game.rating}
                    </span>
                  </div>

                  {/* Price Status */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase">
                      STATUS:
                    </span>
                    <span className="font-press text-[8px] text-emerald-500 font-bold">
                      {t.storePriceFree}
                    </span>
                  </div>

                  {/* Classification Type */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-press text-[8px] text-slate-400 dark:text-slate-500 uppercase">
                      {t.itemType}:
                    </span>
                    <span className="font-press text-[8px] text-purple-650 dark:text-cyan-400 font-bold uppercase">
                      {game.type === 'app' ? t.itemApp : t.itemGame}
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Full Description Section */}
          <div className="mt-6 pt-5 border-t-2 border-slate-150 dark:border-slate-900">
            <h3 className="font-press text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              Description
            </h3>
            <p className="font-inter text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              {description}
            </p>
          </div>

        </div>

        {/* Footer Area */}
        <div className="px-4 py-4 border-t-4 border-slate-955 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row gap-3 justify-end">
          <RetroButton
            variant="outline"
            size="sm"
            onClick={() => {
              playClick();
              onClose();
            }}
            onMouseEnter={playHover}
            className="w-full sm:w-auto"
          >
            {t.modalClose}
          </RetroButton>
          <RetroButton
            variant="purple"
            size="sm"
            onClick={() => {
              onClose();
              onPlay(title, game.playUrl);
            }}
            onMouseEnter={playHover}
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
  );
}
