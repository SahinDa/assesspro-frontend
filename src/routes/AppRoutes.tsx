import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpView from '@/modules/auth/views/SignUpView'
import SignInView from '@/modules/auth/views/SignInView'
import ForgotPasswordView from '@/modules/auth/views/ForgotPasswordView'
import ResetPasswordView from '@/modules/auth/views/ResetPasswordView'
import VerifyOtpView from '@/modules/auth/views/VerifyOtpView'
import RoleSelectionView from '@/modules/users/views/RoleSelectionView'
import OrganizationSetupView from '@/modules/organizations/views/OrganizationSetupView'
import OrganizationDashboardView from '@/modules/organizations/views/OrganizationDashboardView'

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
      <Route path="/dashboard/organization" element={<OrganizationDashboardView />}></Route>
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}