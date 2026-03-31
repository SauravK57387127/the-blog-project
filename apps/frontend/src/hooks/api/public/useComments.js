import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicCommentsService } from '@/api/services/public/comments.service';
import { userCommentsService } from '@/api/services/user/comments.service';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

const COMMENTS_PER_PAGE = 5;

export function useComments(blogId) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments.byBlog(blogId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      publicCommentsService.getByBlog(blogId, { page: pageParam, limit: COMMENTS_PER_PAGE }),
    enabled: !!blogId,
    staleTime: 60 * 1000,
    getNextPageParam: (lastPage) => {
      const p = lastPage?.data?.pagination;
      return p?.hasMore ? p.currentPage + 1 : undefined;
    },
    select: (data) => ({
      comments: data.pages.flatMap((page) => page?.data?.comments ?? []),
      totalComments: data.pages[0]?.data?.pagination?.totalComments ?? 0,
      hasNextPage: data.pages[data.pages.length - 1]?.data?.pagination?.hasMore ?? false,
    }),
  });
}

export function useAddComment(blogId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentId }) => userCommentsService.add(blogId, content, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byBlog(blogId) });
      toast.success('Comment posted!');
    },
    onError: (error) => toast.error(error?.message || 'Failed to post comment'),
  });
}

export function useDeleteComment(blogId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => userCommentsService.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byBlog(blogId) });
      toast.success('Comment deleted');
    },
    onError: (error) => toast.error(error?.message || 'Failed to delete comment'),
  });
}
