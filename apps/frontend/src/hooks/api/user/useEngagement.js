import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { engagementService } from '@/api/services/user/engagement.service';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

export function useEngagement(blogId) {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSignedIn && blogId) {
      queryClient.removeQueries({ queryKey: queryKeys.user.engagement(blogId) });
    }
  }, [isSignedIn, blogId]);

  return useQuery({
    queryKey: queryKeys.user.engagement(blogId),
    queryFn: () => engagementService.getStatus(blogId),
    enabled: !!blogId && !!isSignedIn,
    staleTime: 0,
    select: (response) => response.data,
  });
}

export function useToggleLike(blogId, slug) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => engagementService.toggleLike(blogId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user.engagement(blogId) });
      const prevEngagement = queryClient.getQueryData(queryKeys.user.engagement(blogId));

      // FIX: cache holds the raw axios response; select: r => r.data reads .data
      // Previous code wrote old.isLiked (top-level) which select never saw.
      const currentlyLiked = prevEngagement?.data?.isLiked ?? false;

      queryClient.setQueryData(queryKeys.user.engagement(blogId), (old) => ({
        ...old,
        data: {
          ...old?.data,
          isLiked: !currentlyLiked,
        },
      }));

      return { prevEngagement };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKeys.user.engagement(blogId), context?.prevEngagement);
      toast.error('Failed to update like');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.engagement(blogId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs.detail(slug) });
    },
  });
}

export function useToggleBookmark(blogId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => engagementService.toggleBookmark(blogId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user.engagement(blogId) });
      const prev = queryClient.getQueryData(queryKeys.user.engagement(blogId));

      // FIX: same shape fix as useToggleLike
      queryClient.setQueryData(queryKeys.user.engagement(blogId), (old) => ({
        ...old,
        data: {
          ...old?.data,
          isBookmarked: !old?.data?.isBookmarked,
        },
      }));

      return { prev };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKeys.user.engagement(blogId), context?.prev);
      toast.error('Failed to update bookmark');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.engagement(blogId) });
    },
  });
}
