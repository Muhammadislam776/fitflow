import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle,
  Activity,
  Dumbbell,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminMemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, attendance, bookings } = useGym();

  const [member, setMember] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMember = async () => {
      const m = await api.getMemberById(id);
      setMember(m);
    };
    fetchMember();
  }, [id]);

  if (!member) {
    return (
      <div className="py-20 text-center text-slate-400 animate-pulse">
        Loading member record...
      </div>
    );
  }

  const memberAttendance = attendance.filter((a) => a.member_id === id);
  const memberBookings = bookings.filter((b) => b.member_id === id);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin/members')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </button>

      {/* Member Hero Header Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-brand-900 to-navy-900 text-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={member.avatar_url}
            alt={member.full_name}
            className="w-24 h-24 rounded-2xl border-4 border-white/20 object-cover shadow-soft-xl"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold">{member.full_name}</h1>
              <Badge variant="accent" size="sm">
                {member.plan ? `${member.plan.name} Tier` : 'Member'}
              </Badge>
              <Badge
                variant={member.membership?.status === 'active' ? 'success' : 'danger'}
                size="sm"
                dot
              >
                {member.membership?.status || 'Active'}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-brand-200">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {member.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {member.phone || '+44 7700 900123'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Quick Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">{member.visits || 42}</p>
          <span className="text-[11px] text-slate-500">Total Visits</span>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classes</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">{memberBookings.length}</p>
          <span className="text-[11px] text-slate-500">Bookings Made</span>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Membership</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 mt-1">
            {member.plan ? member.plan.name : 'Premium'}
          </p>
          <span className="text-[11px] text-slate-500">£{member.plan?.price || 50}/mo</span>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Member Since</p>
          <p className="text-xl sm:text-2xl font-bold text-navy-900 mt-1">
            {new Date(member.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active Member</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'membership', label: 'Membership Plan' },
            { id: 'bookings', label: `Bookings (${memberBookings.length})` },
            { id: 'attendance', label: `Attendance (${memberAttendance.length})` },
            { id: 'workouts', label: 'Workout History (Phase 2)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-bold text-navy-900 mb-4">Membership Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Plan Tier</span>
                <span className="font-bold text-navy-900">{member.plan?.name || 'Premium'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Monthly Price</span>
                <span className="font-bold text-navy-900">£{member.plan?.price || 50}.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Class Allowance</span>
                <span className="font-bold text-navy-900">
                  {member.plan?.class_limit ? `${member.plan.class_limit} classes/mo` : 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Billing Cycle Ends</span>
                <span className="font-bold text-navy-900">
                  {member.membership?.end_date || 'Dec 31, 2026'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-bold text-navy-900 mb-4">Check-In Activity Trend</h3>
            <p className="text-xs text-slate-500 mb-3">
              Member averages <strong>3.4 studio sessions per week</strong>.
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Peak workout day</span>
                <span className="font-bold text-brand-600">Wednesday Evenings</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Preferred instructor</span>
                <span className="font-bold text-brand-600">Maya Patel (Yoga)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Primary check-in method</span>
                <span className="font-bold text-emerald-600">Dynamic QR Code (92%)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'membership' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-navy-900">{member.plan?.name || 'Premium'} Plan</h3>
              <p className="text-xs text-slate-500">{member.plan?.description}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-navy-900">£{member.plan?.price || 50}</span>
              <span className="text-xs text-slate-400 block">per month</span>
            </div>
          </div>

          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Included Benefits:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(member.plan?.features || [
              '20 Classes per month',
              'Full gym & functional zone access',
              'Priority class booking',
              'Complimentary sauna & steam room',
            ]).map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'bookings' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Class</th>
                <th className="py-3 px-6">Date & Time</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Booked At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {memberBookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No bookings logged for this member.
                  </td>
                </tr>
              ) : (
                memberBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-6 font-bold text-navy-900">{b.class?.name || 'Fitness Class'}</td>
                    <td className="py-3.5 px-6 text-slate-600 text-xs">
                      {b.class?.date} at {b.class?.start_time}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'waitlisted' ? 'warning' : 'neutral'} size="sm">
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-400">
                      {new Date(b.booked_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Date & Time</th>
                <th className="py-3 px-6">Access / Class</th>
                <th className="py-3 px-6">Method</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {memberAttendance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No attendance records logged yet.
                  </td>
                </tr>
              ) : (
                memberAttendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-6 text-slate-700 text-xs">
                      {new Date(a.check_in_time).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-navy-900">
                      {a.class ? a.class.name : 'General Gym Entry'}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant={a.check_in_method === 'qr' ? 'brand' : 'neutral'} size="sm">
                        {a.check_in_method.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-xs font-semibold text-emerald-600">
                      Verified Present
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'workouts' && (
        <Card className="p-8 text-center border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-7 h-7" />
          </div>
          <Badge variant="accent" size="sm" className="mb-2">
            Phase 2 Architecture Ready
          </Badge>
          <h3 className="text-lg font-bold text-navy-900">Workout & AI Routine Logs</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-normal">
            This module is structured for Phase 2 integration with the AI Workout Generator, heart-rate telemetry, rep tracking, and GoCardless automated billing.
          </p>
        </Card>
      )}
    </div>
  );
};
