import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  CreditCard,
  QrCode,
  Flame,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const { classes, bookings, attendance, plans } = useGym();
  const navigate = useNavigate();

  const firstName = user?.full_name?.split(' ')[0] || 'Member';

  // Get user's active bookings
  const myBookings = bookings.filter(
    (b) => b.member_id === user?.id && ['confirmed', 'waitlisted'].includes(b.status)
  );

  // Next upcoming class
  const nextBooking = myBookings[0] || null;
  const nextClass = nextBooking
    ? classes.find((c) => c.id === nextBooking.class_id)
    : classes[0];

  const myVisitsCount = attendance.filter((a) => a.member_id === user?.id).length || 42;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ready for your next workout? Keep pushing toward your fitness milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="accent"
            icon={QrCode}
            onClick={() => navigate('/member/qr')}
          >
            My Check-In Pass
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Membership</span>
            <CreditCard className="w-5 h-5 text-brand-600" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mt-3">Premium Tier</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">✓ Active until Dec 31, 2026</p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600" />
        </Card>

        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Attendance</span>
            <CheckCircle className="w-5 h-5 text-accent-500" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mt-3">{myVisitsCount} Visits</h3>
          <p className="text-xs text-slate-400 mt-1">Total verified gym check-ins</p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent-500" />
        </Card>

        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Classes Taken</span>
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mt-3">31 Sessions</h3>
          <p className="text-xs text-slate-400 mt-1">Completed studio workouts</p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
        </Card>

        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Workout Streak</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mt-3">7 Days Fire</h3>
          <p className="text-xs text-amber-600 font-semibold mt-1">🔥 Personal best streak</p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        </Card>
      </div>

      {/* Center Row: Next Class Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Class Spotlight Card */}
        <Card className="lg:col-span-2 p-6 sm:p-8 bg-gradient-to-br from-brand-900 via-brand-800 to-navy-900 text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="accent" size="sm" className="bg-white/10 text-accent-300 border-accent-400/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {nextBooking ? 'Your Confirmed Session' : 'Recommended Next Session'}
            </Badge>
            <span className="text-xs text-brand-200 font-medium">Today</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            {nextClass?.name || 'Sunrise Vinyasa Yoga'}
          </h2>
          <p className="text-xs sm:text-sm text-brand-200 mt-2 max-w-xl line-clamp-2">
            {nextClass?.description || 'Dynamic fluid movements, breathing sequences, and core stabilization.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-brand-100 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-4 h-4 text-accent-400" />
              {nextClass?.start_time} - {nextClass?.end_time}
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-4 h-4 text-accent-400" />
              {nextClass?.location}
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Users className="w-4 h-4 text-accent-400" />
              {nextClass?.confirmedCount || 18} / {nextClass?.capacity || 20} booked
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button
              variant="accent"
              onClick={() => navigate('/member/classes')}
              icon={ArrowRight}
            >
              Browse All Classes
            </Button>
            {nextBooking && (
              <Button
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                onClick={() => navigate('/member/bookings')}
              >
                Manage My Spot
              </Button>
            )}
          </div>
        </Card>

        {/* Quick Actions Shortcuts */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-900 mb-4">Quick Shortcuts</h3>
            <div className="space-y-3">
              <Link
                to="/member/classes"
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-brand-50 hover:border-brand-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900 group-hover:text-brand-700">
                      Book a Class
                    </p>
                    <p className="text-[11px] text-slate-400">View live timetable</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/member/qr"
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-accent-50 hover:border-accent-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900 group-hover:text-accent-700">
                      My QR Code
                    </p>
                    <p className="text-[11px] text-slate-400">Studio check-in pass</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent-600 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/member/membership"
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-navy-800 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900">My Membership</p>
                    <p className="text-[11px] text-slate-400">Plan perks & renewal</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/member/attendance"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              View complete visit history <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
