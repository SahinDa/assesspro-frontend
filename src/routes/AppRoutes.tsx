import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpView from '@/modules/auth/views/SignUpView'
import SignInView from '@/modules/auth/views/SignInView'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to sign-in or dashboard */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      
      {/* Auth Routes */}
      <Route path="/signin" element={<SignInView />} />
      <Route path="/signup" element={<SignUpView />} />
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}