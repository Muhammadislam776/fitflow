import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  accent = false,
  iconBg = 'bg-brand-50 text-brand-600',
  className = '',
}) => {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 ${className}`} hoverEffect>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent ? 'bg-accent-50 text-accent-600' : iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-navy-900">{value}</h3>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {trend}
          </span>
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500" />
      )}
    </Card>
  );
};
