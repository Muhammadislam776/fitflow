import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, resetDataStore } from '../services/api';
import { useNotification } from './NotificationContext';

const GymContext = createContext(null);

export const GymProvider = ({ children }) => {
  const [gym, setGym] = useState(null);
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useNotification();

  const loadAllData = useCallback(async () => {
    try {
      const [g, c, m, t, p, a, b, mt] = await Promise.all([
        api.getGym(),
        api.getClasses(),
        api.getMembers(),
        api.getTrainers(),
        api.getPlans(),
        api.getAttendance(),
        api.getBookings(),
        api.getDashboardMetrics(),
      ]);

      setGym(g);
      setClasses(c);
      setMembers(m);
      setTrainers(t);
      setPlans(p);
      setAttendance(a);
      setBookings(b);
      setMetrics(mt);
    } catch (err) {
      console.error('Failed to load gym data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Booking action with toast & confetti
  const handleBookClass = async (classId, memberId) => {
    try {
      const res = await api.bookClassAtomic(classId, memberId);
      await loadAllData();

      if (res.status === 'confirmed') {
        showToast({
          type: 'success',
          title: 'Booking Confirmed!',
          message: res.message,
          triggerConfetti: true,
        });
      } else {
        showToast({
          type: 'warning',
          title: 'Added to Waitlist',
          message: res.message,
        });
      }
      return res;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Booking Failed',
        message: err.message,
      });
      throw err;
    }
  };

  // Cancel booking action with waitlist promotion notification
  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await api.cancelBookingAtomic(bookingId);
      await loadAllData();

      showToast({
        type: 'info',
        title: 'Booking Cancelled',
        message: res.message,
      });

      if (res.promoted) {
        showToast({
          type: 'success',
          title: '🎉 Waitlist Spot Auto-Promoted!',
          message: `${res.promoted.member?.full_name || 'Next member'} was automatically promoted from the waitlist into ${res.promoted.class?.name || 'the class'}!`,
          duration: 6000,
          triggerConfetti: true,
        });
      }
      return res;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Cancellation Failed',
        message: err.message,
      });
      throw err;
    }
  };

  // QR or Manual Check-In action
  const handleCheckIn = async (memberId, classId = null, method = 'qr') => {
    try {
      const res = await api.checkInMember(memberId, gym?.id || 'gym-001', classId, method);
      await loadAllData();

      showToast({
        type: 'success',
        title: 'Check-In Successful! 💪',
        message: res.message,
        triggerConfetti: true,
      });
      return res;
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Check-In Denied',
        message: err.message,
      });
      throw err;
    }
  };

  const handleResetData = async () => {
    resetDataStore();
    await loadAllData();
    showToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All gym classes, members, and bookings have been restored to initial state.',
    });
  };

  return (
    <GymContext.Provider
      value={{
        gym,
        classes,
        members,
        trainers,
        plans,
        attendance,
        bookings,
        metrics,
        loading,
        refresh: loadAllData,
        bookClass: handleBookClass,
        cancelBooking: handleCancelBooking,
        checkIn: handleCheckIn,
        resetData: handleResetData,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
