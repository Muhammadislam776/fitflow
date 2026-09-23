import React, { useState } from 'react';
import { Plus, Check, Edit2, Trash2, Sparkles, CreditCard } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { api } from '../../services/api';

export const AdminPlans = () => {
  const { plans, refresh } = useGym();
  const { showToast } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '30',
    class_limit: '8',
    features: '',
  });

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: '40',
      duration_days: '30',
      class_limit: '12',
      features: 'Full gym access\n12 Studio classes\nLocker room access\nFree water refill',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: String(plan.price),
      duration_days: String(plan.duration_days || 30),
      class_limit: plan.class_limit !== null ? String(plan.class_limit) : '',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parsedFeatures = formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        duration_days: Number(formData.duration_days) || 30,
        class_limit: formData.class_limit ? Number(formData.class_limit) : null,
        features: parsedFeatures,
      };

      if (editingPlan) {
        await api.updatePlan(editingPlan.id, payload);
        showToast({
          type: 'success',
          title: 'Plan Updated',
          message: `${formData.name} tier updated successfully.`,
        });
      } else {
        await api.createPlan(payload);
        showToast({
          type: 'success',
          title: 'New Plan Created',
          message: `${formData.name} is now available for member signups!`,
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

  const handleDeletePlan = async (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await api.deletePlan(id);
      await refresh();
      showToast({
        type: 'info',
        title: 'Plan Removed',
        message: `${name} has been archived.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership Plans"
        description="Configure subscription packages, monthly fees, class limits, and member perks."
        action={
          <Button variant="accent" icon={Plus} onClick={openCreateModal}>
            Create Plan
          </Button>
        }
      />

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPopular = plan.name.toLowerCase().includes('premium');
          const isUnlimited = plan.name.toLowerCase().includes('unlimited');

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between overflow-hidden border-2 transition-all ${
                isPopular
                  ? 'border-brand-600 shadow-soft-lg scale-[1.02]'
                  : 'border-slate-200/90 shadow-soft'
              }`}
              hoverEffect
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-extrabold uppercase tracking-tight text-navy-900">
                    {plan.name}
                  </h3>
                  <Badge variant={isUnlimited ? 'accent' : 'brand'} size="sm">
                    {plan.duration_days} Days
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 min-h-[36px]">{plan.description}</p>

                <div className="mt-5 pb-5 border-b border-slate-100 flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-black text-navy-900">
                    £{plan.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1.5">/ month</span>
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      {plan.class_limit ? `${plan.class_limit} Classes per month` : 'Unlimited Studio Classes'}
                    </span>
                  </div>

                  {(plan.features || []).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  icon={Edit2}
                  onClick={() => openEditModal(plan)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  icon={Trash2}
                  onClick={() => handleDeletePlan(plan.id, plan.name)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create / Edit Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? `Edit ${editingPlan.name} Plan` : 'Create Membership Plan'}
        description="Define subscription details, pricing, and member perks."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plan Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. VIP Athlete"
            required
          />

          <Input
            label="Short Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Full access package with dedicated coach assessment"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Price (£/mo)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Duration (Days)"
              type="number"
              value={formData.duration_days}
              onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
              required
            />
            <Input
              label="Class Limit"
              type="number"
              placeholder="Blank = Unlimited"
              value={formData.class_limit}
              onChange={(e) => setFormData({ ...formData, class_limit: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Features (One per line)
            </label>
            <textarea
              rows={4}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
              placeholder="Free sauna access&#10;24/7 gym floor pass&#10;Priority bookings"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" type="submit" isLoading={isSubmitting}>
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
