"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";
import { useSmartQuery } from "@/utils/useSmartQuery";

export function useDraftMutation(config) {
    return useSmartMutation("/admin/blogs/drafts/autosave", "POST", {
        invalidateKeys: [["all-drafts"]],
        ...config,
    });
}

export function useGetDraftById(id, config = {}) {
    const isValidId = Boolean(id);
    
    return useSmartQuery(
        ["draft", id], 
        isValidId ? `/admin/blogs/drafts/${id}` : null, 
        {
            enabled: isValidId,
            ...config
        }
    );
}