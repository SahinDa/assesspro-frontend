import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { isUserUnassigned, getHomePathForRole } from '../utils/routeUtils';
import { Loader2 } from 'lucide-react';

export function PublicOnlyRoute() {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  // 1. Wait for session check to complete so login forms don't flicker
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. If logged in, redirect them away from signin/signup
  if (isAuthenticated) {
    if (isUserUnassigned(user?.role)) {
      return <Navigate to="/role-selection" replace />;
    }
    return <Navigate to={getHomePathForRole(user?.role)} replace />;
  }

  // 3. Guest confirmed -> Render auth page
  return <Outlet />;
}