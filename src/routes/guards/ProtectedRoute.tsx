import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { type UserRoleType } from '@/config/enums';
import { isUserUnassigned, getHomePathForRole } from '../utils/routeUtils';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRoleType[];
}

const ONBOARDING_PATHS = ['/role-selection', '/organization/setup'];

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const location = useLocation();

  // 1. Session verification check
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. Unauthenticated check (always send to /signin)
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const needsOnboarding = isUserUnassigned(user?.role);
  const isOnboardingRoute = ONBOARDING_PATHS.includes(location.pathname);

  // 3. User has role OTHER (3) or no role:
  //    - If already on an onboarding route: allow them through
  //    - If trying to access dashboards/features: force to /role-selection
  if (needsOnboarding) {
    return isOnboardingRoute ? <Outlet /> : <Navigate to="/role-selection" replace />;
  }

  // 4. User already has a role (0, 1, or 2):
  //    - Prevent visiting onboarding again; redirect to their respective dashboard
  if (isOnboardingRoute) {
    return <Navigate to={getHomePathForRole(user?.role)} replace />;
  }

  // 5. Role authorization check (e.g. Student attempting to access Admin routes)
  if (allowedRoles && user?.role !== undefined && !allowedRoles.includes(user.role as UserRoleType)) {
    return <Navigate to={getHomePathForRole(user.role as UserRoleType)} replace />;
  }

  return <Outlet />;
}