"use client";
import { PredictReportType } from "@/types/stock-report";
import { TableBar } from "./components/table-bar";
import {
  fetchStockReportByDate,
  getLastBusinessDay,
} from "./fetchReportByDate";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const PredictReport = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("reportDate");
  const reportDate = date ? date : getLastBusinessDay();

  const {
    data: reports,
    isLoading,
    mutate,
  } = useSWR(`api/reportDate?date=${reportDate}`, () =>
    fetchStockReportByDate(reportDate)
  );

  // const [reportDate, setReportDate] = useState<string>(getLastBusinessDay);

  // const [selectedHorizon, setSelectedHorizon] = useState<InvestmentHorizon>(
  //   InvestmentHorizon.ShortTerm
  // );

  return (
    <div className="bg-muted/40 p-4">
      <TableBar />
      <div>{JSON.stringify(reports)}</div>
    </div>
  );
};

export default PredictReport;
