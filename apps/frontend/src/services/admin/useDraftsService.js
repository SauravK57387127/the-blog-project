"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";


export function useCreateDraft(config = {}) {
    return useSmartMutation("admin/blogs/drafts/create-draft", "POST", {
        invalidateKeys: [["create-draft"]],
        config
    })
}


export function uesAllDrafts(config = {}) {
    return useSmartMutation("/admin/blogs/drafts/list-drafts", "POST", {
        invalidateKeys: [["all-drafts"]],
        config,
    });
}


export function useGetDraftById(id, config = {}) {
    if (id === null || id === undefined) {
        console.warn("❌ Invalid draft ID");
        return { data: null, isError: true, error: "❌ Invalid draft ID" };
    }

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
export function useDraftAutoSave(config = {}) {
    return useSmartMutation("/admin/blogs/drafts/autosave", "POST", config)
}


