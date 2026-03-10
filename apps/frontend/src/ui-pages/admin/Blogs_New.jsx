"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Trash2, Eye, Edit3, Send, X, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AdminLayout_New from "@/components/admin/AdminLayout_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import { toast } from "sonner";

const demoBlogs = [
  { _id: "b1", title: "Getting Started with React Server Components", slug: "getting-started-with-react-server-components", excerpt: "A comprehensive guide to understanding and implementing React Server Components in your Next.js applications.", coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop", tags: ["react", "nextjs", "server-components"], category: "tech-deep-dive", status: "published", publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "b2", title: "The Self-Taught Developer's Journey", slug: "the-self-taught-developers-journey", excerpt: "Reflections on learning to code independently and building a career without a CS degree.", coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop", tags: ["career", "learning", "personal"], category: "career-and-learnings", status: "published", publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "b3", title: "Building Better Habits as a Developer", slug: "building-better-habits-as-a-developer", excerpt: "How daily routines, meditation, and consistent practice transformed my coding skills.", coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop", tags: ["productivity", "habits", "mindfulness"], category: "life-and-growth", status: "scheduled", scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "b4", title: "Advanced TypeScript Patterns", slug: "advanced-typescript-patterns", excerpt: "Deep dive into generics, conditional types, and mapped types for building type-safe applications.", coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop", tags: ["typescript", "patterns", "advanced"], category: "tech-deep-dive", status: "published", publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: "b5", title: "Why I Started Meditating Daily", slug: "why-i-started-meditating-daily", excerpt: "The impact of a consistent meditation practice on focus, creativity, and problem-solving.", coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop", tags: ["meditation", "mindfulness", "wellness"], category: "life-and-growth", status: "scheduled", scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
];

const CATEGORIES = {
  all: "All Categories",
  "tech-deep-dive": "Tech Deep Dive",
  "life-and-growth": "Life & Growth",
  "career-and-learnings": "Career & Learnings",
};

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateString).toLocaleDateString();
}

function formatFutureDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-mono font-medium px-2 py-0.5 border ${
      status === "published"
        ? "border-foreground/30 text-foreground"
        : "border-muted-foreground/30 text-muted-foreground"
    }`}>
      {status === "published" ? "published" : "scheduled"}
    </span>
  );
}

function BlogRow({ blog, onView, onEdit, onPublishNow, onDelete }) {
  return (
    <div className={`group flex items-center gap-4 py-4 border-b border-border hover:bg-muted/20 ${DESIGN_CONSTANTS.transitions.fast}`}>
      {/* Thumbnail */}
      <div className="w-16 h-12 flex-shrink-0 overflow-hidden bg-muted">
        {blog.coverImage
          ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-muted" />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-sans font-semibold text-sm line-clamp-1 group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
          {blog.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={blog.status} />
          <span className="text-xs font-mono text-muted-foreground">
            {blog.status === "scheduled"
              ? `scheduled for ${formatFutureDate(blog.scheduledAt)}`
              : formatTimeAgo(blog.publishedAt)
            }
          </span>
        </div>
      </div>

      {/* Actions — appear on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onView(blog._id)}
          className={`p-2 text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
        {blog.status === "scheduled" && (
          <>
            <button
              onClick={() => onEdit(blog._id)}
              className={`p-2 text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
              title="Edit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPublishNow(blog._id)}
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
        {statusFilter !== "all" || categoryFilter !== "all"
          ? "Try adjusting your filters"
          : "Start writing your first post"
        }
      </p>
      {(statusFilter !== "all" || categoryFilter !== "all") && (
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

export default function BlogsPageComponent() {
  const router = useRouter();
  const [blogs, setBlogs] = useState(demoBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);
  const undoTimeoutRef = useRef(null);

  const statusCounts = {
    published: blogs.filter(b => b.status === "published").length,
    scheduled: blogs.filter(b => b.status === "scheduled").length,
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = !debouncedQuery ||
      blog.title.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || blog.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleView = (id) => {
    const blog = blogs.find(b => b._id === id);
    if (blog?.slug) router.push(`/blogs/${blog.slug}`);
  };

  const handleEdit = (id) => router.push(`/admin/blogs/${id}/edit`);

  const handlePublishNow = async (id) => {
    setBlogs(prev => prev.map(b =>
      b._id === id ? { ...b, status: "published", publishedAt: new Date().toISOString() } : b
    ));
    toast.success("Blog published!");
  };

  const handleDelete = (blog) => {
    setBlogs(prev => prev.filter(b => b._id !== blog._id));
    setPendingDelete(blog);
    toast.success("Blog deleted", {
      action: { label: "Undo", onClick: () => handleUndo(blog) },
      duration: 5000,
    });
    undoTimeoutRef.current = setTimeout(() => {
      console.log("Permanently delete blog:", blog._id);
      setPendingDelete(null);
    }, 5000);
  };

  const handleUndo = (blog) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setBlogs(prev => [...prev, blog]);
    setPendingDelete(null);
    toast.success("Blog restored");
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
    setDebouncedQuery("");
  };

  return (
    <AdminLayout_New>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
              — content
            </span>
            <h1 className="text-3xl font-serif italic mt-1">Blogs</h1>
          </div>

          {blogs.length > 0 && (
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDebouncedQuery(e.target.value);
                }}
                className="pl-10 font-reading border-foreground/20 focus:border-foreground/50"
              />
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border pb-4">
          {/* Status tabs — mono style */}
          <div className="flex gap-0">
            {[
              { value: "all", label: "All" },
              { value: "published", label: `Published [ ${statusCounts.published} ]` },
              { value: "scheduled", label: `Scheduled [ ${statusCounts.scheduled} ]` },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 text-xs font-mono font-medium uppercase tracking-widest border-b-2 ${DESIGN_CONSTANTS.transitions.fast} whitespace-nowrap ${
                  statusFilter === tab.value
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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
                <SelectItem key={value} value={value} className="text-xs font-mono">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blog List */}
        {filteredBlogs.length === 0 ? (
          <EmptyState
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onReset={handleResetFilters}
          />
        ) : (
          <div>
            {filteredBlogs.map(blog => (
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
        )}

      </div>
    </AdminLayout_New>
  );
}
