import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { notificationKeys } from './notification.keys';
import { useActiveOrgId } from '@/hooks/useActiveOrgId';
import type {
    getNoticationQuery,
    getNotificationResponse
} from '../types/notification.types';

export function useNotificationQueries(
    params: Omit<getNoticationQuery, 'orgId'> = {
        offset: 0,
        limit: 20,
    },
    adminOrgId?: string,
) {
    const { orgId } = useActiveOrgId(adminOrgId);

    return useQuery({
        queryKey: notificationKeys.list({ ...params, orgId }),
        queryFn: () => notificationService.getNotification({ ...params, orgId }),
        select: (res): getNotificationResponse[] => res.data,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}