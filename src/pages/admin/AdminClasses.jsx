import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Sparkles,
  Search,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';

export const AdminClasses = () => {
  const { classes, trainers, refresh } = useGym();
  const { showToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trainer_id: trainers[0]?.id || 'user-trainer-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '18:00',
    end_time: '19:00',
    capacity: '20',
    location: 'Studio A (Zen)',
    category: 'Yoga & Mind',
  });

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      description: '',
      trainer_id: trainers[0]?.id || 'user-trainer-1',
      date: new Date().toISOString().split('T')[0],
      start_time: '18:00',
      end_time: '19:00',
      capacity: '20',
      location: 'Studio A (Zen)',
      category: 'Yoga & Mind',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingClass(c);
    setFormData({
      name: c.name,
      description: c.description || '',
      trainer_id: c.trainer_id || (trainers[0]?.id || ''),
      date: c.date,
      start_time: c.start_time,
      end_time: c.end_time,
      capacity: String(c.capacity),
      location: c.location,
      category: c.category || 'General Fitness',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingClass) {
        await api.updateClass(editingClass.id, {
          ...formData,
          capacity: Number(formData.capacity),
        });
        showToast({
          type: 'success',
          title: 'Class Updated',
          message: `${formData.name} schedule updated.`,
        });
      } else {
        await api.createClass(formData);
        showToast({
          type: 'success',
          title: 'Class Scheduled!',
          message: `${formData.name} created with capacity of ${formData.capacity} spots.`,
          triggerConfetti: true,
        });
      }

      await refresh();
      setIsModalOpen(false);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id, name) => {
    if (confirm(`Cancel and delete class "${name}"?`)) {
      await api.deleteClass(id);
      await refresh();
      showToast({
        type: 'info',
        title: 'Class Deleted',
        message: `${name} has been removed from schedule.`,
      });
    }
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Management & Timetable"
        description="Schedule workout sessions, assign certified trainers, and enforce real-time spot capacity limits."
        action={
          <Button variant="accent" icon={Plus} onClick={openCreateModal}>
            Create Class
          </Button>
        }
      />

      {/* Filter / Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search classes or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-navy-900">{filteredClasses.length}</strong> scheduled sessions
          </div>
        </div>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((c) => {
          const fillPercentage = Math.min(100, Math.round((c.confirmedCount / c.capacity) * 100));
          const isFull = c.isFull || fillPercentage >= 100;

          return (
            <Card key={c.id} className="flex flex-col justify-between" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={isFull ? 'danger' : 'brand'} size="sm">
                    {c.category || 'Fitness'}
                  </Badge>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {c.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy-900 mt-1">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>

                {/* Session Meta */}
                <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {c.start_time} - {c.end_time}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <img
                      src={c.trainer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.trainer?.full_name}`}
                      alt={c.trainer?.full_name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-navy-900">{c.trainer?.full_name || 'Staff Coach'}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar Section */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-navy-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {c.confirmedCount} / {c.capacity} spots
                    </span>
                    {isFull ? (
                      <span className="font-extrabold text-rose-600 uppercase text-[11px]">
                        FULL {c.waitlistCount > 0 ? `(${c.waitlistCount} on waitlist)` : ''}
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-600">
                        {c.spotsRemaining} spots left
                      </span>
                    )}
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-rose-500'
                          : fillPercentage > 75
                          ? 'bg-accent-500'
                          : 'bg-brand-600'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  icon={Edit2}
                  onClick={() => openEditModal(c)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  icon={Trash2}
                  onClick={() => handleDeleteClass(c.id, c.name)}
                >
                  Cancel Class
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create / Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Class Details' : 'Schedule New Class'}
        description="Configure class time, assign trainer, and define booking capacity."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Class Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. HIIT Strength & Conditioning"
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Session breakdown and focus areas"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Trainer"
              value={formData.trainer_id}
              onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
              options={trainers.map((t) => ({
                value: t.id,
                label: t.full_name,
              }))}
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Yoga & Mind', label: 'Yoga & Mind' },
                { value: 'Cardio & HIIT', label: 'Cardio & HIIT' },
                { value: 'Strength', label: 'Strength & Lifting' },
                { value: 'Conditioning', label: 'Conditioning' },
                { value: 'Pilates', label: 'Pilates Core' },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Start Time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Capacity (Max Spots)"
              type="number"
              min="1"
              max="100"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
            <Input
              label="Location / Studio"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Studio A (Zen)"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit" isLoading={isSubmitting}>
              {editingClass ? 'Save Changes' : 'Schedule Class'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
