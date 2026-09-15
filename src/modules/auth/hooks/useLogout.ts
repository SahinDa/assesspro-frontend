import { useState } from 'react'
import { authService } from '../services/authService'
import { useAuthStore } from '@/stores/authStore'

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const logout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error on server:', err)
    } finally {
      clearAuth?.()
      window.location.replace('/signin')
    }
  }

  return { logout, isLoggingOut }
}