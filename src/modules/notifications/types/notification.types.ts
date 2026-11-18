import {NotificationFilterEnum} from '@/config/enums';

export interface createAnnouncementInput {
    userId?: string | null;
    orgId?: string | null;
    is_global?: boolean ;
    subject: string;
    message: string;
    url?: string;
    isPinned?: boolean;
}

export interface createAnnouncementResponse {
    message:string;
}


export interface getNoticationQuery {
     orgId?: string,
     offset: number;
     limit: number;
     type?:NotificationFilterEnum ,
}

export interface getNotificationResponse {
    notification_id: string;
    user_id: string | null;
    org_id: string | null;
    is_global: boolean;
    subject: string;
    message: string;
    url: string | null;
    is_pinned: boolean;
    created_at: string; 
  }

export  interface removeNotificationParams{
    notificationId:string;
}

export interface removeNotificationResponse {
    message:string;
}
