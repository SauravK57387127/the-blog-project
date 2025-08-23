"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DateTimePicker({ value, onChange }) {
  // local state for popover open/close
  const [open, setOpen] = useState(false)

  // extract date + time parts from value coming from parent
  const date = value ? new Date(value) : undefined
  const time = value
    ? value.toLocaleTimeString("en-GB", { hour12: false }) // format HH:mm:ss
    : "12:00:00"
    

  return (
    <div className="flex gap-4">
      {/* ---------------- Date Picker ---------------- */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>

        {/* IMPORTANT: PopoverTrigger + PopoverContent together 
            ensure calendar positions correctly below trigger 
            (no top-left jump like you saw in menubar). */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
            >
            {date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
                date.getDate()
            ).padStart(2, "0")}`
            : "Select date"}
            <ChevronDownIcon />
            </Button>

          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => {
                if (!d) return
                const newDateTime = new Date(d)

                // preserve the chosen time
                const [h, m, s] = time.split(":")
                newDateTime.setHours(+h, +m, +s)

                // IMPORTANT: send new value to parent (via onChange prop)
                onChange?.(newDateTime)

                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* ---------------- Time Picker ---------------- */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={(e) => {
            const [h, m, s] = e.target.value.split(":")
            const newDateTime = date ? new Date(date) : new Date()

            // update with new time
            newDateTime.setHours(+h, +m, +s)

            // IMPORTANT: send new value to parent (via onChange prop)
            onChange?.(newDateTime)
          }}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  )
}
