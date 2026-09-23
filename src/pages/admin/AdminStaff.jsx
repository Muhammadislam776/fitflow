import React, { useState } from 'react';
import { UserCog, Plus, Mail, Phone, Award, Calendar, CheckCircle } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const AdminStaff = () => {
  const { trainers, classes, refresh } = useGym();
  const { showToast } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialty: 'Functional Strength & Mobility',
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem('fitflow_profiles') || '[]');
    const newTrainer = {
      id: 'user-trainer-' + Date.now(),
      gym_id: 'gym-001',
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.full_name)}`,
      role: 'trainer',
      specialty: formData.specialty,
      created_at: new Date().toISOString(),
    };
    stored.push(newTrainer);
    localStorage.setItem('fitflow_profiles', JSON.stringify(stored));
    refresh();

    showToast({
      type: 'success',
      title: 'Trainer Added',
      message: `${formData.full_name} added to coaching staff.`,
      triggerConfetti: true,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coaching Staff & Trainers"
        description="Manage instructor assignments, certifications, and class coverage."
        action={
          <Button variant="accent" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Add Trainer
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainers.map((t) => {
          const assignedClasses = classes.filter((c) => c.trainer_id === t.id);

          return (
            <Card key={t.id} className="p-6 text-center flex flex-col justify-between" hoverEffect>
              <div>
                <img
                  src={t.avatar_url}
                  alt={t.full_name}
                  className="w-20 h-20 rounded-2xl mx-auto object-cover border-2 border-slate-200 shadow-soft mb-4"
                />
                <h3 className="text-lg font-bold text-navy-900">{t.full_name}</h3>
                <Badge variant="brand" size="sm" className="mt-1">
                  Coach / Trainer
                </Badge>

                <p className="text-xs text-brand-700 font-semibold mt-3 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-accent-500" />
                  {t.specialty || 'Fitness Specialist'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.phone || '+44 7700 900124'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned Sessions:</span>
                <span className="font-bold text-navy-900 px-2 py-0.5 rounded-md bg-slate-100">
                  {assignedClasses.length} Classes
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Certified Trainer"
        description="Invite a coach or instructor to the staff workspace."
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="e.g. Jordan Hayes"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jordan@fitflow.com"
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+44 7700 900888"
          />
          <Input
            label="Coaching Specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            placeholder="e.g. Boxing & Olympic Weightlifting"
          />
          <div className="pt-3 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit">
              Save Staff Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
