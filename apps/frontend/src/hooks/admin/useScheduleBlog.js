"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";

export const useScheduleBlog = () =>
    useSmartMutation("/api/admin/blogs/schedule", "POST", {
        invalidateKeys: [["all-drafts"]], // ADD THIS
    });

// export const useScheduleBlog = () =>
//     useSmartMutation("/api/admin/blogs/schedule");
