import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { notificationKeys } from './notification.keys';
import type { ApiResponse } from '@/types/api.types';
import {
    createAnnouncementInput,
    createAnnouncementResponse,
    removeNotificationParams,
    removeNotificationResponse,
} from "../types/notification.types"


export function useCreateAnnouncement(){
    const queryClient = useQueryClient();
   return useMutation<ApiResponse<createAnnouncementResponse>,Error,createAnnouncementInput>({
        mutationFn : (payload : createAnnouncementInput) =>
        notificationService.createAnnouncement(
            payload,
        ),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: notificationKeys.lists(),
            });
        }
   })
}
export function useRemoveNotification(){
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<removeNotificationResponse>,Error,removeNotificationParams>({
         mutationFn : (payload : removeNotificationParams) =>
         notificationService.removeNotification(
             payload,
         ),
         onSuccess: ()=>{
             queryClient.invalidateQueries({
                 queryKey: notificationKeys.lists(),
             });
         }
    })
}