"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { Plus, Globe, FileText, ArrowRight, Edit3 } from "lucide-react";
import AdminLayout_New from "@/components/admin/AdminLayout_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import {
    useRecentDraft,
    useScheduledUpcoming,
    useStaleDrafts,
} from "@/hooks/api/admin/useAdminHome";

// OPT: below-fold sections — dynamically imported
const WritingStreak = dynamic(
    () => import("@/components/admin/WritingStreak"),
    { loading: () => <div className="h-32 bg-muted animate-pulse rounded" /> },
);
const ScheduledTimeline = dynamic(
    () => import("@/components/admin/ScheduledTimeline"),
    { loading: () => <div className="h-48 bg-muted animate-pulse rounded" /> },
);
const StaleDrafts = dynamic(() => import("@/components/admin/StaleDrafts"), {
    loading: () => <div className="h-48 bg-muted animate-pulse rounded" />,
});

// ── Helpers ───────────────────────────────────────────────────

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function getNextSlotDate(scheduled) {
    if (!scheduled?.length) return null;
    const last = new Date(scheduled[scheduled.length - 1].scheduledFor);
    last.setDate(last.getDate() + 7);
    return last.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── QuickActions ──────────────────────────────────────────────
function QuickActions({ onNewPost, onDrafts }) {
    const itemClass = `group flex flex-col items-start gap-2 p-5 hover:bg-foreground hover:text-background text-left w-full ${DESIGN_CONSTANTS.transitions.fast}`;
    const descClass = `text-xs font-mono text-muted-foreground group-hover:text-background/60 ${DESIGN_CONSTANTS.transitions.fast}`;

    return (
        <div className="grid grid-cols-3 border-2 border-foreground divide-x-2 divide-foreground">
            <button onClick={onNewPost} className={itemClass}>
                <Plus className="h-5 w-5 flex-shrink-0" />
                <div>
                    <p className="font-sans font-bold text-sm uppercase tracking-wide">
                        New Post
                    </p>
                    <p className={descClass}>+ start writing</p>
                </div>
            </button>

            {/* View Blog — <a> with w-full so it fills grid cell like buttons do */}
            <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full ${itemClass}`}
            >
                <Globe className="h-5 w-5 flex-shrink-0" />
                <div>
                    <p className="font-sans font-bold text-sm uppercase tracking-wide">
                        View Blog
                    </p>
                    <p className={descClass}>→ live site</p>
                </div>
            </a>

            {/* Pen icon restored */}
            <button onClick={onDrafts} className={itemClass}>
                <Edit3 className="h-5 w-5 flex-shrink-0" />
                <div>
                    <p className="font-sans font-bold text-sm uppercase tracking-wide">
                        Drafts
                    </p>
                    <p className={descClass}>edit existing</p>
                </div>
            </button>
        </div>
    );
}

// ── PickUpDraft ───────────────────────────────────────────────

function PickUpDraft({ draft, onContinue }) {
    if (!draft)
        return (
            <p className="text-sm font-reading text-muted-foreground italic">
                No drafts in progress.
            </p>
        );
    return (
        <div
            onClick={() => onContinue(draft.draftSlug)}
            className="group cursor-pointer border-l-4 border-foreground pl-6 py-2"
        >
            <span className="text-xs font-mono text-muted-foreground">
                — last opened {draft.lastOpened}
            </span>
            <div className="flex items-start justify-between gap-6 mt-3">
                <h2 className="text-2xl font-serif italic leading-snug group-hover:text-accent transition-colors duration-200 flex-1">
                    {draft.title}
                </h2>
                {draft.wordCount && (
                    <span className="font-mono text-sm text-muted-foreground flex-shrink-0 mt-1">
                        {draft.wordCount} words
                    </span>
                )}
            </div>
            {draft.excerpt && (
                <p className="font-reading text-sm text-foreground/60 mt-2 line-clamp-1">
                    {draft.excerpt}
                </p>
            )}
            <div className="inline-flex items-center gap-2 mt-4 text-sm font-medium">
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-foreground after:transition-all after:duration-300 group-hover:after:w-full">
                    Continue writing
                </span>
                <ArrowRight className="h-4 w-4 opacity-60" />
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────

export default function AdminHomePage() {
    const router = useRouter();

    const { data: recentDraft, isLoading: draftLoading } = useRecentDraft();
    const { data: scheduledBlogs, isLoading: scheduledLoading } =
        useScheduledUpcoming();
    const { data: staleDrafts, isLoading: staleLoading } = useStaleDrafts();

    const nextSlot = getNextSlotDate(scheduledBlogs ?? []);

    const handleContinue = useCallback(
        (id) => router.push(`/admin/drafts/${id}`),
        [router],
    );
    const handleEdit = useCallback(
        (id) => router.push(`/admin/drafts/${id}`),
        [router],
    );
    const handleNewPost = useCallback(
        () => router.push("/admin/blogs/new"),
        [router],
    );
    const handleDrafts = useCallback(
        () => router.push("/admin/drafts"),
        [router],
    );

    return (
        <AdminLayout_New>
            <div className="space-y-12">
                {/* Greeting */}
                <div>
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                    <h1 className="text-4xl font-serif italic mt-2">
                        {getGreeting()}, Saurav.
                    </h1>
                </div>

                {/* 1. Quick Actions */}
                <section>
                    <QuickActions
                        onNewPost={handleNewPost}
                        onDrafts={handleDrafts}
                    />
                </section>

                {/* 2. Writing Streak */}
                <section>
                    <WritingStreak />
                </section>

                {/* 3. Pick Up Where You Left Off */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                            Pick Up Where You Left Off
                        </span>
                        <div className="flex-1 h-[1px] bg-border" />
                    </div>
                    {draftLoading ? (
                        <div className="h-24 bg-muted animate-pulse rounded" />
                    ) : (
                        <PickUpDraft
                            draft={recentDraft}
                            onContinue={handleContinue}
                        />
                    )}
                </section>

                {/* 4 + 5. Scheduled Timeline + Stale Drafts */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {scheduledLoading ? (
                        <div className="h-48 bg-muted animate-pulse rounded" />
                    ) : (
                        <ScheduledTimeline
                            scheduled={scheduledBlogs ?? []}
                            nextSlotDate={nextSlot}
                        />
                    )}
                    {staleLoading ? (
                        <div className="h-48 bg-muted animate-pulse rounded" />
                    ) : (
                        <StaleDrafts
                            drafts={staleDrafts ?? []}
                            onEdit={handleEdit}
                        />
                    )}
                </section>
            </div>
        </AdminLayout_New>
    );
}
