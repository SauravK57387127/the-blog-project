import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/api/services/user/profile.service';
import { notificationService } from '@/api/services/user/notification.service';
import { historyService } from '@/api/services/user/history.service';
import { queryKeys } from '@/lib/react-query';
import { toast } from 'sonner';

// ── Profile ──────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000,
    select: (response) => response.data,
  });
}

// ── Notifications ─────────────────────────────────────────────

export function useNotifications({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: [...queryKeys.user.notifications, page],
    queryFn: () => notificationService.getNotifications({ page, limit }),
    staleTime: 0,
    select: (response) => response.data,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications });
    },
  });
}

// ── History ───────────────────────────────────────────────────

export function useHistory({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: [...queryKeys.user.history, page],
    queryFn: () => historyService.getHistory({ page, limit }),
    staleTime: 60 * 1000,
    select: (response) => response.data,
  });
}
