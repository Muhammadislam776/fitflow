import React, { useState } from 'react';
import {
  CheckCircle,
  QrCode,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

export const AdminAttendance = () => {
  const { attendance, metrics } = useGym();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredAttendance = attendance.filter((a) => {
    const matchesSearch =
      a.member?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.member?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.class?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'all' || a.check_in_method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Check-In Log"
        description="Real-time access logs from QR scanners, automated turnstiles, and staff check-ins."
        action={
          <Button
            variant="accent"
            icon={QrCode}
            onClick={() => setScannerOpen(true)}
          >
            Launch QR Scanner
          </Button>
        }
      />

      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Today's Check-ins</p>
            <h3 className="text-2xl font-bold text-navy-900 mt-1">{metrics?.todayCheckins || 126}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">QR Code Scans</p>
            <h3 className="text-2xl font-bold text-brand-600 mt-1">
              {attendance.filter((a) => a.check_in_method === 'qr').length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Manual Staff Check-ins</p>
            <h3 className="text-2xl font-bold text-navy-900 mt-1">
              {attendance.filter((a) => a.check_in_method === 'manual').length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by member name or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['all', 'qr', 'manual'].map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  methodFilter === method
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {method === 'all' ? 'All Methods' : method === 'qr' ? 'QR Pass' : 'Manual'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Member</th>
                <th className="py-3.5 px-6">Entry / Class</th>
                <th className="py-3.5 px-6">Check-In Time</th>
                <th className="py-3.5 px-6">Method</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No attendance records match your filters.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
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
                          <p className="font-bold text-navy-900 leading-tight">
                            {a.member?.full_name}
                          </p>
                          <p className="text-xs text-slate-400">{a.member?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-navy-900">
                      {a.class ? (
                        <div>
                          <span>{a.class.name}</span>
                          <span className="block text-xs font-normal text-slate-400">
                            Studio Session
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span>General Gym Entry</span>
                          <span className="block text-xs font-normal text-slate-400">
                            Main Turnstile
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-600 text-xs">
                      <div>
                        {new Date(a.check_in_time).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="font-mono text-navy-900 font-semibold">
                        {new Date(a.check_in_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <QRScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
};
