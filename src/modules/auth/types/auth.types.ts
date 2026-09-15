import type { User } from '@/modules/users/types/index';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface RegisterPayload {
  firstname: string;
  lastname?: string;
  email: string;
  password?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface VerifyOtpPayload {
  email: string; 
  otp: string
}

export interface VerifyOtpResponse {
  success:boolean,
  message: string;
  user: User;
}

export interface ForgotPasswordPayload {
 email:string;
}
export interface ForgotPasswordResponse {
  message:string;
 }
