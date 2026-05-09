import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBlogsService } from "@/api/services/admin/blogs.service";
import { toast } from "sonner";
import { apiClient } from "@/lib/axios";

const keys = {
    published: (filters) => ["admin", "blogs", "published", filters],
    counts: (category) => ["admin", "blogs", "counts", category],
};

export function usePublishedBlogs({
    status,
    category,
    page = 1,
    limit = 20,
} = {}) {
    return useQuery({
        queryKey: keys.published({ status, category, page }),
        queryFn: () =>
            adminBlogsService.getPublished({ status, category, page, limit }),
        staleTime: 60 * 1000,
        select: (r) => r?.data ?? { blogs: [], pagination: {} },
    });
}

export function usePublishedBlogsCounts(categoryFilter) {
    return useQuery({
        queryKey: keys.counts(categoryFilter),
        queryFn: () =>
            adminBlogsService.getPublished({
                category: categoryFilter !== "all" ? categoryFilter : undefined,
                limit: 500,
            }),
        staleTime: 60 * 1000,
        select: (r) => ({
            published: (r?.data?.blogs ?? []).filter(
                (b) => b.status === "published",
            ).length,
            scheduled: (r?.data?.blogs ?? []).filter(
                (b) => b.status === "scheduled",
            ).length,
        }),
    });
}

export function useDeleteBlog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (blogId) => adminBlogsService.delete(blogId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
        },
        onError: () => toast.error("Failed to delete blog"),
    });
}

export function usePublishNow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (blogId) => adminBlogsService.publishNow(blogId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
            toast.success("Blog published!");
        },
        onError: () => toast.error("Failed to publish blog"),
    });
}

export function useToggleEditorsPick() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ blogId, isEditorsPick, annotation }) =>
            apiClient.post(`/api/admin/blogs/${blogId}/editors-choice`, {
                isEditorsPick,
                annotation,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
        },
        onError: () => toast.error("Failed to update editor's choice"),
    });
}
