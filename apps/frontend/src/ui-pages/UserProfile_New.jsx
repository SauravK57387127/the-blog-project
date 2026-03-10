"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Heart, Bookmark, MessageCircle, Clock,
  ArrowRight, Check, CheckCheck, ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

// ─── Demo Data ── TODO: Replace all with React Query ────────

const demoUser = {
  _id: "current-user",
  name: "Saurav Kumar",
  avatar: "https://avatars.githubusercontent.com/u/190694463?s=400&v=4",
  email: "hello@innerflame.dev",
};

const demoNotifications = [
  { _id: "n1", type: "reply", isRead: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), actor: { name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" }, blogTitle: "The Art of Clean Code", blogSlug: "art-of-clean-code", commentPreview: "Great point! I'd also add that naming conventions matter just as much." },
  { _id: "n2", type: "like_comment", isRead: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), actor: { name: "Alex Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" }, blogTitle: "Getting Started with Modern Web Development", blogSlug: "getting-started-modern-web-dev", commentPreview: "Your comment: \"This was exactly what I needed to understand...\"" },
  { _id: "n3", type: "reply", isRead: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), actor: { name: "Mike Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" }, blogTitle: "DSA Problem Solving: My Daily Approach", blogSlug: "dsa-daily-approach", commentPreview: "Have you tried the two-pointer approach for this type of problem?" },
];

const demoLikedBlogs = [
  { _id: "1", title: "Getting Started with Modern Web Development", slug: "getting-started-modern-web-dev", coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=80&fit=crop", tags: ["React", "TypeScript"], readingTime: 6, publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "4", title: "DSA Problem Solving: My Daily Approach", slug: "dsa-daily-approach", coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&h=80&fit=crop", tags: ["DSA", "Career & Learning"], readingTime: 7, publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "5", title: "Meditation for Focus: A Developer's Guide", slug: "meditation-for-focus", coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&h=80&fit=crop", tags: ["Life & Growth"], readingTime: 4, publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
];

const demoBookmarkedBlogs = [
  { _id: "2", title: "The Art of Clean Code", slug: "art-of-clean-code", coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=120&h=80&fit=crop", tags: ["Best Practices", "Programming"], readingTime: 8, publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "5", title: "Meditation for Focus: A Developer's Guide", slug: "meditation-for-focus", coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&h=80&fit=crop", tags: ["Life & Growth", "Wellness"], readingTime: 4, publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
];

const demoComments = [
  { _id: "c1", content: "This was exactly what I needed. The Server Components section cleared up so many doubts I had been carrying for weeks.", blogTitle: "Getting Started with Modern Web Development", blogSlug: "getting-started-modern-web-dev", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), replyCount: 2 },
  { _id: "c2", content: "Great point about naming conventions! I'd also add that consistent file structure matters just as much as the code itself.", blogTitle: "The Art of Clean Code", blogSlug: "art-of-clean-code", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), replyCount: 1 },
];

const demoHistory = [
  { _id: "3", title: "Yoga for Developers: Staying Healthy While Coding", slug: "yoga-for-developers", coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=80&fit=crop", tags: ["Lifestyle", "Health"], readingTime: 5, readAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { _id: "1", title: "Getting Started with Modern Web Development", slug: "getting-started-modern-web-dev", coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=80&fit=crop", tags: ["React", "TypeScript"], readingTime: 6, readAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { _id: "5", title: "Meditation for Focus: A Developer's Guide", slug: "meditation-for-focus", coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&h=80&fit=crop", tags: ["Life & Growth", "Wellness"], readingTime: 4, readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

const TABS = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "liked",         label: "Liked",         icon: Heart },
  { id: "bookmarked",    label: "Bookmarked",     icon: Bookmark },
  { id: "comments",      label: "Comments",       icon: MessageCircle },
  { id: "history",       label: "History",        icon: Clock },
];

const BATCH_SIZE = 10;

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function BlogRow({ blog, meta, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(`/blog/${blog.slug}`)}
      className={`flex gap-4 p-4 border border-border cursor-pointer hover:border-foreground/30 hover:bg-muted/30 ${DESIGN_CONSTANTS.transitions.smooth} group`}
    >
      <div className="w-24 h-16 overflow-hidden flex-shrink-0 bg-muted">
        {blog.coverImage
          ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-muted" />
        }
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <h3 className={`font-sans font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {blog.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs py-0 h-5">{tag}</Badge>
          ))}
          <span className="text-xs font-mono text-muted-foreground">{blog.readingTime} min read</span>
          <span className="text-xs font-mono text-muted-foreground">· {meta}</span>
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
    </div>
  );
}

function NotificationItem({ notification, onMarkRead, onNavigate }) {
  const isReply = notification.type === "reply";
  return (
    <div
      onClick={() => onNavigate(`/blog/${notification.blogSlug}`)}
      className={`flex gap-4 p-4 border cursor-pointer ${DESIGN_CONSTANTS.transitions.smooth} group ${
        !notification.isRead
          ? "bg-muted/50 border-foreground/20 hover:border-foreground/40"
          : "border-border hover:border-foreground/20 hover:bg-muted/30"
      }`}
    >
      <img src={notification.actor.avatar} alt={notification.actor.name} className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-border" />

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug mb-1.5">
          <span className="font-sans font-semibold">{notification.actor.name}</span>
          <span className="text-muted-foreground">
            {isReply ? " replied to your comment on " : " liked your comment on "}
          </span>
          <span className="font-medium line-clamp-1">"{notification.blogTitle}"</span>
        </p>
        <p className="text-xs text-muted-foreground italic line-clamp-1 mb-1.5">
          {notification.commentPreview}
        </p>
        <p className="text-xs font-mono text-muted-foreground">{formatTimeAgo(notification.createdAt)}</p>
      </div>

      <div className="flex flex-col items-end justify-between flex-shrink-0">
        {!notification.isRead && <div className="w-2 h-2 rounded-full bg-accent mt-1" />}
        {!notification.isRead && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(notification._id); }}
            className={`text-muted-foreground hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(`/blog/${comment.blogSlug}`)}
      className={`p-4 border border-border cursor-pointer hover:border-foreground/30 hover:bg-muted/30 ${DESIGN_CONSTANTS.transitions.smooth} group`}
    >
      <p className="font-reading text-sm leading-relaxed line-clamp-2 mb-3 text-foreground/80">
        "{comment.content}"
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <span className="flex-shrink-0 font-mono">on</span>
          <span className={`font-medium text-foreground truncate group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
            {comment.blogTitle}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground flex-shrink-0 ml-4">
          {comment.replyCount > 0 && (
            <span>{comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}</span>
          )}
          <span>{formatTimeAgo(comment.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 space-y-3">
      <Icon className="h-10 w-10 text-muted-foreground/20" />
      <p className="text-sm font-mono text-muted-foreground">{message}</p>
    </div>
  );
}

function LoadMore({ onLoad, remaining }) {
  if (remaining <= 0) return null;
  return (
    <button
      onClick={onLoad}
      className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-mono text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-foreground/30 ${DESIGN_CONSTANTS.transitions.fast} mt-2`}
    >
      <ChevronDown className="h-4 w-4" />
      Load {Math.min(remaining, BATCH_SIZE)} more
    </button>
  );
}

function TabWindow({ children }) {
  return (
    <div
      className="overflow-y-auto pr-1 space-y-2 custom-scroll"
      style={{ height: "calc(100vh - 280px)" }}
    >
      {children}
    </div>
  );
}

export default function UserProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState(demoNotifications);

  const [visibleCounts, setVisibleCounts] = useState({
    notifications: BATCH_SIZE,
    liked:         BATCH_SIZE,
    bookmarked:    BATCH_SIZE,
    comments:      BATCH_SIZE,
    history:       BATCH_SIZE,
  });

  const user = demoUser;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const loadMore = (tabId) => {
    setVisibleCounts(prev => ({ ...prev, [tabId]: prev[tabId] + BATCH_SIZE }));
  };

  const navigate = (path) => router.push(path);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-10`}>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-border flex-shrink-0"
          />
          <div>
            <h1 className="text-xl font-sans font-bold leading-tight">{user.name}</h1>
            <p className="text-sm font-mono text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Tabs — mono uppercase, consistent with rest of site */}
        <div className="flex items-center gap-0 border-b border-border mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === "notifications" && unreadCount > 0;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium uppercase tracking-widest border-b-2 whitespace-nowrap ${DESIGN_CONSTANTS.transitions.fast} ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {showBadge && (
                  <span className="px-1.5 py-0.5 text-xs bg-accent text-accent-foreground font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">

          {activeTab === "notifications" && (
            <TabWindow>
              {unreadCount > 0 && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={handleMarkAllRead}
                    className={`flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all as read
                  </button>
                </div>
              )}
              {notifications.length === 0
                ? <EmptyState icon={Bell} message="No notifications yet." />
                : <>
                    {notifications.slice(0, visibleCounts.notifications).map(n => (
                      <NotificationItem key={n._id} notification={n} onMarkRead={handleMarkRead} onNavigate={navigate} />
                    ))}
                    <LoadMore onLoad={() => loadMore("notifications")} remaining={notifications.length - visibleCounts.notifications} />
                  </>
              }
            </TabWindow>
          )}

          {activeTab === "liked" && (
            <TabWindow>
              {demoLikedBlogs.length === 0
                ? <EmptyState icon={Heart} message="No liked articles yet." />
                : <>
                    {demoLikedBlogs.slice(0, visibleCounts.liked).map(blog => (
                      <BlogRow key={blog._id} blog={blog} meta={formatTimeAgo(blog.publishedAt)} onNavigate={navigate} />
                    ))}
                    <LoadMore onLoad={() => loadMore("liked")} remaining={demoLikedBlogs.length - visibleCounts.liked} />
                  </>
              }
            </TabWindow>
          )}

          {activeTab === "bookmarked" && (
            <TabWindow>
              {demoBookmarkedBlogs.length === 0
                ? <EmptyState icon={Bookmark} message="No bookmarked articles yet." />
                : <>
                    {demoBookmarkedBlogs.slice(0, visibleCounts.bookmarked).map(blog => (
                      <BlogRow key={blog._id} blog={blog} meta={formatTimeAgo(blog.publishedAt)} onNavigate={navigate} />
                    ))}
                    <LoadMore onLoad={() => loadMore("bookmarked")} remaining={demoBookmarkedBlogs.length - visibleCounts.bookmarked} />
                  </>
              }
            </TabWindow>
          )}

          {activeTab === "comments" && (
            <TabWindow>
              {demoComments.length === 0
                ? <EmptyState icon={MessageCircle} message="You haven't commented yet." />
                : <>
                    {demoComments.slice(0, visibleCounts.comments).map(comment => (
                      <CommentItem key={comment._id} comment={comment} onNavigate={navigate} />
                    ))}
                    <LoadMore onLoad={() => loadMore("comments")} remaining={demoComments.length - visibleCounts.comments} />
                  </>
              }
            </TabWindow>
          )}

          {activeTab === "history" && (
            <TabWindow>
              {demoHistory.length === 0
                ? <EmptyState icon={Clock} message="No reading history yet." />
                : <>
                    {demoHistory.slice(0, visibleCounts.history).map(blog => (
                      <BlogRow key={blog._id} blog={blog} meta={`Read ${formatTimeAgo(blog.readAt)}`} onNavigate={navigate} />
                    ))}
                    <LoadMore onLoad={() => loadMore("history")} remaining={demoHistory.length - visibleCounts.history} />
                  </>
              }
            </TabWindow>
          )}

        </div>
      </div>
    </div>
  );
}
