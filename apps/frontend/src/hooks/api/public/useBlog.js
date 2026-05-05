import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { blogService } from "@/api/services/public/blog.service";
import { queryKeys } from "@/lib/react-query";

export function useBlogBySlug(slug) {
    const query = useQuery({
        queryKey: queryKeys.blogs.detail(slug),
        queryFn: () => blogService.getBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        select: (response) => response.data,
    });

    // Track view on mount — fire and forget
    useEffect(() => {
        if (slug && query.data) {
            blogService.trackView(slug).catch(() => {});
        }
    }, [slug, query.data?._id]);

    return query;
}

export function useRelatedBlogs(slug) {
    return useQuery({
        queryKey: queryKeys.blogs.related(slug),
        queryFn: () => blogService.getRelated(slug, 5),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
        select: (response) => response.data,
    });
}
