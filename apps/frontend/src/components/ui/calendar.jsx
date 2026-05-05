"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            styles={{
                month_grid: { width: "100%", borderCollapse: "collapse" },
                weekdays: { display: "flex" },
                week: { display: "flex", marginTop: "4px" },
            }}
            classNames={{
                months: "flex flex-col sm:flex-row gap-4",
                month: "space-y-3",
                month_caption:
                    "flex justify-center pt-1 relative items-center h-7",
                caption_label:
                    "text-xs font-mono font-medium uppercase tracking-widest text-foreground",
                nav: "flex items-center",
                button_previous: cn(
                    "absolute left-1 inline-flex items-center justify-center h-6 w-6",
                    "border border-border text-muted-foreground bg-transparent",
                    "hover:text-foreground hover:border-foreground/40 transition-colors duration-150",
                ),
                button_next: cn(
                    "absolute right-1 inline-flex items-center justify-center h-6 w-6",
                    "border border-border text-muted-foreground bg-transparent",
                    "hover:text-foreground hover:border-foreground/40 transition-colors duration-150",
                ),
                weekday:
                    "text-muted-foreground w-9 text-center text-[10px] font-mono uppercase tracking-wide pb-1",
                day: "h-9 w-9 p-0 text-center relative",
                day_button: cn(
                    "h-9 w-9 text-xs font-mono",
                    "inline-flex items-center justify-center",
                    "border border-transparent",
                    "hover:border-foreground/30 hover:bg-muted",
                    "transition-colors duration-150",
                ),
                selected:
                    "[&>button]:border-foreground [&>button]:bg-foreground [&>button]:text-background",
                today: "[&>button]:border-accent [&>button]:text-accent [&>button]:font-semibold",
                outside: "opacity-30",
                disabled: "opacity-25 pointer-events-none",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) =>
                    orientation === "left" ? (
                        <ChevronLeft className="h-3.5 w-3.5" />
                    ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                    ),
            }}
            {...props}
        />
    );
}

Calendar.displayName = "Calendar";
export { Calendar };
