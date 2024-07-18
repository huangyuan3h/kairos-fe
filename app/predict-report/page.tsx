"use client";
import { PredictReportType } from "@/types/stock-report";
import { TableBar } from "./components/table-bar";
import {
  fetchStockReportByDate,
  getLastBusinessDay,
} from "./fetchReportByDate";

import useSWR from "swr";
import { useState } from "react";
import { InvestmentHorizon, RiskTolerance } from "./types";
import { getHorizonData } from "./reportProcess";
import { StockTable } from "@/components/predict-report-table";

const PredictReport = () => {
  const [reportDate, setReportDate] = useState<string>(getLastBusinessDay);
  const [selectedHorizon, setSelectedHorizon] = useState<InvestmentHorizon>(
    InvestmentHorizon.ShortTerm
  );
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(
    RiskTolerance.moderate
  );
  const {
    data: reports,
    isLoading,
    mutate,
  } = useSWR(`api/reportDate?date=${reportDate}`, () =>
    fetchStockReportByDate(reportDate)
  );

  const handleReportDateChange = (date: string) => {
    setReportDate(date);
  };

  const handleStrategyChanged = (strategy: InvestmentHorizon) => {
    setSelectedHorizon(strategy);
  };

  const handleRiskToleranceChange = (riskTolerance: RiskTolerance) => {
    setRiskTolerance(riskTolerance);
  };

  let tableData = null;

  if (reports) {
    tableData = getHorizonData(reports, selectedHorizon, riskTolerance);
  }

  // tableData = tableData?.filter((d) => d.stock_code.includes("002130"));

  return (
    <div className="bg-muted/40 p-4">
      <TableBar
        reportDate={reportDate}
        onReportDateChanged={handleReportDateChange}
        strategy={selectedHorizon}
        onStrategyChanged={handleStrategyChanged}
        riskTolerance={riskTolerance}
        onRiskToleranceChanged={handleRiskToleranceChange}
      />
      <div>{tableData && <StockTable reportData={tableData} />}</div>
    </div>
  );
};

export default PredictReport;
