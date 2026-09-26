import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  CheckCircle2,
  Calendar,
  Plus,
  QrCode,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Sparkles,
  Flame,
  Zap,
  Activity,
  ShieldCheck,
  RefreshCw,
  Award,
  DollarSign,
  UserPlus,
  ChevronRight,
  Eye,
  Sliders,
  Layers,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { GrowthChart } from '../../components/charts/GrowthChart';
import { AttendanceChart } from '../../components/charts/AttendanceChart';
import { PlanDistributionChart } from '../../components/charts/PlanDistributionChart';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { metrics, classes, attendance, members, refreshData } = useGym();
  const navigate = useNavigate();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('monthly'); // 'weekly' | 'monthly' | 'quarterly'

  const greetingName = user?.full_name?.split(' ')[0] || 'Admin';

  const upcomingToday = classes.slice(0, 4);
  const recentCheckins = attendance.slice(0, 6);

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      if (refreshData) await refreshData();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Studio Zones Capacity Data
  const studioZones = [
    { name: 'Main Gym Floor (Free Weights & Machines)', current: 38, capacity: 45, color: 'bg-emerald-500' },
    { name: 'Studio A (Zen & Mobility Room)', current: 18, capacity: 20, color: 'bg-indigo-500' },
    { name: 'Studio B (Turf & Functional Rig)', current: 14, capacity: 15, color: 'bg-amber-500' },
    { name: 'Recovery Suite (Sauna & Ice Baths)', current: 6, capacity: 10, color: 'bg-cyan-500' },
  ];

  // Coach Leaderboard
  const topCoaches = [
    {
      name: 'Alex Morgan',
      role: 'Master Strength Coach',
      classesToday: 2,
      hours: '22.5 hrs/wk',
      rating: '4.98 ★',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Maya Patel',
      role: 'Yoga & Mobility Director',
      classesToday: 2,
      hours: '19.0 hrs/wk',
      rating: '4.95 ★',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Marcus Chen',
      role: 'Head HIIT & Conditioning',
      classesToday: 3,
      hours: '24.0 hrs/wk',
      rating: '4.97 ★',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. EXECUTIVE COMMAND CENTER HERO SPOTLIGHT BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-[#080d1a] bg-gradient-to-br from-[#060a15] via-[#0d1527] to-[#171f38] text-white p-6 sm:p-8 shadow-2xl border border-slate-700/60">
        {/* Background photo overlay */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a15]/95 via-[#0d1527]/85 to-[#060a15]/90 pointer-events-none" />

        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Studio Operational
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Executive Tier Access
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md text-white">
              Command Center — <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-accent-300">{greetingName}</span> ⚡
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
              Complete gym overview. Monitor real-time turnstiles, evaluate membership run rates, verify coach sessions, and track facility occupancy.
            </p>

            {/* Quick KPI Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="font-black text-amber-300 text-sm">£2,450.00</span>
                <span className="text-slate-300 font-medium">Today's Revenue (+14%)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="font-black text-emerald-300 text-sm">84% Peak</span>
                <span className="text-slate-300 font-medium">Floor Occupancy</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="font-black text-accent-400 text-sm">99.98%</span>
                <span className="text-slate-300 font-medium">Turnstile Uptime</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setScannerOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent-500 to-orange-500 text-white font-black text-sm shadow-xl shadow-accent-500/40 hover:shadow-accent-500/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-accent-400/30"
            >
              <QrCode className="w-5 h-5 animate-pulse" />
              <span>Launch QR Scanner</span>
            </button>

            <button
              onClick={() => navigate('/admin/classes')}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-600/30 hover:scale-105 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Class</span>
            </button>

            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-sm font-bold backdrop-blur-md border border-slate-600/80 transition-all cursor-pointer shadow-lg"
              title="Sync with Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-brand-400' : 'text-slate-300'}`} />
              <span className="hidden sm:inline">{syncSuccess ? 'Synced!' : 'Cloud Sync'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Connection Status Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-emerald-300 font-bold">Supabase Realtime Cloud Connected</span>
            <span className="text-slate-400">• Latency 18ms</span>
          </div>
          <span className="text-slate-300 font-medium">
            Active Facility: <strong className="text-white font-bold">FitFlow Downtown Studio 1 & Performance Rig</strong>
          </span>
        </div>
      </div>

      {/* 2. TOP METRIC STAT CARDS WITH GLOW GRADIENTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Enrolled Members</span>
            <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-navy-900">{metrics?.totalMembers || '524'}</h3>
            <p className="mt-1 text-xs text-brand-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs last month</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-indigo-500" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Active Subscriptions</span>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-navy-900">{metrics?.activeMembers || '431'}</h3>
            <p className="mt-1 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.2% retention rate</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Today's Verifications</span>
            <div className="p-3 rounded-2xl bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-navy-900">{attendance.length || metrics?.todayCheckins || '126'}</h3>
            <p className="mt-1 text-xs text-accent-600 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>+15.1% vs yesterday</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-orange-400" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Scheduled Sessions</span>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-black text-navy-900">{classes.length || '8'}</h3>
            <p className="mt-1 text-xs text-indigo-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{upcomingToday.length} live upcoming today</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>
      </div>

      {/* 3. STUDIO FLOOR OCCUPANCY RADAR & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Zone Occupancy Radar */}
        <div className="lg:col-span-8 rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Studio Floor Real-Time Occupancy</h3>
                <p className="text-xs text-slate-500">Live athlete headcounts across facility zones</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ● Live Radar
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {studioZones.map((zone, idx) => {
              const percent = Math.round((zone.current / zone.capacity) * 100);
              return (
                <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy-900">{zone.name}</span>
                    <span className="font-black text-slate-700">
                      {zone.current} / {zone.capacity} spots ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        percent >= 90 ? 'bg-rose-500' : percent >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certified Coach Leaderboard */}
        <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900">Staff Leaderboard</h3>
                  <p className="text-xs text-slate-500">Coaches active on schedule</p>
                </div>
              </div>
              <Link to="/admin/staff" className="text-xs font-bold text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {topCoaches.map((coach, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-navy-900">{coach.name}</h4>
                      <p className="text-[11px] text-slate-400">{coach.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-500">{coach.rating}</span>
                    <p className="text-[10px] text-slate-400">{coach.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={() => navigate('/admin/staff')}
              icon={UserPlus}
            >
              Add Certified Coach
            </Button>
          </div>
        </div>
      </div>

      {/* 4. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Growth Area Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Membership Growth Velocity</h3>
              <p className="text-xs text-slate-500">Net active member enrollment over past 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                +24% YoY
              </Badge>
            </div>
          </div>
          {metrics?.growthData && <GrowthChart data={metrics.growthData} />}
        </Card>

        {/* Membership Tier Distribution Donut */}
        <Card>
          <div className="mb-4">
            <h3 className="text-base font-bold text-navy-900">Plan Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of member subscriptions</p>
          </div>
          {metrics?.distributionData && <PlanDistributionChart data={metrics.distributionData} />}
        </Card>
      </div>

      {/* 5. SECOND ROW: ATTENDANCE VELOCITY & UPCOMING CLASSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Bar Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Weekly Attendance Velocity</h3>
              <p className="text-xs text-slate-500">Daily check-in volume across peak workout hours</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Peak: Friday (184 Athletes)
            </span>
          </div>
          {metrics?.attendanceData && <AttendanceChart data={metrics.attendanceData} />}
        </Card>

        {/* Live Upcoming Classes with Visual Capacity Bars */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Today's Class Roster</h3>
              <p className="text-xs text-slate-500">Live booking capacity & spots</p>
            </div>
            <Link
              to="/admin/classes"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingToday.map((c) => {
              const fillPercentage = Math.min(100, Math.round(((c.confirmedCount || 0) / (c.capacity || 20)) * 100));
              const isFull = c.isFull || fillPercentage >= 100;

              return (
                <div key={c.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-sm text-navy-900">{c.name}</span>
                    <span className="text-xs font-bold text-brand-700">{c.start_time}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.location || 'Main Gym Floor'}</span>
                    </div>
                    <div>
                      {isFull ? (
                        <span className="font-black text-rose-600">FULL ({c.capacity}/{c.capacity})</span>
                      ) : (
                        <span className="font-bold text-navy-900">
                          {c.confirmedCount || 0} / {c.capacity} booked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-rose-500'
                          : fillPercentage > 75
                          ? 'bg-accent-500'
                          : 'bg-brand-600'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 6. RECENT LIVE CHECK-IN STREAM */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">Live Turnstile Check-In Stream</h3>
              <p className="text-xs text-slate-500">Real-time attendance logs from turnstiles and class QR scanners</p>
            </div>
          </div>
          <Link
            to="/admin/attendance"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All attendance logs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentCheckins.map((entry) => (
            <div key={entry.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={entry.member?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.member?.full_name}`}
                  alt={entry.member?.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <p className="text-sm font-black text-navy-900 leading-tight">
                    {entry.member?.full_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {entry.class ? entry.class.name : 'General Gym Turnstile Entry'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <Badge variant={entry.check_in_method === 'qr' ? 'brand' : 'neutral'} size="sm">
                  {entry.check_in_method.toUpperCase()}
                </Badge>
                <div className="text-xs font-semibold text-slate-500">
                  {new Date(entry.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Global QR Scanner Modal */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
};
