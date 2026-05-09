import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export const authorService = {
    /**
     * Get the single active author.
     * Used by about page and blog detail page.
     */
    getActiveAuthor: async () => {
        return apiClient.get(API_ENDPOINTS.PUBLIC.AUTHORS.ME);
    },

    /**
     * Get author by ID.
     */
    getAuthorById: async (authorId) => {
        return apiClient.get(API_ENDPOINTS.PUBLIC.AUTHORS.DETAIL(authorId));
    },
};
