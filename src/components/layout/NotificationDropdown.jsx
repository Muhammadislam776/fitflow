import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  AlertCircle,
  Info,
  Calendar,
  Trash2,
  Zap,
  Award,
  ShieldCheck,
  Clock,
  X,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const notifs = await api.getNotifications(user?.id);
      setNotifications(notifs || []);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 6000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close dropdown
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

  const handleMarkRead = async (id, e) => {
    e?.stopPropagation();
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead(user?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    await api.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Quick live demo alert trigger
  const handleSimulateAlert = async () => {
    const sampleAlerts = [
      {
        type: 'success',
        title: 'Instant QR Pass Scanned! ✅',
        message: 'Athlete verified turnstile entrance for Powerlifting Clinic.',
      },
      {
        type: 'class',
        title: 'New Class Booking! 🎟️',
        message: 'Marcus Chen booked Sunrise Vinyasa Yoga (Slot #16).',
      },
      {
        type: 'warning',
        title: 'Class Capacity Alert! ⚡',
        message: 'High-Octane HIIT is now 95% full (1 spot left).',
      },
    ];
    const alert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    const created = await api.createNotification(alert);
    setNotifications((prev) => [created, ...prev]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case 'class':
        return (
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/80 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'milestone':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none cursor-pointer border border-transparent hover:border-slate-200"
        title="Live Studio Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r from-accent-500 to-rose-500 text-[10px] font-black text-white ring-2 ring-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-white/10 text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold tracking-tight">Studio Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-500 text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-light">Real-time alerts & arrival logs</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 hover:underline transition-all cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-accent-400" />
                <span className="text-[11px]">Mark Read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTab === 'unread'
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <button
              onClick={handleSimulateAlert}
              className="text-[10px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Simulate incoming real-time alert"
            >
              <Zap className="w-3 h-3 text-brand-600" />
              <span>+ Send Test</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-88 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <h5 className="text-sm font-bold text-navy-900">All caught up!</h5>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {activeTab === 'unread'
                    ? 'No unread notifications left to review.'
                    : 'No notifications recorded yet today.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                    !n.read
                      ? 'bg-brand-50/40 hover:bg-brand-50/70'
                      : 'hover:bg-slate-50 bg-white'
                  }`}
                >
                  {getNotificationIcon(n.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${!n.read ? 'text-navy-900' : 'text-slate-700'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(n.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                      {n.message}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      {!n.read && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                          Unread
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button
                        onClick={(e) => handleMarkRead(n.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-200/60 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(n.id, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400">
              Synced with Supabase Cloud Realtime
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
