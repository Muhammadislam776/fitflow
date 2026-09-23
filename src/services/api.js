import { supabase, isSupabaseConfigured } from './supabase';
import {
  INITIAL_GYM,
  INITIAL_PLANS,
  INITIAL_PROFILES,
  INITIAL_MEMBERSHIPS,
  INITIAL_CLASSES,
  INITIAL_BOOKINGS,
  INITIAL_WAITLISTS,
  INITIAL_ATTENDANCE,
} from '../data/initialSeedData';

const STORAGE_KEYS = {
  GYM: 'fitflow_gym',
  PROFILES: 'fitflow_profiles',
  PLANS: 'fitflow_plans',
  MEMBERSHIPS: 'fitflow_memberships',
  CLASSES: 'fitflow_classes',
  BOOKINGS: 'fitflow_bookings',
  WAITLISTS: 'fitflow_waitlists',
  ATTENDANCE: 'fitflow_attendance',
  NOTIFICATIONS: 'fitflow_notifications',
};

// Local storage helpers
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// Initialize seed data if not present
export const initializeDataStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.GYM)) setStored(STORAGE_KEYS.GYM, INITIAL_GYM);
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) setStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) setStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS)) setStored(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) setStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) setStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  if (!localStorage.getItem(STORAGE_KEYS.WAITLISTS)) setStored(STORAGE_KEYS.WAITLISTS, INITIAL_WAITLISTS);
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) setStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
};

export const resetDataStore = () => {
  setStored(STORAGE_KEYS.GYM, INITIAL_GYM);
  setStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  setStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  setStored(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  setStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  setStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setStored(STORAGE_KEYS.WAITLISTS, INITIAL_WAITLISTS);
  setStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  setStored(STORAGE_KEYS.NOTIFICATIONS, []);
  return true;
};

// Initialize on module load
initializeDataStore();

// --- API Service Methods ---

export const api = {
  // --- Gym Info ---
  getGym: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('gyms').select('*').limit(1).single();
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.GYM, INITIAL_GYM);
  },

  updateGym: async (gymData) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('gyms').upsert(gymData).select().single();
      if (!error && data) return data;
    }
    const current = getStored(STORAGE_KEYS.GYM, INITIAL_GYM);
    const updated = { ...current, ...gymData, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.GYM, updated);
    return updated;
  },

  // --- Profiles & Members ---
  getProfiles: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },

  getMembers: async () => {
    const profiles = await api.getProfiles();
    const memberships = await api.getMemberships();
    const plans = await api.getPlans();
    const attendance = await api.getAttendance();

    const members = profiles.filter((p) => p.role === 'member');

    return members.map((m) => {
      const mem = memberships.find((ms) => ms.member_id === m.id);
      const plan = mem ? plans.find((p) => p.id === mem.plan_id) : null;
      const visitCount = attendance.filter((a) => a.member_id === m.id).length;

      return {
        ...m,
        membership: mem || null,
        plan: plan || null,
        visits: visitCount,
      };
    });
  },

  getMemberById: async (id) => {
    const members = await api.getMembers();
    return members.find((m) => m.id === id) || null;
  },

  getTrainers: async () => {
    const profiles = await api.getProfiles();
    return profiles.filter((p) => p.role === 'trainer');
  },

  createMember: async (memberData) => {
    const newId = 'user-member-' + Date.now();
    const newProfile = {
      id: newId,
      gym_id: memberData.gym_id || 'gym-001',
      full_name: memberData.full_name,
      email: memberData.email,
      phone: memberData.phone || '',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(memberData.full_name)}`,
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const profiles = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    profiles.push(newProfile);
    setStored(STORAGE_KEYS.PROFILES, profiles);

    // Create Membership if plan specified
    if (memberData.plan_id) {
      const memberships = getStored(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
      const newMembership = {
        id: 'mship-' + Date.now(),
        gym_id: memberData.gym_id || 'gym-001',
        member_id: newId,
        plan_id: memberData.plan_id,
        start_date: memberData.start_date || new Date().toISOString().split('T')[0],
        end_date: memberData.end_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'active',
      };
      memberships.push(newMembership);
      setStored(STORAGE_KEYS.MEMBERSHIPS, memberships);
    }

    return newProfile;
  },

  updateMember: async (id, updateData) => {
    const profiles = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const index = profiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updateData, updated_at: new Date().toISOString() };
      setStored(STORAGE_KEYS.PROFILES, profiles);
      return profiles[index];
    }
    return null;
  },

  // --- Membership Plans ---
  getPlans: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('membership_plans').select('*');
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  },

  createPlan: async (planData) => {
    const plans = getStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const newPlan = {
      id: 'plan-' + Date.now(),
      gym_id: 'gym-001',
      name: planData.name,
      description: planData.description,
      price: Number(planData.price),
      duration_days: Number(planData.duration_days) || 30,
      class_limit: planData.class_limit ? Number(planData.class_limit) : null,
      features: Array.isArray(planData.features) ? planData.features : [planData.features],
      is_active: true,
      created_at: new Date().toISOString(),
    };
    plans.push(newPlan);
    setStored(STORAGE_KEYS.PLANS, plans);
    return newPlan;
  },

  updatePlan: async (id, updateData) => {
    const plans = getStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const index = plans.findIndex((p) => p.id === id);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updateData };
      setStored(STORAGE_KEYS.PLANS, plans);
      return plans[index];
    }
    return null;
  },

  deletePlan: async (id) => {
    const plans = getStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const updated = plans.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PLANS, updated);
    return true;
  },

  // --- Memberships ---
  getMemberships: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('memberships').select('*');
      if (!error && data) return data;
    }
    return getStored(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  },

  // --- Classes & Real-Time Capacity Calculation ---
  getClasses: async () => {
    let classes = [];
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('classes').select('*, trainer:profiles(id, full_name, avatar_url)');
      if (!error && data) classes = data;
    } else {
      classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    }

    const bookings = getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const trainers = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES).filter((p) => p.role === 'trainer');
    const waitlists = getStored(STORAGE_KEYS.WAITLISTS, INITIAL_WAITLISTS);

    return classes.map((c) => {
      const confirmedBookings = bookings.filter((b) => b.class_id === c.id && b.status === 'confirmed');
      const waitlistedBookings = waitlists.filter((w) => w.class_id === c.id && w.status === 'active');
      const trainer = trainers.find((t) => t.id === c.trainer_id) || c.trainer || { full_name: 'Staff Coach' };

      const confirmedCount = confirmedBookings.length;
      const spotsRemaining = Math.max(0, c.capacity - confirmedCount);
      const isFull = confirmedCount >= c.capacity;

      return {
        ...c,
        trainer,
        confirmedCount,
        spotsRemaining,
        isFull,
        waitlistCount: waitlistedBookings.length,
      };
    });
  },

  getClassById: async (id) => {
    const classes = await api.getClasses();
    return classes.find((c) => c.id === id) || null;
  },

  createClass: async (classData) => {
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    const newClass = {
      id: 'class-' + Date.now(),
      gym_id: 'gym-001',
      trainer_id: classData.trainer_id || 'user-trainer-1',
      name: classData.name,
      description: classData.description || '',
      date: classData.date,
      start_time: classData.start_time,
      end_time: classData.end_time,
      capacity: Number(classData.capacity) || 20,
      location: classData.location || 'Studio A',
      status: 'scheduled',
      category: classData.category || 'General Fitness',
      intensity: classData.intensity || 'Medium',
      created_at: new Date().toISOString(),
    };
    classes.push(newClass);
    setStored(STORAGE_KEYS.CLASSES, classes);
    return newClass;
  },

  updateClass: async (id, updateData) => {
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    const index = classes.findIndex((c) => c.id === id);
    if (index !== -1) {
      classes[index] = { ...classes[index], ...updateData };
      setStored(STORAGE_KEYS.CLASSES, classes);
      return classes[index];
    }
    return null;
  },

  deleteClass: async (id) => {
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    const filtered = classes.filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CLASSES, filtered);
    return true;
  },

  // --- Bookings & Atomic Race-Condition Safe Booking ---
  getBookings: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('class_bookings').select('*, member:profiles(full_name, email, avatar_url), class:classes(name, date, start_time, location)');
      if (!error && data) return data;
    }
    const bookings = getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const profiles = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);

    return bookings.map((b) => ({
      ...b,
      member: profiles.find((p) => p.id === b.member_id) || { full_name: 'Member' },
      class: classes.find((c) => c.id === b.class_id) || { name: 'Class' },
    }));
  },

  getUserBookings: async (memberId) => {
    const all = await api.getBookings();
    const waitlists = getStored(STORAGE_KEYS.WAITLISTS, INITIAL_WAITLISTS);
    return all
      .filter((b) => b.member_id === memberId)
      .map((b) => {
        const wl = waitlists.find((w) => w.class_id === b.class_id && w.member_id === memberId && w.status === 'active');
        return {
          ...b,
          waitlistPosition: wl ? wl.position : null,
        };
      });
  },

  // Atomic Booking Logic (prevents overbooking, routes to waitlist if full)
  bookClassAtomic: async (classId, memberId) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('book_class_atomic', {
        p_class_id: classId,
        p_member_id: memberId,
      });
      if (!error && data) return data;
    }

    // Local atomic logic
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    const bookings = getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const waitlists = getStored(STORAGE_KEYS.WAITLISTS, INITIAL_WAITLISTS);

    const classItem = classes.find((c) => c.id === classId);
    if (!classItem) {
      throw new Error('Class not found.');
    }

    // Check if member is already booked or waitlisted
    const existing = bookings.find(
      (b) => b.class_id === classId && b.member_id === memberId && ['confirmed', 'waitlisted'].includes(b.status)
    );
    if (existing) {
      throw new Error(`You already have an active ${existing.status} spot for this class.`);
    }

    // Count confirmed
    const confirmedCount = bookings.filter((b) => b.class_id === classId && b.status === 'confirmed').length;

    if (confirmedCount < classItem.capacity) {
      // Confirmed spot!
      const newBooking = {
        id: 'bkg-' + Date.now(),
        gym_id: classItem.gym_id || 'gym-001',
        class_id: classId,
        member_id: memberId,
        status: 'confirmed',
        booked_at: new Date().toISOString(),
      };
      bookings.push(newBooking);
      setStored(STORAGE_KEYS.BOOKINGS, bookings);

      return {
        success: true,
        status: 'confirmed',
        booking: newBooking,
        message: 'Spot confirmed! See you on the mat.',
      };
    } else {
      // Class full -> Add to waitlist
      const activeWaitlists = waitlists.filter((w) => w.class_id === classId && w.status === 'active');
      const nextPos = activeWaitlists.length + 1;

      const newWaitlistEntry = {
        id: 'wl-' + Date.now(),
        gym_id: classItem.gym_id || 'gym-001',
        class_id: classId,
        member_id: memberId,
        position: nextPos,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      waitlists.push(newWaitlistEntry);
      setStored(STORAGE_KEYS.WAITLISTS, waitlists);

      const newBooking = {
        id: 'bkg-' + Date.now(),
        gym_id: classItem.gym_id || 'gym-001',
        class_id: classId,
        member_id: memberId,
        status: 'waitlisted',
        booked_at: new Date().toISOString(),
      };
      bookings.push(newBooking);
      setStored(STORAGE_KEYS.BOOKINGS, bookings);

      return {
        success: true,
        status: 'waitlisted',
        position: nextPos,
        booking: newBooking,
        message: `Class is full. You're #${nextPos} on the waitlist. If a spot opens, you'll be automatically enrolled!`,
      };
    }
  },

  // Atomic Cancellation with Instant Waitlist Promotion
  cancelBookingAtomic: async (bookingId) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('cancel_booking_atomic', {
        p_booking_id: bookingId,
      });
      if (!error && data) return data;
    }

    const bookings = getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    const waitlists = getStored(STORAGE_KEYS.WAITLISTS, INITIAL_WAITLISTS);
    const profiles = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);

    const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    const currentBooking = bookings[bookingIndex];
    const previousStatus = currentBooking.status;
    const classId = currentBooking.class_id;

    // Update status to cancelled
    bookings[bookingIndex] = {
      ...currentBooking,
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    };

    let promotedInfo = null;

    // If waitlisted was cancelled, mark waitlist cancelled
    if (previousStatus === 'waitlisted') {
      const wlIdx = waitlists.findIndex(
        (w) => w.class_id === classId && w.member_id === currentBooking.member_id && w.status === 'active'
      );
      if (wlIdx !== -1) {
        waitlists[wlIdx].status = 'cancelled';
        setStored(STORAGE_KEYS.WAITLISTS, waitlists);
      }
    }

    // If confirmed was cancelled, PROMOTE the top waitlist user!
    if (previousStatus === 'confirmed') {
      const activeWl = waitlists
        .filter((w) => w.class_id === classId && w.status === 'active')
        .sort((a, b) => a.position - b.position);

      if (activeWl.length > 0) {
        const topWaitlisted = activeWl[0];
        topWaitlisted.status = 'promoted';

        // Update booking to confirmed
        const waitlistedBkgIndex = bookings.findIndex(
          (b) => b.class_id === classId && b.member_id === topWaitlisted.member_id && b.status === 'waitlisted'
        );
        if (waitlistedBkgIndex !== -1) {
          bookings[waitlistedBkgIndex].status = 'confirmed';
          bookings[waitlistedBkgIndex].updated_at = new Date().toISOString();
        }

        setStored(STORAGE_KEYS.WAITLISTS, waitlists);

        const promotedMember = profiles.find((p) => p.id === topWaitlisted.member_id);
        const bookedClass = classes.find((c) => c.id === classId);

        promotedInfo = {
          member: promotedMember,
          class: bookedClass,
          memberId: topWaitlisted.member_id,
        };

        // Add a notification for promoted user
        const notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
        notifications.unshift({
          id: 'notif-' + Date.now(),
          user_id: topWaitlisted.member_id,
          title: '🎉 Spot opened! You have been promoted!',
          message: `A spot opened for ${bookedClass?.name || 'your class'} and you have been promoted from the waitlist to confirmed.`,
          type: 'success',
          created_at: new Date().toISOString(),
          read: false,
        });
        setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
      }
    }

    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    return {
      success: true,
      promoted: promotedInfo,
      message: promotedInfo
        ? `Booking cancelled. ${promotedInfo.member?.full_name || 'Waitlisted member'} was automatically promoted into the class!`
        : 'Booking cancelled successfully.',
    };
  },

  // --- Attendance & QR Scanning ---
  getAttendance: async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, member:profiles(full_name, email, avatar_url), class:classes(name, start_time, location)')
        .order('check_in_time', { ascending: false });
      if (!error && data) return data;
    }

    const attendance = getStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const profiles = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const classes = getStored(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);

    return attendance
      .map((a) => ({
        ...a,
        member: profiles.find((p) => p.id === a.member_id) || { full_name: 'Member', email: 'member@gym.com' },
        class: a.class_id ? classes.find((c) => c.id === a.class_id) || null : null,
      }))
      .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time));
  },

  checkInMember: async (memberId, gymId = 'gym-001', classId = null, method = 'qr') => {
    const profiles = getStored(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const member = profiles.find((p) => p.id === memberId);

    if (!member) {
      throw new Error('Member not found. QR code may be invalid or expired.');
    }

    // Check membership status
    const memberships = getStored(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
    const membership = memberships.find((m) => m.member_id === memberId && m.status === 'active');

    if (!membership) {
      throw new Error(`Member ${member.full_name} does not have an active membership. Status is inactive or expired.`);
    }

    const attendance = getStored(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const newRecord = {
      id: 'att-' + Date.now(),
      gym_id: gymId,
      member_id: memberId,
      class_id: classId,
      check_in_method: method,
      check_in_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    attendance.unshift(newRecord);
    setStored(STORAGE_KEYS.ATTENDANCE, attendance);

    return {
      success: true,
      record: newRecord,
      member,
      membership,
      message: `Welcome, ${member.full_name}! Check-in verified. Have a great workout! 💪`,
    };
  },

  // --- Notifications ---
  getNotifications: async (userId) => {
    const notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifications.filter((n) => !n.user_id || n.user_id === userId);
  },

  markNotificationRead: async (id) => {
    const notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
  },

  // --- Analytics & Statistics for Dashboards ---
  getDashboardMetrics: async () => {
    const members = await api.getMembers();
    const memberships = await api.getMemberships();
    const attendance = await api.getAttendance();
    const classes = await api.getClasses();

    const todayStr = new Date().toISOString().split('T')[0];

    const totalMembers = members.length;
    const activeMembers = memberships.filter((m) => m.status === 'active').length;
    const todayCheckins = attendance.filter((a) => a.check_in_time.startsWith(todayStr)).length;
    const todayClasses = classes.filter((c) => c.date === todayStr).length;

    // Growth Chart Data (Last 6 Months)
    const growthData = [
      { month: 'Oct', members: 380, revenue: 14200 },
      { month: 'Nov', members: 410, revenue: 15800 },
      { month: 'Dec', members: 435, revenue: 16900 },
      { month: 'Jan', members: 480, revenue: 18400 },
      { month: 'Feb', members: 505, revenue: 19800 },
      { month: 'Mar', members: 524, revenue: 21500 },
    ];

    // Weekly Attendance Bar Chart Data (Mon - Sun)
    const attendanceData = [
      { day: 'Mon', count: 142 },
      { day: 'Tue', count: 165 },
      { day: 'Wed', count: 158 },
      { day: 'Thu', count: 172 },
      { day: 'Fri', count: 184 },
      { day: 'Sat', count: 135 },
      { day: 'Sun', count: 98 },
    ];

    // Membership Distribution Donut Chart Data
    const distributionData = [
      { name: 'Basic (£30)', value: 160, color: '#60A5FA' },
      { name: 'Premium (£50)', value: 245, color: '#2563EB' },
      { name: 'Unlimited (£70)', value: 119, color: '#F97316' },
    ];

    return {
      totalMembers,
      activeMembers,
      todayCheckins,
      todayClasses,
      growthData,
      attendanceData,
      distributionData,
      upcomingClasses: classes.filter((c) => c.date === todayStr).slice(0, 4),
    };
  },
};
