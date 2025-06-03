// src/components/DateRangeFilter.tsx


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DateRangeFilterProps {
  dateRange: { start?: Date; end?: Date };
  onDateChange: (range: { start?: Date; end?: Date }) => void;
  onReset: () => void;
}

export const DateRangeFilter = ({ 
  dateRange, 
  onDateChange, 
  onReset 
}: DateRangeFilterProps) => {
  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange.start && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.start ? (
              format(dateRange.start, "PPP", { locale: fr })
            ) : (
              <span>Date de début</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateRange.start}
            onSelect={(date:any) => onDateChange({ ...dateRange, start: date })}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      <span className="mx-1">à</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange.end && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.end ? (
              format(dateRange.end, "PPP", { locale: fr })
            ) : (
              <span>Date de fin</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateRange.end}
            onSelect={(date:any) => onDateChange({ ...dateRange, end: date })}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="outline" 
        onClick={onReset}
        disabled={!dateRange.start && !dateRange.end}
      >
        Réinitialiser
      </Button>
    </div>
  );
};