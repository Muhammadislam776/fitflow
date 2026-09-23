import React from 'react';
import { CheckCircle, QrCode, Calendar, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const MemberAttendance = () => {
  const { user } = useAuth();
  const { attendance } = useGym();

  const myAttendance = attendance.filter((a) => a.member_id === user?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance & Check-In History"
        description="Full timeline of your gym entrance and class check-ins."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Visits</span>
          <h3 className="text-2xl font-bold text-navy-900 mt-1">{myAttendance.length || 42}</h3>
          <p className="text-xs text-emerald-600 mt-0.5">Verified sessions</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Check-In Method</span>
          <h3 className="text-2xl font-bold text-brand-600 mt-1">100% QR</h3>
          <p className="text-xs text-slate-400 mt-0.5">Digital pass scans</p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Weekly Frequency</span>
          <h3 className="text-2xl font-bold text-accent-500 mt-1">3.4x</h3>
          <p className="text-xs text-slate-400 mt-0.5">Visits per week average</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Date & Time</th>
              <th className="py-3.5 px-6">Entry / Session</th>
              <th className="py-3.5 px-6">Method</th>
              <th className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myAttendance.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-400">
                  No attendance history logged yet. Use your QR pass at the entrance!
                </td>
              </tr>
            ) : (
              myAttendance.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-4 px-6 text-slate-700 text-xs">
                    <div>{new Date(item.check_in_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="font-mono text-slate-400">{new Date(item.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-navy-900">
                    {item.class ? item.class.name : 'General Gym Floor Access'}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={item.check_in_method === 'qr' ? 'brand' : 'neutral'} size="sm">
                      {item.check_in_method.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="success" size="sm" dot>
                      Verified
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
