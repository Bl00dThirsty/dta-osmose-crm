'use client'

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  label?: string
  date: Date
  onSelect: (date: Date) => void
}

export function DatePicker({ label, date, onSelect }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }))

  const isValidDate = (d: Date) => d instanceof Date && !isNaN(d.getTime())

  return (
    <div className="flex flex-col gap-2 w-[250px]">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          >
            <span>{inputValue || "Select date"}</span>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                onSelect(d)
                setInputValue(d.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }))
                setOpen(false)
              }
            }}
            captionLayout="dropdown"
            
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
