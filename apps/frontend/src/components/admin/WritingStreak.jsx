"use client";

import { useState } from "react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";
import {
    useWritingStreak,
    useSidebarStats,
} from "@/hooks/api/admin/useAdminHome";

function getActivityLevel(day) {
    const published = day.published ?? 0;
    const scheduled = day.scheduled ?? 0;
    const drafted = day.drafted ?? 0;
    if (published > 0 && (scheduled > 0 || drafted > 0)) return 4;
    if (published > 0) return 3;
    if (scheduled > 0) return 2;
    if (drafted > 0) return 1;
    return 0;
}

function getLevelClass(level) {
    switch (level) {
        case 4:
            return "bg-accent border-accent";
        case 3:
            return "bg-accent/70 border-accent/60";
        case 2:
            return "bg-accent/40 border-accent/30";
        case 1:
            return "bg-accent/20 border-accent/15";
        default:
            return "bg-muted border-border";
    }
}

function getLevelLabel(day) {
    const parts = [];
    if (day.published > 0) parts.push(`${day.published} published`);
    if (day.scheduled > 0) parts.push(`${day.scheduled} scheduled`);
    if (day.drafted > 0) parts.push(`${day.drafted} drafted`);
    return parts.length > 0 ? parts.join(" · ") : "no activity";
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function WritingStreak() {
    const [view, setView] = useState("monthly");
    const [hoveredDay, setHoveredDay] = useState(null);

    const period =
        view === "monthly" ? "month" : view === "weekly" ? "week" : "year";

    const { data: streakData, isLoading: streakLoading } =
        useWritingStreak(period);
    const { data: sidebarData, isLoading: sidebarLoading } =
        useSidebarStats(period);

    const rawDays = streakData?.data ?? [];

    const monthlyData = (() => {
        const weeks = [];
        for (let i = 0; i < rawDays.length; i += 7)
            weeks.push(rawDays.slice(i, i + 7));
        return weeks;
    })();

    const weeklyData = rawDays.map((week, wi) => ({
        label: new Date(week.weekStart).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        total: week.totalActivity ?? 0,
        weekIndex: wi,
    }));

    const yearlyData = rawDays.map((m, mi) => ({
        label: m.month?.split(" ")[0] ?? "",
        published: m.totalActivity ?? 0,
        scheduled: 0,
        drafted: 0,
        monthIndex: mi,
    }));

    const activeDays = sidebarData?.last28d?.activeDays ?? 0;
    const currentStreak = sidebarData?.last28d?.currentStreak ?? 0;
    const longestStreak = sidebarData?.last28d?.longestStreak ?? 0;
    const topDays = sidebarData?.topDaysThisMonth ?? [];
    const last12Weeks = sidebarData?.last12Weeks ?? {};
    const thisYear = sidebarData?.thisYear ?? {};

    const isLoading = streakLoading || sidebarLoading;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                        Writing Streak
                    </span>
                    <div className="h-[1px] bg-border w-8" />
                </div>
                <div className="flex items-center gap-0 border border-border">
                    {["weekly", "monthly", "yearly"].map((v, i) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest ${DESIGN_CONSTANTS.transitions.fast} ${i < 2 ? "border-r border-border" : ""} ${
                                view === v
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="h-32 bg-muted animate-pulse rounded" />
            ) : (
                <div className="grid grid-cols-5 gap-8 items-start">
                    {/* Left — Graph */}
                    <div className="col-span-3">
                        {view === "monthly" && (
                            <div className="space-y-1.5">
                                <div className="grid grid-cols-7 gap-1.5 mb-1">
                                    {DAY_LABELS.map((d, i) => (
                                        <div
                                            key={i}
                                            className="text-center text-[10px] font-mono text-muted-foreground/40"
                                        >
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                {monthlyData.map((week, wi) => (
                                    <div
                                        key={wi}
                                        className="grid grid-cols-7 gap-1.5"
                                    >
                                        {week.map((day, di) => {
                                            const level = getActivityLevel(day);
                                            const isHovered =
                                                hoveredDay?.date === day.date;
                                            return (
                                                <div
                                                    key={di}
                                                    onMouseEnter={() =>
                                                        setHoveredDay(day)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredDay(null)
                                                    }
                                                    className={`relative aspect-square border ${getLevelClass(level)} transition-all duration-150 ${isHovered ? "scale-110 z-10" : ""}`}
                                                >
                                                    {isHovered && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                                                            <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                                                                {new Date(
                                                                    day.date,
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    },
                                                                )}{" "}
                                                                ·{" "}
                                                                {getLevelLabel(
                                                                    day,
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 pt-3">
                                    {[
                                        { label: "Published + more", level: 4 },
                                        { label: "Published", level: 3 },
                                        { label: "Scheduled", level: 2 },
                                        { label: "Draft only", level: 1 },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-1.5"
                                        >
                                            <div
                                                className={`w-3 h-3 flex-shrink-0 border ${getLevelClass(item.level)}`}
                                            />
                                            <span className="text-[10px] font-mono text-muted-foreground">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === "weekly" && (
                            <div className="space-y-2">
                                <div className="flex items-end gap-2">
                                    {weeklyData.map((week, wi) => {
                                        const maxTotal = Math.max(
                                            ...weeklyData.map((w) => w.total),
                                            1,
                                        );
                                        const heightPercent =
                                            (week.total / maxTotal) * 100;
                                        const isHovered =
                                            hoveredDay?.weekIndex === wi;
                                        return (
                                            <div
                                                key={wi}
                                                className="flex-1 flex flex-col items-center gap-1"
                                                onMouseEnter={() =>
                                                    setHoveredDay({
                                                        weekIndex: wi,
                                                        ...week,
                                                    })
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredDay(null)
                                                }
                                            >
                                                <div
                                                    className="relative w-full flex flex-col justify-end"
                                                    style={{ height: "80px" }}
                                                >
                                                    {isHovered && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                                                            <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                                                                {week.label} ·{" "}
                                                                {week.total}{" "}
                                                                activities
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`w-full border transition-all duration-200 ${
                                                            week.total > 0
                                                                ? "bg-accent/60 border-accent/40"
                                                                : "bg-muted border-border"
                                                        } ${isHovered ? "bg-accent border-accent" : ""}`}
                                                        style={{
                                                            height: `${Math.max(heightPercent, week.total > 0 ? 8 : 4)}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[9px] font-mono text-muted-foreground/50">
                                                    {week.label.split(" ")[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {view === "yearly" && (
                            <div className="space-y-2">
                                <div className="flex items-end gap-2">
                                    {yearlyData.map((month, mi) => {
                                        const total =
                                            month.published +
                                            month.scheduled +
                                            month.drafted;
                                        const maxTotal = Math.max(
                                            ...yearlyData.map(
                                                (m) =>
                                                    m.published +
                                                    m.scheduled +
                                                    m.drafted,
                                            ),
                                            1,
                                        );
                                        const heightPercent =
                                            (total / maxTotal) * 100;
                                        const isHovered =
                                            hoveredDay?.monthIndex === mi;
                                        return (
                                            <div
                                                key={mi}
                                                className="flex-1 flex flex-col items-center gap-1"
                                                onMouseEnter={() =>
                                                    setHoveredDay({
                                                        monthIndex: mi,
                                                        ...month,
                                                    })
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredDay(null)
                                                }
                                            >
                                                <div
                                                    className="relative w-full flex flex-col justify-end"
                                                    style={{ height: "80px" }}
                                                >
                                                    {isHovered && (
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                                                            <div className="bg-foreground text-background text-[10px] font-mono px-2 py-1 whitespace-nowrap">
                                                                {month.label} ·{" "}
                                                                {total} total
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div
                                                        className="w-full flex flex-col justify-end border border-border overflow-hidden"
                                                        style={{
                                                            height: `${Math.max(heightPercent, total > 0 ? 8 : 4)}%`,
                                                        }}
                                                    >
                                                        {month.published >
                                                            0 && (
                                                            <div
                                                                className="w-full bg-accent"
                                                                style={{
                                                                    flex: month.published,
                                                                }}
                                                            />
                                                        )}
                                                        {month.scheduled >
                                                            0 && (
                                                            <div
                                                                className="w-full bg-accent/50"
                                                                style={{
                                                                    flex: month.scheduled,
                                                                }}
                                                            />
                                                        )}
                                                        {month.drafted > 0 && (
                                                            <div
                                                                className="w-full bg-accent/20"
                                                                style={{
                                                                    flex: month.drafted,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-mono text-muted-foreground/50">
                                                    {month.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Stats panel */}
                    <div className="col-span-2 space-y-6 border-l border-border pl-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    Active days (28d)
                                </p>
                                <p className="text-2xl font-mono font-bold mt-0.5">
                                    {activeDays}{" "}
                                    <span className="text-sm text-muted-foreground font-normal">
                                        / 28
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    Current streak
                                </p>
                                <p className="text-2xl font-mono font-bold mt-0.5">
                                    {currentStreak}{" "}
                                    <span className="text-sm text-muted-foreground font-normal">
                                        days
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    Longest streak
                                </p>
                                <p className="text-2xl font-mono font-bold mt-0.5">
                                    {longestStreak}{" "}
                                    <span className="text-sm text-muted-foreground font-normal">
                                        days
                                    </span>
                                </p>
                            </div>
                        </div>

                        {view === "monthly" && topDays.length > 0 && (
                            <div className="pt-4 border-t border-border">
                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
                                    Top days this month
                                </p>
                                <div className="space-y-2">
                                    {topDays.map((day, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-[10px] font-mono text-muted-foreground/40 w-3">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-mono text-foreground">
                                                    {day.day}
                                                </p>
                                                <p className="text-[10px] font-mono text-muted-foreground truncate">
                                                    {day.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === "weekly" && (
                            <div className="pt-4 border-t border-border">
                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
                                    Last 12 weeks
                                </p>
                                <div className="space-y-1">
                                    {[
                                        {
                                            label: "Most active week",
                                            value:
                                                last12Weeks.mostActiveWeek ??
                                                "—",
                                        },
                                        {
                                            label: "Avg per week",
                                            value: last12Weeks.averagePostsPerWeek
                                                ? `${last12Weeks.averagePostsPerWeek} posts`
                                                : "—",
                                        },
                                        {
                                            label: "Active weeks",
                                            value:
                                                last12Weeks.activeWeeks ?? "—",
                                        },
                                    ].map((stat) => (
                                        <div key={stat.label}>
                                            <p className="text-[10px] font-mono text-muted-foreground">
                                                {stat.label}
                                            </p>
                                            <p className="text-xs font-mono font-medium text-foreground">
                                                {stat.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === "yearly" && (
                            <div className="pt-4 border-t border-border">
                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
                                    This year
                                </p>
                                <div className="space-y-1">
                                    {[
                                        {
                                            label: "Total published",
                                            value:
                                                thisYear.totalPublished != null
                                                    ? `${thisYear.totalPublished} posts`
                                                    : "—",
                                        },
                                        {
                                            label: "Total scheduled",
                                            value:
                                                thisYear.totalScheduled != null
                                                    ? `${thisYear.totalScheduled} posts`
                                                    : "—",
                                        },
                                        {
                                            label: "Total drafted",
                                            value:
                                                thisYear.totalDrafts != null
                                                    ? `${thisYear.totalDrafts} drafts`
                                                    : "—",
                                        },
                                        {
                                            label: "Best month",
                                            value: thisYear.bestMonth ?? "—",
                                        },
                                    ].map((stat) => (
                                        <div key={stat.label}>
                                            <p className="text-[10px] font-mono text-muted-foreground">
                                                {stat.label}
                                            </p>
                                            <p className="text-xs font-mono font-medium text-foreground">
                                                {stat.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
