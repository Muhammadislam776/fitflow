import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const QRGenerator = ({ member, membership, plan }) => {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [countdown, setCountdown] = useState(60);

  // Auto-refresh dynamic token every 60 seconds for security
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTimestamp(Date.now());
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const qrData = JSON.stringify({
    app: 'FITFLOW',
    type: 'member_checkin_token',
    memberId: member?.id,
    gymId: member?.gym_id || 'gym-001',
    name: member?.full_name,
    email: member?.email,
    plan: plan?.name || 'Premium',
    ts: timestamp,
  });

  return (
    <Card className="max-w-md mx-auto overflow-hidden border-slate-200/90 shadow-soft-lg text-center p-0">
      {/* Gym Pass Header */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-navy-900 text-white p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center font-black text-xs text-white">
              FF
            </div>
            <span className="font-bold tracking-tight text-base">FITFLOW PASS</span>
          </div>
          <Badge variant="accent" size="sm" className="bg-white/10 text-accent-300 border-accent-400/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {membership?.status === 'active' ? 'Active Member' : 'Membership Pass'}
          </Badge>
        </div>

        <div className="mt-5 flex items-center gap-4 text-left">
          <img
            src={member?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.full_name}`}
            alt={member?.full_name}
            className="w-14 h-14 rounded-2xl border-2 border-white/20 bg-white/10 object-cover shadow-soft"
          />
          <div>
            <h3 className="font-bold text-lg text-white leading-tight">{member?.full_name}</h3>
            <p className="text-xs text-brand-200 mt-0.5">{member?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-500/20 text-accent-300 border border-accent-500/30">
                {plan?.name || 'Premium Tier'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Presentation Box */}
      <div className="p-8 flex flex-col items-center justify-center bg-white">
        <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner group">
          <QRCodeSVG
            value={qrData}
            size={220}
            level="H"
            includeMargin={true}
            className="rounded-lg shadow-sm"
          />
          {/* Subtle animated scanline */}
          <div className="absolute inset-x-4 top-4 h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent animate-pulse opacity-75" />
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
          <span>Dynamic security code refreshes in <strong className="text-navy-900 font-mono">{countdown}s</strong></span>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Ready to scan at turnstiles and class check-in stations.</span>
        </div>
      </div>
    </Card>
  );
};
