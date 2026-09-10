import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { VerifyOtpPayload } from '../types/auth.types';

export function useVerifyOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginToStore = useAuthStore((state) => state.login);

  const verifyotp = async (payload: VerifyOtpPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyotp(payload);
      loginToStore(response?.data?.updateduser);

      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'failed to verify otp';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyotp,
    isLoading,
    error,
  };
}