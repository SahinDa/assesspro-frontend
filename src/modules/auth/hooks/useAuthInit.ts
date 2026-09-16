import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/apiClient';
import { AUTH_ENDPOINTS } from '../constants/endpoints';

export function useAuthInit() {
  const { setUser, setInitialized, clearAuth } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const res = await apiClient.get(AUTH_ENDPOINTS.ME);

        if (isMounted) {
          // Adjust based on your API envelope (e.g., res.data.data, res.data.user, or res.data)

          const userData = res?.data?.data;
          setUser(userData);
        }
      } catch {
        if (isMounted) {
          // Cookie expired, missing, or invalid -> clear any stale cached state
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [setUser, setInitialized, clearAuth]);
}