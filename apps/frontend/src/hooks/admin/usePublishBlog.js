"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";

export const usePublishBlog = () =>
    useSmartMutation("/api/admin/blogs/publish", "POST", {
        invalidateKeys: [["all-drafts"]], // ADD THIS
    });

