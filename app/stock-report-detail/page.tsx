"use client";
import useSWR from "swr";
import { codeIdMapEm, stockZhAHist } from "./get_stock_daily";

const StockReportDetail: React.FC<{}> = () => {
  const stock_code = "002594";
  const startDate: string = "20240701";
  const endDate: string = "20240731";
  const { data } = useSWR(
    `api/stock/daily/${stock_code}/${startDate}/${endDate}`,
    () => stockZhAHist(stock_code, "daily", startDate, endDate)
  );

  return <div className="bg-muted/40 p-4">{JSON.stringify(data)}</div>;
};

export default StockReportDetail;
