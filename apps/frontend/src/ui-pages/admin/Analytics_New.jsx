"use client";

import { useState } from "react";
import { Eye, FileText, TrendingUp, Clock, Mail, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminLayout_New from "@/components/admin/AdminLayout_New";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

// ─── Demo Data ── TODO: Replace with React Query ────────────

const analyticsOverview = {
    totalViews: 45820,
    totalBlogs: 38,
    avgReadTime: 4.2,
    subscribers: 312,
    subscriberGrowth: 24,
};

const topPosts = [
    {
        _id: "1",
        title: "Getting Started with React Server Components",
        slug: "getting-started-with-react-server-components",
        views: 5420,
        category: "tech-deep-dive",
        publishedAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
    },
    {
        _id: "2",
        title: "The Self-Taught Developer's Journey",
        slug: "self-taught-developer-journey",
        views: 4850,
        category: "career-and-learnings",
        publishedAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
    },
    {
        _id: "3",
        title: "Building Better Habits as a Developer",
        slug: "building-better-habits",
        views: 3240,
        category: "life-and-growth",
        publishedAt: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString(),
    },
    {
        _id: "4",
        title: "Advanced TypeScript Patterns",
        slug: "advanced-typescript-patterns",
        views: 2890,
        category: "tech-deep-dive",
        publishedAt: new Date(
            Date.now() - 20 * 24 * 60 * 60 * 1000,
        ).toISOString(),
    },
    {
        _id: "5",
        title: "Why I Started Meditating Daily",
        slug: "why-i-started-meditating",
        views: 2140,
        category: "life-and-growth",
        publishedAt: new Date(
            Date.now() - 25 * 24 * 60 * 60 * 1000,
        ).toISOString(),
    },
];

const categoryAnalytics = [
    {
        category: "tech-deep-dive",
        label: "Tech Deep Dive",
        totalPosts: 18,
        totalViews: 18540,
    },
    {
        category: "life-and-growth",
        label: "Life & Growth",
        totalPosts: 12,
        totalViews: 12340,
    },
    {
        category: "career-and-learnings",
        label: "Career & Learnings",
        totalPosts: 8,
        totalViews: 8450,
    },
];

// TODO: Replace with real daily views from backend
function generateViewsData(days = 30) {
    const data = [];
    let base = 800;
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        base = Math.max(200, base + (Math.random() - 0.45) * 200);
        data.push({
            date: date.toISOString().split("T")[0],
            views: Math.floor(base),
        });
    }
    return data;
}

const viewsData = generateViewsData(30);

const bestDay = {
    date: "Feb 14, 2025",
    views: 1240,
    post: "Getting Started with React Server Components",
};

const bestMonth = {
    month: "January 2025",
    views: 12400,
    posts: 6,
};

const CATEGORY_LABELS = {
    "tech-deep-dive": "[ tech ]",
    "life-and-growth": "[ life ]",
    "career-and-learnings": "[ career ]",
};

// ─── Helpers ─────────────────────────────────────────────────

function formatTimeAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(dateString).toLocaleDateString();
}

function formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

// ─── Components ──────────────────────────────────────────────

function StatTile({ title, value, sub, highlight = false }) {
    return (
        <div
            className={`p-6 border-2 ${highlight ? "border-foreground" : "border-border"} ${DESIGN_CONSTANTS.transitions.smooth}`}
        >
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                {title}
            </span>
            <p className="text-4xl font-mono font-bold text-foreground mt-3">
                {value}
            </p>
            {sub && (
                <p className="text-xs font-mono text-muted-foreground mt-1">
                    {sub}
                </p>
            )}
        </div>
    );
}

function ViewsSparkline({ data }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const maxViews = Math.max(...data.map((d) => d.views));
    const minViews = Math.min(...data.map((d) => d.views));
    const range = maxViews - minViews || 1;

    const W = 1000;
    const H = 120;
    const PAD = 8;
    const barW = W / data.length - 3;

    const totalViews = data.reduce((sum, d) => sum + d.views, 0);
    const avgViews = Math.floor(totalViews / data.length);
    const trend = data[data.length - 1].views > data[0].views;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Views — last 30 days
                    </span>
                    <div className="h-[1px] bg-border w-8" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Total
                        </p>
                        <p className="text-sm font-mono font-bold">
                            {formatNumber(totalViews)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Daily avg
                        </p>
                        <p className="text-sm font-mono font-bold">
                            {formatNumber(avgViews)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Trend
                        </p>
                        <p
                            className={`text-sm font-mono font-bold ${trend ? "text-accent" : "text-destructive/70"}`}
                        >
                            {trend ? "↑ growing" : "↓ declining"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative w-full" style={{ height: `${H + 32}px` }}>
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full"
                    style={{ height: `${H}px` }}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {data.map((d, i) => {
                        const x = i * (W / data.length);
                        const heightPct = (d.views - minViews) / range;
                        const barHeight = Math.max(
                            heightPct * (H - PAD * 2) + PAD,
                            4,
                        );
                        const y = H - barHeight;
                        const isHovered = hoveredIndex === i;

                        return (
                            <g key={i} onMouseEnter={() => setHoveredIndex(i)}>
                                <rect
                                    x={x + 1}
                                    y={y}
                                    width={barW}
                                    height={barHeight}
                                    className={`transition-all duration-100 ${
                                        isHovered
                                            ? "fill-foreground"
                                            : "fill-foreground/15"
                                    }`}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Hover tooltip */}
                {hoveredIndex !== null && (
                    <div
                        className="absolute top-0 pointer-events-none"
                        style={{
                            left: `${(hoveredIndex / data.length) * 100}%`,
                            transform:
                                hoveredIndex > data.length * 0.7
                                    ? "translateX(-100%)"
                                    : "translateX(8px)",
                        }}
                    >
                        <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                            {data[hoveredIndex].date} ·{" "}
                            {formatNumber(data[hoveredIndex].views)} views
                        </div>
                    </div>
                )}

                {/* X axis labels */}
                <div className="flex justify-between mt-2">
                    {[0, Math.floor(data.length / 2), data.length - 1].map(
                        (i) => (
                            <span
                                key={i}
                                className="text-[10px] font-mono text-muted-foreground/50"
                            >
                                {data[i].date.slice(5)}
                            </span>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

function TopPostsTable({ posts }) {
    const maxViews = Math.max(...posts.map((p) => p.views));

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Top Performing Posts
                </span>
                <div className="flex-1 h-[1px] bg-border" />
            </div>

            <div>
                {posts.map((post, i) => {
                    const fillPct = (post.views / maxViews) * 100;
                    return (
                        <div
                            key={post._id}
                            className="relative flex items-center gap-4 py-4 border-b border-border last:border-0 overflow-hidden group"
                        >
                            {/* Background fill bar */}
                            <div
                                className="absolute inset-0 bg-muted/40 transition-all duration-500"
                                style={{ width: `${fillPct}%` }}
                            />

                            {/* Rank */}
                            <span className="relative text-2xl font-mono font-bold text-foreground/10 w-8 flex-shrink-0 text-right">
                                {i + 1}
                            </span>

                            {/* Title */}
                            <span
                                onClick={() =>
                                    window.open(`/blogs/${post.slug}`, "_blank")
                                }
                                className={`relative flex-1 min-w-0 font-sans font-semibold text-sm line-clamp-1 hover:text-accent cursor-pointer ${DESIGN_CONSTANTS.transitions.fast}`}
                            >
                                {post.title}
                            </span>

                            {/* Category */}
                            <span className="relative text-xs font-mono text-muted-foreground flex-shrink-0 hidden sm:block">
                                {CATEGORY_LABELS[post.category]}
                            </span>

                            {/* Published */}
                            <span className="relative text-xs font-mono text-muted-foreground flex-shrink-0 hidden md:block w-16 text-right">
                                {formatTimeAgo(post.publishedAt)}
                            </span>

                            {/* Views */}
                            <span className="relative text-sm font-mono font-bold flex-shrink-0 w-14 text-right">
                                {formatNumber(post.views)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CategoryBreakdown({ data }) {
    const totalViews = data.reduce((sum, d) => sum + d.totalViews, 0);

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Category Breakdown
                </span>
                <div className="flex-1 h-[1px] bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-foreground divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
                {data.map((item) => {
                    const avgViewsPerPost = Math.floor(
                        item.totalViews / item.totalPosts,
                    );
                    const sharePct = Math.round(
                        (item.totalViews / totalViews) * 100,
                    );

                    return (
                        <div key={item.category} className="p-6 space-y-4">
                            <div>
                                <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground">
                                    {CATEGORY_LABELS[item.category]}
                                </span>
                                <h3 className="font-sans font-bold text-base mt-1">
                                    {item.label}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                        Total views
                                    </p>
                                    <p className="text-2xl font-mono font-bold">
                                        {formatNumber(item.totalViews)}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                            Posts
                                        </p>
                                        <p className="text-base font-mono font-bold">
                                            {item.totalPosts}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                            Avg / post
                                        </p>
                                        <p className="text-base font-mono font-bold">
                                            {formatNumber(avgViewsPerPost)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Share bar */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        Share of total views
                                    </span>
                                    <span className="text-[10px] font-mono font-bold">
                                        {sharePct}%
                                    </span>
                                </div>
                                <div className="h-[3px] bg-muted w-full">
                                    <div
                                        className="h-full bg-foreground/50 transition-all duration-500"
                                        style={{ width: `${sharePct}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function BestMoments({ bestDay, bestMonth }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Personal Bests
                </span>
                <div className="flex-1 h-[1px] bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
                {/* Best Day */}
                <div className="p-6 border-l-4 border-l-accent">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Best day ever
                    </span>
                    <p className="text-4xl font-mono font-bold mt-3">
                        {formatNumber(bestDay.views)}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                        views on {bestDay.date}
                    </p>
                    <p className="font-reading text-sm text-foreground/70 mt-3 italic line-clamp-1">
                        "{bestDay.post}"
                    </p>
                </div>

                {/* Best Month */}
                <div className="p-6 border-l-4 border-l-foreground/30">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Best month ever
                    </span>
                    <p className="text-4xl font-mono font-bold mt-3">
                        {formatNumber(bestMonth.views)}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                        views in {bestMonth.month}
                    </p>
                    <p className="font-reading text-sm text-foreground/70 mt-3 italic">
                        {bestMonth.posts} posts published that month
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────

export default function AnalyticsPage() {
    return (
        <AdminLayout_New>
            <div className="space-y-12">
                {/* Header */}
                <div>
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        — analytics
                    </span>
                    <h1 className="text-3xl font-serif italic mt-1">
                        Your Numbers
                    </h1>
                </div>

                {/* 1. Stat Tiles */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatTile
                        title="Total Views"
                        value={formatNumber(analyticsOverview.totalViews)}
                        sub="all-time"
                        highlight
                    />
                    <StatTile
                        title="Published Posts"
                        value={analyticsOverview.totalBlogs}
                        sub="articles live"
                    />
                    <StatTile
                        title="Avg Read Time"
                        value={`${analyticsOverview.avgReadTime}m`}
                        sub="per article"
                    />
                    <StatTile
                        title="Subscribers"
                        value={analyticsOverview.subscribers}
                        sub={`+${analyticsOverview.subscriberGrowth} this month`}
                    />
                </section>

                {/* 2. Views Sparkline */}
                <section>
                    <ViewsSparkline data={viewsData} />
                </section>

                {/* 3. Top Posts */}
                <section>
                    <TopPostsTable posts={topPosts} />
                </section>

                {/* 4. Category Breakdown */}
                <section>
                    <CategoryBreakdown data={categoryAnalytics} />
                </section>

                {/* 5. Personal Bests */}
                <section>
                    <BestMoments bestDay={bestDay} bestMonth={bestMonth} />
                </section>
            </div>
        </AdminLayout_New>
    );
}
