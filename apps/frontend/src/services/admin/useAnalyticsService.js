'use client';

import { useSmartMutation, useSmartQuery } from "@/utils/apiClient.js";


export function useSaveEvent(options = {}){
    return useSmartMutation("/admin/analytics/track", "POST", {
        invalidateKeys: [["save-event"]],
        ...options
    })
}