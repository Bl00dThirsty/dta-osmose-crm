"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  label?: string
  locale?: string // <- optionnel pour gérer la langue
}

export function DatePicker({ label, date, onSelect, locale = "fr-FR" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Valeur affichée dans le bouton
  const formattedDate = date
    ? date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <div className="flex flex-col gap-2 w-[250px]">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          >
            <span>{formattedDate || "Sélectionner une date"}</span>
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onSelect(d)
              setOpen(false)
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
