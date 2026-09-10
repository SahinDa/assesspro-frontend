import { User } from '@/modules/user/types';

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