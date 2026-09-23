import React, { useState } from 'react';
import { CheckCircle, QrCode, Search, UserCheck, Calendar } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

export const TrainerAttendance = () => {
  const { attendance } = useGym();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAttendance = attendance.filter((a) => {
    return (
      a.member?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.class?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer Attendance & Check-In"
        description="Verify incoming member passes before class begins."
        action={
          <Button
            variant="accent"
            icon={QrCode}
            onClick={() => setScannerOpen(true)}
          >
            Launch Camera Scanner
          </Button>
        }
      />

      <Card className="p-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search attendees or session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Athlete</th>
              <th className="py-3.5 px-6">Class Session</th>
              <th className="py-3.5 px-6">Check-In Time</th>
              <th className="py-3.5 px-6">Method</th>
              <th className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAttendance.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/80">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        a.member?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.member?.full_name}`
                      }
                      alt={a.member?.full_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-navy-900 leading-tight">{a.member?.full_name}</p>
                      <p className="text-xs text-slate-400">{a.member?.email}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6 font-semibold text-navy-900">
                  {a.class ? a.class.name : 'General Gym Entry'}
                </td>

                <td className="py-4 px-6 text-slate-600 text-xs">
                  {new Date(a.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>

                <td className="py-4 px-6">
                  <Badge variant={a.check_in_method === 'qr' ? 'brand' : 'neutral'} size="sm">
                    {a.check_in_method.toUpperCase()}
                  </Badge>
                </td>

                <td className="py-4 px-6">
                  <Badge variant="success" size="sm" dot>
                    Present
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
};
