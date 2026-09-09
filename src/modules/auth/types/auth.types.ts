import { User } from '@/modules/user/types';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}