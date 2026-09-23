import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import { useAuthInit } from '@/modules/auth/hooks/useAuthInit'
import { useAuthStore } from '@/stores/authStore';
import { AppLoader } from '@/common/components/AppLoader';
import { Toaster } from 'sonner'
import './App.css'

export default function App() {
  useAuthInit()
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Hold the boot screen until auth verification finishes
  if (!isInitialized) {
    return <AppLoader message="Verifying session..." />;
  }
  
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: { zIndex: 99999 },
        }}
      />
    </BrowserRouter>
  )
}