import { Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from '@/modules/layouts/AppLayout';
import { UserRole } from '@/config/enums';

const DashboardView = lazy(() => import('@/modules/dashboard/views/DashboardView'));
const BookmarksView = lazy(() => import('@/modules/bookmarks/views/BookmarksView'));
const LeaderboardView = lazy(() => import('@/modules/leaderboards/views/LeaderboardView'));
const NotificationsView = lazy(() => import('@/modules/notifications/views/NotificationsView'));
const TestsView = lazy(() => import('@/modules/tests/views/TestsView'));
const TestAttemptsView = lazy(() => import('@/modules/attempts/views/TestAttemptsView'));

const PlansView = lazy(() =>
  import('@/modules/subscriptions').then((m) => ({ default: m.PlansView }))
);
const TransactionsView = lazy(() =>
  import('@/modules/subscriptions').then((m) => ({ default: m.TransactionsView }))
);

export const studentRoutes = (
  <Route path="/student" element={<AppLayout role={UserRole.STUDENT} />}>
    <Route index element={<Navigate to="/student/dashboard" replace />} />
    <Route path="dashboard" element={<DashboardView role={UserRole.STUDENT} />} />
    <Route path="bookmarks" element={<BookmarksView />} />
    <Route path="leaderboards" element={<LeaderboardView />} />
    <Route path="notifications" element={<NotificationsView />} />
    <Route path="plans" element={<PlansView userRole={UserRole.STUDENT} />} />
    <Route path="transactions" element={<TransactionsView userRole={UserRole.STUDENT} />} />
    <Route path="tests" element={<TestsView userRole={UserRole.STUDENT} />} />
    <Route path="attempts" element={<TestAttemptsView userRole={UserRole.STUDENT} />} />
  </Route>
);