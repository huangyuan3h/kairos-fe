"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LineProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

// 汇率 API 获取函数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 主流国家列表
const countries = [
  { name: "United States", code: "USD" },
  { name: "Euro", code: "EUR" },
  { name: "United Kingdom", code: "GBP" },
  { name: "Japan", code: "JPY" },
  { name: "Canada", code: "CAD" },
  { name: "Australia", code: "AUD" },
  { name: "China", code: "CNY" },
];

// 获取过去几天的日期
const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

// 获取当前日期
const getCurrentDate = () => new Date().toISOString().split("T")[0];

export function ExchangeRateChart() {
  const [fromCountry, setFromCountry] = useState("USD");
  const [toCountry, setToCountry] = useState("CNY");
  const [days, setDays] = useState(20);

  const startDate = getPastDate(days);
  const endDate = getCurrentDate();

  const { data, error } = useSWR(
    `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCountry}&to=${toCountry}`,
    fetcher
  );

  const handleDayChange = (val: string) => {
    setDays(parseInt(val, 10));
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartData =
    data && data.rates
      ? Object.keys(data.rates).map((date, key) => ({
          date: key,
          rate: data.rates[date][toCountry],
        }))
      : [];

  // 计算 Y 轴最小值
  const yMin = chartData.reduce(
    (min, dataPoint) => Math.min(min, dataPoint.rate),
    Infinity
  );

  if (error) return <div>Error loading data...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Last 20 Day Exchange Rate</CardTitle>
        <CardDescription>
          Base: {fromCountry} to {toCountry}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div>
              <Select
                onValueChange={(v) => setFromCountry(v)}
                value={fromCountry}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder="From Country"
                    defaultValue={fromCountry}
                  />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>-</div>
            <div>
              <Select onValueChange={(v) => setToCountry(v)} value={toCountry}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder="To Country"
                    defaultValue={toCountry}
                  />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Label>Days:</Label>
            <Select value={`${days}`} onValueChange={handleDayChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[yMin - 0.1, "auto"]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line type="monotone" dataKey="rate" stroke="#8884d8" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
