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
export function useSearchBlogs({ query, tags, page = 1, limit = 9 }) {
  const isActive = (query && query.trim().length > 0) || tags?.length > 0;

  return useQuery({
    queryKey: [...queryKeys.blogs.search(query, tags), page],
    queryFn: () => searchService.searchBlogs({ query, tags, page, limit }),
    enabled: isActive,
    staleTime: 60 * 1000,
    select: (response) => response.data,
  });
}
