import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PredictReportDisplayType } from "@/types/stock-report";
import { ReceiptText } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ReportDetailProps {
  report: PredictReportDisplayType[];
}

const chartConfig = {
  score: {
    label: "stock score",
  },
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  negitive: {
    label: "Negitive",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ReportDetail: React.FC<ReportDetailProps> = ({
  report,
}: ReportDetailProps) => {
  const positiveScore = report.filter((r) => r.score > 0).length;
  const negitiveScore = report.filter((r) => r.score < 0).length;
  const chartData = [
    {
      statistics: "Positive",
      score: positiveScore,
      fill: "var(--color-positive)",
    },
    {
      statistics: "Negitive",
      score: negitiveScore,
      fill: "var(--color-negitive)",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-x-1">
          <ReceiptText className="h-4 w-4" />
          <span className="ml-2 sr-only sm:not-sr-only sm:whitespace-nowrap">
            Detail
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Detail</DialogTitle>
          <DialogDescription>
            This Dialog is to give a overview of the stock report
          </DialogDescription>
        </DialogHeader>
        <div>
          <h3>综合评分</h3>
          <p className="text-sm text-muted-foreground">
            总和评分分布可以判断模型对市场强弱的判断
          </p>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="score" nameKey="statistics" />
            </PieChart>
          </ChartContainer>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetail;
