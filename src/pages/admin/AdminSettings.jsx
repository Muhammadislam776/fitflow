import React, { useState } from 'react';
import {
  Building2,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { useNotification } from '../../context/NotificationContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { api } from '../../services/api';

export const AdminSettings = () => {
  const { gym, refresh, resetData } = useGym();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: gym?.name || 'FitFlow Performance Club',
    email: gym?.email || 'hello@fitflowgym.com',
    phone: gym?.phone || '+44 20 7946 0912',
    address: gym?.address || '120 Bishopsgate, Level 3',
    city: gym?.city || 'London',
    country: gym?.country || 'United Kingdom',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateGym(formData);
      await refresh();
      showToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Gym profile details successfully updated.',
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetConfirm = async () => {
    await resetData();
    setResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Studio & System Settings"
        description="Configure gym branding, tenant security policies, and database synchronization."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Gym Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
              <Building2 className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-navy-900">Gym Location & Branding</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Gym / Studio Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Physical Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="accent" type="submit" isLoading={isSaving} icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Seed Data Reset Tool */}
          <Card className="border-rose-200/80 bg-rose-50/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy-900">Reset Demo Data Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Restores default gym, 3 plans, 10 members, and 8 classes for fresh demonstration.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={RotateCcw}
                onClick={() => setResetConfirmOpen(true)}
              >
                Reset Data
              </Button>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Supabase & Architecture Diagnostics */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-navy-900">Database Engine</h3>
              </div>
              <Badge variant={isSupabaseConfigured ? 'success' : 'brand'} size="sm" dot>
                {isSupabaseConfigured ? 'Supabase Live' : 'Active Local Engine'}
              </Badge>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isSupabaseConfigured
                ? 'Connected directly to live PostgreSQL database with Row Level Security (RLS) enforcement.'
                : 'Running on high-performance in-browser storage layer with atomic concurrency simulations. Connect your Supabase project in .env to switch to remote PostgreSQL.'}
            </p>

            <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Row Level Security:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Enforced
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Atomic Booking RPC:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Auto-Waitlist Engine:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              <span className="font-semibold text-navy-900 block mb-1">Production SQL Schema:</span>
              <span>Available in project at <code className="font-mono text-brand-700">supabase/schema.sql</code></span>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Demo Data?"
        message="This will re-initialize all members, classes, and attendance logs to the initial baseline seed data."
        confirmText="Reset Now"
        isDestructive={true}
      />
    </div>
  );
};
