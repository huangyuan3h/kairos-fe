"use client";
import { PredictReportType } from "@/types/stock-report";
import { TableBar } from "./components/table-bar";
import {
  fetchStockReportByDate,
  getLastBusinessDay,
} from "./fetchReportByDate";

import useSWR from "swr";
import { useState } from "react";
import { InvestmentHorizon, RiskTolerance, TabEnum } from "./types";
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
  const [tab, setTab] = useState<TabEnum>(TabEnum.system);
  const [searchText, setSearchText] = useState<string>("");
  const { data: reports } = useSWR(`api/reportDate?date=${reportDate}`, () =>
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

  const handleTabChanged = (tab: TabEnum) => {
    setTab(tab);
  };

  let tableData = null;

  if (reports) {
    tableData = getHorizonData(reports, selectedHorizon, riskTolerance);
  }

  const handleSearchTextChanged = (text: string) => {
    setSearchText(text);
  };

  tableData = tableData?.filter(
    (d) => d.stock_code.includes(searchText) || d.name.includes(searchText)
  );

  return (
    <div className="bg-muted/40 p-4">
      <TableBar
        reportDate={reportDate}
        onReportDateChanged={handleReportDateChange}
        strategy={selectedHorizon}
        onStrategyChanged={handleStrategyChanged}
        riskTolerance={riskTolerance}
        onRiskToleranceChanged={handleRiskToleranceChange}
        searchText={searchText}
        onSearchTextChanged={handleSearchTextChanged}
        tab={tab}
        onTabChanged={handleTabChanged}
      />
      <div>{tableData && <StockTable reportData={tableData} />}</div>
    </div>
  );
};

export default PredictReport;
