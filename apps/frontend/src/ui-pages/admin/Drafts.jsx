'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminLayout_New from '@/components/admin/AdminLayout_New';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

const PAGE_SIZE = 20;

function formatTimeAgo(dateString) {
  const diff  = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function useDrafts(page = 1) {
  return useQuery({
    queryKey: ['admin', 'drafts', page],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN.BLOGS.DRAFTS, { params: { page, limit: PAGE_SIZE } }),
    staleTime: 60 * 1000,
    select: (r) => r?.data ?? { drafts: [], pagination: {} },
  });
}

function useDeleteDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(API_ENDPOINTS.ADMIN.BLOGS.DELETE(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'drafts'] }),
  });
}

function DraftRow({ draft, onEdit, onDelete }) {
  return (
    <div className={`group flex items-center gap-4 py-4 border-b border-border hover:bg-muted/20 ${DESIGN_CONSTANTS.transitions.fast}`}>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(draft)}>
        <p className={`font-sans font-semibold text-sm line-clamp-1 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {draft.title || <span className="italic text-muted-foreground">Untitled</span>}
        </p>
        {draft.excerpt
          ? <p className="font-reading text-xs text-muted-foreground line-clamp-1 mt-0.5">{draft.excerpt}</p>
          : <p className="font-reading text-xs text-muted-foreground/50 italic mt-0.5">No content yet...</p>
        }
        <div className="flex items-center gap-2 mt-1 text-xs font-mono text-muted-foreground">
          <span>Edited {formatTimeAgo(draft.updatedAt)}</span>
          <span className="opacity-40">·</span>
          <span>{draft.wordCount ?? 0} words</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(draft)}
          className={`p-2 text-muted-foreground hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}
          title="Edit"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(draft); }}
          className={`p-2 text-muted-foreground hover:text-destructive ${DESIGN_CONSTANTS.transitions.fast}`}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onCreateNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <p className="text-4xl font-mono font-bold text-muted-foreground/10">0</p>
      <p className="text-base font-sans font-bold">No drafts yet</p>
      <p className="text-sm font-reading text-muted-foreground max-w-sm text-center">
        Start writing your first post and save it as a draft to continue later.
      </p>
      <button
        onClick={onCreateNew}
        className={`group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px]`}
      >
        Create First Draft
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export default function DraftsPageComponent() {
  const router       = useRouter();
  const [searchQuery, setSearchQuery]     = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage]                   = useState(1);
  const [accDrafts, setAccDrafts]         = useState([]);
  const debounceRef  = useRef(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (!token) router.replace('/admin/login');
  }, []);

  const { data, isLoading, isFetching } = useDrafts(page);
  const { mutate: deleteDraft }         = useDeleteDraft();

  // Accumulate pages
  useEffect(() => {
    if (!data?.drafts?.length) return;
    setAccDrafts(prev => page === 1 ? data.drafts : [...prev, ...data.drafts]);
  }, [data?.drafts, page]);

  // Debounce search
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  };

  const filtered = accDrafts.filter(d =>
    !debouncedQuery || d.title?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const hasMore = data?.pagination?.hasMore ?? false;

  const handleEdit = (draft) => {
    router.push(`/admin/drafts/${draft.draftSlug}`);
  };

  const handleDelete = (draft) => {
    deleteDraft(draft._id, {
      onSuccess: () => {
        setAccDrafts(prev => prev.filter(d => d._id !== draft._id));
        toast.error('Draft deleted', {
          description: draft.title || 'Untitled',
          action: {
            label: 'Undo',
            onClick: () => toast.info('Undo not available — draft permanently deleted'),
          },
        });
      },
      onError: () => toast.error('Failed to delete draft'),
    });
  };

  return (
    <AdminLayout_New>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">— drafts</span>
            <h1 className="text-3xl font-serif italic mt-1">Continue Writing</h1>
          </div>
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 font-reading border-foreground/20 focus:border-foreground/50"
            />
          </div>
        </div>

        {/* List */}
        {isLoading && page === 1 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 py-4 border-b border-border">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : accDrafts.length === 0 ? (
          <EmptyState onCreateNew={() => router.push('/admin/blogs/new')} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-reading text-muted-foreground">
              No drafts match "<span className="text-foreground">{debouncedQuery}</span>"
            </p>
          </div>
        ) : (
          <>
            <div>
              {filtered.map(draft => (
                <DraftRow
                  key={draft._id}
                  draft={draft}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {hasMore && (
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={isFetching}
                className={`w-full flex items-center justify-center py-4 text-xs font-mono text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-foreground/30 ${DESIGN_CONSTANTS.transitions.fast} disabled:opacity-40`}
              >
                {isFetching ? 'loading...' : 'load more'}
              </button>
            )}
          </>
        )}

      </div>
    </AdminLayout_New>
  );
}
