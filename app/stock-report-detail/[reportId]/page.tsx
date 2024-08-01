"use client";
import useSWR from "swr";
import { stockZhAHist } from "./get_stock_daily";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getReportById } from "./get_report_by_id";

const StockReportDetail = ({ params }: { params: { reportId: string } }) => {
  console.log(params.reportId);
  const [reportId, classifyId] = params.reportId.split("-");

  const { data: report } = useSWR(`api/get-report-by-id/${reportId}`, () =>
    getReportById(reportId)
  );

  // const stock_code = "002594";
  // const startDate: string = "20240701";
  // const endDate: string = "20240731";
  // const { data } = useSWR(
  //   `api/stock/daily/${stock_code}/${startDate}/${endDate}`,
  //   () => stockZhAHist(stock_code, "daily", startDate, endDate)
  // );

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
      {JSON.stringify(report)}
    </div>
  );
};

export default StockReportDetail;
