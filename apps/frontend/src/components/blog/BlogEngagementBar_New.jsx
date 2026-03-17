"use client";
import { Heart, Bookmark, Share2, MessageCircle } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import AuthAction from "@/components/auth/AuthAction";
import { useToast } from "@/hooks/use-toast";

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
      onClick: () => {
        onLike?.();
        toast({ title: isLiked ? "Like removed" : "❤️ Liked!" });
      },
      active: isLiked,
      activeClass: "text-accent",
      fillActive: true,
      requiresAuth: true,
    },
    {
      icon: Bookmark,
      label: "Save",
      onClick: () => {
        onBookmark?.();
        toast({ title: isBookmarked ? "Bookmark removed" : "🔖 Bookmarked!" });
      },
      active: isBookmarked,
      activeClass: "text-foreground",
      fillActive: true,
      requiresAuth: true,
    },
    {
      icon: Share2,
      label: "Share",
      onClick: onShare,
      active: false,
      activeClass: "",
      fillActive: false,
      requiresAuth: false,
    },
    {
      icon: MessageCircle,
      label: "Comment",
      onClick: onScrollToComments,
      active: false,
      activeClass: "",
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
            key={action.label}
            // ✅ Only attach onClick directly for actions that don't require auth
            onClick={action.onClick}
            className={`group flex items-center gap-2 px-6 py-4 text-sm font-mono ${DESIGN_CONSTANTS.transitions.fast} hover:bg-muted/40 ${
              action.active
                ? action.activeClass
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${DESIGN_CONSTANTS.transitions.fast} ${
                action.active && action.fillActive ? "fill-current" : ""
              }`}
            />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        );

        return action.requiresAuth ? (
          // ✅ AuthAction owns the onClick and only calls it post-auth
          <AuthAction
            key={action.label}
          actionKey={action.label}
            onAuthenticated={action.onClick}
          >
            {buttonContent}
          </AuthAction>
        ) : (
          buttonContent
        );
      })}
    </div>
  );
}
