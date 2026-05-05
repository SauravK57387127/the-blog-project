import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsService } from "@/api/services/admin/analytics.service";

const keys = {
    overview: ["admin", "analytics", "overview"],
    views30d: ["admin", "analytics", "views-30d"],
    topPosts: ["admin", "analytics", "top-posts"],
    categoryBreakdown: ["admin", "analytics", "category-breakdown"],
    personalBest: ["admin", "analytics", "personal-best"],
};

export function useOverviewStats() {
    return useQuery({
        queryKey: keys.overview,
        queryFn: () => adminAnalyticsService.getOverviewStats(),
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}

export function useViews30d() {
    return useQuery({
        queryKey: keys.views30d,
        queryFn: () => adminAnalyticsService.getViews30d(),
        staleTime: 5 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}

export function useTopPosts(limit = 5) {
    return useQuery({
        queryKey: [...keys.topPosts, limit],
        queryFn: () => adminAnalyticsService.getTopPosts(limit),
        staleTime: 10 * 60 * 1000,
        select: (r) => r?.data ?? [],
    });
}

export function useCategoryBreakdown() {
    return useQuery({
        queryKey: keys.categoryBreakdown,
        queryFn: () => adminAnalyticsService.getCategoryBreakdown(),
        staleTime: 10 * 60 * 1000,
        select: (r) => r?.data ?? [],
    });
}

export function usePersonalBest() {
    return useQuery({
        queryKey: keys.personalBest,
        queryFn: () => adminAnalyticsService.getPersonalBest(),
        staleTime: 10 * 60 * 1000,
        select: (r) => r?.data ?? null,
    });
}
