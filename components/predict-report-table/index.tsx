"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PredictReportType } from "@/types/stock-report";

interface PredictReportDisplayType extends PredictReportType {
  score: number;
  name: string;
  recommendation: string;
}

interface StockTableProps {
  reportData: PredictReportDisplayType[];
  sortByScore: "asc" | "desc";
}

export const StockTableComponent: React.FC<StockTableProps> = ({
  reportData,
  sortByScore,
}) => {
  const sortedData = [...reportData].sort((a, b) => {
    if (sortByScore === "asc") {
      return a.score - b.score;
    } else {
      return b.score - a.score;
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>股票名称/代码</TableHead>
          <TableHead>1天涨跌幅</TableHead>
          <TableHead>3天涨跌幅</TableHead>
          <TableHead>5天涨跌幅</TableHead>
          <TableHead>10天涨跌幅</TableHead>
          <TableHead>综合评分</TableHead>
          <TableHead>推荐行为</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((stock, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="font-medium">{stock.name}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {stock.stock_code}
              </div>
            </TableCell>
            <TableCell>
              {stock.change_1d > 0 ? (
                <span className="text-green-500">
                  +{stock.change_1d.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500">
                  {stock.change_1d.toFixed(2)}%
                </span>
              )}
            </TableCell>
            <TableCell>
              {stock.change_3d > 0 ? (
                <span className="text-green-500">
                  +{stock.change_3d.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500">
                  {stock.change_3d.toFixed(2)}%
                </span>
              )}
            </TableCell>
            <TableCell>
              {stock.change_5d > 0 ? (
                <span className="text-green-500">
                  +{stock.change_5d.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500">
                  {stock.change_5d.toFixed(2)}%
                </span>
              )}
            </TableCell>
            <TableCell>
              {stock.change_10d > 0 ? (
                <span className="text-green-500">
                  +{stock.change_10d.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500">
                  {stock.change_10d.toFixed(2)}%
                </span>
              )}
            </TableCell>
            <TableCell>{stock.score}</TableCell>
            <TableCell>
              <Badge variant="secondary">{stock.recommendation}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
