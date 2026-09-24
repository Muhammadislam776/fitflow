import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    // 1. Name validation
    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    // 2. Email validation
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 3. Password checks
    if (!password || password.length < 6) {
      setErrorMessage('Password is too short. It must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your confirm password.');
      return;
    }

    // 4. Admin key check
    if (role === 'admin' && adminPasscode !== 'FITFLOW2026') {
      setErrorMessage('Invalid Admin Passkey. Please enter "FITFLOW2026" to authorize Admin account creation.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        full_name: cleanName,
        email: cleanEmail,
        password,
        role,
      });

      showToast({
        type: 'success',
        title: 'Account Registered Successfully! 🎉',
        message: 'Your account is now created. Please log in with your credentials.',
        triggerConfetti: true,
      });

      // Redirect user to log in with their created account
      navigate(`/login?email=${encodeURIComponent(cleanEmail)}&registered=true`);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
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
          Register first to access your personalized fitness dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-soft-xl border-slate-200/90">
          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. Liam Foster"
              icon={User}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. liam@example.com"
              icon={Mail}
              required
            />

            <Input
              label="Password (min. 6 characters)"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="At least 6 characters"
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Re-type password"
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
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign In to Your Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
