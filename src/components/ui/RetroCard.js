import React from 'react';
import { cn } from '../../lib/utils';

export default function RetroCard({
  children,
  title,
  headerRight,
  className = '',
  hoverEffect = false,
  variant = 'default',
}) {
  return (
    <div
      className={cn(
        "bg-white/80 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-[#f5f5f7] rounded-3xl overflow-hidden shadow-sm transition-all duration-300",
        hoverEffect ? "hover:scale-[1.01] hover:shadow-lg hover:border-slate-300/80 dark:hover:border-white/20" : "",
        className
      )}
    >
      {/* Card Header (Optional) */}
      {(title || headerRight) && (
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/55 dark:bg-slate-900/50">
          {title && (
            <h3 className="font-semibold text-sm md:text-base tracking-tight text-slate-800 dark:text-[#f5f5f7]">
              {title}
            </h3>
          )}
          {headerRight && (
            <div className="flex items-center">
              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
