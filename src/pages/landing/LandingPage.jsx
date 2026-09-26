import React, { useState } from 'react';
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
  Flame,
  Star,
  Activity,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Check,
  Award,
  Globe,
  Lock,
  Smartphone,
  ChevronRight,
  Heart,
  Mail,
  Send,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const LandingPage = () => {
  const navigate = useNavigate();

  // Interactive Persona Tabs (Owners, Trainers, Members)
  const [activePersona, setActivePersona] = useState('owners');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Newsletter Email State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const personaContent = {
    owners: {
      badge: 'For Gym Owners & Managers',
      title: 'Complete Operations & Revenue on Autopilot',
      description:
        'Manage multiple facilities, automate recurring membership billing, monitor turnstile throughput, and analyze real-time attendance velocity from a unified executive command center.',
      features: [
        'Automated multi-tier memberships (Basic, Premium, Unlimited)',
        'Atomic database spot allocation — zero double-bookings',
        'Staff management with trainer schedules & role permissions',
        'Executive SaaS metrics: revenue velocity, retention, and peak occupancy',
      ],
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      statLabel: 'Average Studio Revenue Increase',
      statVal: '+28.4%',
    },
    trainers: {
      badge: 'For Head Coaches & Instructors',
      title: 'Next-Level Floor Coaching & Fast Check-Ins',
      description:
        'Say goodbye to paper rosters. View real-time attendee lists, scan dynamic QR passes directly from your phone camera, run custom HIIT/Tabata interval timers, and track workout drills live.',
      features: [
        'Built-in Tabata & HIIT interval stopwatch with sound cues',
        'Live athlete roster with instant webcam / camera QR scanning',
        'Interactive daily drill planner with muscle group targeting',
        'One-click manual check-in override for walk-in athletes',
      ],
      image:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      statLabel: 'Coach Check-in Time Saved',
      statVal: '85% Faster',
    },
    members: {
      badge: 'For Members & Athletes',
      title: 'Effortless Class Booking & Touchless Access',
      description:
        'A sleek mobile-first experience. Book your favorite HIIT and yoga sessions in one click, receive automated waitlist promotions, and generate dynamic secure QR passes for seamless studio entry.',
      features: [
        'Dynamic 60-second rotating QR passes for secure access',
        'One-tap class reservations with real-time remaining spots',
        'Automated waitlist queue — never miss a full class cancellation',
        'Personal attendance streaks, class history, and membership stats',
      ],
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
      statLabel: 'Member Retention Rate',
      statVal: '94.2%',
    },
  };

  const faqs = [
    {
      q: 'How does the camera QR check-in work?',
      a: 'Members open their personal dashboard to display a secure QR pass that automatically refreshes. Trainers and front desk staff scan the pass using any phone or laptop webcam. The attendance is instantly verified and synced with Supabase in real-time.',
    },
    {
      q: 'How does atomic class capacity protection prevent double bookings?',
      a: 'FitFlow uses PostgreSQL database-level row locking. Even if multiple members click "Book Class" simultaneously on the last available spot, only the first request succeeds while others are smoothly queued into the automated waitlist.',
    },
    {
      q: 'What happens when a fully booked class has a cancellation?',
      a: 'The waitlist engine immediately detects the open spot and automatically promotes the next member in the queue, notifying them in their dashboard and updating the live studio capacity.',
    },
    {
      q: 'Can I connect my own Supabase cloud database?',
      a: 'Yes! FitFlow includes complete Supabase SQL migration files (`schema.sql` and `seed.sql`) with PostgreSQL Row Level Security (RLS) policies. Simply add your Supabase URL and anon key to `.env`.',
    },
    {
      q: 'Is FitFlow optimized for mobile tablets and phones?',
      a: 'Absolutely. Every screen — from the Member QR pass to the Trainer Interval Stopwatch and Admin Dashboard — is fully responsive and optimized for mobile devices and gym floor tablets.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white font-sans antialiased">
      {/* 1. TOP PUBLIC NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform duration-300">
              <Dumbbell className="w-5 h-5 text-accent-400 rotate-[-25deg] group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tight text-navy-900 leading-none">
                FIT<span className="text-accent-500">FLOW</span>
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase mt-0.5">
                Commercial Gym OS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#interactive-preview" className="hover:text-brand-600 transition-colors">Live Portal</a>
            <a href="#classes" className="hover:text-brand-600 transition-colors">Studio Classes</a>
            <a href="#plans" className="hover:text-brand-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/login')}
              className="font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            >
              Sign In
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate('/signup')}
              icon={ArrowRight}
              className="font-bold shadow-md shadow-accent-500/20 hover:shadow-accent-500/40 hover:scale-105 transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH DYNAMIC VISUALS & EFFECTS */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-36 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-brand-50/20">
        {/* Decorative background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-400/15 to-accent-400/15 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Notification Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold mb-8 shadow-xl shadow-slate-900/10 border border-slate-800 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400">FitFlow 2.0 Live</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">Supabase Cloud Realtime Active</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-navy-900 leading-[1.08] max-w-5xl mx-auto">
            Run Your Entire Gym <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500">
              Without Friction & Clutter.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            The high-performance commercial SaaS platform for modern fitness clubs. Features atomic spot reservations, camera QR turnstiles, coach interval stopwatches, and strictly isolated role portals.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/signup')}
              icon={ArrowRight}
              className="w-full sm:w-auto text-base px-8 py-4 shadow-xl shadow-accent-500/30 hover:shadow-accent-500/50 hover:scale-105 active:scale-95 transition-all font-extrabold cursor-pointer"
            >
              Start Free Studio Trial
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
              icon={Play}
              className="w-full sm:w-auto text-base px-8 py-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 font-bold transition-all cursor-pointer"
            >
              Sign In to Your Portal
            </Button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <h3 className="text-2xl sm:text-3xl font-black text-navy-900">500+</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Active Fitness Clubs</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <h3 className="text-2xl sm:text-3xl font-black text-brand-600">99.98%</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">QR Turnstile Uptime</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <h3 className="text-2xl sm:text-3xl font-black text-accent-500">140,000+</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Verified QR Check-Ins</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">4.96 ★</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Athlete Rating Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SLIDING PERSONA TABS */}
      <section id="interactive-preview" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              Interactive Multi-Role Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3">
              One Unified System. Dedicated Portals.
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Explore how FitFlow tailors the interface for Owners, Coaches, and Members.
            </p>

            {/* Persona Switcher Tabs */}
            <div className="inline-flex p-1.5 mt-8 bg-slate-100 rounded-2xl border border-slate-200">
              {[
                { id: 'owners', label: '👑 Gym Owners' },
                { id: 'trainers', label: '💪 Head Trainers' },
                { id: 'members', label: '🏃 Athletes & Members' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePersona(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activePersona === tab.id
                      ? 'bg-white text-navy-900 shadow-md'
                      : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display with Hover / Transition Effects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm transition-all duration-300">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
                <Sparkles className="w-3.5 h-3.5" />
                {personaContent[activePersona].badge}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-snug">
                {personaContent[activePersona].title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {personaContent[activePersona].description}
              </p>

              <div className="space-y-3 pt-2">
                {personaContent[activePersona].features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button
                  variant="brand"
                  size="md"
                  onClick={() => navigate('/signup')}
                  icon={ArrowRight}
                >
                  Explore {personaContent[activePersona].badge.split(' ')[1]} Portal
                </Button>
              </div>
            </div>

            {/* Visual Image Card with Floating Stat Pill */}
            <div className="lg:col-span-6 relative group">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video lg:aspect-[4/3]">
                <img
                  src={personaContent[activePersona].image}
                  alt={personaContent[activePersona].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Floating Metric Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/40 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {personaContent[activePersona].statLabel}
                    </p>
                    <h4 className="text-2xl font-black text-brand-600 mt-0.5">
                      {personaContent[activePersona].statVal}
                    </h4>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Verified Metric
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE STUDIO CLASS CAROUSEL / SHOWCASE WITH HIGH-RES PHOTOS */}
      <section id="classes" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-50 text-accent-700 border border-accent-200">
              Live Timetable & Roster
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3">
              Studio Sessions Powered by FitFlow
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Real-time capacity tracking, certified coach rosters, and instant QR verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'High-Octane HIIT Burn',
                category: 'Cardio & HIIT',
                time: '12:30 - 13:15',
                coach: 'Coach Marcus Chen',
                spots: '14 / 15 Booked (93%)',
                badgeColor: 'bg-rose-500',
                image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Powerlifting & Strength',
                category: 'Strength',
                time: '17:30 - 18:30',
                coach: 'Coach Alex Morgan',
                spots: '10 / 12 Booked (83%)',
                badgeColor: 'bg-amber-500',
                image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Sunrise Vinyasa Flow',
                category: 'Yoga & Mind',
                time: '07:00 - 08:00',
                coach: 'Coach Maya Patel',
                spots: '18 / 20 Booked (90%)',
                badgeColor: 'bg-indigo-500',
                image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Metabolic Conditioning',
                category: 'Conditioning',
                time: '08:00 - 09:00',
                coach: 'Coach Marcus Chen',
                spots: '15 / 16 Booked (94%)',
                badgeColor: 'bg-emerald-500',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
              },
            ].map((cls, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {cls.category}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-black leading-snug drop-shadow-md">{cls.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between font-bold text-navy-900">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-brand-600" /> Time:
                      </span>
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Instructor:</span>
                      <span className="font-semibold text-navy-900">{cls.coach}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Occupancy:</span>
                      <span className="font-black text-accent-600">{cls.spots}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/signup')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-navy-900 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Reserve Spot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE SAAS INFRASTRUCTURE FEATURES */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              Battle-Tested Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3">
              Engineered for Real-World Gyms
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Built on modern PostgreSQL, real-time WebSockets, and zero-trust authentication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Smart Memberships</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Configure tiered packages (Basic, Premium, Unlimited) with class allowances, automated expiration rules, and member status tracking.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-accent-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Real-Time Capacity Lock</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Enforces strict spot quotas at the database level. Prevents race conditions so two members can never take the final spot concurrently.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Dynamic QR Turnstile Check-In</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Members generate secure barcode passes that refresh on a 60-second security interval. Coaches scan with any device webcam or phone.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Automated Waitlist Queue</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                When a class hits capacity, members enter an ordered queue. If a reservation is cancelled, the next waitlisted user is automatically promoted.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">HIIT / Tabata Coach Stopwatch</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Interactive digital timer with custom work/rest intervals, audio countdown beeps, round counter, and real-time exercise drill checklists.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-navy-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-navy-900 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Supabase RLS Multi-Tenancy</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                PostgreSQL tenant isolation with strict Row Level Security (RLS). Members cannot inspect other gym data or cross-tenant records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING PLANS */}
      <section id="plans" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
            Transparent Membership Packages
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3 mb-12">
            Plans Built for Every Athlete & Studio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* BASIC */}
            <div className="p-8 rounded-3xl bg-white flex flex-col justify-between border-2 border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-navy-900">BASIC</h3>
                <p className="text-4xl font-black text-navy-900 mt-4">
                  £30 <span className="text-xs text-slate-400 font-normal">/ month</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">Essential floor access for casual trainers.</p>
                <div className="mt-6 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>8 Studio Classes / month</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Standard gym floor access</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Member dashboard & booking</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Dynamic mobile QR pass</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button variant="secondary" className="w-full font-bold" onClick={() => navigate('/signup')}>
                  Choose Basic
                </Button>
              </div>
            </div>

            {/* PREMIUM */}
            <div className="p-8 rounded-3xl bg-white flex flex-col justify-between border-2 border-brand-600 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 scale-105 relative bg-gradient-to-b from-white via-brand-50/20 to-white">
              <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-bl-2xl shadow-sm">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-navy-900">PREMIUM</h3>
                <p className="text-4xl font-black text-navy-900 mt-4">
                  £50 <span className="text-xs text-slate-400 font-normal">/ month</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">Full athletic access with priority reservations.</p>
                <div className="mt-6 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>20 Studio Classes / month</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Full gym & functional turf zone</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Priority class booking window</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Sauna & steam room access</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button variant="accent" className="w-full font-extrabold shadow-md shadow-accent-500/30" onClick={() => navigate('/signup')}>
                  Choose Premium
                </Button>
              </div>
            </div>

            {/* UNLIMITED */}
            <div className="p-8 rounded-3xl bg-white flex flex-col justify-between border-2 border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-navy-900">UNLIMITED</h3>
                <p className="text-4xl font-black text-navy-900 mt-4">
                  £70 <span className="text-xs text-slate-400 font-normal">/ month</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">Unlimited studio sessions and 24/7 VIP key.</p>
                <div className="mt-6 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Unlimited Studio Classes</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>24/7 VIP Gym floor access</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Waitlist skip & priority slots</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                    <span>Personal trainer quarterly assessment</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Button variant="secondary" className="w-full font-bold" onClick={() => navigate('/signup')}>
                  Choose Unlimited
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Everything you need to know about setting up and running FitFlow.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-navy-900 text-sm sm:text-base cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRE-FOOTER CTA BANNER */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a15]/95 via-[#0d1527]/90 to-[#060a15]/95" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold bg-accent-500/20 text-accent-300 border border-accent-500/30">
            <Flame className="w-4 h-4 text-accent-400" />
            Ready to upgrade your gym operations?
          </span>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Start Running FitFlow Today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Join hundreds of modern fitness facilities that eliminated manual spreadsheets, double-bookings, and front desk queues forever.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/signup')}
              icon={ArrowRight}
              className="w-full sm:w-auto px-8 py-4 text-base font-black shadow-xl shadow-accent-500/30 cursor-pointer"
            >
              Create Free Account
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
            >
              Sign In to Your Gym
            </Button>
          </div>
        </div>
      </section>

      {/* 9. PROFESSIONAL DARK THEME MULTI-COLUMN FOOTER */}
      <footer className="bg-[#070b15] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Newsletter & Subscribe Row */}
          <div className="pb-12 border-b border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Subscribe to Studio Intelligence</span>
                <Sparkles className="w-4 h-4 text-accent-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Monthly product updates, gym owner growth benchmarks, and database release notes.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="Enter your studio email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* 4 Main Footer Columns */}
          <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                  <Dumbbell className="w-4 h-4 text-accent-400 rotate-[-25deg]" />
                </div>
                <span className="font-black text-xl text-white tracking-tight">
                  FIT<span className="text-accent-500">FLOW</span>
                </span>
              </Link>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                The next-generation commercial gym operating system. Built for athletic performance, seamless turnstile QR verification, and automated class capacity protection.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com/Muhammadislam776/fitflow"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                  title="GitHub Repository"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                  title="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Class Timetable</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">QR Camera Turnstiles</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Waitlist Promotion</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">HIIT Stopwatch Tool</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Atomic PostgreSQL Lock</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Multi-Tenant Isolation</a></li>
              </ul>
            </div>

            {/* Col 3: Solutions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#interactive-preview" className="hover:text-white transition-colors">Commercial Health Clubs</a></li>
                <li><a href="#interactive-preview" className="hover:text-white transition-colors">Boutique Fitness Studios</a></li>
                <li><a href="#interactive-preview" className="hover:text-white transition-colors">CrossFit Box Affiliates</a></li>
                <li><a href="#interactive-preview" className="hover:text-white transition-colors">Yoga & Pilates Sanctuaries</a></li>
                <li><a href="#interactive-preview" className="hover:text-white transition-colors">Personal Training Studios</a></li>
                <li><a href="#interactive-preview" className="hover:text-white transition-colors">Corporate Wellness Centers</a></li>
              </ul>
            </div>

            {/* Col 4: Platform & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Security & Trust</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Supabase Cloud Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Row Level Security (RLS)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR & Data Protection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status Monitor</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">FITFLOW Gym SaaS Platform</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} FitFlow Inc. All rights reserved.</span>
            </div>

            {/* Live Operational Status Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 font-bold">Supabase Realtime Cloud Connected</span>
                <span className="text-slate-500">• Latency 22ms</span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Role Guard Active
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
