import React from 'react';

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
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.brand} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-brand-500'}`} />}
      {children}
    </span>
  );
};
