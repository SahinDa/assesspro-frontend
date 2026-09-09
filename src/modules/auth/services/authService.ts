// src/modules/auth/services/auth.service.ts
import { apiClient } from '@/lib/apiClient';
import { AUTH_ENDPOINTS } from '../constants/endpoints';
import { LoginPayload, AuthResponse } from '../types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, payload);
    return res.data;
  },
};