import React from 'react';

export const PageHeader = ({
  title,
  description,
  badge,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-3 flex-wrap">
          {action}
          {children}
        </div>
      )}
    </div>
  );
};
