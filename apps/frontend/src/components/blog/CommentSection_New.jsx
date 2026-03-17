"use client";

import { useState, useEffect } from "react";
import { Trash2, Send, CornerDownRight } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AuthAction from "@/components/auth/AuthAction";
import { useToast } from "@/hooks/use-toast";

const demoComments = [
  {
    _id: "c1",
    author: { _id: "u1", name: "Alex Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    content: "Great article! Really insightful perspective on the future of web development.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    replies: [],
  },
  {
    _id: "c3",
    author: { _id: "u3", name: "Mike Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    content: "I have a question about edge computing — how does it differ from traditional CDN caching?",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    replies: [
      {
        _id: "c3-r1",
        author: { _id: "u4", name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
        content: "I can help with that! CDNs cache static assets, edge computing runs actual logic close to the user.",
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        replies: [],
      },
    ],
  },
  {
    _id: "c2",
    author: { _id: "u2", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    content: "The section on Server Components was particularly helpful. Thanks for sharing!",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    replies: [],
  },
];

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (secs < 60)  return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── CommentCard ─────────────────────────────────────────────

function CommentCard({ comment, onDelete, onReply, canDelete, currentUserId, level = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [, setTick] = useState(0);

  // Re-render every minute so timestamps stay live
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div className={level > 0 ? "ml-6 sm:ml-10 mt-3" : ""}>

      {level > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
        </div>
      )}

      <div className={`group flex gap-3 py-4 border-b border-border last:border-0 ${DESIGN_CONSTANTS.transitions.fast}`}>

        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-border mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-sm">{comment.author.name}</span>
              {/* suppressHydrationWarning: Date.now() differs between SSR and client */}
              <span suppressHydrationWarning className="text-xs font-mono text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            {canDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                className={`opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive ${DESIGN_CONSTANTS.transitions.fast}`}
                title="Delete comment"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <p className="font-reading text-sm leading-relaxed text-foreground/80 break-words">
            {comment.content}
          </p>

          {level < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className={`mt-2 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
            >
              {showReplyForm ? "cancel" : "reply"}
            </button>
          )}

          {showReplyForm && (
            <div className="mt-3 flex gap-2 items-start">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 text-sm font-reading bg-background border border-foreground/20 focus:border-foreground/50 outline-none px-3 py-2 resize-none placeholder:text-muted-foreground"
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className={`px-3 py-2 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40 disabled:pointer-events-none`}
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              canDelete={reply.author._id === currentUserId}
              currentUserId={currentUserId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main CommentSection ──────────────────────────────────────

export default function CommentSection_New({ blogId }) {
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState(demoComments);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Draft survives refresh — safe because it only runs on client
  const [newComment, setNewComment] = useState("");

  const { toast } = useToast();
  const { userId, userName, userAvatar } = useAuthGuard();

  // On mount: restore draft + full comments array from sessionStorage
  useEffect(() => {
    setMounted(true);
    const draft = sessionStorage.getItem(`draft-comment-${blogId}`);
    if (draft) setNewComment(draft);

    const saved = sessionStorage.getItem(`comments-${blogId}`);
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch {
        // corrupted — fall back to demoComments silently
      }
    }
  }, [blogId]);

  // Persist full comments array on every change (covers posts, replies, deletes)
  useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(`comments-${blogId}`, JSON.stringify(comments));
  }, [comments, mounted, blogId]);

  const handleChange = (e) => {
    setNewComment(e.target.value);
    sessionStorage.setItem(`draft-comment-${blogId}`, e.target.value);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      _id: Date.now().toString(),
      author: { _id: userId, name: userName, avatar: userAvatar },
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    // TODO (API wiring): fire POST /api/comments here, then reconcile with
    // React Query cache on success (match by userId + content + ~timestamp).
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
    sessionStorage.removeItem(`draft-comment-${blogId}`);
    toast({ title: "💬 Comment posted!" });
  };

  const handleDeleteComment = (commentId) => {
    const deleteFromList = (list) =>
      list
        .filter((c) => c._id !== commentId)
        .map((c) => ({ ...c, replies: deleteFromList(c.replies ?? []) }));
    setComments(deleteFromList);
    toast({ title: "Comment removed", variant: "destructive" });
  };

  const handleReplyToComment = (parentId, replyContent) => {
    const newReply = {
      _id: Date.now().toString(),
      author: { _id: userId, name: userName, avatar: userAvatar },
      content: replyContent,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    const addReply = (list) =>
      list.map((c) => {
        if (c._id === parentId) return { ...c, replies: [...(c.replies ?? []), newReply] };
        if (c.replies?.length) return { ...c, replies: addReply(c.replies) };
        return c;
      });
    setComments(addReply);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // TODO: fetchNextPage() from React Query
    setTimeout(() => {
      setVisibleCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          Comments
        </span>
        <span className="text-xs font-mono text-muted-foreground/50">
          [ {mounted ? comments.length : demoComments.length} ]
        </span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      {/* Comment form */}
      <div className="space-y-3">
        <textarea
          value={newComment}
          onChange={handleChange}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full text-sm font-reading bg-background border border-foreground/20 focus:border-foreground/50 outline-none px-4 py-3 resize-none placeholder:text-muted-foreground"
        />
        <div className="flex justify-end">
          <AuthAction actionKey="post-comment" onAuthenticated={handleSubmitComment}>
            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className={`group flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40 disabled:pointer-events-none`}
            >
              <Send className="h-3.5 w-3.5" />
              Post Comment
            </button>
          </AuthAction>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-reading text-muted-foreground italic">
            No comments yet. Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="border border-border">
          <div className="overflow-y-auto custom-scroll px-4" style={{ maxHeight: "480px" }}>
            {comments.slice(0, visibleCount).map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
                onReply={handleReplyToComment}
                canDelete={comment.author._id === userId}
                currentUserId={userId}
              />
            ))}
          </div>

          <div className="border-t border-border">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <span className="text-xs font-mono text-muted-foreground animate-pulse">loading...</span>
              </div>
            ) : visibleCount >= comments.length ? (
              <div className="flex items-center justify-center py-3">
                <span className="text-xs font-mono text-muted-foreground/50">— no more comments —</span>
              </div>
            ) : (
              <button
                onClick={handleLoadMore}
                className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/30 ${DESIGN_CONSTANTS.transitions.fast}`}
              >
                load {Math.min(comments.length - visibleCount, 5)} more comments
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
