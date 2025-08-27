'use client'

import { useRouter } from "next/navigation";
import { useSmartMutation } from "@/utils/useSmartMutation.js";
import { toast } from "sonner";



export const usePublishBlog = (id) => {
    const router = useRouter();

    return useSmartMutation(`/admin/blogs/drafts/${id}/publish-draft`, "POST", {
        onSuccess: () => {
            toast.success("Blog published successfully! ✅✅");
            router.push(`/admin/blogs/new`);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to publish blog.");
        },
        invalidateKeys: [["all-drafts"]],
    });
};


export const useScheduleBlog = (id) => {
    const router = useRouter();

    return useSmartMutation(`/admin/blogs/drafts/${id}/schedule-draft`, "POST", {
        onSuccess: () => {
            toast.success("Blog scheduled successfully! ✅✅");
            toast.success("re-directing to editor's page... ✅");
            router.push(`/admin/blogs/new`);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to schedule blog.");
        },
        invalidateKeys: [["all-drafts"]],
    });
};