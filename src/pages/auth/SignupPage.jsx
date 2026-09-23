import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('member'); // 'member' | 'trainer' | 'admin'
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast({
        type: 'warning',
        title: 'Password Too Short',
        message: 'Password must be at least 6 characters.',
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Passwords Mismatch',
        message: 'The entered passwords do not match.',
      });
      return;
    }

    if (role === 'admin' && adminPasscode !== 'FITFLOW2026') {
      showToast({
        type: 'error',
        title: 'Admin Verification Key Required',
        message: 'Enter passkey "FITFLOW2026" to register as Gym Owner / Admin.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        full_name: fullName,
        email,
        password,
        role,
      });

      showToast({
        type: 'success',
        title: 'Account Created Successfully! 🎉',
        message: 'Please log in with your new email and password.',
        triggerConfetti: true,
      });

      // Redirect to Login with prefilled email as requested: "First create account, then log in"
      navigate(`/login?email=${encodeURIComponent(email)}&registered=true`);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-soft">
            <Dumbbell className="w-6 h-6 text-accent-400 rotate-[-25deg]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-navy-900">
            FIT<span className="text-accent-500">FLOW</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">
          Create Your Account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Step 1: Register your credentials • Step 2: Log in to your portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-soft-xl border-slate-200/90">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Liam Foster"
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="liam@example.com"
              icon={Mail}
              required
            />

            <Input
              label="Password (min. 6 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                    role === 'member'
                      ? 'bg-accent-50 text-accent-700 border-accent-300 shadow-soft-sm font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole('trainer')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                    role === 'trainer'
                      ? 'bg-brand-50 text-brand-700 border-brand-300 shadow-soft-sm font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Trainer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                    role === 'admin'
                      ? 'bg-navy-900 text-white border-navy-800 shadow-soft-sm font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {role === 'admin' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 animate-in fade-in">
                <Input
                  label="Gym Admin Verification Passcode"
                  type="text"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter FITFLOW2026"
                  helperText="Security key required to create owner account (FITFLOW2026)."
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-3"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign In to Your Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
