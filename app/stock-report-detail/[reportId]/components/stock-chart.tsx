"use client";

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
import stockNameConfig from "@/config/stock_config";

const chartConfig = {
  history: {
    label: "历史价格",
    color: "hsl(var(--chart-1))",
  },
  predict: {
    label: "预测数据",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface StockChartProps {
  stockCode: string;
  historyData: { date: string; history?: number; predict?: number }[];
}

const StockChart: React.FC<StockChartProps> = ({ stockCode, historyData }) => {
  const stockName = stockNameConfig[stockCode];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${stockName} - ${stockCode}`}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={historyData}>
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="history"
              type="natural"
              stroke="var(--color-history)"
              strokeWidth={1}
              dot={{
                fill: "var(--color-history)",
              }}
            />
            <Line
              dataKey="predict"
              type="natural"
              stroke="var(--color-predict)"
              strokeWidth={1}
              dot={{
                fill: "var(--color-predict)",
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StockChart;
