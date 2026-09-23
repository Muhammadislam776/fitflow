import React, { useState } from 'react';
import { User, Mail, Phone, Save, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const MemberProfile = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Sarah Jenkins',
    email: user?.email || 'sarah@example.com',
    phone: user?.phone || '+44 7700 900201',
    emergency_contact: 'Mark Jenkins (+44 7700 900999)',
    fitness_goals: 'Strength conditioning, flexibility, and 3x weekly yoga practice.',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal member information has been saved.',
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Member Profile & Preferences"
        description="Update your personal details, emergency contact information, and fitness goals."
      />

      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200/80 mb-6">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`}
            alt={user?.full_name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-soft"
          />
          <div>
            <h3 className="text-lg font-bold text-navy-900">{formData.full_name}</h3>
            <p className="text-xs text-slate-500">{formData.email}</p>
            <Badge variant="brand" size="sm" className="mt-1">
              Premium Member
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Legal Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            icon={User}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
              required
            />
          </div>

          <Input
            label="Emergency Contact"
            value={formData.emergency_contact}
            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
            placeholder="Name and telephone number"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Fitness Aspirations & Goals
            </label>
            <textarea
              rows={3}
              value={formData.fitness_goals}
              onChange={(e) => setFormData({ ...formData, fitness_goals: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <Button variant="accent" type="submit" isLoading={isSaving} icon={Save}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
