import { apiClient } from '@/lib/apiClient';
import { ORGANIZATION_ENDPOINTS } from '../constants/endpoints';
import type { OrganizationInputDTO } from '../utils/organizationValidation';
import type { Organization } from '../types';

export const organizationService = {
        create: async (payload:OrganizationInputDTO): Promise<Organization> => {
      const res = await apiClient.post<Organization>(ORGANIZATION_ENDPOINTS.CREATE,payload);
      return res.data.data;
    },
}