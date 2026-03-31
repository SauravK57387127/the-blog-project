import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { engagementService } from '@/api/services/user/engagement.service';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

export function useEngagement(blogId) {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();

  // Clear engagement cache when user signs out
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
  const currentlyLiked = prevEngagement?.isLiked ?? false;

  // Only optimistically update the toggle state — NOT the count
  queryClient.setQueryData(queryKeys.user.engagement(blogId), (old) => ({
    ...old,
    isLiked: !currentlyLiked,
  }));

  return { prevEngagement };
},

onError: (err, _, context) => {
  queryClient.setQueryData(queryKeys.user.engagement(blogId), context?.prevEngagement);
  toast.error('Failed to update like');
},

onSettled: () => {
  // Let backend tell us the real count
  queryClient.invalidateQueries({ queryKey: queryKeys.user.engagement(blogId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.blogs.detail(slug) });
},

    onError: (err, _, context) => {
      queryClient.setQueryData(queryKeys.user.engagement(blogId), context?.prevEngagement);
      queryClient.setQueryData(queryKeys.blogs.detail(slug), context?.prevBlog);
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

      queryClient.setQueryData(queryKeys.user.engagement(blogId), (old) => ({
        ...old,
        isBookmarked: !old?.isBookmarked,
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
