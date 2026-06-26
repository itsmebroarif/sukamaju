import React from 'react';
import { cn } from '../../lib/utils';

export default function RetroInput({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  error = '',
  options = [], // For select input
  rows = 4, // For textarea
  disabled = false,
  className = ''
}) {
  const inputClass = cn(
    "w-full px-4 py-2 text-sm text-slate-900 dark:text-slate-100 transition-all duration-150 font-inter",
    "border-2 border-slate-950 dark:border-slate-100 shadow-retro-sm focus:outline-none",
    disabled 
      ? "bg-slate-100 dark:bg-slate-900 opacity-60 cursor-not-allowed" 
      : "bg-white dark:bg-slate-950 focus:bg-slate-50 dark:focus:bg-slate-900",
    error ? "border-rose-500 dark:border-rose-400" : ""
  );

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label htmlFor={id} className="font-press text-[9px] uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500 font-inter">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClass}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={cn(inputClass, "cursor-pointer appearance-none bg-no-repeat bg-right pr-8")}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 9l3 3 3-3' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClass}
        />
      )}

      {error && (
        <span className="font-press text-[8px] uppercase text-rose-500 dark:text-rose-450 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
