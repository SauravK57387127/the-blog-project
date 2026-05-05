import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsService } from "@/api/services/admin/analytics.service";

const adminKeys = {
    writingStreak: (period) => ["admin", "writing-streak", period],
    sidebarStats: (period) => ["admin", "sidebar-stats", period],
    recentDraft: ["admin", "recent-draft"],
    scheduledUpcoming: ["admin", "scheduled-upcoming"],
    staleDrafts: ["admin", "stale-drafts"],
    dashboardStats: ["admin", "dashboard-stats"],
};

export function useWritingStreak(period = "month") {
    return useQuery({
        queryKey: adminKeys.writingStreak(period),
        queryFn: () => adminAnalyticsService.getWritingStreak(period),
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}

export function useSidebarStats(period = "month") {
    return useQuery({
        queryKey: adminKeys.sidebarStats(period),
        queryFn: () => adminAnalyticsService.getSidebarStats(period),
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}

export function useRecentDraft() {
    return useQuery({
        queryKey: adminKeys.recentDraft,
        queryFn: adminAnalyticsService.getRecentDraft,
        staleTime: 2 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}

export function useScheduledUpcoming() {
    return useQuery({
        queryKey: adminKeys.scheduledUpcoming,
        queryFn: () => adminAnalyticsService.getScheduledUpcoming(5),
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? [],
    });
}

export function useStaleDrafts() {
    return useQuery({
        queryKey: adminKeys.staleDrafts,
        queryFn: () => adminAnalyticsService.getStaleDrafts(5),
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? [],
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: adminKeys.dashboardStats,
        queryFn: adminAnalyticsService.getDashboardStats,
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}
