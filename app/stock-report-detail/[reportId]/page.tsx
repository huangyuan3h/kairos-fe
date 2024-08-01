"use client";
import useSWR from "swr";
import { stockZhAHist } from "./get_stock_daily";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getReportById } from "./get_report_by_id";
import { getClassifyById } from "./get_classify_by_id";
import { useEffect, useState } from "react";
import { subMonths, format } from "date-fns";

const StockReportDetail = ({ params }: { params: { reportId: string } }) => {
  const [reportId, classifyId] = params.reportId.split("-");

  const { data: report, isLoading } = useSWR(
    `api/get-report-by-id/${reportId}`,
    () => getReportById(reportId)
  );

  const { data: classify } = useSWR(
    `api/get-classify-by-id/${classifyId}`,
    () => getClassifyById(classifyId)
  );

  const [stockCode, setStockCode] = useState<null | string>(null);
  const [startDate, setStartDate] = useState<null | string>(null);
  const [endDate, setEndDate] = useState<null | string>(null);

  useEffect(() => {
    if (!isLoading && report) {
      setStockCode(report.stock_code);
      const date = new Date(report.report_date);
      const threeMonthsAgo = subMonths(date, 3);
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

  const router = useRouter();

  const handleClickBack = () => {
    router.back();
  };

  return (
    <div className="bg-muted/40 p-4">
      <div>
        <Button variant="link" onClick={handleClickBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      </div>
      <div>{JSON.stringify(report)}</div>
      <div>{JSON.stringify(classify)}</div>
      <div>{JSON.stringify(stockLine)}</div>
    </div>
  );
};

export default StockReportDetail;
