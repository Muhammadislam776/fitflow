import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchDemoUser } = useAuth();

  const handleDemoStart = (role) => {
    switchDemoUser(role);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'trainer') navigate('/trainer/dashboard');
    else navigate('/member/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Public Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-soft">
              <Dumbbell className="w-5 h-5 text-accent-400 rotate-[-25deg]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-navy-900 leading-none">
                FIT<span className="text-accent-500">FLOW</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                Gym SaaS Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#plans" className="hover:text-brand-600 transition-colors">Pricing Plans</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => handleDemoStart('admin')}
              icon={Sparkles}
            >
              Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden bg-gradient-to-b from-white via-brand-50/25 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>Next-Generation Studio Management & Member Experience</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-navy-900 leading-[1.1] max-w-4xl mx-auto">
            Manage Your Gym. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">
              Grow Your Community.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The all-in-one commercial platform for smart memberships, real-time class booking with atomic capacity protection, camera QR check-ins, and multi-tenant isolation.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => handleDemoStart('admin')}
              icon={ArrowRight}
              className="w-full sm:w-auto text-base px-8 py-3.5 shadow-soft-lg"
            >
              Explore Admin Portal
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleDemoStart('member')}
              className="w-full sm:w-auto text-base px-8 py-3.5"
            >
              Try Member App Experience
            </Button>
          </div>

          {/* Quick Sandbox Persona Banner */}
          <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-3 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-soft text-xs text-slate-600">
            <span className="font-bold text-navy-900 px-2">Instant 1-Click Persona Sandbox:</span>
            <button
              onClick={() => handleDemoStart('admin')}
              className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white font-semibold transition-colors"
            >
              Admin (Muhammad)
            </button>
            <button
              onClick={() => handleDemoStart('trainer')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-semibold transition-colors"
            >
              Trainer (Alex)
            </button>
            <button
              onClick={() => handleDemoStart('member')}
              className="px-3 py-1.5 rounded-xl bg-accent-50 text-accent-700 hover:bg-accent-500 hover:text-white font-semibold transition-colors"
            >
              Member (Sarah)
            </button>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="brand" size="md">Core Infrastructure</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3">
              Engineered for Modern Fitness Studios
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Say goodbye to clunky spreadsheets, double-bookings, and manual turnstile check-ins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-slate-200/80 hover:border-brand-500 transition-all" hoverEffect>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Smart Memberships</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Configure tiered packages (Basic, Premium, Unlimited) with class allowances, automated expiration rules, and member status tracking.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:border-accent-500 transition-all" hoverEffect>
              <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Real-Time Class Capacity</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Enforces strict spot quotas at the database level. Prevents race conditions so two members can never take the final 20th spot concurrently.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:border-emerald-500 transition-all" hoverEffect>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Dynamic QR Check-In</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Members generate secure barcode passes that refresh on a security interval. Coaches scan with any device webcam or mobile camera.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:border-amber-500 transition-all" hoverEffect>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Automated Waitlist Queue</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                When a class hits capacity, members enter an ordered queue. If a confirmed reservation cancels, the next waitlisted user is automatically promoted.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:border-indigo-500 transition-all" hoverEffect>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Executive SaaS Analytics</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Interactive Recharts tracking monthly membership growth, peak hourly attendance velocity, and subscription tier distributions.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:border-navy-500 transition-all" hoverEffect>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-navy-900 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Supabase RLS Multi-Tenancy</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                PostgreSQL tenant isolation with strict Row Level Security (RLS). Members cannot inspect other gym data or cross-tenant records.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="accent" size="md">Smooth Onboarding</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3">
              How FitFlow Works
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Five frictionless steps from installation to daily studio operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Create Studio', desc: 'Setup your gym profile, branding, and location settings.' },
              { step: '02', title: 'Define Plans', desc: 'Create monthly packages, pricing tiers, and class quotas.' },
              { step: '03', title: 'Schedule Classes', desc: 'Assign certified trainers, studio locations, and spot caps.' },
              { step: '04', title: 'Scan Passes', desc: 'Members check in with dynamic QR codes via webcam scanner.' },
              { step: '05', title: 'Scale Community', desc: 'Monitor attendance metrics, member streaks, and retention.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft text-left relative">
                <span className="text-3xl font-black text-brand-600/30 block mb-2 font-mono">
                  {item.step}
                </span>
                <h4 className="font-bold text-navy-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plans Preview */}
      <section id="plans" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="brand" size="md">Transparent Membership</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3 mb-12">
            Membership Packages Built for Every Athlete
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <Card className="p-8 flex flex-col justify-between border-2 border-slate-200" hoverEffect>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-navy-900">BASIC</h3>
                <p className="text-3xl font-black text-navy-900 mt-4">£30 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
                <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> 8 Studio Classes / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Standard gym floor access</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Member dashboard & booking</div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button variant="secondary" className="w-full" onClick={() => handleDemoStart('member')}>
                  Get Basic
                </Button>
              </div>
            </Card>

            <Card className="p-8 flex flex-col justify-between border-2 border-brand-600 shadow-soft-lg scale-105 relative bg-gradient-to-b from-white via-brand-50/20 to-white" hoverEffect>
              <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-navy-900">PREMIUM</h3>
                <p className="text-3xl font-black text-navy-900 mt-4">£50 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
                <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> 20 Studio Classes / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Full gym & functional zone</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Priority class booking</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Sauna & steam room access</div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button variant="accent" className="w-full" onClick={() => handleDemoStart('member')}>
                  Get Premium
                </Button>
              </div>
            </Card>

            <Card className="p-8 flex flex-col justify-between border-2 border-slate-200" hoverEffect>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-navy-900">UNLIMITED</h3>
                <p className="text-3xl font-black text-navy-900 mt-4">£70 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
                <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-500" /> Unlimited Studio Classes</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-500" /> 24/7 VIP Gym floor access</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-500" /> Waitlist skip & priority slots</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-500" /> Personal trainer assessment</div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button variant="secondary" className="w-full" onClick={() => handleDemoStart('member')}>
                  Get Unlimited
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA Strip */}
      <section className="py-20 bg-gradient-to-r from-brand-900 via-navy-900 to-navy-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge variant="accent" size="sm" className="mb-4">
            Commercial Ready (Phase 1)
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Transform Your Gym Management?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-200 max-w-xl mx-auto">
            Experience real-time capacity management, automated waitlist promotions, and frictionless QR check-ins today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => handleDemoStart('admin')}
              icon={Sparkles}
              className="w-full sm:w-auto px-8"
            >
              Launch Live Platform
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white text-[11px] font-bold">
              FF
            </div>
            <span className="font-bold text-navy-900">FITFLOW Performance Platform</span>
            <span>© 2026. Production Phase 1.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" /> RLS Security Enabled
            </span>
            <span className="text-slate-400">PostgreSQL + Vite + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
