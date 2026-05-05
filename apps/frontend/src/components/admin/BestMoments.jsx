"use client";

export default function BestMoments({ data, isLoading }) {
    if (isLoading)
        return <div className="h-40 bg-muted animate-pulse rounded" />;
    if (!data) return null;

    const { bestDay, bestMonth } = data;
    if (!bestDay && !bestMonth) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Personal Bests
                </span>
                <div className="flex-1 h-[1px] bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
                <div className="p-6 border-l-4 border-l-accent">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Best day ever
                    </span>
                    <p className="text-4xl font-mono font-bold mt-3">
                        {bestDay?.views ?? "—"}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                        views on {bestDay?.date ?? "—"}
                    </p>
                    {bestDay?.blogTitle && (
                        <p className="font-reading text-sm text-foreground/70 mt-3 italic line-clamp-1">
                            "{bestDay.blogTitle}"
                        </p>
                    )}
                </div>
                <div className="p-6 border-l-4 border-l-foreground/30">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Best month ever
                    </span>
                    <p className="text-4xl font-mono font-bold mt-3">
                        {bestMonth?.views ?? "—"}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                        views in {bestMonth?.month ?? "—"}
                    </p>
                    {bestMonth?.postsPublished != null && (
                        <p className="font-reading text-sm text-foreground/70 mt-3 italic">
                            {bestMonth.postsPublished} posts published that
                            month
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
