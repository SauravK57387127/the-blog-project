import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminBlogsService } from '@/api/services/admin/blogs.service';
import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { toast } from 'sonner';

// ── Fetch draft by draftSlug ──────────────────────────────────

export function useDraftBySlug(draftSlug) {
  return useQuery({
    queryKey: ['admin', 'draft', draftSlug],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN.BLOGS.BY_DRAFT_SLUG(draftSlug)),
    enabled: !!draftSlug,
    staleTime: 0,
    select: (r) => r?.data ?? null,
  });
}

// ── Create new blog (returns draftSlug) ───────────────────────

export function useCreateBlog() {
  return useMutation({
    mutationFn: (title) =>
      apiClient.post(API_ENDPOINTS.ADMIN.BLOGS.CREATE, { title }),
    
  });
}

// ── Autosave ──────────────────────────────────────────────────

export function useAutosave(blogId) {
  return useMutation({
    mutationFn: (updates) =>
      apiClient.post(API_ENDPOINTS.ADMIN.BLOGS.AUTOSAVE(blogId), updates),
    // Silent — no toast, no invalidation
  });
}

// ── Publish now ───────────────────────────────────────────────

export function usePublishBlog(blogId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post(API_ENDPOINTS.ADMIN.BLOGS.PUBLISH(blogId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      toast.success('Blog published!', { description: 'Your post is now live.' });
    },
    onError: (err) => toast.error('Failed to publish', { description: err?.message }),
  });
}

// ── Schedule ──────────────────────────────────────────────────

export function useScheduleBlog(blogId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduledAt) =>
      apiClient.post(API_ENDPOINTS.ADMIN.BLOGS.SCHEDULE(blogId), { scheduledAt }),
    onSuccess: (_, scheduledAt) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      toast.success('Blog scheduled!', {
        description: `Will publish on ${new Date(scheduledAt).toLocaleString()}`,
      });
    },
    onError: (err) => toast.error('Failed to schedule', { description: err?.message }),
  });
}
