import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { queryKeys } from "@/lib/react-query";

const likesService = {
    getMyLikes: ({ page = 1, limit = 10 } = {}) =>
        apiClient.get(API_ENDPOINTS.USER.LIKES.LIST, {
            params: { page, limit },
        }),
};

const bookmarksService = {
    getMyBookmarks: ({ page = 1, limit = 10 } = {}) =>
        apiClient.get(API_ENDPOINTS.USER.BOOKMARKS.LIST, {
            params: { page, limit },
        }),
};

export function useMyLikes({ page = 1, limit = 10 } = {}) {
    return useQuery({
        queryKey: [...queryKeys.user.likes, page],
        queryFn: () => likesService.getMyLikes({ page, limit }),
        staleTime: 60 * 1000,
        select: (response) => response.data,
    });
}

export function useMyBookmarks({ page = 1, limit = 10 } = {}) {
    return useQuery({
        queryKey: [...queryKeys.user.bookmarks, page],
        queryFn: () => bookmarksService.getMyBookmarks({ page, limit }),
        staleTime: 60 * 1000,
        select: (response) => response.data,
    });
}
