import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpView from '@/modules/auth/views/SignUpView'
import SignInView from '@/modules/auth/views/SignInView'
import ForgotPasswordView from '@/modules/auth/views/ForgotPasswordView'
import ResetPasswordView from '@/modules/auth/views/ResetPasswordView'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to sign-in or dashboard */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      
      {/* Auth Routes */}
      <Route path="/signin" element={<SignInView />} />
      <Route path="/signup" element={<SignUpView />} />
      <Route path="/forgot-password" element={<ForgotPasswordView />} />
      <Route path="/reset-password" element={<ResetPasswordView />} />
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}