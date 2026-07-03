import React from 'react';
import { cn } from '../../lib/utils';

export default function RetroButton({
  children,
  onClick,
  type = 'button',
  variant = 'purple',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false
}) {
  const baseStyles = 'font-medium text-center select-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

  const variants = {
    purple: 'bg-[#0071e3] hover:bg-[#147ce5] text-white shadow-sm',
    cyan: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 hover:text-white shadow-sm',
    green: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm',
    red: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm',
    yellow: 'bg-amber-500 hover:bg-amber-400 text-white shadow-sm',
    gray: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5',
    outline: 'bg-transparent border border-slate-300 dark:border-slate-750 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-3.5 text-base rounded-2xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
    >
      {children}
    </button>
  );
}
