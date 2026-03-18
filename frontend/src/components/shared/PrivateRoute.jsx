import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  /**
   * FULL POWER SYNC:
   * During page reloads, Redux-Persist takes a moment to "re-hydrate" the state.
   * If we don't wait for 'loading' to be false, the user will be redirected to Sign-In
   * erroneously.
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Final validation: Redirect to sign-in only if no user exists after loading is done
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;