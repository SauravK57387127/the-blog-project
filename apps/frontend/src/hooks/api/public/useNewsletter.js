import { useMutation } from '@tanstack/react-query';
import { newsletterService } from '@/api/services/public/newsletter.service';
import { toast } from 'sonner';

/**
 * Mutation hook for newsletter subscription.
 * Handles success/error toasts internally.
 */
export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: (email) => newsletterService.subscribe(email),

    onSuccess: (response) => {
      const message = response?.message;

      if (message === 'Already subscribed') {
        toast.info("You're already subscribed!");
      } else {
        toast.success("You're in! I'll be in touch.");
      }
    },

    onError: (error) => {
      toast.error(error?.message || 'Something went wrong. Try again.');
    },
  });
}
