import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Lazy-loaded pages for fast bundle splitting
const LandingPage = lazy(() => import('../pages/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('../pages/auth/SignupPage').then(m => ({ default: m.SignupPage })));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminMembers = lazy(() => import('../pages/admin/AdminMembers').then(m => ({ default: m.AdminMembers })));
const AdminMemberDetail = lazy(() => import('../pages/admin/AdminMemberDetail').then(m => ({ default: m.AdminMemberDetail })));
const AdminPlans = lazy(() => import('../pages/admin/AdminPlans').then(m => ({ default: m.AdminPlans })));
const AdminClasses = lazy(() => import('../pages/admin/AdminClasses').then(m => ({ default: m.AdminClasses })));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings').then(m => ({ default: m.AdminBookings })));
const AdminAttendance = lazy(() => import('../pages/admin/AdminAttendance').then(m => ({ default: m.AdminAttendance })));
const AdminStaff = lazy(() => import('../pages/admin/AdminStaff').then(m => ({ default: m.AdminStaff })));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const TrainerDashboard = lazy(() => import('../pages/trainer/TrainerDashboard').then(m => ({ default: m.TrainerDashboard })));
const TrainerClasses = lazy(() => import('../pages/trainer/TrainerClasses').then(m => ({ default: m.TrainerClasses })));
const TrainerMembers = lazy(() => import('../pages/trainer/TrainerMembers').then(m => ({ default: m.TrainerMembers })));
const TrainerAttendance = lazy(() => import('../pages/trainer/TrainerAttendance').then(m => ({ default: m.TrainerAttendance })));

const MemberDashboard = lazy(() => import('../pages/member/MemberDashboard').then(m => ({ default: m.MemberDashboard })));
const MemberClasses = lazy(() => import('../pages/member/MemberClasses').then(m => ({ default: m.MemberClasses })));
const MemberBookings = lazy(() => import('../pages/member/MemberBookings').then(m => ({ default: m.MemberBookings })));
const MemberMembership = lazy(() => import('../pages/member/MemberMembership').then(m => ({ default: m.MemberMembership })));
const MemberAttendance = lazy(() => import('../pages/member/MemberAttendance').then(m => ({ default: m.MemberAttendance })));
const MemberQRCode = lazy(() => import('../pages/member/MemberQRCode').then(m => ({ default: m.MemberQRCode })));
const MemberProfile = lazy(() => import('../pages/member/MemberProfile').then(m => ({ default: m.MemberProfile })));

const LoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    <span className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
      Loading view...
    </span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Strictly Admin Portal - ONLY Admin allowed! */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="members/:id" element={<AdminMemberDetail />} />
          <Route path="memberships" element={<AdminPlans />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Strictly Trainer Portal - ONLY Trainer allowed! */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/trainer/dashboard" replace />} />
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="classes" element={<TrainerClasses />} />
          <Route path="members" element={<TrainerMembers />} />
          <Route path="attendance" element={<TrainerAttendance />} />
        </Route>

        {/* Strictly Member Portal - ONLY Member allowed! */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/member/dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="classes" element={<MemberClasses />} />
          <Route path="bookings" element={<MemberBookings />} />
          <Route path="membership" element={<MemberMembership />} />
          <Route path="qr" element={<MemberQRCode />} />
          <Route path="attendance" element={<MemberAttendance />} />
          <Route path="profile" element={<MemberProfile />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
