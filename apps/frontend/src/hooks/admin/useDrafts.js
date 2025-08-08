"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";
import { useSmartQuery } from "@/utils/useSmartQuery";

export function useDraftMutation(config) {
    return useSmartMutation("/admin/drafts/autosave", "POST", {
        invalidateKeys: [["all-drafts"]],
        ...config,
    });
}

export function useGetDraftById(id, config = {}) {
    const isValidId = Boolean(id);
    
    return useSmartQuery(
        ["draft", id], 
        isValidId ? `/admin/drafts/${id}` : null, 
        {
            enabled: isValidId,
            ...config
        }
    );
}