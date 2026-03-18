import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  /**
   * AUTH HYDRATION CHECK:
   * During page reloads, Redux-Persist takes a moment to "re-hydrate" the state.
   * We wait for 'loading' to be false to prevent an erroneous redirect to Sign-In.
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  /**
   * ADMIN VALIDATION:
   * Only renders child routes (via <Outlet />) if the user exists AND has isAdmin: true.
   * If they fail either check, they are sent to the sign-in page.
   */
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default AdminPrivateRoute;