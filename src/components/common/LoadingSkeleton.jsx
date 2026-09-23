import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-100 rounded-lg w-1/4" />
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 animate-pulse shadow-soft"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/2" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};
