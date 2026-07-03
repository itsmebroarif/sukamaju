import React from 'react';
import { Disc, MessageSquare } from 'lucide-react';
import { useLangStore } from '../../lib/store';
import { locales } from '../../data/locales';

export default function Footer() {
  const { lang } = useLangStore();
  const t = locales[lang];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/5 pt-10 pb-28 lg:pb-10 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2">
            <img 
              src="/icon.png" 
              alt="Sukamaju Hub Logo" 
              className="w-6 h-6 object-contain rounded" 
            />
            <span className="font-semibold text-xs tracking-tight text-white font-bold">
              SUKAMAJU HUB
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
              href="https://www.instagram.com/sukamajuhub.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-white/10 bg-slate-900 text-slate-100 hover:bg-[#0071e3] hover:text-white rounded-lg transition-colors duration-150"
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
              className="p-2 border border-white/10 bg-slate-900 text-slate-100 hover:bg-[#0071e3] hover:text-white rounded-lg transition-colors duration-150"
              aria-label="Discord Link"
            >
              <Disc className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/6285817048266"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-white/10 bg-slate-900 text-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors duration-150"
              aria-label="WhatsApp Link"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[10px] text-slate-500 text-center md:text-right mt-2 font-medium">
            &copy; {new Date().getFullYear()} Sukamaju Hub. All Systems Operational.
          </div>
        </div>

      </div>
    </footer>
  );
}
