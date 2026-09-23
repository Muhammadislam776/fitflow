import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-soft-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`block w-full rounded-xl border bg-white text-navy-900 placeholder-slate-400 text-sm transition-colors
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
            ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500'
            }
            focus:outline-none focus:ring-1 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
