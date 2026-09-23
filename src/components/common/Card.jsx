import React from 'react';

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-soft-sm">
        <select
          id={selectId}
          className={`block w-full rounded-xl border bg-white text-navy-900 text-sm transition-colors pl-3.5 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-1
            ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500'
            } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    navy: 'bg-navy-900 text-white border-navy-800',
  };

  const dotColors = {
    brand: 'bg-brand-500',
    accent: 'bg-accent-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
    navy: 'bg-accent-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl shadow-soft ${
        hoverEffect ? 'hover-card-lift' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
