"use client";

import { Heart, Bookmark, Share2, MessageCircle } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

export default function BlogEngagementBar_New({
  likeCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onShare,
  onScrollToComments,
}) {
  const actions = [
    {
      icon: Heart,
      label: isLiked ? `${likeCount}` : `${likeCount}`,
      onClick: onLike,
      active: isLiked,
      activeClass: "text-accent",
      fillActive: true,
    },
    {
      icon: Bookmark,
      label: "Save",
      onClick: onBookmark,
      active: isBookmarked,
      activeClass: "text-foreground",
      fillActive: true,
    },
    {
      icon: Share2,
      label: "Share",
      onClick: onShare,
      active: false,
      activeClass: "",
      fillActive: false,
    },
    {
      icon: MessageCircle,
      label: "Comment",
      onClick: onScrollToComments,
      active: false,
      activeClass: "",
      fillActive: false,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-0 border-y border-border divide-x divide-border">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`group flex items-center gap-2 px-6 py-4 text-sm font-mono ${DESIGN_CONSTANTS.transitions.fast} hover:bg-muted/40 ${
              action.active ? action.activeClass : "text-muted-foreground hover:text-foreground"
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
      })}
    </div>
  );
}
