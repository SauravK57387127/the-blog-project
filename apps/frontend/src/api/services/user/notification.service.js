import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export const notificationService = {
    getNotifications: async ({ page = 1, limit = 10 } = {}) => {
        return apiClient.get(API_ENDPOINTS.USER.NOTIFICATIONS.LIST, {
            params: { page, limit },
        });
    },

    markAsRead: async (notificationId) => {
        return apiClient.post(
            API_ENDPOINTS.USER.NOTIFICATIONS.MARK_READ(notificationId),
        );
    },

    markAllAsRead: async () => {
        return apiClient.post(API_ENDPOINTS.USER.NOTIFICATIONS.MARK_ALL);
    },
};
