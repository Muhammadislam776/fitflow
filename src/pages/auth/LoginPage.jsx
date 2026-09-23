import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Dumbbell, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || 'admin@fitflow.com';
  const isJustRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(isJustRegistered ? '' : 'password123');
  const [isLoading, setIsLoading] = useState(false);

  const { login, switchDemoUser } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('email')) {
      setEmail(searchParams.get('email'));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loggedUser = await login(email, password);
      showToast({
        type: 'success',
        title: 'Authentication Successful! 🎉',
        message: `Welcome, ${loggedUser.full_name}! Redirecting to ${loggedUser.role} portal...`,
        triggerConfetti: true,
      });

      // Role-based authorization redirect
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message || 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    switchDemoUser(role);
    showToast({
      type: 'success',
      title: 'Demo Persona Activated',
      message: `Logged in as ${role.toUpperCase()} workspace.`,
    });
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'trainer') navigate('/trainer/dashboard');
    else navigate('/member/dashboard');
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
          Enter your credentials to access your fitness portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-8 shadow-soft-xl border-slate-200/90">
          {/* Registration Success Banner */}
          {isJustRegistered && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Account Created Successfully!</p>
                <p className="mt-0.5 text-emerald-700">
                  Please enter your password below to log in to your new account.
                </p>
              </div>
            </div>
          )}

          {/* Quick Demo Switcher Strip */}
          <div className="mb-6 p-3.5 bg-brand-50/60 rounded-xl border border-brand-100">
            <p className="text-xs font-semibold text-brand-900 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              Pre-Seeded Demo Accounts (1-Click):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@fitflow.com');
                  setPassword('password123');
                  handleQuickLogin('admin');
                }}
                className="py-1.5 px-2 bg-white text-brand-700 hover:bg-brand-600 hover:text-white border border-brand-200 rounded-lg text-xs font-semibold transition-all shadow-soft-sm"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('alex.trainer@fitflow.com');
                  setPassword('password123');
                  handleQuickLogin('trainer');
                }}
                className="py-1.5 px-2 bg-white text-brand-700 hover:bg-brand-600 hover:text-white border border-brand-200 rounded-lg text-xs font-semibold transition-all shadow-soft-sm"
              >
                Trainer
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sarah@example.com');
                  setPassword('password123');
                  handleQuickLogin('member');
                }}
                className="py-1.5 px-2 bg-white text-accent-700 hover:bg-accent-500 hover:text-white border border-accent-200 rounded-lg text-xs font-semibold transition-all shadow-soft-sm"
              >
                Member
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-slate-400">
                  Demo password: <code className="font-mono text-brand-600">password123</code>
                </span>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-700">
              Create an Account First
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
