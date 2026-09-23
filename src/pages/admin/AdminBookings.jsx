import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';

export const AdminBookings = () => {
  const { bookings, cancelBooking, classes } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (bookingId) => {
    if (confirm('Cancel this booking? If there is a waitlist, the next member will be automatically promoted.')) {
      setCancellingId(bookingId);
      try {
        await cancelBooking(bookingId);
      } finally {
        setCancellingId(null);
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.member?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.class?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Bookings & Waitlist"
        description="Monitor confirmed attendees, track waitlist queues, and manage class registrations."
      />

      {/* Filter and Stats Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search member or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['all', 'confirmed', 'waitlisted', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Member</th>
                <th className="py-3.5 px-6">Class Session</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Booking Status</th>
                <th className="py-3.5 px-6">Booked Timestamp</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            b.member?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.member?.full_name}`
                          }
                          alt={b.member?.full_name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-soft-sm"
                        />
                        <div>
                          <p className="font-bold text-navy-900 leading-tight">
                            {b.member?.full_name}
                          </p>
                          <p className="text-xs text-slate-400">{b.member?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-navy-900">
                      {b.class?.name || 'Session'}
                    </td>

                    <td className="py-4 px-6 text-slate-600 text-xs">
                      <div>{b.class?.date || 'Today'}</div>
                      <div className="text-slate-400 font-mono">{b.class?.start_time}</div>
                    </td>

                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          b.status === 'confirmed'
                            ? 'success'
                            : b.status === 'waitlisted'
                            ? 'warning'
                            : 'neutral'
                        }
                        dot={true}
                      >
                        {b.status === 'waitlisted' ? 'Waitlist' : b.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(b.booked_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {b.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50"
                          onClick={() => handleCancel(b.id)}
                          isLoading={cancellingId === b.id}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
