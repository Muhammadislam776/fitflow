import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const { metrics, classes, attendance, members } = useGym();
  const [scannerOpen, setScannerOpen] = useState(false);

  const greetingName = user?.full_name?.split(' ')[0] || 'Admin';

  const upcomingToday = classes.slice(0, 4);
  const recentCheckins = attendance.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900">
              Good Morning, {greetingName} 👋
            </h1>
            <Badge variant="accent" size="sm">
              Live Studio
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening at your gym today. All systems operating at peak performance.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            icon={QrCode}
            onClick={() => setScannerOpen(true)}
          >
            Launch QR Scanner
          </Button>
          <Button
            variant="accent"
            icon={Plus}
            to="/admin/classes"
            onClick={() => window.location.assign('/admin/classes')}
          >
            Create Class
          </Button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Members"
          value={metrics?.totalMembers || '524'}
          icon={Users}
          trend="+12.4%"
          trendLabel="vs last month"
          iconBg="bg-brand-50 text-brand-600"
        />
        <StatCard
          title="Active Memberships"
          value={metrics?.activeMembers || '431'}
          icon={CreditCard}
          trend="+8.2%"
          trendLabel="vs last month"
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Today's Check-ins"
          value={metrics?.todayCheckins || '126'}
          icon={CheckCircle2}
          trend="+15.1%"
          trendLabel="vs yesterday"
          accent={true}
        />
        <StatCard
          title="Today's Classes"
          value={metrics?.todayClasses || '8'}
          icon={Calendar}
          trend="4 Upcoming"
          trendLabel="afternoon schedule"
          iconBg="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Growth Line Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Membership Growth</h3>
              <p className="text-xs text-slate-500">Net active member enrollment over past 6 months</p>
            </div>
            <Badge variant="brand" size="sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              +24% YoY
            </Badge>
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

      {/* Second Row: Attendance Bar Chart & Live Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Bar Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Weekly Attendance Velocity</h3>
              <p className="text-xs text-slate-500">Daily check-in volume across peak workout hours</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Peak: Friday 184</span>
          </div>
          {metrics?.attendanceData && <AttendanceChart data={metrics.attendanceData} />}
        </Card>

        {/* Live Upcoming Classes with Visual Capacity Bars */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-900">Today's Class Roster</h3>
              <p className="text-xs text-slate-500">Live booking capacity</p>
            </div>
            <Link
              to="/admin/classes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingToday.map((c) => {
              const fillPercentage = Math.min(100, Math.round((c.confirmedCount / c.capacity) * 100));
              const isFull = c.isFull || fillPercentage >= 100;

              return (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-navy-900">{c.name}</span>
                    <span className="text-xs font-semibold text-brand-700">{c.start_time}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{c.location}</span>
                    </div>
                    <div>
                      {isFull ? (
                        <span className="font-bold text-rose-600">FULL ({c.capacity}/{c.capacity})</span>
                      ) : (
                        <span className="font-medium text-navy-800">
                          {c.confirmedCount} / {c.capacity} booked
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

      {/* Third Row: Recent Live Check-Ins */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-navy-900">Recent Member Check-Ins</h3>
            <p className="text-xs text-slate-500">Live feed from turnstiles and class scanners</p>
          </div>
          <Link
            to="/admin/attendance"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All attendance logs <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentCheckins.map((entry) => (
            <div key={entry.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={entry.member?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.member?.full_name}`}
                  alt={entry.member?.full_name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-sm font-bold text-navy-900 leading-tight">
                    {entry.member?.full_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {entry.class ? entry.class.name : 'General Gym Access'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <Badge variant={entry.check_in_method === 'qr' ? 'brand' : 'neutral'} size="sm">
                  {entry.check_in_method.toUpperCase()}
                </Badge>
                <div className="text-xs font-medium text-slate-500">
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
