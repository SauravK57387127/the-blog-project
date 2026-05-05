import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export const adminAnalyticsService = {
    // ── Home page ─────────────────────────────────────────────
    getWritingStreak: (period = "month") =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.WRITING_STREAK, {
            params: { period },
        }),
    getSidebarStats: (period = "month") =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.SIDEBAR_STATS, {
            params: { period },
        }),
    getRecentDraft: () =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.RECENT_DRAFT),
    getScheduledUpcoming: (limit = 5) =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.SCHEDULED_UPCOMING, {
            params: { limit },
        }),
    getStaleDrafts: (limit = 5) =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.STALE_DRAFTS, {
            params: { limit },
        }),
    getDashboardStats: () => apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS),

    // ── Analytics page ────────────────────────────────────────
    getOverviewStats: () =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.OVERVIEW),
    getViews30d: () => apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.VIEWS_30D),
    getTopPosts: (limit = 5) =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.TOP_POSTS, {
            params: { limit },
        }),
    getCategoryBreakdown: () =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.CATEGORY_BREAKDOWN),
    getPersonalBest: () =>
        apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.PERSONAL_BEST),
};
