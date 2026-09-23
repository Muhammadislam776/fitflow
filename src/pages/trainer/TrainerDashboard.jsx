import React, { useState } from 'react';
import {
  Calendar,
  Users,
  QrCode,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

export const TrainerDashboard = () => {
  const { user } = useAuth();
  const { classes, bookings, attendance } = useGym();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeClassId, setActiveClassId] = useState(null);

  const coachName = user?.full_name?.split(' ')[0] || 'Coach';

  // Trainer's assigned classes
  const myClasses = classes.filter((c) => c.trainer_id === user?.id || c.trainer?.id === user?.id);
  const displayClasses = myClasses.length > 0 ? myClasses : classes.slice(0, 3);

  const openScannerForClass = (classId) => {
    setActiveClassId(classId);
    setScannerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-900">
            Coach Portal — {coachName} 💪
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your daily class rosters, verify member check-ins, and track session attendance.
          </p>
        </div>

        <Button
          variant="accent"
          icon={QrCode}
          onClick={() => {
            setActiveClassId(null);
            setScannerOpen(true);
          }}
        >
          Open QR Scanner
        </Button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card>
          <span className="text-xs font-semibold text-slate-400 uppercase">Assigned Sessions</span>
          <h3 className="text-2xl font-bold text-navy-900 mt-1">{displayClasses.length} Classes</h3>
          <p className="text-xs text-brand-600 font-semibold mt-0.5">Scheduled on timetable</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-400 uppercase">Registered Athletes</span>
          <h3 className="text-2xl font-bold text-brand-600 mt-1">
            {displayClasses.reduce((acc, c) => acc + c.confirmedCount, 0)} Attendees
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Confirmed across your classes</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-400 uppercase">Today's Verifications</span>
          <h3 className="text-2xl font-bold text-accent-500 mt-1">
            {attendance.length} Check-Ins
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-0.5">✓ Studio active</p>
        </Card>
      </div>

      {/* Assigned Classes Roster Cards */}
      <div>
        <h2 className="text-lg font-bold text-navy-900 mb-4">Your Assigned Sessions Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayClasses.map((c) => {
            const classBookings = bookings.filter(
              (b) => b.class_id === c.id && b.status === 'confirmed'
            );

            return (
              <Card key={c.id} className="p-6 flex flex-col justify-between" hoverEffect>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="brand" size="sm">
                      {c.category || 'Strength'}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500">{c.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-navy-900">{c.name}</h3>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {c.start_time} - {c.end_time}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {c.location}
                    </span>
                    <span className="font-bold text-navy-900">
                      {c.confirmedCount} / {c.capacity} Booked
                    </span>
                  </div>

                  {/* Attendee Avatars */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Confirmed Athletes:</p>
                    <div className="flex items-center -space-x-2 overflow-hidden py-1">
                      {classBookings.slice(0, 6).map((b) => (
                        <img
                          key={b.id}
                          src={
                            b.member?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.member?.full_name}`
                          }
                          alt={b.member?.full_name}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                          title={b.member?.full_name}
                        />
                      ))}
                      {classBookings.length > 6 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 ring-2 ring-white">
                          +{classBookings.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.location.assign('/trainer/classes')}
                  >
                    View Full Roster
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="flex-1"
                    icon={QrCode}
                    onClick={() => openScannerForClass(c.id)}
                  >
                    Check In Attendees
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        defaultClassId={activeClassId}
      />
    </div>
  );
};
