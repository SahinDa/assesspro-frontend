import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import SignUpView from '@/modules/auth/views/SignUpView'
import SignInView from '@/modules/auth/views/SignInView'
import ForgotPasswordView from '@/modules/auth/views/ForgotPasswordView'
import ResetPasswordView from '@/modules/auth/views/ResetPasswordView'
import VerifyOtpView from '@/modules/auth/views/VerifyOtpView'
import RoleSelectionView from '@/modules/users/views/RoleSelectionView'
import OrganizationSetupView from '@/modules/organizations/views/OrganizationSetupView'

import DashboardView from '@/modules/dashboard/views/DashboardView'
import AppLayout from '@/modules/layouts/AppLayout'
import { UserRole } from '@/config/enums'
import TestsView from '@/modules/tests/views/TestsView'
import OrgStudentsView from '@/modules/students/views/OrgStudentsView'
const BookmarksView = lazy(() => import('@/modules/bookmarks/views/BookmarksView'))
const LeaderboardView = lazy(() => import('@/modules/leaderboards/views/LeaderboardView'))
import NotificationsView from '@/modules/notifications/views/NotificationsView'
import { PlansView, TransactionsView } from '@/modules/subscriptions'
import TestAttemptsView from "@/modules/attempts/views/TestAttemptsView"
import AdminOrganizationsView from '@/modules/admin/views/AdminOrganizationsView'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to sign-in or dashboard */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      
      {/* Auth Routes */}
      <Route path="/signin" element={<SignInView />} />
      <Route path="/signup" element={<SignUpView />} />
      <Route path="/verify-otp" element={<VerifyOtpView />} />
      <Route path="/forgot-password" element={<ForgotPasswordView />} />
      <Route path="/reset-password" element={<ResetPasswordView />} />

      <Route path="/role-selection" element={<RoleSelectionView />} />
      <Route path="/organization/setup" element={<OrganizationSetupView />} />

      
      {/* 1. Organization Dashboard */}
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
        <Route path ="attempts" element={<TestAttemptsView userRole={UserRole.ORGANIZATION}/>} />
      </Route>

      {/* 2. Student Dashboard */}
      <Route path="/student" element={<AppLayout role={UserRole.STUDENT} />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView role={UserRole.STUDENT} />} />
         <Route path="bookmarks" element={<BookmarksView />} />
        <Route path="leaderboards" element={<LeaderboardView />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="plans" element={<PlansView userRole={UserRole.STUDENT} />} />
        <Route path="transactions" element={<TransactionsView userRole={UserRole.STUDENT} />} />
        <Route path="tests" element={<TestsView userRole={UserRole.STUDENT} />} />
        <Route path ="attempts" element={<TestAttemptsView userRole={UserRole.STUDENT}/>} />
      </Route>

      {/* 3. Super Admin Dashboard */}
      <Route path="/admin" element={<AppLayout role={UserRole.ADMIN} />}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<DashboardView role={UserRole.ADMIN} />} />
        <Route path="plans" element={<PlansView userRole={UserRole.ADMIN} />} />
        <Route path="transactions" element={<TransactionsView userRole={UserRole.ADMIN} />} />
        <Route path="organizations" element={<AdminOrganizationsView />} />
      </Route>

      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}