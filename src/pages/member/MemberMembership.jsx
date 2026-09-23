import React from 'react';
import { CreditCard, Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const MemberMembership = () => {
  const { user } = useAuth();
  const { plans } = useGym();

  const currentPlan = plans.find((p) => p.name.toLowerCase().includes('premium')) || plans[1];

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Membership"
        description="View your active subscription benefits, renewal dates, and available tier upgrades."
      />

      {/* Current Active Plan Showcase */}
      <Card className="p-6 sm:p-8 border-2 border-brand-600 bg-gradient-to-br from-white via-brand-50/30 to-white shadow-soft-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-navy-900">{currentPlan.name} Tier</h2>
              <Badge variant="success" size="sm" dot>
                Active
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentPlan.description}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-3xl font-black text-navy-900">£{currentPlan.price}</span>
            <span className="text-xs text-slate-500 block">per month (auto-renews)</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
            <span className="text-slate-400 block font-medium">Monthly Class Limit</span>
            <strong className="text-sm text-navy-900 font-bold mt-0.5 block">
              {currentPlan.class_limit ? `${currentPlan.class_limit} Classes / Mo` : 'Unlimited'}
            </strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
            <span className="text-slate-400 block font-medium">Current Billing Cycle</span>
            <strong className="text-sm text-navy-900 font-bold mt-0.5 block">Renews Dec 31, 2026</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
            <span className="text-slate-400 block font-medium">Payment Method</span>
            <strong className="text-sm text-navy-900 font-bold mt-0.5 block">•••• 4242 (Visa)</strong>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Included Tier Benefits:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(currentPlan.features || [
              '20 Classes per month',
              'Full gym & functional zone access',
              'Priority class booking (7 days advance)',
              'Complimentary sauna & steam room',
              '1 Free guest pass per month',
            ]).map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 p-2.5 bg-white rounded-xl border border-slate-200/80"
              >
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Available Upgrade Options */}
      <div>
        <h3 className="text-lg font-bold text-navy-900 mb-4">Explore All Studio Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = p.id === currentPlan.id;
            return (
              <Card
                key={p.id}
                className={`p-6 flex flex-col justify-between ${
                  isCurrent ? 'border-2 border-brand-500 bg-brand-50/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-navy-900">{p.name}</h4>
                    {isCurrent && <Badge variant="brand" size="sm">Current Plan</Badge>}
                  </div>
                  <p className="text-2xl font-black text-navy-900 mt-2">£{p.price} <span className="text-xs text-slate-400 font-normal">/mo</span></p>
                  <p className="text-xs text-slate-500 mt-2 min-h-[32px]">{p.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    variant={isCurrent ? 'secondary' : 'accent'}
                    size="sm"
                    className="w-full"
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Active Subscription' : 'Upgrade Plan'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
