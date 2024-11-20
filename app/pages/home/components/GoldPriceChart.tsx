"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Fetch function to get data from API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to get past date
const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

// Helper function to get current date
const getCurrentDate = () => new Date().toISOString().split("T")[0];

export function GoldPriceChart() {
  const [days, setDays] = useState(20);

  const startDate = getPastDate(days);
  const endDate = getCurrentDate();

  const { data, error } = useSWR(
    `https://metals-api.com/api/timeseries?start_date=${startDate}&end_date=${endDate}&base=USD&symbols=XAU`,
    fetcher
  );

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
          price: data.rates[date]["XAU"],
        }))
      : [];

  // Calculate Y axis min value
  const yMin = chartData.reduce(
    (min, dataPoint) => Math.min(min, dataPoint.price),
    Infinity
  );

  if (error) return <div>Error loading data...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Last {days} Days Gold Price</CardTitle>
        <CardDescription>Base currency: USD</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-center mb-4">
          <label>Days:</label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </div>

        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[yMin - 5, "auto"]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line type="monotone" dataKey="price" stroke="#FFD700" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
