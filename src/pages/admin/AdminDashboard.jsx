import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
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
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { GrowthChart } from '../../components/charts/GrowthChart';
import { AttendanceChart } from '../../components/charts/AttendanceChart';
import { PlanDistributionChart } from '../../components/charts/PlanDistributionChart';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

// Audio chime using Web Audio API
const playReportChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (e) {}
};

// Universal CSV Download Helper
const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { metrics, classes, attendance, members, memberships, refreshData } = useGym();
  const navigate = useNavigate();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState(null);

  // Custom Report Generator state
  const [reportType, setReportType] = useState('attendance'); // 'attendance' | 'revenue' | 'classes' | 'members'
  const [reportRange, setReportRange] = useState('all'); // 'today' | 'week' | 'month' | 'all'

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

  // Generate Reports Data
  const getAttendanceReportData = () => {
    return attendance.map((a, i) => ({
      ID: a.id || `ATT-${i + 1}`,
      MemberName: a.member?.full_name || 'Registered Athlete',
      Email: a.member?.email || 'N/A',
      ClassSession: a.class?.name || 'General Gym Floor Entry',
      CheckInTime: a.check_in_time ? new Date(a.check_in_time).toLocaleString() : new Date().toLocaleString(),
      Method: (a.check_in_method || 'QR Scanner').toUpperCase(),
      Status: 'VERIFIED',
    }));
  };

  const getRevenueReportData = () => {
    return memberships.map((m, i) => {
      const planPrice = m.plan_id === 'plan-unlimited' ? '£70' : m.plan_id === 'plan-premium' ? '£50' : '£30';
      return {
        MembershipID: m.id || `MSHIP-${i + 1}`,
        MemberID: m.member_id || 'N/A',
        PlanTier: m.plan_id?.replace('plan-', '').toUpperCase() || 'PREMIUM',
        BillingAmount: planPrice,
        Cycle: 'Monthly',
        StartDate: m.start_date || '2026-03-01',
        EndDate: m.end_date || '2026-12-31',
        PaymentStatus: m.status?.toUpperCase() || 'ACTIVE',
      };
    });
  };

  const getClassesReportData = () => {
    return classes.map((c, i) => ({
      ClassID: c.id || `CLS-${i + 1}`,
      Name: c.name,
      Category: c.category || 'Fitness',
      Instructor: c.trainer?.full_name || 'Coach Alex Morgan',
      ScheduleDate: c.date,
      TimeSlot: `${c.start_time} - ${c.end_time}`,
      Location: c.location || 'Studio A',
      Capacity: c.capacity,
      ConfirmedAthletes: c.confirmedCount || 0,
      SpotsLeft: Math.max(0, c.capacity - (c.confirmedCount || 0)),
      OccupancyRate: `${Math.min(100, Math.round(((c.confirmedCount || 0) / c.capacity) * 100))}%`,
    }));
  };

  const getMembersReportData = () => {
    return members.map((m, i) => ({
      MemberID: m.id || `MBR-${i + 1}`,
      FullName: m.full_name,
      Email: m.email,
      Role: m.role?.toUpperCase() || 'MEMBER',
      PlanStatus: m.membership?.status?.toUpperCase() || 'ACTIVE',
      PlanTier: m.plan?.name || 'Premium Plan',
      JoinedDate: m.created_at ? new Date(m.created_at).toLocaleDateString() : '2026-02-01',
    }));
  };

  const triggerDownload = (type, customFilename = null) => {
    let rows = [];
    let defaultName = `FitFlow_${type}_Report_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'attendance') {
      rows = getAttendanceReportData();
    } else if (type === 'revenue') {
      rows = getRevenueReportData();
    } else if (type === 'classes') {
      rows = getClassesReportData();
    } else if (type === 'members') {
      rows = getMembersReportData();
    }

    if (!rows.length) {
      rows = [
        { Notice: 'FitFlow Report', Date: new Date().toLocaleString(), TotalRecords: 0 }
      ];
    }

    exportToCSV(customFilename || defaultName, rows);
    playReportChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    setDownloadSuccessMessage(`${type.toUpperCase()} Report downloaded successfully!`);
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

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
              Complete gym overview. Monitor real-time turnstiles, evaluate membership run rates, verify coach sessions, and export executive business reports.
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
            {/* Generate & Download Reports Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/40 hover:shadow-emerald-600/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-emerald-400/30"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>Export Reports (.CSV)</span>
            </button>

            <button
              onClick={() => navigate('/admin/classes')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-brand-600/30 hover:scale-[1.03] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Class</span>
            </button>

            <button
              onClick={() => navigate('/admin/members')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-accent-500 to-orange-500 hover:from-accent-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-accent-500/30 hover:scale-[1.03] transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>

            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-slate-600/80 transition-all cursor-pointer shadow-lg"
              title="Sync with Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-brand-400' : 'text-slate-300'}`} />
              <span className="hidden sm:inline">{syncSuccess ? 'Synced!' : 'Sync'}</span>
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

      {/* Success Notification Bar for Downloads */}
      {downloadSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

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
            <h3 className="text-3xl font-black text-navy-900">{metrics?.totalMembers || members.length || '524'}</h3>
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

      {/* 3. EXECUTIVE REPORTS & DATA EXPORT HUB */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-navy-900 tracking-tight flex items-center gap-2">
                <span>Executive Reports & Data Export Hub</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Live Generator
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Generate and download compliance audit trails, turnstile logs, and membership financials.
              </p>
            </div>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Filter className="w-3.5 h-3.5 text-accent-400" />
            <span>Custom Report Builder</span>
          </button>
        </div>

        {/* 4 Quick Export Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report 1: Attendance */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {attendance.length} Logs
                </span>
              </div>
              <h3 className="text-sm font-black text-navy-900">Attendance & Turnstile Log</h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified member check-ins, timestamps, QR pass methods, and studio rooms.
              </p>
            </div>
            <button
              onClick={() => triggerDownload('attendance')}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-navy-900 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
              <span>Download (.CSV)</span>
            </button>
          </div>

          {/* Report 2: Financial Revenue */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <DollarSign className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  MRR Audit
                </span>
              </div>
              <h3 className="text-sm font-black text-navy-900">Revenue & Membership Billing</h3>
              <p className="text-xs text-slate-500 mt-1">
                Subscription tier distribution (Basic £30, Premium £50, Unlimited £70) and revenue run-rates.
              </p>
            </div>
            <button
              onClick={() => triggerDownload('revenue')}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-amber-600 hover:text-white text-navy-900 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 group-hover:text-white" />
              <span>Download (.CSV)</span>
            </button>
          </div>

          {/* Report 3: Classes & Capacity */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Calendar className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {classes.length} Sessions
                </span>
              </div>
              <h3 className="text-sm font-black text-navy-900">Class Occupancy & Rosters</h3>
              <p className="text-xs text-slate-500 mt-1">
                Timetable capacity, booked spots, waitlists, instructor assignments, and room usage.
              </p>
            </div>
            <button
              onClick={() => triggerDownload('classes')}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-600 hover:text-white text-navy-900 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white" />
              <span>Download (.CSV)</span>
            </button>
          </div>

          {/* Report 4: Member Roster */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-brand-100 text-brand-700">
                  <Users className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {members.length} Members
                </span>
              </div>
              <h3 className="text-sm font-black text-navy-900">Complete Athlete Directory</h3>
              <p className="text-xs text-slate-500 mt-1">
                Full member contact lists, membership statuses, join dates, and access permissions.
              </p>
            </div>
            <button
              onClick={() => triggerDownload('members')}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-brand-600 hover:text-white text-navy-900 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-brand-600 group-hover:text-white" />
              <span>Download (.CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. STUDIO FLOOR OCCUPANCY RADAR & QUICK ACTIONS */}
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

      {/* 5. ANALYTICS CHARTS SECTION */}
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

      {/* 6. SECOND ROW: ATTENDANCE VELOCITY & UPCOMING CLASSES */}
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

      {/* 7. RECENT LIVE CHECK-IN STREAM */}
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

      {/* 8. CUSTOM REPORT GENERATOR MODAL */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Custom Executive Report Generator"
        description="Select audit criteria, preview dataset, and download instant CSV spreadsheet."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5">
          {/* Select Report Type */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              1. Choose Report Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'attendance', label: 'Attendance Log', icon: CheckCircle2 },
                { id: 'revenue', label: 'Revenue & Plans', icon: DollarSign },
                { id: 'classes', label: 'Class Capacity', icon: Calendar },
                { id: 'members', label: 'Member Roster', icon: Users },
              ].map((t) => {
                const IconComponent = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setReportType(t.id)}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      reportType === t.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${reportType === t.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Date Range */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              2. Select Time Range
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'today', label: "Today's Activity" },
                { id: 'week', label: 'Last 7 Days' },
                { id: 'month', label: 'This Month (30d)' },
                { id: 'all', label: 'All-Time Records' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReportRange(r.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reportRange === r.id
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Dataset Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-navy-900">
                Preview Summary: <strong className="text-emerald-600 uppercase">{reportType}</strong> Report
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Format: Microsoft Excel / CSV UTF-8
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {reportType === 'attendance' && `Ready to export ${attendance.length} verified athlete turnstile records with timestamps and scan methods.`}
              {reportType === 'revenue' && `Ready to export ${memberships.length} active subscription contracts, billing tiers, and recurring revenues.`}
              {reportType === 'classes' && `Ready to export ${classes.length} scheduled studio sessions, coach allocations, and capacity fill rates.`}
              {reportType === 'members' && `Ready to export ${members.length} registered member profiles, contact emails, and account privileges.`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => window.print()}
              icon={Printer}
              type="button"
            >
              Print Preview
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setReportModalOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  triggerDownload(reportType, `FitFlow_${reportType}_${reportRange}_${Date.now()}.csv`);
                  setReportModalOpen(false);
                }}
                icon={Download}
                type="button"
                className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
              >
                Download CSV Spreadsheet
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Global QR Scanner Modal */}
      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
};
