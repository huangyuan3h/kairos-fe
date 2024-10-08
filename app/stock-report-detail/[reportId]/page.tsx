"use client";
import useSWR from "swr";
import { stockZhAHist } from "./get_stock_daily";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getReportById } from "./get_report_by_id";
import { useEffect, useState } from "react";
import { subMonths, format } from "date-fns";
import StockChart from "./components/stock-chart";
import { PredictReportType } from "@/types/stock-report";
import XueqiuStockLink from "./components/xueqiu-Link";
const StockReportDetail = ({ params }: { params: { reportId: string } }) => {
  const reportId = params.reportId;

  const { data: report, isLoading } = useSWR(
    `api/get-report-by-id/${reportId}`,
    () => getReportById(reportId)
  );

  const [stockCode, setStockCode] = useState<string>();
  const [startDate, setStartDate] = useState<null | string>(null);
  const [endDate, setEndDate] = useState<null | string>(null);

  useEffect(() => {
    if (!isLoading && report) {
      setStockCode(report.stock_code);
      const date = new Date(report.report_date);
      const threeMonthsAgo = subMonths(date, 2);
      setStartDate(format(threeMonthsAgo, "yyyyMMdd"));
      setEndDate(format(date, "yyyyMMdd"));
    }
  }, [isLoading]);

  const allExisted = stockCode && startDate && endDate;
  const { data: stockLine } = useSWR(
    allExisted ? `api/stock/daily/${stockCode}/${startDate}/${endDate}` : null,
    () =>
      allExisted ? stockZhAHist(stockCode, "daily", startDate, endDate) : null
  );

  if (!stockLine || !report) {
    return null;
  }

  const historyData = stockLine
    .slice(stockLine.length - 20, stockLine.length)
    .map((l, idx) => {
      if (idx === 19) {
        return {
          date: l.date,
          history: l.close,
          predict: l.close,
        };
      }
      return {
        date: l.date,
        history: l.close,
      };
    });

  const router = useRouter();

  const handleClickBack = () => {
    router.back();
  };

  const currentClose =
    historyData && historyData[historyData.length - 1].history;

  const predictData = [];

  for (let i = 1; i <= 3; i++) {
    const key = `change_${i}d`;
    const obj = {
      date: `${i}个交易日`,
      predict:
        ((100 + (report[key as keyof PredictReportType] as number)) *
          currentClose) /
        100,
    };
    predictData.push(obj);
  }

  return (
    <div className="bg-muted/40 p-4">
      <div>
        <Button variant="link" onClick={handleClickBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      </div>
      <div className="grid grid-cols-12 grid-rows-12 gap-4 p-4">
        {stockCode && historyData && (
          <StockChart
            stockCode={stockCode ?? ""}
            historyData={[...historyData, ...predictData]}
          />
        )}
        <XueqiuStockLink stockCode={stockCode} />
      </div>
    </div>
  );
};

export default StockReportDetail;
