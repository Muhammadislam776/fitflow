import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, QrCode, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const Navbar = ({ onOpenSidebar, onOpenScanner }) => {
  const { user, role, logout } = useAuth();
  const { gym } = useGym();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

      {/* Right: Authenticated Role Badge & User Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Strictly display verified role badge - No switching allowed! */}
        {role && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase hidden md:inline">
              Portal:
            </span>
            <Badge
              variant={role === 'admin' ? 'brand' : role === 'trainer' ? 'neutral' : 'accent'}
              size="md"
              dot
            >
              {role.toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Quick Action according to authorized role */}
        {role === 'admin' || role === 'trainer' ? (
          <Button
            variant="accent"
            size="sm"
            onClick={onOpenScanner}
            icon={QrCode}
            className="hidden sm:inline-flex"
          >
            Scan Pass
          </Button>
        ) : role === 'member' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/member/qr')}
            icon={QrCode}
            className="hidden sm:inline-flex"
          >
            My QR Pass
          </Button>
        ) : null}

        {/* Notifications */}
        <NotificationDropdown />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
