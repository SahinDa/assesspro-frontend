// src/modules/auth/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/modules/auth/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { LoginPayload } from '@/modules/auth/types';

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
      loginToStore(response.user);

      // 3. Navigation
      navigate('/dashboard');

      return response.user;
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