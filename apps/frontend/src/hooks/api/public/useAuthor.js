import { useQuery } from "@tanstack/react-query";
import { authorService } from "@/api/services/public/author.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetch the single active author.
 * Used by about page and blog detail page.
 * Cached for 1 hour — author data rarely changes.
 */
export function useActiveAuthor() {
    return useQuery({
        queryKey: queryKeys.authors.detail("me"),
        queryFn: authorService.getActiveAuthor,
        staleTime: 60 * 60 * 1000, // 1 hour
        select: (response) => response.data,
    });
}
