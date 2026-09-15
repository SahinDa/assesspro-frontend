import { apiClient } from '@/lib/apiClient';
import { AUTH_ENDPOINTS } from '../constants/endpoints';
import type {
   LoginPayload, 
   AuthResponse,
   RegisterPayload,
   RegisterResponse,
   VerifyOtpPayload,
   VerifyOtpResponse,
   ForgotPasswordPayload,
   ForgotPasswordResponse,
  } from '../types/auth.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, payload);
    return res.data;
  },
  register: async(payload:RegisterPayload):Promise<RegisterResponse>=>{
    const res = await apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER,payload);
    return res.data;
  },
  verifyotp: async(payload:VerifyOtpPayload):Promise<VerifyOtpResponse> =>{
    const res = await apiClient.post<VerifyOtpResponse>(AUTH_ENDPOINTS.VERIFYOTP,payload);
    return res.data;
  },
  forgotpassword: async(payload:ForgotPasswordPayload ):Promise<ForgotPasswordResponse> =>{
    const res = await apiClient.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.FORGOTPASSWORD,payload);
    return res.data;
  }
};