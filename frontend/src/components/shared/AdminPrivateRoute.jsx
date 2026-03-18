import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  /**
   * FULL POWER PROTECTION:
   * We must wait for the loading state to finish before redirecting.
   * This prevents "False Negatives" during page refreshes.
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Final check: Is the user logged in AND are they an Admin?
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default AdminPrivateRoute;