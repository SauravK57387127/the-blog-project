import { useQuery } from "@tanstack/react-query";
import { homepageService } from "@/api/services/public/homepage.service";
import { queryKeys } from "@/lib/react-query";

/**
 * Fetches all homepage sections in one call.
 *
 * Returns:
 *   data.hero            — single blog object
 *   data.recentHighlights — array of 5 blogs
 *   data.trending         — array of 5 blogs
 *   data.mostRead         — array of 5 blogs
 *   data.editorsChoice    — array of 4 blogs with annotation
 */
export function useHomepage() {
    return useQuery({
        queryKey: queryKeys.homepage,
        queryFn: homepageService.getHomepageData,
        staleTime: 5 * 60 * 1000, // 5 min — homepage doesn't change that often
        select: (response) => response.data, // unwrap { success, message, data }
    });
}
