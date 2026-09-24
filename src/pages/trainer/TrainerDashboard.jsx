import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Users,
  QrCode,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Dumbbell,
  CheckSquare,
  Square,
  Activity,
  Zap,
  TrendingUp,
  RefreshCw,
  Search,
  UserCheck,
  ShieldCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { QRScannerModal } from '../../components/qr/QRScannerModal';

// Web Audio API beep generator for coach timer
const playTone = (freq = 880, duration = 0.15, type = 'sine') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may be restricted by autoplay policy until user gesture
  }
};

export const TrainerDashboard = () => {
  const { user } = useAuth();
  const { classes, bookings, attendance, recordAttendance, refreshData } = useGym();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeClassId, setActiveClassId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Manual athlete check-in search state
  const [searchQuery, setSearchQuery] = useState('');
  const [manualCheckInSuccess, setManualCheckInSuccess] = useState(null);

  // Workout Routine Board State
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Barbell Back Squats', sets: '5x5 @ 80% 1RM', muscle: 'Legs & Core', done: true, category: 'Strength' },
    { id: 2, name: 'Romanian Deadlifts + Box Jumps', sets: '4x10 superset', muscle: 'Posterior Chain', done: false, category: 'Power' },
    { id: 3, name: 'Kettlebell Snatch Complex', sets: '4x12 each arm', muscle: 'Full Body', done: false, category: 'HIIT' },
    { id: 4, name: 'Assault Bike Tabata Finisher', sets: '8 rounds (20s/10s)', muscle: 'Cardio Engine', done: false, category: 'Endurance' },
    { id: 5, name: 'Mobility & Thoracic Decompression', sets: '5 mins cooldown', muscle: 'Flexibility', done: false, category: 'Recovery' },
  ]);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('');
  const [showAddEx, setShowAddEx] = useState(false);

  // HIIT / Tabata Interval Stopwatch State
  const [timerMode, setTimerMode] = useState('Tabata'); // 'Tabata', 'HIIT', 'EMOM'
  const [workSec, setWorkSec] = useState(20);
  const [restSec, setRestSec] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerRunning, setTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef(null);

  const coachName = user?.full_name?.split(' ')[0] || 'Alex';

  // Trainer's assigned classes: fallback to all available classes if no specific match
  const myClasses = classes.filter((c) => c.trainer_id === user?.id || c.trainer?.id === user?.id);
  const displayClasses = myClasses.length > 0 ? myClasses : classes;

  // Sync Supabase handler
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      if (refreshData) await refreshData();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Phase transition
            if (isWorkPhase) {
              if (soundEnabled) playTone(587, 0.4, 'triangle'); // Rest buzzer
              setIsWorkPhase(false);
              return restSec;
            } else {
              // Rest finished, move to next round or finish
              if (currentRound >= totalRounds) {
                if (soundEnabled) {
                  playTone(880, 0.2);
                  setTimeout(() => playTone(1174, 0.5), 250);
                }
                setTimerRunning(false);
                setCurrentRound(1);
                setIsWorkPhase(true);
                return workSec;
              } else {
                if (soundEnabled) playTone(880, 0.3, 'square'); // Work buzzer
                setCurrentRound((r) => r + 1);
                setIsWorkPhase(true);
                return workSec;
              }
            }
          }
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playTone(440, 0.08); // Countdown pip
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, isWorkPhase, currentRound, totalRounds, workSec, restSec, soundEnabled]);

  const selectTimerPreset = (preset) => {
    setTimerRunning(false);
    setTimerMode(preset);
    setCurrentRound(1);
    setIsWorkPhase(true);
    if (preset === 'Tabata') {
      setWorkSec(20);
      setRestSec(10);
      setTotalRounds(8);
      setTimeLeft(20);
    } else if (preset === 'HIIT') {
      setWorkSec(45);
      setRestSec(15);
      setTotalRounds(6);
      setTimeLeft(45);
    } else if (preset === 'EMOM') {
      setWorkSec(50);
      setRestSec(10);
      setTotalRounds(10);
      setTimeLeft(50);
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setTimeLeft(workSec);
  };

  const toggleExercise = (id) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, done: !ex.done } : ex))
    );
  };

  const addExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim()) return;
    setExercises((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newExName.trim(),
        sets: newExSets.trim() || '3 sets',
        muscle: 'Custom Drill',
        done: false,
        category: 'Custom',
      },
    ]);
    setNewExName('');
    setNewExSets('');
    setShowAddEx(false);
  };

  const openScannerForClass = (classId) => {
    setActiveClassId(classId);
    setScannerOpen(true);
  };

  // Manual one-click attendance check-in for walk-in member
  const handleManualCheckIn = async (booking) => {
    try {
      await recordAttendance({
        booking_id: booking.id,
        member_id: booking.member_id,
        class_id: booking.class_id,
        verified_by: user?.id || 'coach',
      });
      setManualCheckInSuccess(booking.member?.full_name || 'Member');
      setTimeout(() => setManualCheckInSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const totalAttendees = displayClasses.reduce(
    (acc, c) => acc + (c.confirmedCount || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO SPOTLIGHT BANNER (High-Contrast & Ultra-Sharp) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#080d1a] bg-gradient-to-br from-[#060a15] via-[#0d1527] to-[#171f38] text-white p-6 sm:p-8 shadow-2xl border border-slate-700/60">
        {/* Background photo with strong dark tint to guarantee 100% text readability */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a15]/95 via-[#0d1527]/85 to-[#060a15]/90 pointer-events-none" />

        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Floor Active • Coach Mode
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Master Level Coach
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-accent-400">Coach {coachName}</span> 🔥
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
              Your studio is primed. Review today's roster, launch the interval stopwatch, and scan attendee QR passes at the door.
            </p>

            {/* High-contrast Coach Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="font-black text-amber-300 text-sm">4.96 ★</span>
                <span className="text-slate-300 font-medium">(142 athlete reviews)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="font-black text-accent-400 text-sm">18.5 hrs</span>
                <span className="text-slate-300 font-medium">Coached this week</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="font-black text-emerald-300 text-sm">98.2%</span>
                <span className="text-slate-300 font-medium">Punctuality index</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveClassId(null);
                setScannerOpen(true);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent-500 to-orange-500 text-white font-black text-sm shadow-xl shadow-accent-500/40 hover:shadow-accent-500/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-accent-400/30"
            >
              <QrCode className="w-5 h-5 animate-pulse" />
              <span>Launch QR Scanner</span>
            </button>

            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-sm font-bold backdrop-blur-md border border-slate-600/80 transition-all cursor-pointer shadow-lg"
              title="Sync with Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-brand-400' : 'text-slate-300'}`} />
              <span className="hidden sm:inline">{syncSuccess ? 'Synced!' : 'Cloud Sync'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Connection Status Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-emerald-300 font-bold">Supabase Realtime Cloud Connected</span>
            <span className="text-slate-400">• Latency 22ms</span>
          </div>
          <span className="text-slate-300 font-medium">
            Assigned Studio: <strong className="text-white font-bold">FitFlow Downtown Studio 1 & Turf</strong>
          </span>
        </div>
      </div>

      {/* 2. TOP METRIC STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Classes</span>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-navy-900">{displayClasses.length}</h3>
            <p className="mt-1 text-xs text-brand-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Full scheduled timetable today</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-indigo-500" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Athletes</span>
            <div className="p-2.5 rounded-xl bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-navy-900">{totalAttendees}</h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">Confirmed athlete registrations</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-orange-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Check-Ins</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-600">{attendance.length}</h3>
            <p className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Live QR passes scanned</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Studio Energy Output</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-navy-900">4,850 kcal</h3>
            <p className="mt-1 text-xs text-amber-600 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>High Intensity Performance</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
        </div>
      </div>

      {/* 3. INTERACTIVE COACH TIMER & WORKOUT PLANNER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Built-in HIIT / Tabata / Circuit Interval Clock */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div
            className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-colors duration-700 pointer-events-none ${
              isWorkPhase ? 'bg-orange-500/25' : 'bg-cyan-500/25'
            }`}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isWorkPhase ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Studio Interval Stopwatch</h2>
                  <p className="text-xs text-slate-400">Tabata & HIIT interval coaching tool</p>
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={soundEnabled ? 'Mute Audio Beeps' : 'Enable Audio Beeps'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 mb-6">
              {['Tabata', 'HIIT', 'EMOM'].map((p) => (
                <button
                  key={p}
                  onClick={() => selectTimerPreset(p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timerMode === p
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {p} {p === 'Tabata' ? '20/10' : p === 'HIIT' ? '45/15' : '50/10'}
                </button>
              ))}
            </div>

            {/* Big Digital Display */}
            <div className="text-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 transition-all duration-300">
                {isWorkPhase ? (
                  <span className="text-orange-400 bg-orange-500/20 px-3 py-0.5 rounded-full border border-orange-500/30 animate-pulse">
                    🔥 WORK INTERVAL
                  </span>
                ) : (
                  <span className="text-cyan-400 bg-cyan-500/20 px-3 py-0.5 rounded-full border border-cyan-500/30">
                    💧 REST & HYDRATE
                  </span>
                )}
              </div>

              <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white select-none">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-2">
                Round <strong className="text-white text-sm">{currentRound}</strong> of {totalRounds}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all cursor-pointer"
              title="Reset Stopwatch"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg transition-all cursor-pointer ${
                timerRunning
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Interval</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Coach's Daily Workout Board & Drill Tracker */}
        <div className="lg:col-span-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-navy-900">Today's Class Drill Plan</h2>
                  <p className="text-xs text-slate-500">Live exercise checklist for coaching sessions</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setShowAddEx(!showAddEx)}
              >
                Add Drill
              </Button>
            </div>

            {/* Inline Add Exercise Form */}
            {showAddEx && (
              <form onSubmit={addExercise} className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Barbell Thrusters"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
                <input
                  type="text"
                  placeholder="4x12 reps"
                  value={newExSets}
                  onChange={(e) => setNewExSets(e.target.value)}
                  className="w-24 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
                <Button type="submit" size="sm" variant="brand">
                  Save
                </Button>
              </form>
            )}

            {/* Checklist */}
            <div className="space-y-2.5">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    ex.done
                      ? 'bg-slate-50/80 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {ex.done ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-bold ${ex.done ? 'text-slate-400' : 'text-navy-900'}`}>
                        {ex.name}
                      </p>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {ex.sets} • <strong className="text-slate-600">{ex.muscle}</strong>
                      </span>
                    </div>
                  </div>

                  <Badge variant={ex.done ? 'neutral' : 'brand'} size="sm">
                    {ex.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Drills Completed: <strong className="text-navy-900">{exercises.filter((e) => e.done).length} / {exercises.length}</strong>
            </span>
            <span className="text-emerald-600 font-semibold">Active Studio Session Mode</span>
          </div>
        </div>
      </div>

      {/* 4. ASSIGNED SESSIONS TODAY (Eye-catching Studio Cards with Cover Photos) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight flex items-center gap-2">
              <span>Your Assigned Sessions Today</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-brand-100 text-brand-700">
                {displayClasses.length} Scheduled
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live athlete rosters, studio locations, and direct QR arrival scanning.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveClassId(null);
              setScannerOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-all cursor-pointer w-fit"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Attendance Scanner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClasses.map((c) => {
            const classBookings = bookings.filter(
              (b) => b.class_id === c.id && b.status === 'confirmed'
            );
            const confirmedCount = c.confirmedCount || classBookings.length;
            const percentFilled = Math.min(100, Math.round((confirmedCount / (c.capacity || 20)) * 100));

            return (
              <div
                key={c.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Photo cover header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={c.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {c.category || 'Fitness'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-navy-900 shadow">
                      {c.date}
                    </span>
                  </div>

                  {/* Title over image bottom */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-black tracking-tight leading-snug drop-shadow-md">
                      {c.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Time & Location Pill */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-700">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-brand-600" />
                        {c.start_time} - {c.end_time}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {c.location || 'Studio A'}
                      </span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-500">Roster Capacity</span>
                        <span className="font-bold text-navy-900">
                          {confirmedCount} / {c.capacity} Booked ({percentFilled}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentFilled >= 90
                              ? 'bg-rose-500'
                              : percentFilled >= 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>

                    {/* Confirmed Athlete Avatars */}
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Registered Athletes:
                      </p>
                      <div className="flex items-center -space-x-2 overflow-hidden py-1">
                        {classBookings.slice(0, 6).map((b) => (
                          <img
                            key={b.id}
                            src={
                              b.member?.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.member?.full_name || 'User'}`
                            }
                            alt={b.member?.full_name}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm"
                            title={b.member?.full_name}
                          />
                        ))}
                        {classBookings.length > 6 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 text-[10px] font-black text-slate-700 ring-2 ring-white shadow-sm">
                            +{classBookings.length - 6}
                          </div>
                        )}
                        {classBookings.length === 0 && (
                          <span className="text-xs text-slate-400 italic">No athletes confirmed yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => openScannerForClass(c.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-accent-500 to-orange-500 text-white font-bold text-xs shadow-md shadow-accent-500/20 hover:shadow-accent-500/40 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Check In (QR)</span>
                    </button>

                    <button
                      onClick={() => window.location.assign('/trainer/classes')}
                      className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      title="View Full Roster"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE ACTIVITY FEED & ONE-CLICK ATHLETE CHECK-IN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Athlete Search & Manual Check-In (For dead batteries / no QR) */}
        <div className="lg:col-span-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Quick Manual Verification</h3>
                <p className="text-xs text-slate-500">Check in athletes if they forgot phone or pass</p>
              </div>
            </div>
          </div>

          {manualCheckInSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Successfully checked in <strong>{manualCheckInSuccess}</strong>!</span>
            </div>
          )}

          {/* Search box */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search athlete by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Matching Bookings List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {bookings
              .filter((b) => {
                if (!searchQuery.trim()) return b.status === 'confirmed';
                const q = searchQuery.toLowerCase();
                return (
                  b.member?.full_name?.toLowerCase().includes(q) ||
                  b.member?.email?.toLowerCase().includes(q)
                );
              })
              .slice(0, 5)
              .map((b) => {
                const targetClass = classes.find((c) => c.id === b.class_id);
                return (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          b.member?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.member?.full_name || 'Member'}`
                        }
                        alt={b.member?.full_name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-navy-900">
                          {b.member?.full_name || 'Registered Member'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {targetClass?.name || 'Class Session'} • {b.booking_date || 'Today'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleManualCheckIn(b)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Live Attendance Stream */}
        <div className="lg:col-span-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">Studio Floor Activity Feed</h3>
                <p className="text-xs text-slate-500">Live feed of verified member check-ins</p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {attendance.length > 0 ? (
              attendance.slice(0, 5).map((att, idx) => (
                <div
                  key={att.id || idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">
                        {att.member?.full_name || 'Athlete Checked In'}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        QR Pass verified by Coach • {att.check_in_time ? new Date(att.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                <p className="font-semibold text-slate-600">No arrivals recorded yet today.</p>
                <p className="mt-1">Scan athletes using the QR scanner as they enter the studio.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        defaultClassId={activeClassId}
      />
    </div>
  );
};
