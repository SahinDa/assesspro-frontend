import { apiClient } from '@/lib/apiClient';
import { AUTH_ENDPOINTS } from '../constants/endpoints';
import { LoginPayload, AuthResponse,RegisterPayload,RegisterResponse} from '../types/auth.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, payload);
    return res.data;
  },
  register: async(payload:RegisterPayload):Promise<RegisterResponse>=>{
    const res = await apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER,payload);
    return res.data;
  }
};