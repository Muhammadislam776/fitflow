import React from 'react';
import { QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { QRGenerator } from '../../components/qr/QRGenerator';

export const MemberQRCode = () => {
  const { user } = useAuth();
  const { gym, plans } = useGym();

  const plan = plans.find((p) => p.name.toLowerCase().includes('premium')) || plans[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Digital Check-In Pass"
        description="Scan this secure barcode at the entrance turnstiles or front desk terminal to record your gym visit."
      />

      <div className="py-4">
        <QRGenerator
          member={user}
          membership={{ status: 'active', end_date: '2026-12-31' }}
          plan={plan}
        />
      </div>

      <div className="max-w-md mx-auto text-center text-xs text-slate-500 space-y-1">
        <p>Dynamic token security prevents pass sharing and unauthorized duplication.</p>
        <p>If your screen brightness is low, increase it for faster scanner recognition.</p>
      </div>
    </div>
  );
};
