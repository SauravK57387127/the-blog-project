"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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