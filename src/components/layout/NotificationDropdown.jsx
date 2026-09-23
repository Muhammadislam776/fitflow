import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Sparkles, AlertCircle, Info, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const notifs = await api.getNotifications(user.id);
        setNotifications(notifs);
      }
    };
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'class':
        return <Calendar className="w-4 h-4 text-brand-500" />;
      default:
        return <Info className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-xl border border-slate-200/90 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-navy-900">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                    !n.read ? 'bg-brand-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy-900 leading-snug">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-slate-400 hover:text-brand-600 p-1"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
