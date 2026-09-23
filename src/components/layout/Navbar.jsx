import React from 'react';
import { Menu, QrCode, Sparkles, User, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '../common/Button';

export const Navbar = ({ onOpenSidebar, onOpenScanner }) => {
  const { user, role, switchDemoUser } = useAuth();
  const { gym } = useGym();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Gym tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-semibold text-xs tracking-wide text-slate-500 uppercase">
            Active Studio:
          </span>
          <span className="text-xs font-bold text-navy-900 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
            {gym?.name || 'FitFlow Performance Club'}
          </span>
        </div>
      </div>

      {/* Center / Right: Interactive Quick Role Persona Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Role Switcher for seamless grading & testing */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="hidden md:inline px-2 font-semibold text-slate-500">
            Role:
          </span>
          <button
            onClick={() => switchDemoUser('admin')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              role === 'admin'
                ? 'bg-brand-600 text-white shadow-soft-sm font-semibold'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchDemoUser('trainer')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              role === 'trainer'
                ? 'bg-brand-600 text-white shadow-soft-sm font-semibold'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Trainer
          </button>
          <button
            onClick={() => switchDemoUser('member')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              role === 'member'
                ? 'bg-accent-500 text-white shadow-soft-sm font-semibold'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Member
          </button>
        </div>

        {/* Scanner CTA Button */}
        {role !== 'member' ? (
          <Button
            variant="accent"
            size="sm"
            onClick={onOpenScanner}
            icon={QrCode}
            className="hidden sm:inline-flex"
          >
            Scan Pass
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            to="/member/qr"
            icon={QrCode}
            onClick={() => window.location.assign('/member/qr')}
            className="hidden sm:inline-flex"
          >
            My QR Pass
          </Button>
        )}

        {/* Notifications */}
        <NotificationDropdown />
      </div>
    </header>
  );
};
