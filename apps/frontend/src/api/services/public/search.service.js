import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export const searchService = {
    /**
     * Get initial search page data — tags + popular reads.
     * Called once on page mount.
     */
    getInitialData: async () => {
        return apiClient.get(API_ENDPOINTS.PUBLIC.SEARCH.INITIAL);
    },

    /**
     * Search blogs by query and/or tags.
     * Called when user types or selects tags.
     */
    searchBlogs: async ({ query, tags, page = 1, limit = 9 }) => {
        return apiClient.get(API_ENDPOINTS.PUBLIC.BLOGS.SEARCH, {
            params: {
                q: query,
                tags: tags?.length > 0 ? tags.join(",") : undefined,
                page,
                limit,
            },
        });
    },
};
