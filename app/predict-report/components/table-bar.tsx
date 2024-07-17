"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date?: Date;
  onChange: (reportDate: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          disabled={(d: Date) => d > new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

interface TableBarProps {
  reportDate: string;
  onReportDateChanged: (reportDate: string) => void;
}

export const TableBar: React.FC<TableBarProps> = ({
  reportDate,
  onReportDateChanged,
}: TableBarProps) => {
  const currentDate = new Date(reportDate);

  const handleDatePickerChange = (date: Date) => {
    onReportDateChanged(format(date, "yyyy-MM-dd"));
  };

  return (
    <div className="flex">
      <div>
        <DatePicker date={currentDate} onChange={handleDatePickerChange} />
      </div>
    </div>
  );
};
