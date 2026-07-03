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
      <nav className="hidden lg:block sticky top-0 z-50 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 py-3 px-4 md:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("home")}
            onMouseEnter={playHover}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <img 
              src="/icon.png" 
              alt="Sukamaju Hub Logo" 
              className="w-8 h-8 object-contain rounded-lg group-hover:scale-105 transition-transform duration-200" 
            />
            <span className="font-semibold text-base md:text-lg tracking-tight text-slate-900 dark:text-white font-bold transition-all duration-200">
              SUKAMAJU HUB
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                onMouseEnter={playHover}
                className={`text-xs font-semibold tracking-tight transition-colors duration-150 relative py-1.5 px-1 ${
                  page === link.id
                    ? "text-[#0071e3] dark:text-[#2997ff]"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                {link.label}
                {page === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0071e3] dark:bg-[#2997ff] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              onMouseEnter={playHover}
              className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1c1c1e] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:scale-95 transition-all"
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
                className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1c1c1e] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:scale-95 transition-all flex items-center gap-1 text-xs font-medium"
              >
                <Globe className="w-4 h-4 text-slate-855 text-slate-800 dark:text-slate-100" />
                <span className="hidden sm:inline uppercase">{lang}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 py-1 rounded-xl shadow-lg z-50 w-24 overflow-hidden">
                  {["en", "id", "jp"].map((l) => (
                    <button
                      key={l}
                      onClick={() => selectLanguage(l)}
                      onMouseEnter={playHover}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium uppercase hover:bg-slate-100 dark:hover:bg-slate-900 ${
                        lang === l
                          ? "text-[#0071e3] dark:text-[#2997ff] font-bold"
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
          className="p-2 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#1c1c1e]/85 backdrop-blur-md rounded-lg active:scale-95 shadow-sm transition-all"
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
            className="p-2 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#1c1c1e]/85 backdrop-blur-md rounded-lg active:scale-95 shadow-sm transition-all flex items-center gap-1 text-[10px] font-medium"
          >
            <Globe className="w-4 h-4 text-slate-800 dark:text-slate-100" />
            <span className="uppercase">{lang}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 py-1 rounded-xl shadow-lg z-50 w-24 overflow-hidden">
              {["en", "id", "jp"].map((l) => (
                <button
                  key={l}
                  onClick={() => selectLanguage(l)}
                  onMouseEnter={playHover}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium uppercase hover:bg-slate-100 dark:hover:bg-slate-900 ${
                    lang === l
                      ? "text-[#0071e3] dark:text-[#2997ff] font-bold"
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

      {/* Mobile Floating iOS-style Dock Navigation Bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 h-16 z-50 bg-white/85 dark:bg-[#1c1c1e]/70 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 flex items-center justify-around px-2 shadow-lg rounded-3xl select-none">
        {navLinks.map((link) => {
          const isActive = page === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              onMouseEnter={playHover}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors duration-150 ${
                isActive
                  ? "text-[#0071e3] dark:text-[#2997ff] font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-205"
              }`}
            >
              {/* iOS active circle indicator container */}
              <div
                className={`px-3.5 py-1.5 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-[#0071e3]/10 dark:bg-[#2997ff]/10 text-[#0071e3] dark:text-[#2997ff] scale-105"
                    : "bg-transparent text-slate-500 dark:text-slate-400"
                }`}
              >
                {link.icon}
              </div>
              <span
                className={`text-[8px] mt-0.5 font-medium transition-all ${
                  isActive
                    ? "text-[#0071e3] dark:text-[#2997ff] font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {link.label.split(' ')[0]} {/* Keep it single word for mobile dock */}
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
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <div className="px-3.5 py-1.5 rounded-2xl flex items-center justify-center bg-transparent text-slate-500 dark:text-slate-400">
            <Sparkles className="w-5 h-5 text-[#0071e3] dark:text-[#2997ff]" />
          </div>
          <span className="text-[8px] mt-0.5 font-medium text-slate-500 dark:text-slate-400">
            Collab
          </span>
        </button>
      </div>
    </>
  );
}
