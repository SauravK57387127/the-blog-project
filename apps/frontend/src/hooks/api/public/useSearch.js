import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/api/services/public/search.service';
import { queryKeys } from '@/lib/react-query';

// TODO: cleanup — useSearchInitial replaced by ISR prop in search page.jsx
// export function useSearchInitial() {
//   return useQuery({
//     queryKey: ['search', 'initial'],
//     queryFn: searchService.getInitialData,
//     staleTime: 5 * 60 * 1000,
//     select: (response) => response.data,
//   });
// }

/**
 * Search blogs by query and/or tags.
 * S-7: accepts page + limit for load more pagination.
 * Only fires when query has text OR tags are selected.
 */
/**
 * Search blogs by query and/or tags.
 * - query: min 3 chars required (matches backend enforcement)
 * - tags: any number of tags, no query needed
 * - both: combined filter
 */
export function useSearchBlogs({ query, tags, page = 1, limit = 9 }) {
  // FIX: min 3 chars for query — prevents noisy single-letter results
  // tags alone is valid — isActive true even when query is empty
  const hasQuery = query && query.trim().length >= 3;
  const hasTags  = tags?.length > 0;
  const isActive = hasQuery || hasTags;

  return useQuery({
    queryKey: [...queryKeys.blogs.search(query, tags), page],
    queryFn: () => searchService.searchBlogs({ query: hasQuery ? query : '', tags, page, limit }),
    enabled: isActive,
    staleTime: 60 * 1000,
    select: (response) => response.data,
  });
}
