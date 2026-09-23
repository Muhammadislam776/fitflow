import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Sparkles,
  ArrowRight,
  Hourglass,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const MemberBookings = () => {
  const { user } = useAuth();
  const { bookings, classes, cancelBooking } = useGym();
  const [cancellingId, setCancellingId] = useState(null);

  const userBookings = bookings.filter((b) => b.member_id === user?.id);

  const activeBookings = userBookings.filter((b) =>
    ['confirmed', 'waitlisted'].includes(b.status)
  );
  const pastBookings = userBookings.filter((b) =>
    ['cancelled', 'attended'].includes(b.status)
  );

  const handleCancel = async (bookingId) => {
    if (confirm('Cancel this booking? If this spot is confirmed, the next waitlisted member will receive it.')) {
      setCancellingId(bookingId);
      try {
        await cancelBooking(bookingId);
      } finally {
        setCancellingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings & Reservations"
        description="View your confirmed workout sessions and monitor live waitlist positions."
        action={
          <Button
            variant="accent"
            icon={Calendar}
            to="/member/classes"
            onClick={() => window.location.assign('/member/classes')}
          >
            Browse Schedule
          </Button>
        }
      />

      {/* Active Bookings Section */}
      <div>
        <h2 className="text-base font-bold text-navy-900 mb-3 flex items-center gap-2">
          <span>Active Bookings</span>
          <Badge variant="brand" size="sm">
            {activeBookings.length} Scheduled
          </Badge>
        </h2>

        {activeBookings.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="No upcoming classes booked"
            description="Browse our timetable and reserve your spot in today's or tomorrow's classes."
            actionLabel="Browse Classes"
            onAction={() => window.location.assign('/member/classes')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => {
              const classItem = classes.find((c) => c.id === b.class_id) || b.class;
              const isConfirmed = b.status === 'confirmed';

              return (
                <Card
                  key={b.id}
                  className={`p-5 flex flex-col justify-between border-2 ${
                    isConfirmed
                      ? 'border-emerald-500/80 bg-emerald-50/10'
                      : 'border-amber-400 bg-amber-50/10'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant={isConfirmed ? 'success' : 'warning'}
                        size="sm"
                        dot
                      >
                        {isConfirmed ? 'Spot Confirmed' : 'Waitlisted (Position #1)'}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-500">
                        {classItem?.date || 'Scheduled'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy-900 mt-1">{classItem?.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {classItem?.description}
                    </p>

                    <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Time:
                        </span>
                        <strong className="text-navy-900 font-mono">
                          {classItem?.start_time} - {classItem?.end_time}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Studio:
                        </span>
                        <strong className="text-navy-900">{classItem?.location}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Booked {new Date(b.booked_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      onClick={() => handleCancel(b.id)}
                      isLoading={cancellingId === b.id}
                      icon={XCircle}
                    >
                      Cancel Reservation
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past / Cancelled History */}
      {pastBookings.length > 0 && (
        <div className="pt-6">
          <h2 className="text-base font-bold text-navy-900 mb-3">Past History</h2>
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Class</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3.5 px-6 font-semibold text-navy-900">
                      {b.class?.name || 'Workout Class'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">
                      {b.class?.date || 'Past date'}
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge variant="neutral" size="sm">
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
};
