"use client";

import { useSmartMutation } from "@/utils/useSmartMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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