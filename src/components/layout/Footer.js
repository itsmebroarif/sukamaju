import React from 'react';
import { Disc, MessageSquare } from 'lucide-react';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';

export default function Footer() {
  const { lang } = useLangStore();
  const t = locales[lang];

  return (
    <footer className="bg-slate-950 text-slate-350 border-t-4 border-slate-950 dark:border-slate-100 py-10 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 border border-slate-100 flex items-center justify-center font-press text-white text-xs">
              K
            </div>
            <span className="font-press text-[10px] tracking-tight text-white">
              KAFEINARTS
            </span>
          </div>
          <p className="font-inter text-xs text-slate-400 max-w-sm mt-1">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/kafeinarts.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-slate-100 bg-slate-900 text-slate-100 hover:bg-purple-600 hover:text-white shadow-retro-sm transition-colors duration-150"
              aria-label="Instagram Link"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://discord.com/users/itsmebroarif"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-slate-100 bg-slate-900 text-slate-100 hover:bg-indigo-650 hover:bg-indigo-600 hover:text-white shadow-retro-sm transition-colors duration-150"
              aria-label="Discord Link"
            >
              <Disc className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/6285817048266"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border-2 border-slate-100 bg-slate-900 text-slate-100 hover:bg-emerald-600 hover:text-white shadow-retro-sm transition-colors duration-150"
              aria-label="WhatsApp Link"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>

          <div className="font-press text-[8px] uppercase tracking-wider text-slate-500 text-center md:text-right mt-2">
            &copy; {new Date().getFullYear()} KafeinArts Studio. All Systems Operational.
          </div>
        </div>

      </div>
    </footer>
  );
}
