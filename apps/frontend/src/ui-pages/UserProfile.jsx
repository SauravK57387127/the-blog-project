import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, Heart, Bookmark, MessageCircle, Clock,
  ArrowRight, Check, CheckCheck, ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { useProfile, useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useHistory } from '@/hooks/api/user/useProfile';
import { useMyLikes, useMyBookmarks } from '@/hooks/api/user/useUserContent';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { queryKeys } from '@/lib/react-query';

const TABS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'liked',         label: 'Liked',         icon: Heart },
  { id: 'bookmarked',    label: 'Bookmarked',     icon: Bookmark },
  { id: 'comments',      label: 'Comments',       icon: MessageCircle },
  { id: 'history',       label: 'History',        icon: Clock },
];

const BATCH_SIZE = 10;

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const diff  = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Sub-components ────────────────────────────────────────────

function BlogRow({ blog, meta, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(`/blog/${blog.slug}`)}
      className={`flex gap-4 p-4 border border-border cursor-pointer hover:border-foreground/30 hover:bg-muted/30 ${DESIGN_CONSTANTS.transitions.smooth} group`}
    >
    <div className="w-24 h-16 overflow-hidden flex-shrink-0 bg-muted relative">
  {blog.coverImage
    ? <Image src={blog.coverImage} alt={blog.title} fill loading="lazy" sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
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
  const isReply = notification.type === 'reply';
  const avatar  = notification.actor?.profileImage
    ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.actor?.name}`;

  return (
    <div
      onClick={() => {
  if (!notification.isRead) onMarkRead(notification._id);
  onNavigate(`/blog/${notification.blogSlug}`);
}}
className={`flex gap-4 p-4 border cursor-pointer ${DESIGN_CONSTANTS.transitions.smooth} group ${
        !notification.isRead
          ? 'bg-muted/50 border-foreground/20 hover:border-foreground/40'
          : 'border-border hover:border-foreground/20 hover:bg-muted/30'
      }`}
    >
     <Image
  src={avatar}
  alt={notification.actor?.name}
  width={40}
  height={40}
  loading="lazy"
  className="rounded-full flex-shrink-0 ring-2 ring-border"
/> 
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug mb-1.5">
          <span className="font-sans font-semibold">{notification.actor?.name}</span>
          <span className="text-muted-foreground">
            {isReply ? ' replied to your comment on ' : ' liked your comment on '}
          </span>
          <span className="font-medium line-clamp-1">"{notification.blogTitle}"</span>
        </p>
        {notification.commentPreview && (
          <p className="text-xs text-muted-foreground italic line-clamp-1 mb-1.5">
            {notification.commentPreview}
          </p>
        )}
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
            <span>{comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}</span>
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
      style={{ height: 'calc(100vh - 280px)' }}
    >
      {children}
    </div>
  );
}

function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border border-border">
          <div className="w-24 h-16 bg-muted animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function UserProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState('notifications');
  const [notifPage, setNotifPage]   = useState(1);
  const [likedPage, setLikedPage]   = useState(1);
  const [bmPage, setBmPage]         = useState(1);
  const [histPage, setHistPage]     = useState(1);
  const [commPage, setCommPage]     = useState(1);

  // ── Data fetching ─────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } = useProfile();

  const { data: notifData, isLoading: notifLoading } = useNotifications({ page: notifPage });
  const { mutate: markRead }    = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const { data: likesData,  isLoading: likesLoading  } = useMyLikes({ page: likedPage });
  const { data: bmData,     isLoading: bmLoading      } = useMyBookmarks({ page: bmPage });
  const { data: histData,   isLoading: histLoading    } = useHistory({ page: histPage });

  // My comments — reuse existing endpoint
  const { data: commData, isLoading: commLoading } = useQuery({
    queryKey: [...queryKeys.user.comments, commPage],
    queryFn: () => apiClient.get(API_ENDPOINTS.USER.COMMENTS.MY, { params: { page: commPage, limit: 10 } }),
    staleTime: 60 * 1000,
    select: (r) => r.data,
  });

  const notifications = notifData?.notifications ?? [];
  const unreadCount   = notifData?.pagination?.unreadCount ?? 0;
  const likes         = likesData?.likes ?? [];
  const bookmarks     = bmData?.bookmarks ?? [];
  const history       = histData?.history ?? [];
  const comments      = commData?.comments ?? [];

  const navigate = (path) => router.push(path);


  return (
    <div className="w-full h-screen overflow-hidden">
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-10`}>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-border flex-shrink-0 relative">
  <Image
    src={profile?.profileImage ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`}
    alt={profile?.name ?? 'User'}
    fill
    priority
    sizes="56px"
    className="object-cover rounded-full"
  />
</div> 
          <div>
            {profileLoading
              ? <>
                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                </>
              : <>
                  <h1 className="text-xl font-sans font-bold leading-tight">{profile?.name}</h1>
                  <p className="text-sm font-mono text-muted-foreground">{profile?.email}</p>
                </>
            }
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon     = tab.icon;
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === 'notifications' && unreadCount > 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium uppercase tracking-widest border-b-2 whitespace-nowrap ${DESIGN_CONSTANTS.transitions.fast} ${
                  isActive
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
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

          {activeTab === 'notifications' && (
            <TabWindow>
              {unreadCount > 0 && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => markAllRead()}
                    className={`flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all as read
                  </button>
                </div>
              )}
              {notifLoading
                ? <SkeletonRows />
                : notifications.length === 0
                  ? <EmptyState icon={Bell} message="No notifications yet." />
                  : <>
                      {notifications.map(n => (
                        <NotificationItem
                          key={n._id}
                          notification={n}
                          onMarkRead={(id) => markRead(id)}
                          onNavigate={navigate}
                        />
                      ))}
                      {notifData?.pagination?.hasMore && (
                        <LoadMore onLoad={() => setNotifPage(p => p + 1)} remaining={1} />
                      )}
                    </>
              }
            </TabWindow>
          )}

          {activeTab === 'liked' && (
            <TabWindow>
              {likesLoading
                ? <SkeletonRows />
                : likes.length === 0
                  ? <EmptyState icon={Heart} message="No liked articles yet." />
                  : <>
                      {likes.map(blog => (
                        <BlogRow
                          key={blog.blogId ?? blog._id}
                          blog={blog}
                          meta={formatTimeAgo(blog.likedAt ?? blog.publishedAt)}
                          onNavigate={navigate}
                        />
                      ))}
                      {likesData?.pagination?.hasMore && (
                        <LoadMore onLoad={() => setLikedPage(p => p + 1)} remaining={1} />
                      )}
                    </>
              }
            </TabWindow>
          )}

          {activeTab === 'bookmarked' && (
            <TabWindow>
              {bmLoading
                ? <SkeletonRows />
                : bookmarks.length === 0
                  ? <EmptyState icon={Bookmark} message="No bookmarked articles yet." />
                  : <>
                      {bookmarks.map(blog => (
                        <BlogRow
                          key={blog.blogId ?? blog._id}
                          blog={blog}
                          meta={formatTimeAgo(blog.savedAt ?? blog.publishedAt)}
                          onNavigate={navigate}
                        />
                      ))}
                      {bmData?.pagination?.hasMore && (
                        <LoadMore onLoad={() => setBmPage(p => p + 1)} remaining={1} />
                      )}
                    </>
              }
            </TabWindow>
          )}

          {activeTab === 'comments' && (
            <TabWindow>
              {commLoading
                ? <SkeletonRows count={2} />
                : comments.length === 0
                  ? <EmptyState icon={MessageCircle} message="You haven't commented yet." />
                  : <>
                      {comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} onNavigate={navigate} />
                      ))}
                      {commData?.pagination?.hasMore && (
                        <LoadMore onLoad={() => setCommPage(p => p + 1)} remaining={1} />
                      )}
                    </>
              }
            </TabWindow>
          )}

          {activeTab === 'history' && (
            <TabWindow>
              {histLoading
                ? <SkeletonRows />
                : history.length === 0
                  ? <EmptyState icon={Clock} message="No reading history yet." />
                  : <>
                      {history.map(blog => (
                        <BlogRow
                          key={blog.blogId}
                          blog={blog}
                          meta={`Read ${formatTimeAgo(blog.viewedAt)}`}
                          onNavigate={navigate}
                        />
                      ))}
                      {histData?.pagination?.hasMore && (
                        <LoadMore onLoad={() => setHistPage(p => p + 1)} remaining={1} />
                      )}
                    </>
              }
            </TabWindow>
          )}

        </div>
      </div>
    </div>
  );
}
