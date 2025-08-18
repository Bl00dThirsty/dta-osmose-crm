"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/trendUtils";

export function Calendar22() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const CustomCalendar = ({
    className,
    classNames,
    showOutsideDays = true,
    ...props
  }: React.ComponentProps<typeof DayPicker>) => (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="date" className="px-1 text-sm font-medium">
        Date of birth
      </label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-48 justify-between font-normal"
          )}
          id="date"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-auto rounded-md border bg-popover p-0 shadow-md">
            <CustomCalendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 