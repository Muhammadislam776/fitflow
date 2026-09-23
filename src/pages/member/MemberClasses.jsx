import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  Sparkles,
  AlertCircle,
  Hourglass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';

export const MemberClasses = () => {
  const { user } = useAuth();
  const { classes, bookings, bookClass, cancelBooking, trainers } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'open' | 'waitlist'
  const [processingId, setProcessingId] = useState(null);

  const categories = ['all', 'Yoga & Mind', 'Cardio & HIIT', 'Strength', 'Conditioning', 'Pilates'];

  // User's active bookings lookup
  const userBookings = bookings.filter(
    (b) => b.member_id === user?.id && ['confirmed', 'waitlisted'].includes(b.status)
  );

  const handleBookingClick = async (classItem) => {
    setProcessingId(classItem.id);
    try {
      await bookClass(classItem.id, user.id);
    } catch (err) {
      // Handled in GymContext with toast
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelClick = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await cancelBooking(bookingId);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || (c.category && c.category === categoryFilter);

    const matchesAvailability =
      availabilityFilter === 'all'
        ? true
        : availabilityFilter === 'open'
        ? !c.isFull
        : c.isFull;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule & Booking"
        description="Reserve studio spots in advance. Real-time capacity prevents overbooking with automated waitlist queueing."
      />

      {/* Search & Filter Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search classes or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 uppercase hidden sm:inline">
              Filter:
            </span>
            {['all', 'open', 'waitlist'].map((av) => (
              <button
                key={av}
                onClick={() => setAvailabilityFilter(av)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  availabilityFilter === av
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {av === 'all' ? 'All Sessions' : av === 'open' ? 'Spots Available' : 'Full / Waitlist'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-accent-500 text-white font-semibold shadow-soft-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Disciplines' : cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((c) => {
          const userBooking = userBookings.find((b) => b.class_id === c.id);
          const isUserConfirmed = userBooking?.status === 'confirmed';
          const isUserWaitlisted = userBooking?.status === 'waitlisted';

          const fillPercentage = Math.min(100, Math.round((c.confirmedCount / c.capacity) * 100));
          const isFull = c.isFull || fillPercentage >= 100;

          return (
            <Card
              key={c.id}
              className={`flex flex-col justify-between border-2 transition-all ${
                isUserConfirmed
                  ? 'border-emerald-500/80 bg-emerald-50/10 shadow-soft-md'
                  : isUserWaitlisted
                  ? 'border-amber-400 bg-amber-50/10'
                  : 'border-slate-200/90'
              }`}
              hoverEffect
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={isUserConfirmed ? 'success' : isFull ? 'danger' : 'brand'} size="sm">
                    {c.category || 'Fitness'}
                  </Badge>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {c.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy-900 mt-1">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>

                {/* Session Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {c.start_time} - {c.end_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <img
                      src={
                        c.trainer?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.trainer?.full_name}`
                      }
                      alt={c.trainer?.full_name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-navy-900">
                      Coach {c.trainer?.full_name || 'Staff'}
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-navy-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {c.confirmedCount} / {c.capacity} spots
                    </span>
                    {isFull ? (
                      <span className="font-extrabold text-rose-600 uppercase text-[11px]">
                        FULL {c.waitlistCount > 0 ? `(${c.waitlistCount} waiting)` : ''}
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-600">
                        {c.spotsRemaining} spots left
                      </span>
                    )}
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
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
              </div>

              {/* Action Button Section */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isUserConfirmed ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl flex-1 border border-emerald-200">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Spot Confirmed</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      onClick={() => handleCancelClick(userBooking.id)}
                      isLoading={processingId === userBooking.id}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : isUserWaitlisted ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-2 rounded-xl flex-1 border border-amber-200">
                      <Hourglass className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Waitlisted (#1)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:bg-slate-100"
                      onClick={() => handleCancelClick(userBooking.id)}
                      isLoading={processingId === userBooking.id}
                    >
                      Leave
                    </Button>
                  </div>
                ) : isFull ? (
                  <Button
                    variant="accent"
                    size="md"
                    className="w-full"
                    onClick={() => handleBookingClick(c)}
                    isLoading={processingId === c.id}
                  >
                    Join Waitlist
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => handleBookingClick(c)}
                    isLoading={processingId === c.id}
                  >
                    Book Class
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
