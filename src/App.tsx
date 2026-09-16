import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import { useAuthInit } from '@/modules/auth/hooks/useAuthInit'
import './App.css'

export default function App() {
  useAuthInit()
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}