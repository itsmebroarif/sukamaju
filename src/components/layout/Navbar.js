import React, { useState } from "react";
import {
  Sun,
  Moon,
  Globe,
  Home,
  Gamepad2,
  Cpu,
  Info,
  Mail,
  Sparkles,
} from "lucide-react";
import { useNavStore, useThemeStore, useLangStore } from "../../lib/store";
import { locales } from "../../data/locales";
import { playHover, playClick } from "../../lib/sfx";
import RetroButton from "../ui/RetroButton";

export default function Navbar() {
  const { page, setPage, openWizard } = useNavStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, setLang } = useLangStore();

  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = locales[lang] || locales["en"];

  const navLinks = [
    { id: "home", label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: "games", label: t.navGames, icon: <Gamepad2 className="w-5 h-5" /> },
    { id: "services", label: t.navServices, icon: <Cpu className="w-5 h-5" /> },
    { id: "about", label: t.navAbout, icon: <Info className="w-5 h-5" /> },
    { id: "contact", label: t.navContact, icon: <Mail className="w-5 h-5" /> },
  ];

  const handleNavClick = (id) => {
    playClick();
    setPage(id);
  };

  const handleThemeToggle = () => {
    playClick();
    toggleTheme();
  };

  const handleLangToggle = () => {
    playClick();
    setLangMenuOpen(!langMenuOpen);
  };

  const selectLanguage = (l) => {
    playClick();
    setLang(l);
    setLangMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation Header */}
      <nav className="hidden lg:block sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b-4 border-slate-950 dark:border-slate-100 py-3 px-4 md:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("home")}
            onMouseEnter={playHover}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-purple-600 border-2 border-slate-950 dark:border-slate-100 flex items-center justify-center font-undertale text-white text-base shadow-retro-sm group-hover:bg-purple-500 transition-colors">
              K
            </div>
            <span className="font-undertale text-base md:text-lg tracking-widest text-slate-950 dark:text-white font-bold transition-all duration-200">
              KAFEINARTS
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                onMouseEnter={playHover}
                className={`font-press text-[9px] uppercase tracking-wider transition-colors duration-150 ${
                  page === link.id
                    ? "text-purple-600 dark:text-cyan-400 underline decoration-2 underline-offset-4"
                    : "text-slate-650 hover:text-slate-900 dark:text-slate-350 dark:hover:text-slate-100"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              onMouseEnter={playHover}
              className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 shadow-retro-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-800" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={handleLangToggle}
                onMouseEnter={playHover}
                className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-slate-50 dark:bg-slate-900 shadow-retro-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 font-press text-[9px]"
              >
                <Globe className="w-4 h-4 text-slate-800 dark:text-slate-100" />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-slate-100 py-1 shadow-retro z-50 w-24">
                  {["en", "id", "jp"].map((l) => (
                    <button
                      key={l}
                      onClick={() => selectLanguage(l)}
                      onMouseEnter={playHover}
                      className={`w-full text-left px-3 py-1.5 font-press text-[9px] uppercase hover:bg-slate-100 dark:hover:bg-slate-900 ${
                        lang === l
                          ? "text-purple-600 dark:text-cyan-400 font-bold"
                          : "text-slate-700 dark:text-slate-350"
                      }`}
                    >
                      {l === "en" ? "EN" : l === "id" ? "ID" : "JP"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Request button - Desktop */}
            <div className="hidden lg:block">
              <RetroButton
                variant="purple"
                size="sm"
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  openWizard("game");
                }}
              >
                {t.navRequestGame}
              </RetroButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Settings Panel (Top Right) */}
      <div className="lg:hidden fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          onMouseEnter={playHover}
          className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-white/95 dark:bg-slate-950/95 shadow-retro-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-colors duration-200"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-800" />
          )}
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={handleLangToggle}
            onMouseEnter={playHover}
            className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-white/95 dark:bg-slate-950/95 shadow-retro-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 font-press text-[9px]"
          >
            <Globe className="w-4 h-4 text-slate-800 dark:text-slate-100" />
            <span className="uppercase text-[8px]">{lang}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-slate-100 py-1 shadow-retro z-50 w-24">
              {["en", "id", "jp"].map((l) => (
                <button
                  key={l}
                  onClick={() => selectLanguage(l)}
                  onMouseEnter={playHover}
                  className={`w-full text-left px-3 py-1.5 font-press text-[9px] uppercase hover:bg-slate-100 dark:hover:bg-slate-900 ${
                    lang === l
                      ? "text-purple-600 dark:text-cyan-400 font-bold"
                      : "text-slate-700 dark:text-slate-350"
                  }`}
                >
                  {l === "en" ? "EN" : l === "id" ? "ID" : "JP"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Instagram / Play Store Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-1 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] select-none">
        {navLinks.map((link) => {
          const isActive = page === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              onMouseEnter={playHover}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors duration-150 ${
                isActive
                  ? "text-purple-600 dark:text-cyan-400 font-bold"
                  : "text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {/* Play Store active pill background container */}
              <div
                className={`px-4 py-1 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-cyan-400 scale-105"
                    : "bg-transparent text-slate-500 dark:text-slate-400"
                }`}
              >
                {link.icon}
              </div>
              <span
                className={`font-press text-[7px] mt-1 uppercase tracking-tighter transition-all ${
                  isActive
                    ? "text-purple-600 dark:text-cyan-400 font-bold scale-105"
                    : "text-slate-500 dark:text-slate-450"
                }`}
              >
                {link.label}
              </span>
            </button>
          );
        })}
        {/* Open Collab Button */}
        <button
          onClick={() => {
            playClick();
            openWizard("game");
          }}
          onMouseEnter={playHover}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-555 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-250"
        >
          <div className="px-4 py-1 rounded-full flex items-center justify-center bg-transparent text-slate-500 dark:text-slate-400">
            <Sparkles className="w-5 h-5 text-purple-650 dark:text-cyan-455 text-purple-600 dark:text-cyan-400" />
          </div>
          <span className="font-press text-[7px] mt-1 uppercase tracking-tighter text-slate-500 dark:text-slate-450">
            Collab
          </span>
        </button>
      </div>
    </>
  );
}
