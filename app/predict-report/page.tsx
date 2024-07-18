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

const PredictReport = () => {
  const [reportDate, setReportDate] = useState<string>(getLastBusinessDay);
  const [selectedHorizon, setSelectedHorizon] = useState<InvestmentHorizon>(
    InvestmentHorizon.ShortTerm
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

  let tableData = null;

  if (reports) {
    tableData = getHorizonData(RiskTolerance.moderate, reports);
  }

  return (
    <div className="bg-muted/40 p-4">
      <TableBar
        reportDate={reportDate}
        onReportDateChanged={handleReportDateChange}
        strategy={selectedHorizon}
        onStrategyChanged={handleStrategyChanged}
      />
      <div>{JSON.stringify(tableData)}</div>
    </div>
  );
};

export default PredictReport;
