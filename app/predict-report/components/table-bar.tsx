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
import { InvestmentHorizon, RiskTolerance, TabEnum } from "../types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Settings, Search, ReceiptText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ReportDetail from "./ReportDetail";
import { PredictReportDisplayType } from "@/types/stock-report";

const styleOfButton =
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3  gap-1";

interface DatePickerProps {
  date?: Date;
  onChange: (reportDate: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onChange }) => {
  const handleChange = (day: Date | undefined) => {
    if (day) {
      onChange(day);
    }
  };
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
          onSelect={handleChange}
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
  searchText: string;
  onSearchTextChanged: (text: string) => void;
  tab: TabEnum;
  onTabChanged: (tab: TabEnum) => void;
  report: PredictReportDisplayType[];
}

export const TableBar: React.FC<TableBarProps> = ({
  reportDate,
  onReportDateChanged,
  strategy,
  onStrategyChanged,
  riskTolerance,
  onRiskToleranceChanged,
  searchText,
  onSearchTextChanged,
  tab,
  onTabChanged,
  report,
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

  const handleChangeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTextChanged(e.target.value);
  };

  const handleTabChange = (value: string) => {
    onTabChanged(value as TabEnum);
  };

  return (
    <div className="flex justify-between">
      <Tabs defaultValue={tab} onValueChange={handleTabChange}>
        <TabsList>
          {Object.values(TabEnum).map((tab) => (
            <TabsTrigger value={tab} key={`tab-${tab}`}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex gap-4 items-center">
        <Label className="text-base">股票名称/代码:</Label>
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            value={searchText}
            onChange={handleChangeSearchText}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <DatePicker date={currentDate} onChange={handleDatePickerChange} />
        </div>

        <ReportDetail report={report} />

        <Sheet>
          <SheetTrigger className={styleOfButton}>
            <Settings className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Strategy
            </span>
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle>Strategy Configuration</SheetTitle>
              <SheetDescription>some description</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 mt-6">
              <div className="grid gap-3">
                <Label htmlFor="RiskTolerance">Risk Tolerance</Label>
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
              </div>

              <div className="grid gap-3">
                <Label htmlFor="InvestmentHorizon">Investment Horizon</Label>
                <Tabs
                  defaultValue={strategy}
                  onValueChange={handleStrategTabChange}
                >
                  <TabsList>
                    {Object.values(InvestmentHorizon).map((horizon) => (
                      <TabsTrigger value={horizon} key={`tab-${horizon}`}>
                        {horizon}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
