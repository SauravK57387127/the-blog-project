import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export const userCommentsService = {
    /**
     * Add a top-level comment or a reply (pass parentId for replies).
     */
    add: async (blogId, content, parentId = null) => {
        return apiClient.post(API_ENDPOINTS.USER.COMMENTS.ADD(blogId), {
            content,
            ...(parentId && { parentId }),
        });
    },

    update: async (commentId, content) => {
        return apiClient.put(API_ENDPOINTS.USER.COMMENTS.UPDATE(commentId), {
            content,
        });
    },

    delete: async (commentId) => {
        return apiClient.delete(API_ENDPOINTS.USER.COMMENTS.DELETE(commentId));
    },
};
