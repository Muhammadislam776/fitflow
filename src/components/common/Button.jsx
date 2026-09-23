import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-soft-sm focus:ring-brand-500',
    secondary: 'bg-white hover:bg-slate-50 text-navy-800 border border-slate-200 shadow-soft-sm focus:ring-brand-500',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-soft focus:ring-accent-500 font-semibold',
    outline: 'border border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
    ghost: 'text-slate-600 hover:text-navy-900 hover:bg-slate-100 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-soft-sm focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
