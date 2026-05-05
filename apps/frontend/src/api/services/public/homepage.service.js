import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export const homepageService = {
    /**
     * Fetch all homepage data in one request.
     * Returns: hero, recentHighlights, trending, mostRead, editorsChoice
     */
    getHomepageData: async () => {
        return apiClient.get(API_ENDPOINTS.PUBLIC.HOMEPAGE);
    },
};
