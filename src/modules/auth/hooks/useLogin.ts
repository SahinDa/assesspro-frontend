import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/modules/auth/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { LoginPayload } from '@/modules/auth/types/auth.types';
import { UserRole } from '@/config/enums';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginToStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. API Call
      const response = await authService.login(credentials);

      // 2. State Mutation
      loginToStore(response.data);
      // 3. Navigation
      switch (response.data.role) {
        case UserRole.ORGANIZATION:
            navigate('/dashboard/organization');
          break;

        case UserRole.ADMIN:
          navigate('/admin/overview');
          break;

        case UserRole.STUDENT:
          navigate('/student/dashboard');
          break;

        default:
          navigate('/role-selection');
          break;
      }

      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}