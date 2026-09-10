import { useState } from 'react';
import { authService } from '../services/auth.service';
import { RegisterPayload } from '../types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(payload);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}