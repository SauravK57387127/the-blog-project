'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, Eye, Edit3, Send, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout_New from '@/components/admin/AdminLayout_New';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { toast } from 'sonner';
import {
  usePublishedBlogs, usePublishedBlogsCounts,
  useDeleteBlog, usePublishNow, useToggleEditorsPick,
} from '@/hooks/api/admin/useAdminBlogs';

const CATEGORIES = {
  all:                    'All Categories',
  'tech-deep-dive':       'Tech Deep Dive',
  'life-and-growth':      'Life & Growth',
  'career-and-learnings': 'Career & Learnings',
};

const PAGE_SIZE = 10;

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

function BlogRow({ blog, onView, onEdit, onPublishNow, onDelete, onEditorsPick }) {
  const isPick = blog.editorsPick?.isEditorsPick ?? false;
  return (
    <div className={`group flex items-center gap-4 py-4 border-b border-border hover:bg-muted/20 ${DESIGN_CONSTANTS.transitions.fast}`}>
      <div className="w-16 h-12 flex-shrink-0 overflow-hidden bg-muted">
        {blog.coverImage
          ? <img src={blog.coverImage} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-muted" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-sans font-semibold text-sm line-clamp-1 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
            {blog.title}
          </p>
          {isPick && (
            <Star className="h-3 w-3 text-accent fill-accent flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={blog.status} />
          <span className="text-xs font-mono text-muted-foreground">{blog.timeLabel}</span>
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
        {blog.status === 'published' && (
          <button
            onClick={() => onEditorsPick(blog)}
            className={`p-2 ${DESIGN_CONSTANTS.transitions.fast} ${
              isPick
                ? 'text-accent hover:text-muted-foreground'
                : 'text-muted-foreground hover:text-accent'
            }`}
            title={isPick ? "Remove from editor's choice" : "Add to editor's choice"}
          >
            <Star className={`h-4 w-4 ${isPick ? 'fill-accent' : ''}`} />
          </button>
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
        {statusFilter !== 'all' || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Start writing your first post'}
      </p>
      {(statusFilter !== 'all' || categoryFilter !== 'all') && (
        <button onClick={onReset} className={`text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 ${DESIGN_CONSTANTS.transitions.fast}`}>
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
  const [accBlogs,       setAccBlogs]       = useState([]);
  const debounceRef = useRef(null);

  // Editor's pick modal state
  const [pickModal,  setPickModal]  = useState(null);
  const [annotation, setAnnotation] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) router.replace('/admin/login');
  }, []);

  // ─── FIX: reset only page on filter change, NOT accBlogs ──────────────────
  // accBlogs reset is handled by the accumulation effect below via filterKey.
  // Resetting accBlogs here caused a race: React Query returned cached data with
  // the same array reference, so the accumulation effect never re-fired → blank list.
  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  };

  const { data, isLoading, isFetching } = usePublishedBlogs({
    status: (statusFilter === 'all' || statusFilter === 'editors-choice')
      ? undefined : statusFilter,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    page,
    limit: statusFilter === 'editors-choice' ? 500 : PAGE_SIZE,
  });

  // ─── FIX: stable filterKey as dependency ──────────────────────────────────
  // Previously depended on data?.blogs (array reference). React Query returns the
  // same cached reference when revisiting a filter → effect never re-ran → blank.
  // Now filterKey changes whenever the filter does, guaranteeing a re-run.
  const filterKey = `${statusFilter}__${categoryFilter}`;

  useEffect(() => {
    if (!data?.blogs) return;
    setAccBlogs(prev =>
      page === 1 ? data.blogs : [...prev, ...data.blogs]
    );
  }, [data, filterKey, page]); // filterKey ensures re-run even on same data reference

  const { data: counts }       = usePublishedBlogsCounts(categoryFilter);
  const publishedCount         = counts?.published ?? 0;
  const scheduledCount         = counts?.scheduled ?? 0;

  const { mutate: deleteBlog } = useDeleteBlog();
  const { mutate: publishNow } = usePublishNow();
  const { mutate: togglePick, isPending: isTogglingPick } = useToggleEditorsPick();

  // ─── FIX: `all` now explicitly excludes editor's picks ────────────────────
  // Previously hit `return true` which included every blog regardless of editorsPick.
  const blogs = accBlogs
    .filter(blog => !debouncedQuery || blog.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
    .filter(blog => {
      if (statusFilter === 'editors-choice') return blog.editorsPick?.isEditorsPick === true;
      if (statusFilter === 'published')      return blog.status === 'published' && !blog.editorsPick?.isEditorsPick;
      if (statusFilter === 'scheduled')      return blog.status === 'scheduled';
      // all: exclude editor's picks — they live only in the Editor's Choice tab
      return !blog.editorsPick?.isEditorsPick;
    });

  const hasMore = statusFilter === 'editors-choice'
    ? false
    : (data?.pagination?.hasMore ?? false);

  const handleView       = (blog) => { if (blog.slug) window.open(`/blog/${blog.slug}`, '_blank'); };
  const handleEdit       = (blog) => { router.push(`/admin/drafts/${blog.draftSlug}`); };
  const handlePublishNow = (blog) => { publishNow(blog._id); };

  const handleDelete = (blog) => {
    deleteBlog(blog._id, {
      onSuccess: () => {
        setAccBlogs(prev => prev.filter(b => b._id !== blog._id));
        toast.success('Blog deleted', {
          action: { label: 'Undo', onClick: () => toast.info('Undo not available') },
          duration: 5000,
        });
      },
    });
  };

  const handleEditorsPick = (blog) => {
    const isPick = blog.editorsPick?.isEditorsPick ?? false;
    if (isPick) {
      togglePick({ blogId: blog._id, isEditorsPick: false, annotation: '' }, {
        onSuccess: () => {
          setAccBlogs(prev => prev.map(b =>
            b._id === blog._id ? { ...b, editorsPick: { isEditorsPick: false } } : b
          ));
          toast.success("Removed from editor's choice");
        },
        onError: () => toast.error('Failed to update'),
      });
    } else {
      setAnnotation(blog.editorsPick?.annotation ?? '');
      setPickModal({ blog });
    }
  };

  const handleSavePick = () => {
    if (!pickModal) return;
    togglePick({ blogId: pickModal.blog._id, isEditorsPick: true, annotation }, {
      onSuccess: () => {
        setAccBlogs(prev => prev.map(b =>
          b._id === pickModal.blog._id
            ? { ...b, editorsPick: { isEditorsPick: true, annotation } }
            : b
        ));
        toast.success("Added to editor's choice");
        setPickModal(null);
      },
      onError: () => toast.error('Failed to update'),
    });
  };

  const handleResetFilters = () => {
    setStatusFilter('all'); setCategoryFilter('all');
    setSearchQuery(''); setDebouncedQuery('');
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
            <Input type="search" placeholder="Search blogs..." value={searchQuery} onChange={handleSearch}
              className="pl-10 font-reading border-foreground/20 focus:border-foreground/50" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border pb-4">
          <div className="flex gap-0">
            {[
              { value: 'all',            label: 'All' },
              { value: 'published',      label: `Published [ ${publishedCount} ]` },
              { value: 'scheduled',      label: `Scheduled [ ${scheduledCount} ]` },
              { value: 'editors-choice', label: `Editor's Choice` },
            ].map((tab) => (
              <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 text-xs font-mono font-medium uppercase tracking-widest border-b-2 ${DESIGN_CONSTANTS.transitions.fast} whitespace-nowrap ${
                  statusFilter === tab.value ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] h-8 text-xs font-mono border-foreground/20"><SelectValue /></SelectTrigger>
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
          <EmptyState statusFilter={statusFilter} categoryFilter={categoryFilter} onReset={handleResetFilters} />
        ) : (
          <>
            <div>
              {blogs.map(blog => (
                <BlogRow key={blog._id} blog={blog}
                  onView={handleView} onEdit={handleEdit}
                  onPublishNow={handlePublishNow} onDelete={handleDelete}
                  onEditorsPick={handleEditorsPick}
                />
              ))}
            </div>
            {hasMore && (
              <button onClick={() => setPage(p => p + 1)} disabled={isFetching}
                className={`w-full flex items-center justify-center py-4 text-xs font-mono text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-foreground/30 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40`}>
                {isFetching ? 'loading...' : 'load more'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Editor's Pick Modal */}
      <Dialog open={!!pickModal} onOpenChange={(open) => !open && setPickModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif italic font-normal text-xl">Add to Editor's Choice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Blog</p>
              <p className="text-sm font-sans font-semibold line-clamp-2">{pickModal?.blog.title}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Your annotation</p>
              <textarea
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                placeholder="Why is this worth reading? Add a short thought..."
                className="font-reading text-sm border-foreground/20 resize-none"
                rows={3}
              />
              <p className="text-[10px] font-mono text-muted-foreground mt-1">{annotation.length}/150 chars</p>
            </div>
            <p className="text-xs font-reading text-muted-foreground/60 italic">
              If 4 picks already exist, the oldest will be replaced.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPickModal(null)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wide border border-border hover:bg-muted ${DESIGN_CONSTANTS.transitions.fast}`}>
                Cancel
              </button>
              <button onClick={handleSavePick} disabled={isTogglingPick}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wide border-2 border-foreground bg-foreground text-background hover:bg-foreground/80 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40`}>
                {isTogglingPick ? 'Saving...' : 'Add to picks'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout_New>
  );
}
