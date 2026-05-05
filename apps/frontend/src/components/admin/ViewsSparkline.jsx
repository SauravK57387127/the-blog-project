"use client";

import { useState } from "react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

function formatNumber(num) {
    if (!num && num !== 0) return "—";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

export default function ViewsSparkline({ data, isLoading }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (isLoading)
        return <div className="h-48 bg-muted animate-pulse rounded" />;
    if (!data?.dailyViews?.length) return null;

    const views = data.dailyViews;
    const maxViews = Math.max(...views.map((d) => d.views));
    const minViews = Math.min(...views.map((d) => d.views));
    const range = maxViews - minViews || 1;
    const W = 1000,
        H = 120,
        PAD = 8;
    const barW = W / views.length - 3;

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
                            {formatNumber(data.totalViews)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Daily avg
                        </p>
                        <p className="text-sm font-mono font-bold">
                            {formatNumber(data.dailyAverage)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            Trend
                        </p>
                        <p
                            className={`text-sm font-mono font-bold ${data.trend === "growing" ? "text-accent" : "text-destructive/70"}`}
                        >
                            {data.trend === "growing"
                                ? "↑ growing"
                                : "↓ declining"}
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
                    {views.map((d, i) => {
                        const x = i * (W / views.length);
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
                                    className={`transition-all duration-100 ${isHovered ? "fill-foreground" : "fill-foreground/15"}`}
                                />
                            </g>
                        );
                    })}
                </svg>
                {hoveredIndex !== null && (
                    <div
                        className="absolute top-0 pointer-events-none"
                        style={{
                            left: `${(hoveredIndex / views.length) * 100}%`,
                            transform:
                                hoveredIndex > views.length * 0.7
                                    ? "translateX(-100%)"
                                    : "translateX(8px)",
                        }}
                    >
                        <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                            {views[hoveredIndex].date} ·{" "}
                            {formatNumber(views[hoveredIndex].views)} views
                        </div>
                    </div>
                )}
                <div className="flex justify-between mt-2">
                    {[0, Math.floor(views.length / 2), views.length - 1].map(
                        (i) => (
                            <span
                                key={i}
                                className="text-[10px] font-mono text-muted-foreground/50"
                            >
                                {views[i]?.date?.slice(5)}
                            </span>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}
