"use client";
import { PredictReportType } from "@/types/stock-report";
import { TableBar } from "./components/table-bar";
import {
  fetchStockReportByDate,
  getLastBusinessDay,
} from "./fetchReportByDate";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { InvestmentHorizon, RiskTolerance, TabEnum } from "./types";
import { getHorizonData } from "./reportProcess";
import { StockTable } from "@/components/predict-report-table";
import {
  ActionHeader,
  MoveInAction,
  MoveOutAction,
} from "./components/table-action";

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

  const [stockCodes, setStockCodes] = useState<string[]>([]);

  useEffect(() => {
    const storedCodes = localStorage.getItem("stockCodes");
    if (storedCodes) {
      setStockCodes(JSON.parse(storedCodes));
    }
  }, []);

  const saveStockCodes = (codes: string[]) => {
    localStorage.setItem("stockCodes", JSON.stringify(codes));
    setStockCodes(codes);
  };

  const handleAddStock = (newCode: string) => {
    if (stockCodes.includes(newCode)) return;

    saveStockCodes([...stockCodes, newCode]);
  };

  const handleRemoveStock = (codeToRemove: string) => {
    const updatedCodes = stockCodes.filter((code) => code !== codeToRemove);
    saveStockCodes(updatedCodes);
  };

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

  const handleExtraClick = (action: string, stockCode: string) => {
    switch (action) {
      case "MOVE_IN":
        handleAddStock(stockCode);
        break;
      case "MOVE_OUT":
        handleRemoveStock(stockCode);
        break;
      default:
        break;
    }
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

  if (tab === TabEnum.myStock) {
    tableData = tableData?.filter((d) => stockCodes.includes(d.stock_code));
  }

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
      <div>
        {tableData && (
          <StockTable
            reportData={tableData}
            ExtraHeader={ActionHeader}
            ExtraColumn={tab === TabEnum.system ? MoveInAction : MoveOutAction}
            onExtraClick={handleExtraClick}
          />
        )}
      </div>
    </div>
  );
};

export default PredictReport;
