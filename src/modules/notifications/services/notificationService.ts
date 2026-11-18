import { apiClient } from '@/lib/apiClient';
import { NOTIFICATION_ENDPOINTS } from '../constants/endpoints';
import { ApiResponse } from '@/types/api.types';
import {
    createAnnouncementInput,
    createAnnouncementResponse,
    getNoticationQuery,
    getNotificationResponse,
    removeNotificationParams,
    removeNotificationResponse,
} from "../types/notification.types"

export const notificationService = {

    createAnnouncement: async (input: createAnnouncementInput): Promise<ApiResponse<createAnnouncementResponse>> => {
        const res = await apiClient.post<ApiResponse<createAnnouncementResponse>>(
            NOTIFICATION_ENDPOINTS.CREATE_ANNOUNCEMENT,
            input,
        )
        return res.data;
    },
   
    getNotification : async(query?:getNoticationQuery):Promise<ApiResponse<getNotificationResponse[]>> =>{
        const res = await apiClient.get<ApiResponse<getNotificationResponse[]>>(
            NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS,
            {params : query}
        )
        return res.data;
    },

    removeNotification : async (param : removeNotificationParams) :Promise<ApiResponse<removeNotificationResponse>> =>{
        const res = await apiClient.delete<ApiResponse<removeNotificationResponse>>(
            NOTIFICATION_ENDPOINTS.REMOVED_NOTIFICATION(param.notificationId),
        )
        return res.data;
    }

}