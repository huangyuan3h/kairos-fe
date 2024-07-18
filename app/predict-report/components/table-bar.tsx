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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentHorizon, RiskTolerance } from "../types";

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
  strategy: InvestmentHorizon;
  onStrategyChanged: (strategy: InvestmentHorizon) => void;
  riskTolerance: RiskTolerance;
  onRiskToleranceChanged: (riskTolerance: RiskTolerance) => void;
}

export const TableBar: React.FC<TableBarProps> = ({
  reportDate,
  onReportDateChanged,
  strategy,
  onStrategyChanged,
  riskTolerance,
  onRiskToleranceChanged,
}: TableBarProps) => {
  const currentDate = new Date(reportDate);

  const handleDatePickerChange = (date: Date) => {
    onReportDateChanged(format(date, "yyyy-MM-dd"));
  };

  const handleStrategTabChange = (value: string) => {
    onStrategyChanged(value as InvestmentHorizon);
  };
  const handleRiskToleranceTabChange = (value: string) => {
    onRiskToleranceChanged(value as RiskTolerance);
  };

  return (
    <div className="flex justify-between">
      <div>
        <span className="text-muted-foreground mr-2">Report Date:</span>
        <DatePicker date={currentDate} onChange={handleDatePickerChange} />
      </div>

      <Tabs
        defaultValue={riskTolerance}
        onValueChange={handleRiskToleranceTabChange}
      >
        <TabsList>
          {Object.values(RiskTolerance).map((risk) => (
            <TabsTrigger value={risk} key={`tab-${risk}`}>
              {risk}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs defaultValue={strategy} onValueChange={handleStrategTabChange}>
        <TabsList>
          {Object.values(InvestmentHorizon).map((horizon) => (
            <TabsTrigger value={horizon} key={`tab-${horizon}`}>
              {horizon}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
