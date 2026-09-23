import React, { useState } from 'react';
import { Users, Search, Activity, Mail, Phone, Dumbbell } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

export const TrainerMembers = () => {
  const { members } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const filtered = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Fitness Directory"
        description="Inspect member profiles, attendance velocity, and coaching notes."
      />

      <Card className="p-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search athletes by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m) => (
          <Card
            key={m.id}
            className="p-5 cursor-pointer hover:border-brand-300 transition-all"
            hoverEffect
            onClick={() => setSelectedMember(m)}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={m.avatar_url}
                alt={m.full_name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-navy-900 leading-tight">{m.full_name}</h4>
                <p className="text-xs text-slate-400">{m.email}</p>
                <Badge variant="brand" size="sm" className="mt-1">
                  {m.plan ? m.plan.name : 'Premium'}
                </Badge>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified Attendance:</span>
              <strong className="text-navy-900">{m.visits || 42} Visits</strong>
            </div>
          </Card>
        ))}
      </div>

      {selectedMember && (
        <Modal
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title={`Athlete Record — ${selectedMember.full_name}`}
          description={`Registered member with ${selectedMember.plan?.name || 'Premium'} Tier`}
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <img
                src={selectedMember.avatar_url}
                alt={selectedMember.full_name}
                className="w-14 h-14 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-navy-900">{selectedMember.full_name}</h4>
                <p className="text-xs text-slate-500">{selectedMember.email}</p>
                <p className="text-xs text-slate-500">{selectedMember.phone || '+44 7700 900201'}</p>
              </div>
            </div>

            <div className="p-3.5 bg-brand-50/50 rounded-xl border border-brand-100 text-xs">
              <span className="font-bold text-brand-900 block mb-1">Coaching Note:</span>
              <p className="text-slate-600">
                Focuses on functional mobility, squat depth, and endurance circuits. Consistently
                attends morning sessions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block">Total Gym Visits</span>
                <strong className="text-base text-navy-900">{selectedMember.visits || 42}</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 block">Current Status</span>
                <strong className="text-base text-emerald-600">Active Member</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
