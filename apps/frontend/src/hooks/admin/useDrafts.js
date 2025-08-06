"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";
import { useSmartQuery } from "@/utils/useSmartQuery";

export function useDraftMutation(config) {
    return useSmartMutation("/api/admin/drafts/autosave", "POST", {
        invalidateKeys: [["all-drafts"]],
        ...config,
    });
}
  
export function useGetDraftById(id, config) {
    return useSmartQuery(
        ["draft", id], 
        `/api/admin/drafts/${id}`, 
        {
            enabled: !!id && id !== null, // Prevent null/undefined calls
            ...config
        }
    );
}
 