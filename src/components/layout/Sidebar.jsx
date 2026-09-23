import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  BookmarkCheck,
  CheckCircle,
  UserCog,
  Settings,
  QrCode,
  User,
  LogOut,
  Dumbbell,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Memberships', path: '/admin/memberships', icon: CreditCard },
    { name: 'Classes', path: '/admin/classes', icon: Calendar },
    { name: 'Bookings', path: '/admin/bookings', icon: BookmarkCheck },
    { name: 'Attendance', path: '/admin/attendance', icon: CheckCircle },
    { name: 'Staff & Trainers', path: '/admin/staff', icon: UserCog },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const trainerNavItems = [
    { name: 'Dashboard', path: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Classes', path: '/trainer/classes', icon: Calendar },
    { name: 'Members & Roster', path: '/trainer/members', icon: Users },
    { name: 'Attendance & Scanner', path: '/trainer/attendance', icon: CheckCircle },
  ];

  const memberNavItems = [
    { name: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
    { name: 'Browse Classes', path: '/member/classes', icon: Calendar },
    { name: 'My Bookings', path: '/member/bookings', icon: BookmarkCheck },
    { name: 'My Membership', path: '/member/membership', icon: CreditCard },
    { name: 'My Check-In QR', path: '/member/qr', icon: QrCode, badge: 'Pass' },
    { name: 'Attendance Log', path: '/member/attendance', icon: CheckCircle },
    { name: 'Profile Settings', path: '/member/profile', icon: User },
  ];

  const navItems =
    role === 'admin'
      ? adminNavItems
      : role === 'trainer'
      ? trainerNavItems
      : memberNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-soft">
                <Dumbbell className="w-5 h-5 text-accent-400 rotate-[-25deg]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-navy-900 leading-none">
                  FIT<span className="text-accent-500">FLOW</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                  Gym Platform
                </span>
              </div>
            </NavLink>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-navy-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <div className="px-3 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {role === 'admin' ? 'Gym Management' : role === 'trainer' ? 'Staff Portal' : 'Member Portal'}
              </span>
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-soft-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-inherit" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="accent" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`}
                alt={user?.full_name}
                className="w-9 h-9 rounded-lg border border-slate-200 object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-navy-900 truncate leading-tight">
                  {user?.full_name || 'Muhammad Islam'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      role === 'admin'
                        ? 'bg-accent-500'
                        : role === 'trainer'
                        ? 'bg-brand-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    {role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
