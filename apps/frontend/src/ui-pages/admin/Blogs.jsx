'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, Eye, Edit3, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import AdminLayout_New from '@/components/admin/AdminLayout_New';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { toast } from 'sonner';
import {
  usePublishedBlogs, usePublishedBlogsCounts,
  useDeleteBlog, usePublishNow,
} from '@/hooks/api/admin/useAdminBlogs';

const CATEGORIES = {
  all:                    'All Categories',
  'tech-deep-dive':       'Tech Deep Dive',
  'life-and-growth':      'Life & Growth',
  'career-and-learnings': 'Career & Learnings',
};

const PAGE_SIZE = 20;

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 border ${
      status === 'published'
        ? 'border-foreground/30 text-foreground'
        : 'border-muted-foreground/30 text-muted-foreground'
    }`}>
      {status}
    </span>
  );
}

function BlogRow({ blog, onView, onEdit, onPublishNow, onDelete }) {
  return (
    <div className={`group flex items-center gap-4 py-4 border-b border-border hover:bg-muted/20 ${DESIGN_CONSTANTS.transitions.fast}`}>
      {/* Thumbnail — lazy loaded, fixed dimensions prevent layout shift */}
      <div className="w-16 h-12 flex-shrink-0 overflow-hidden bg-muted">
        {blog.coverImage
          ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          )
          : <div className="w-full h-full bg-muted" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-sans font-semibold text-sm line-clamp-1 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={blog.status} />
          <span className="text-xs font-mono text-muted-foreground">
            {blog.timeLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onView(blog)}
          className={`p-2 text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
        {blog.status === 'scheduled' && (
          <>
            <button
              onClick={() => onEdit(blog)}
              className={`p-2 text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPublishNow(blog)}
              className={`p-2 text-muted-foreground hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}
              title="Publish now"
            >
              <Send className="h-4 w-4" />
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(blog)}
          className={`p-2 text-muted-foreground hover:text-destructive ${DESIGN_CONSTANTS.transitions.fast}`}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ statusFilter, categoryFilter, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <p className="text-4xl font-mono font-bold text-muted-foreground/10">0</p>
      <p className="text-base font-sans font-bold">No blogs found</p>
      <p className="text-sm font-reading text-muted-foreground">
        {statusFilter !== 'all' || categoryFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'Start writing your first post'}
      </p>
      {(statusFilter !== 'all' || categoryFilter !== 'all') && (
        <button
          onClick={onReset}
          className={`text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 ${DESIGN_CONSTANTS.transitions.fast}`}
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  const router = useRouter();

  const [statusFilter,   setStatusFilter]   = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page,           setPage]           = useState(1);
  const [accBlogs,       setAccBlogs]       = useState([]); // accumulated pages
  const debounceRef = useRef(null);

  // Admin guard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) router.replace('/admin/login');
  }, []);

  // Reset pagination whenever filters change
  useEffect(() => {
    setPage(1);
    setAccBlogs([]);
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  };

  const { data, isLoading, isFetching } = usePublishedBlogs({
    status:   statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    page,
    limit:    PAGE_SIZE,
  });

  // Accumulate pages into one list
  useEffect(() => {
    if (!data?.blogs?.length) return;
    setAccBlogs(prev =>
      page === 1 ? data.blogs : [...prev, ...data.blogs]
    );
  }, [data?.blogs, page]);

  const { data: counts } = usePublishedBlogsCounts(categoryFilter);
  const publishedCount = counts?.published ?? 0;
  const scheduledCount = counts?.scheduled ?? 0;

  const { mutate: deleteBlog } = useDeleteBlog();
  const { mutate: publishNow } = usePublishNow();

  // Client-side title search on accumulated list
  const blogs = accBlogs.filter(blog =>
    !debouncedQuery ||
    blog.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const hasMore = data?.pagination?.hasMore ?? false;

  const handleView = (blog) => {
    if (blog.slug) window.open(`/blog/${blog.slug}`, '_blank');
  };

  const handleEdit = (blog) => {
    router.push(`/admin/drafts/${blog.draftSlug}`);
  };

  const handlePublishNow = (blog) => {
    publishNow(blog._id);
  };

  const handleDelete = (blog) => {
    deleteBlog(blog._id, {
      onSuccess: () => {
        // Remove from local accumulated list immediately
        setAccBlogs(prev => prev.filter(b => b._id !== blog._id));
        toast.success('Blog deleted', {
          action: {
            label: 'Undo',
            onClick: () => toast.info('Undo not available — blog permanently deleted'),
          },
          duration: 5000,
        });
      },
    });
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <AdminLayout_New>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">— content</span>
            <h1 className="text-3xl font-serif italic mt-1">Blogs</h1>
          </div>
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 font-reading border-foreground/20 focus:border-foreground/50"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border pb-4">
          <div className="flex gap-0">
            {[
              { value: 'all',       label: 'All' },
              { value: 'published', label: `Published [ ${publishedCount} ]` },
              { value: 'scheduled', label: `Scheduled [ ${scheduledCount} ]` },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 text-xs font-mono font-medium uppercase tracking-widest border-b-2 ${DESIGN_CONSTANTS.transitions.fast} whitespace-nowrap ${
                  statusFilter === tab.value
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] h-8 text-xs font-mono border-foreground/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIES).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs font-mono">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blog list */}
        {isLoading && page === 1 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 py-4 border-b border-border">
                <div className="w-16 h-12 bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onReset={handleResetFilters}
          />
        ) : (
          <>
            <div>
              {blogs.map(blog => (
                <BlogRow
                  key={blog._id}
                  blog={blog}
                  onView={handleView}
                  onEdit={handleEdit}
                  onPublishNow={handlePublishNow}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={isFetching}
                className={`w-full flex items-center justify-center py-4 text-xs font-mono text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-foreground/30 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40`}
              >
                {isFetching ? 'loading...' : `load more`}
              </button>
            )}
          </>
        )}

      </div>
    </AdminLayout_New>
  );
}
