import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-soft-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" onClick={onAction} icon={actionIcon}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
