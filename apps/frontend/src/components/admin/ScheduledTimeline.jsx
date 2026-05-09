"use client";

import { DESIGN_CONSTANTS } from "@/lib/design-constants";

function formatScheduledDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export default function ScheduledTimeline({ scheduled, nextSlotDate }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Coming Up
                </span>
                <div className="flex-1 h-[1px] bg-border" />
            </div>
            <div className="relative">
                <div className="absolute left-[52px] top-0 bottom-0 w-[1px] bg-border" />
                <div className="space-y-0">
                    {scheduled.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 py-3"
                        >
                            <span className="text-xs font-mono text-muted-foreground w-12 flex-shrink-0 text-right">
                                {formatScheduledDate(item.scheduledFor)}
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full bg-foreground flex-shrink-0 z-10" />
                            <p className="font-sans text-sm font-medium line-clamp-1 flex-1">
                                {item.title}
                            </p>
                        </div>
                    ))}
                    {nextSlotDate && (
                        <div className="flex items-center gap-4 py-3">
                            <span className="text-xs font-mono text-muted-foreground/40 w-12 flex-shrink-0 text-right">
                                {nextSlotDate}
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full border border-dashed border-muted-foreground/30 flex-shrink-0 z-10" />
                            <p className="font-reading text-sm text-muted-foreground/50 italic">
                                slot available — write something?
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
