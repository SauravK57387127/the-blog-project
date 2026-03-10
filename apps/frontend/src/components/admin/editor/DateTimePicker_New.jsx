"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateTimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  
  const date = value ? new Date(value) : undefined;
  
  // Format date for display
  const dateString = date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  
  // Time in HH:MM format
  const time = date
    ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "12:00";

  // Today at midnight - for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Date Picker */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-picker">Schedule Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateString || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (!newDate) return;
                
                // Block past dates
                if (newDate < today) {
                  return; // Silently block
                }
                
                // Preserve time if already set
                if (date) {
                  newDate.setHours(date.getHours());
                  newDate.setMinutes(date.getMinutes());
                } else {
                  newDate.setHours(12, 0, 0, 0); // Default to noon
                }
                
                onChange?.(newDate);
                setOpen(false);
              }}
              disabled={(date) => date < today} // Gray out past dates
              fromDate={today} // Don't show dates before today
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="time-picker">Schedule Time</Label>
        <Input
          type="time"
          id="time-picker"
          value={time}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":");
            const newDateTime = date ? new Date(date) : new Date();
            
            // If no date set yet, default to today
            if (!date) {
              newDateTime.setHours(0, 0, 0, 0);
            }
            
            newDateTime.setHours(+h, +m, 0, 0);
            
            // Block if resulting datetime is in the past
            if (newDateTime < new Date()) {
              return;
            }
            
            onChange?.(newDateTime);
          }}
          className="bg-background"
        />
      </div>

      {date && (
        <p className="text-xs text-muted-foreground">
          Will publish on {date.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
