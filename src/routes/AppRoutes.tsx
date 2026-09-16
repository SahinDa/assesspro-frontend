import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { PublicOnlyRoute } from './guards/PublicOnlyRoute';
import { getHomePathForRole } from './utils/routeUtils';
import { UserRole } from '@/config/enums';
import { AppLoader } from '@/common/components/AppLoader';

import { publicRoutes } from './groups/publicRoutes';
import { onboardingRoutes } from './groups/onboardingRoutes';
import { organizationRoutes } from './groups/organizationRoutes';
import { studentRoutes } from './groups/studentRoutes';
import { adminRoutes } from './groups/adminRoutes';

function PageFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Navigate to={getHomePathForRole(user?.role)} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader message="Loading workspace..." />}>
      <Routes>
        {/* Smart Root Entrypoint */}
        <Route path="/" element={<RootRedirect />} />

        {/* 1. Guests Only */}
        <Route element={<PublicOnlyRoute />}>
          {publicRoutes}
        </Route>

        {/* 2. Authenticated Onboarding (role: OTHER / 3) */}
        <Route element={<ProtectedRoute />}>
          {onboardingRoutes}
        </Route>

        {/* 3. Role-Gated Application Trees */}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ORGANIZATION]} />}>
          {organizationRoutes}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]} />}>
          {studentRoutes}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          {adminRoutes}
        </Route>

        {/* 4. Global 404 / Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}