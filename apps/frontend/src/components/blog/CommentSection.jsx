"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2, Send, CornerDownRight } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AuthAction from "@/components/auth/AuthAction";
import { useToast } from "@/hooks/use-toast";
import {
    useComments,
    useAddComment,
    useDeleteComment,
} from "@/hooks/api/public/useComments";

function formatTimeAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime();
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (secs < 60) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function CommentCard({ comment, blogId, onDelete, currentUserId, level = 0 }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [, setTick] = useState(0);
    const { mutate: addComment, isPending: isReplying } = useAddComment(blogId);

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleReply = () => {
        if (!replyText.trim()) return;

        console.log("🔍 parentId:", comment._id, typeof comment._id); // ADD THIS
        addComment(
            { content: replyText, parentId: comment._id?.toString() },
            {
                onSuccess: () => {
                    setReplyText("");
                    setShowReplyForm(false);
                },
            },
        );
    };

    const authorName = comment.userId?.name ?? "User";
    const authorAvatar =
        comment.userId?.profileImage ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;

    // Compare Clerk userId to clerkUserId on populated user
    const canDelete =
        !!currentUserId && comment.userId?.clerkUserId === currentUserId;

    return (
        <div className={level > 0 ? "ml-6 sm:ml-10 mt-3" : ""}>
            {level > 0 && (
                <div className="flex items-center gap-2 mb-2">
                    <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                </div>
            )}

            <div
                className={`group flex gap-3 py-4 border-b border-border last:border-0 ${DESIGN_CONSTANTS.transitions.fast}`}
            >
                <div className="relative w-8 h-8 flex-shrink-0 mt-0.5">
                    <Image
                        src={authorAvatar}
                        alt={authorName}
                        fill
                        loading="lazy"
                        sizes="32px"
                        className="rounded-full object-cover ring-1 ring-border"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                            <span className="font-sans font-semibold text-sm">
                                {authorName}
                            </span>
      {comment.isAuthor && (
    <span className="text-[10px] font-mono px-1.5 py-0.5 border border-accent text-accent uppercase tracking-widest">
        author
    </span>
)}
                            <span
                                suppressHydrationWarning
                                className="text-xs font-mono text-muted-foreground"
                            >
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
                                disabled={!replyText.trim() || isReplying}
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
                            blogId={blogId}
                            onDelete={onDelete}
                            currentUserId={currentUserId}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentSection_New({ blogId }) {
    const [newComment, setNewComment] = useState("");
    const [mounted, setMounted] = useState(false);
    const { toast } = useToast();
    const { userId } = useAuthGuard();

    const { data, isLoading, isFetchingNextPage, fetchNextPage } =
        useComments(blogId);

    const { mutate: addComment, isPending: isPosting } = useAddComment(blogId);
    const { mutate: deleteComment } = useDeleteComment(blogId);

    const comments = data?.comments ?? [];
    const totalComments = data?.totalComments ?? 0;
    const hasNextPage = data?.hasNextPage ?? false;

    useEffect(() => {
        setMounted(true);
        const draft = sessionStorage.getItem(`draft-comment-${blogId}`);
        if (draft) setNewComment(draft);
    }, [blogId]);

    const handleChange = (e) => {
        setNewComment(e.target.value);
        sessionStorage.setItem(`draft-comment-${blogId}`, e.target.value);
    };

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;
        addComment(
            { content: newComment, parentId: null },
            {
                onSuccess: () => {
                    setNewComment("");
                    sessionStorage.removeItem(`draft-comment-${blogId}`);
                },
            },
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Comments
                </span>
                <span className="text-xs font-mono text-muted-foreground/50">
                    [ {mounted ? totalComments : 0} ]
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
                    <AuthAction
                        actionKey="post-comment"
                        onAuthenticated={handleSubmitComment}
                    >
                        <button
                            type="button"
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isPosting}
                            className={`group flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40 disabled:pointer-events-none`}
                        >
                            <Send className="h-3.5 w-3.5" />
                            {isPosting ? "Posting..." : "Post Comment"}
                        </button>
                    </AuthAction>
                </div>
            </div>

            {/* Comments list */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 py-4">
                            <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-sm font-reading text-muted-foreground italic">
                        No comments yet. Be the first to share your thoughts.
                    </p>
                </div>
            ) : (
                <div className="border border-border">
                    <div
                        className="overflow-y-auto custom-scroll px-4"
                        style={{ maxHeight: "480px" }}
                    >
                        {comments.map((comment) => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                blogId={blogId}
                                onDelete={(id) => deleteComment(id)}
                                currentUserId={userId}
                                level={0}
                            />
                        ))}
                    </div>

                    {/* Load more / end indicator */}
                    <div className="border-t border-border">
                        {isFetchingNextPage ? (
                            <div className="flex items-center justify-center gap-2 py-3">
                                <span className="text-xs font-mono text-muted-foreground animate-pulse">
                                    loading...
                                </span>
                            </div>
                        ) : hasNextPage ? (
                            <button
                                onClick={() => fetchNextPage()}
                                className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/30 ${DESIGN_CONSTANTS.transitions.fast}`}
                            >
                                load more comments
                            </button>
                        ) : (
                            <div className="flex items-center justify-center py-3">
                                <span className="text-xs font-mono text-muted-foreground/50">
                                    — no more comments —
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
