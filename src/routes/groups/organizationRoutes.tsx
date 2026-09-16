import { Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from '@/modules/layouts/AppLayout';
import { UserRole } from '@/config/enums';

const DashboardView = lazy(() => import('@/modules/dashboard/views/DashboardView'));
const TestsView = lazy(() => import('@/modules/tests/views/TestsView'));
const OrgStudentsView = lazy(() => import('@/modules/students/views/OrgStudentsView'));
const BookmarksView = lazy(() => import('@/modules/bookmarks/views/BookmarksView'));
const LeaderboardView = lazy(() => import('@/modules/leaderboards/views/LeaderboardView'));
const NotificationsView = lazy(() => import('@/modules/notifications/views/NotificationsView'));
const TestAttemptsView = lazy(() => import('@/modules/attempts/views/TestAttemptsView'));

// Subscriptions module exports
const PlansView = lazy(() =>
  import('@/modules/subscriptions').then((m) => ({ default: m.PlansView }))
);
const TransactionsView = lazy(() =>
  import('@/modules/subscriptions').then((m) => ({ default: m.TransactionsView }))
);

export const organizationRoutes = (
  <Route path="/dashboard" element={<AppLayout role={UserRole.ORGANIZATION} />}>
    <Route index element={<Navigate to="/dashboard/organization" replace />} />
    <Route path="organization" element={<DashboardView role={UserRole.ORGANIZATION} />} />
    <Route path="tests" element={<TestsView />} />
    <Route path="students" element={<OrgStudentsView />} />
    <Route path="bookmarks" element={<BookmarksView />} />
    <Route path="leaderboards" element={<LeaderboardView />} />
    <Route path="notifications" element={<NotificationsView />} />
    <Route path="plans" element={<PlansView userRole={UserRole.ORGANIZATION} />} />
    <Route path="billing" element={<TransactionsView userRole={UserRole.ORGANIZATION} />} />
    <Route path="attempts" element={<TestAttemptsView userRole={UserRole.ORGANIZATION} />} />
  </Route>
);