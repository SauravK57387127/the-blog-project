"use client";

import { useSmartMutation, useSmartQuery } from "@/utils/apiClient";


export function useCreateDraft(config = {}) {
    return useSmartMutation("admin/blogs/drafts/create-draft", "POST", {
        invalidateKeys: [["create-draft"]],
        config
    })
}


export function useAllDrafts(config = {}) {
    return useSmartMutation("/admin/blogs/drafts/list-drafts", "POST", {
        invalidateKeys: [["all-drafts"]],
        config,
    });
}


export function useGetDraftById(id, config = {}) {
    return useSmartQuery(
        [["draft", id]],
        `/admin/blogs/drafts/${id}`,
        {
            enabled: Boolean(id),   // maybe undefined could become true here ?? !!!
            config,
        }
    );
}


// data will be sent via .mutate() and utilized via req.body 
export function useDraftAutoSave(id, config = {}) {
    return useSmartMutation(`/admin/blogs/drafts/${id}/autosave`, "POST", config)
}


