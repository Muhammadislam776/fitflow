import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Dumbbell, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const isJustRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('email')) {
      setEmail(searchParams.get('email'));
    }
  }, [searchParams]);

  // Email format regex
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();

    // 1. Validation checks on email
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 2. Validation checks on password
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(cleanEmail, password);

      showToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome, ${loggedUser.full_name}! Redirecting to your dashboard...`,
        triggerConfetti: true,
      });

      // Role-based authorization redirect: Admin to Admin, Trainer to Trainer, Member to Member
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Authentication failed.';
      setErrorMessage(msg);
      showToast({
        type: 'error',
        title: 'Login Denied',
        message: msg,
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
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your authorized credentials to access your portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-soft-xl border-slate-200/90">
          {/* Post-Registration Success Banner */}
          {isJustRegistered && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Account Registered Successfully!</p>
                <p className="mt-0.5 text-emerald-700">
                  Please enter your password below to log in.
                </p>
              </div>
            </div>
          )}

          {/* Inline Error Notice */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                {errorMessage.includes('register first') && (
                  <Link
                    to="/signup"
                    className="mt-1.5 inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700 underline"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Click here to Register an Account
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. name@domain.com"
              icon={Mail}
              required
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter your password"
                icon={Lock}
                required
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Sign In to Platform
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2">Don't have an account yet?</p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100 font-bold text-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register New Account First
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
