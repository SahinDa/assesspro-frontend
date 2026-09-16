import { Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from '@/modules/layouts/AppLayout';
import { UserRole } from '@/config/enums';

const DashboardView = lazy(() => import('@/modules/dashboard/views/DashboardView'));
const AdminOrganizationsView = lazy(() => import('@/modules/admin/views/AdminOrganizationsView'));

const PlansView = lazy(() =>
  import('@/modules/subscriptions').then((m) => ({ default: m.PlansView }))
);
const TransactionsView = lazy(() =>
  import('@/modules/subscriptions').then((m) => ({ default: m.TransactionsView }))
);

export const adminRoutes = (
  <Route path="/admin" element={<AppLayout role={UserRole.ADMIN} />}>
    <Route index element={<Navigate to="/admin/overview" replace />} />
    <Route path="overview" element={<DashboardView role={UserRole.ADMIN} />} />
    <Route path="plans" element={<PlansView userRole={UserRole.ADMIN} />} />
    <Route path="transactions" element={<TransactionsView userRole={UserRole.ADMIN} />} />
    <Route path="organizations" element={<AdminOrganizationsView />} />
  </Route>
);