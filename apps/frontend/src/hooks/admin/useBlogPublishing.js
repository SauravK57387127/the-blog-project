'use client'

import { useRouter } from "next/navigation";
import { useSmartMutation } from "@/utils/useSmartMutation.js";
import { toast } from "sonner";



export const usePublishBlog = () => {
    const router = useRouter();

    return useSmartMutation("/admin/blogs/publish", "POST", {
        onSuccess: (data) => {
            toast.success("Blog published successfully!");
            router.push(`/blogs/${data.slug}`);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to publish blog.");
        },
        invalidateKeys: [["all-drafts"]],
    });
};


export const useScheduleBlog = () => {
    const router = useRouter();

    return useSmartMutation("/admin/blogs/schedule", "POST", {
        onSuccess: () => {
            toast.success("Blog scheduled successfully!");
            router.push("/admin/blogs/drafts");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to schedule blog.");
        },
        invalidateKeys: [["all-drafts"]],
    });
};