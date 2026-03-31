'use client';

import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import AuthAction from '@/components/auth/AuthAction';
import { useToast } from '@/hooks/use-toast';

/**
 * BUG FIXED: actionKey was previously set to `action.label` which for the Heart
 * button is `${likeCount}` — a dynamic number (e.g. "5").  After sign-in and
 * redirect, the count may have changed to "6", so sessionStorage's stored key
 * "5" never matched, and onAuthenticated (toggleLike) was never called.
 *
 * Fix: each action now carries a stable, static `actionKey` field that is
 * used exclusively for the auth-pending sessionStorage key, keeping it
 * completely decoupled from the display label.
 */
export default function BlogEngagementBar_New({
  likeCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onShare,
  onScrollToComments,
}) {
  const { toast } = useToast();

  const actions = [
    {
      icon: Heart,
      label: `${likeCount}`,
      actionKey: 'like',           // ← static, never changes
      onClick: () => {
        onLike?.();
        toast({ title: isLiked ? 'Like removed' : '❤️ Liked!' });
      },
      active: isLiked,
      activeClass: 'text-accent',
      fillActive: true,
      requiresAuth: true,
    },
    {
      icon: Bookmark,
      label: 'Save',
      actionKey: 'bookmark',       // ← static
      onClick: () => {
        onBookmark?.();
        toast({ title: isBookmarked ? 'Bookmark removed' : '🔖 Bookmarked!' });
      },
      active: isBookmarked,
      activeClass: 'text-foreground',
      fillActive: true,
      requiresAuth: true,
    },
    {
      icon: Share2,
      label: 'Share',
      actionKey: 'share',
      onClick: onShare,
      active: false,
      activeClass: '',
      fillActive: false,
      requiresAuth: false,
    },
    {
      icon: MessageCircle,
      label: 'Comment',
      actionKey: 'comment',
      onClick: onScrollToComments,
      active: false,
      activeClass: '',
      fillActive: false,
      requiresAuth: false,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-0 border-y border-border divide-x divide-border">
      {actions.map((action) => {
        const Icon = action.icon;

        const buttonContent = (
          <button
            key={action.actionKey}
            onClick={action.onClick}
            className={`group flex items-center gap-2 px-6 py-4 text-sm font-mono ${DESIGN_CONSTANTS.transitions.fast} hover:bg-muted/40 ${
              action.active
                ? action.activeClass
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon
              className={`h-4 w-4 ${DESIGN_CONSTANTS.transitions.fast} ${
                action.active && action.fillActive ? 'fill-current' : ''
              }`}
            />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        );

        return action.requiresAuth ? (
          <AuthAction
            key={action.actionKey}
            actionKey={action.actionKey}   // ← now always "like" / "bookmark"
            onAuthenticated={action.onClick}
          >
            {buttonContent}
          </AuthAction>
        ) : (
          // Non-auth actions: render a plain wrapper so the key lives on a DOM
          // element rather than on the button itself (avoids key-prop warning).
          <div key={action.actionKey} className="contents">
            {buttonContent}
          </div>
        );
      })}
    </div>
  );
}
