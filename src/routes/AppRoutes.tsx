import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpView from '@/modules/auth/views/SignUpView'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Sign Up Endpoint Only */}
      <Route path="/signup" element={<SignUpView />} />

      {/* Catch-all fallback redirects to /signup */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  )
}