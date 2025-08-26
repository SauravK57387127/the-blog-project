"use client";

import { useSmartMutation, useSmartQuery } from "@/utils/apiClient";


export function useCreateDraft(options = {}) {
    return useSmartMutation("/admin/blogs/drafts/create-draft", "POST", {
        invalidateKeys: [["create-draft"]],
        ...options
    }
)
}


export function useAllDrafts(options = {}) {
    return useSmartQuery("/admin/blogs/drafts/list-drafts", {
        enabled: true,
    ...options,
    });
}


export function useGetDraftById(id, options = {}) {
    return useSmartQuery(
        [["draft", id]],
        `/admin/blogs/drafts/${id}`,
        {
            enabled: Boolean(id),   // maybe undefined could become true here ?? !!!
            ...options,
        }
    );
}


// data will be sent via .mutate() and utilized via req.body 
export function useDraftAutoSave(id, options = {}) {
    return useSmartMutation(`/admin/blogs/drafts/${id}/autosave`, "POST", options)
}


