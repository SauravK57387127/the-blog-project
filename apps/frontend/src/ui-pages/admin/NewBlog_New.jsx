"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminLayout_New from "@/components/admin/AdminLayout_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

export default function NewBlogPageComponent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsCreating(true);
    try {
      // TODO: POST /api/drafts with { title }
      setTimeout(() => {
        const mockId = Date.now().toString();
        router.push(`/admin/drafts/${mockId}`);
      }, 600);
    } catch (err) {
      console.error("Failed to create draft:", err);
      setIsCreating(false);
    }
  };

  return (
    <AdminLayout_New>
      <div className="flex items-start justify-center min-h-[60vh] pt-20">
        <div className="w-full max-w-2xl space-y-10">

          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
              — new post
            </span>
            <h1 className="text-4xl font-serif italic">
              What's on your mind?
            </h1>
            <p className="font-reading text-muted-foreground">
              Give it a title. You can always change it later.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Enter your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreating}
                className="h-14 text-lg font-sans border-foreground/20 focus:border-foreground/50 bg-background"
                maxLength={150}
              />
              {title.length > 120 && (
                <p className="text-xs font-mono text-muted-foreground text-right mt-2">
                  {title.length}/150
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className={`group w-full h-12 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wide border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-40 disabled:pointer-events-none`}
            >
              {isCreating ? "Creating..." : "Start Writing"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Helper */}
          <p className="text-center text-sm font-mono text-muted-foreground">
            press <kbd className="px-2 py-0.5 text-xs bg-muted border border-border font-mono">Enter</kbd> to continue
          </p>

        </div>
      </div>
    </AdminLayout_New>
  );
}
