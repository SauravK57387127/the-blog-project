import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/api/services/public/search.service';
import { queryKeys } from '@/lib/react-query';

/**
 * Fetches initial search page data — topTags + popularReads.
 * Runs once on mount, cached for 5 minutes.
 */
export function useSearchInitial() {
  return useQuery({
    queryKey: ['search', 'initial'],
    queryFn: searchService.getInitialData,
    staleTime: 5 * 60 * 1000,
    select: (response) => response.data,
  });
}

/**
 * Search blogs by query and/or tags.
 * Only fires when query has text OR tags are selected.
 */
export function useSearchBlogs({ query, tags }) {
  const isActive = (query && query.trim().length > 0) || tags?.length > 0;

  return useQuery({
    queryKey: queryKeys.blogs.search(query, tags),
    queryFn: () => searchService.searchBlogs({ query, tags }),
    enabled: isActive,
    staleTime: 60 * 1000, // 1 min — search results can be slightly stale
    select: (response) => response.data,
  });
}
