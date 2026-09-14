import { apiClient } from '@/lib/apiClient';
import { USER_ENDPOINTS } from '../constants/endpoints';
import type { User } from '../types';

export const userService = {
    registerAsUser: async (): Promise<User> => {
      const res = await apiClient.patch<User>(USER_ENDPOINTS.REGISTER_AS_USER);
      return res.data;
    },
}