import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration = 4500, triggerConfetti = false }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (triggerConfetti) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#F97316', '#3B82F6', '#10B981'],
      });
    }

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Floating Toast Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-soft-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-navy-900'
                : toast.type === 'error'
                ? 'bg-white border-rose-200 text-navy-900'
                : toast.type === 'warning'
                ? 'bg-white border-amber-200 text-navy-900'
                : 'bg-white border-blue-200 text-navy-900'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-brand-600" />}
            </div>
            <div className="flex-1 text-sm">
              {toast.title && <h4 className="font-semibold text-navy-900">{toast.title}</h4>}
              <p className="text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
