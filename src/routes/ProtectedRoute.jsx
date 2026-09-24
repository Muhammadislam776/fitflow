import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <span className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Verifying security authorization...
        </span>
      </div>
    );
  }

  // Not authenticated -> must log in first!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role authorization check -> strict portal isolation
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'trainer') {
      return <Navigate to="/trainer/dashboard" replace />;
    } else {
      return <Navigate to="/member/dashboard" replace />;
    }
  }

  return children;
};
