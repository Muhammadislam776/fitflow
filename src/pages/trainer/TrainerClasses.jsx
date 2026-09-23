import React, { useState } from 'react';
import { Calendar, Users, QrCode, Clock, MapPin, CheckCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

export const TrainerClasses = () => {
  const { user } = useAuth();
  const { classes, bookings, attendance } = useGym();

  const [selectedClass, setSelectedClass] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Classes for trainer
  const myClasses = classes.filter((c) => c.trainer_id === user?.id || c.trainer?.id === user?.id);
  const displayClasses = myClasses.length > 0 ? myClasses : classes;

  const classAttendees = selectedClass
    ? bookings.filter((b) => b.class_id === selectedClass.id && b.status === 'confirmed')
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Classes & Rosters"
        description="Inspect registered members, track capacity limits, and verify arrivals."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayClasses.map((c) => {
          return (
            <Card key={c.id} className="p-6 flex flex-col justify-between" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="brand" size="sm">{c.category || 'Fitness'}</Badge>
                  <span className="text-xs font-bold text-slate-500">{c.date}</span>
                </div>

                <h3 className="text-lg font-bold text-navy-900 mt-1">{c.name}</h3>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="font-bold text-navy-900">{c.start_time} - {c.end_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Studio:</span>
                    <span className="font-semibold text-navy-900">{c.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roster Capacity:</span>
                    <span className="font-bold text-brand-600">{c.confirmedCount} / {c.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedClass(c)}
                >
                  View Roster
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  className="flex-1"
                  icon={QrCode}
                  onClick={() => {
                    setSelectedClass(c);
                    setScannerOpen(true);
                  }}
                >
                  Scan In
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Roster Viewer Modal */}
      {selectedClass && (
        <Modal
          isOpen={Boolean(selectedClass) && !scannerOpen}
          onClose={() => setSelectedClass(null)}
          title={`Class Roster — ${selectedClass.name}`}
          description={`${selectedClass.date} at ${selectedClass.start_time} in ${selectedClass.location}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <span className="text-slate-500">
                Registered Athletes ({classAttendees.length} / {selectedClass.capacity})
              </span>
              <Button
                variant="accent"
                size="sm"
                icon={QrCode}
                onClick={() => setScannerOpen(true)}
              >
                Scan Passes
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {classAttendees.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No confirmed bookings yet.
                </div>
              ) : (
                classAttendees.map((b) => {
                  const hasCheckedIn = attendance.some(
                    (a) => a.member_id === b.member_id && a.class_id === selectedClass.id
                  );

                  return (
                    <div key={b.id} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            b.member?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.member?.full_name}`
                          }
                          alt={b.member?.full_name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-bold text-navy-900 leading-tight">
                            {b.member?.full_name}
                          </p>
                          <p className="text-xs text-slate-400">{b.member?.email}</p>
                        </div>
                      </div>

                      <Badge variant={hasCheckedIn ? 'success' : 'neutral'} size="sm" dot={hasCheckedIn}>
                        {hasCheckedIn ? 'Checked In' : 'Registered'}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Modal>
      )}

      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        defaultClassId={selectedClass?.id}
      />
    </div>
  );
};
