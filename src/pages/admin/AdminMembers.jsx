import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  UserX,
  UserCheck,
  CheckCircle,
  Mail,
  Phone,
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { api } from '../../services/api';

export const AdminMembers = () => {
  const { members, plans, refresh } = useGym();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Member Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    plan_id: plans[1]?.id || 'plan-premium',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  });

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createMember(formData);
      await refresh();
      showToast({
        type: 'success',
        title: 'Member Added!',
        message: `${formData.full_name} has been enrolled into ${plans.find((p) => p.id === formData.plan_id)?.name || 'membership'}.`,
        triggerConfetti: true,
      });
      setIsAddModalOpen(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        plan_id: plans[1]?.id || 'plan-premium',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (member) => {
    const isCurrentlyActive = member.membership?.status === 'active';
    const newStatus = isCurrentlyActive ? 'cancelled' : 'active';

    // Update in storage
    const memberships = await api.getMemberships();
    const memIndex = memberships.findIndex((m) => m.member_id === member.id);
    if (memIndex !== -1) {
      memberships[memIndex].status = newStatus;
      localStorage.setItem('fitflow_memberships', JSON.stringify(memberships));
      await refresh();
      showToast({
        type: 'info',
        title: 'Status Updated',
        message: `${member.full_name}'s membership marked as ${newStatus}.`,
      });
    }
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || (m.membership && m.membership.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Management"
        description="View and manage gym members, active subscriptions, and visit records."
        action={
          <Button
            variant="accent"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Member
          </Button>
        }
      />

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 uppercase hidden sm:inline">
              Filter:
            </span>
            {['all', 'active', 'expired', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  statusFilter === status
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Member</th>
                <th className="py-3.5 px-6">Email & Phone</th>
                <th className="py-3.5 px-6">Plan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Attendance</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No members match your criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Member Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar_url}
                          alt={m.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-soft-sm"
                        />
                        <span className="font-bold text-navy-900">{m.full_name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-600">
                      <div>{m.email}</div>
                      <div className="text-xs text-slate-400">{m.phone || 'No phone'}</div>
                    </td>

                    {/* Membership Plan */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-brand-700">
                        {m.plan ? m.plan.name : 'No Active Plan'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          m.membership?.status === 'active'
                            ? 'success'
                            : m.membership?.status === 'expired'
                            ? 'danger'
                            : 'warning'
                        }
                        dot={true}
                      >
                        {m.membership ? m.membership.status : 'inactive'}
                      </Badge>
                    </td>

                    {/* Attendance */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-navy-900">{m.visits}</span>{' '}
                      <span className="text-slate-400 text-xs">visits</span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {new Date(m.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/members/${m.id}`)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(m)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            m.membership?.status === 'active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={m.membership?.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {m.membership?.status === 'active' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
        description="Enroll a new client and configure their gym membership package."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="e.g. Liam Gallagher"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="liam@example.com"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+44 7700 900555"
          />

          <Select
            label="Membership Plan"
            value={formData.plan_id}
            onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
            options={plans.map((p) => ({
              value: p.id,
              label: `${p.name} (£${p.price}/mo)`,
            }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              type="submit"
              isLoading={isSubmitting}
            >
              Save & Enroll Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
