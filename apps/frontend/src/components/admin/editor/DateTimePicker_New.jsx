"use client";

import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { DESIGN_CONSTANTS } from "@/lib/design-constants";

function pad(n) { return String(n).padStart(2, "0"); }

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function DateTimePicker({ value, onChange }) {
  const selected = value ? new Date(value) : null;

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const currentHour   = selected ? selected.getHours()   : 12;
  const currentMinute = selected ? selected.getMinutes()  : 0;

  const handleDateSelect = (newDate) => {
    if (!newDate) return;
    const d = new Date(newDate);
    d.setHours(
      selected ? selected.getHours()   : 12,
      selected ? selected.getMinutes() : 0,
      0, 0
    );
    onChange?.(d);
  };

  const handleHourChange = (h) => {
    // Always update — backend validates if datetime is in future
    const base = selected ? new Date(selected) : new Date(todayMidnight);
    if (!selected) base.setHours(12, 0, 0, 0);
    base.setHours(h, base.getMinutes(), 0, 0);
    onChange?.(base);
  };

  const handleMinuteChange = (m) => {
    const base = selected ? new Date(selected) : new Date(todayMidnight);
    if (!selected) base.setHours(12, 0, 0, 0);
    base.setMinutes(m, 0, 0);
    onChange?.(base);
  };

  const isPast = selected && selected <= new Date();

  return (
    <div className="flex flex-col gap-5">

      {/* Date — inline, no Popover */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Date</p>
        <div className="border border-border w-fit">
          <Calendar
            mode="single"
            selected={selected ?? undefined}
            onSelect={handleDateSelect}
            disabled={(d) => d < todayMidnight}
            initialFocus
          />
        </div>
      </div>

      {/* Time */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Time</p>
        <div className="flex items-center gap-2">

          <select
            value={currentHour}
            onChange={(e) => handleHourChange(+e.target.value)}
            className="flex-1 px-3 py-2 text-xs font-mono bg-background border border-border hover:border-foreground/40 focus:border-foreground outline-none cursor-pointer appearance-none text-center"
          >
            {HOURS.map(h => <option key={h} value={h}>{pad(h)}</option>)}
          </select>

          <span className="text-xs font-mono text-muted-foreground select-none">:</span>

          <select
            value={currentMinute}
            onChange={(e) => handleMinuteChange(+e.target.value)}
            className="flex-1 px-3 py-2 text-xs font-mono bg-background border border-border hover:border-foreground/40 focus:border-foreground outline-none cursor-pointer appearance-none text-center"
          >
            {MINUTES.map(m => <option key={m} value={m}>{pad(m)}</option>)}
          </select>

          <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>

      {/* Past-time warning */}
      {isPast && (
        <p className="text-[10px] font-mono text-destructive">
          — selected time is in the past, backend will reject
        </p>
      )}

      {/* Summary */}
      {selected && !isPast && (
        <p className="text-[10px] font-mono text-muted-foreground border-l-2 border-foreground pl-3">
          {selected.toLocaleString("en-US", {
            weekday: "short", month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit",
          })}
        </p>
      )}

    </div>
  );
}
