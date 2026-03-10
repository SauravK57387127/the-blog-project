"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Clock, FileText, Undo2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout_New from "@/components/admin/AdminLayout_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import { toast } from "sonner";

const demoDrafts = [
  { _id: "d1", title: "Understanding React Server Components in Depth", excerpt: "A comprehensive guide to React Server Components, their benefits, and how to use them effectively in modern applications.", updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), wordCount: 840 },
  { _id: "d2", title: "My LeetCode Journey: 100 Days In", excerpt: "Reflections on solving problems daily, patterns I've learned, and how it's changed my approach to coding interviews.", updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), wordCount: 1200 },
  { _id: "d3", title: "Why I Started Meditating as a Developer", excerpt: "How mindfulness practice has improved my focus, reduced burnout, and made me a better problem solver.", updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), wordCount: 430 },
  { _id: "d4", title: "Building a Full-Stack Blog with Next.js", excerpt: "", updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), wordCount: 0 },
];

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function DraftRow({ draft, onEdit, onDelete }) {
  return (
    <div className={`group flex items-center gap-4 py-4 border-b border-border hover:bg-muted/20 ${DESIGN_CONSTANTS.transitions.fast}`}>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(draft._id)}>
        <p className={`font-sans font-semibold text-sm line-clamp-1 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {draft.title}
        </p>
        {draft.excerpt ? (
          <p className="font-reading text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {draft.excerpt}
          </p>
        ) : (
          <p className="font-reading text-xs text-muted-foreground/50 italic mt-0.5">
            No content yet...
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs font-mono text-muted-foreground">
          <span>Edited {formatTimeAgo(draft.updatedAt)}</span>
          <span className="opacity-40">·</span>
          <span>{draft.wordCount} words</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(draft._id)}
          className={`p-2 text-muted-foreground hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}
          title="Edit"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(draft._id); }}
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [drafts, setDrafts] = useState(demoDrafts);
  const undoTimeoutRef = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    return () => { if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current); };
  }, []);

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const handleCreateNew = () => router.push("/admin/blogs/new");
  const handleEdit = (id) => router.push(`/admin/drafts/${id}`);

  const handleDelete = (id) => {
    const draftToDelete = drafts.find(d => d._id === id);
    if (!draftToDelete) return;
    setDrafts(prev => prev.filter(d => d._id !== id));
    setPendingDelete(draftToDelete);
    toast.error(`Draft deleted`, {
      description: draftToDelete.title,
      action: {
        label: "Undo",
        onClick: () => handleUndo(draftToDelete),
      },
    });
    undoTimeoutRef.current = setTimeout(() => {
      console.log("Permanently delete draft:", id);
      setPendingDelete(null);
    }, 5000);
  };

  const handleUndo = (draft) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setDrafts(prev => [...prev, draft]);
    setPendingDelete(null);
    toast.success("Draft restored");
  };

  return (
    <AdminLayout_New>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
              — drafts
            </span>
            <h1 className="text-3xl font-serif italic mt-1">Continue Writing</h1>
          </div>

          {drafts.length > 0 && (
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-reading border-foreground/20 focus:border-foreground/50"
              />
            </div>
          )}
        </div>

        {/* Drafts list */}
        {drafts.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : filteredDrafts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-reading text-muted-foreground">
              No drafts match "<span className="text-foreground">{debouncedQuery}</span>"
            </p>
          </div>
        ) : (
          <div>
            {filteredDrafts.map(draft => (
              <DraftRow
                key={draft._id}
                draft={draft}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>
    </AdminLayout_New>
  );
}
