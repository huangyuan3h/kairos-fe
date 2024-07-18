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
import { PredictReportDisplayType } from "@/types/stock-report";

interface StockTableProps {
  reportData: PredictReportDisplayType[];
}
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;
export const StockTable: React.FC<StockTableProps> = ({ reportData }) => {
  const [sortByScore, setSortByScore] = React.useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = React.useState(0);

  const sortedData = [...reportData].sort((a, b) => {
    if (sortByScore === "asc") {
      return a.score - b.score;
    } else {
      return b.score - a.score;
    }
  });

  const displayData = sortedData.slice(
    PAGE_SIZE * currentPage,
    PAGE_SIZE * (currentPage + 1)
  );

  const handleUpdateScoreSorting = () => {
    setSortByScore(sortByScore === "asc" ? "desc" : "asc");
  };

  const handleClickPrevious = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const handleClickNext = () => {
    setCurrentPage(Math.min(currentPage + 1, reportData.length % PAGE_SIZE));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>股票名称/代码</TableHead>
            <TableHead>1天涨跌幅</TableHead>
            <TableHead>3天涨跌幅</TableHead>
            <TableHead>5天涨跌幅</TableHead>
            <TableHead>10天涨跌幅</TableHead>
            <TableHead
              onClick={handleUpdateScoreSorting}
              className="cursor-pointer"
            >
              综合评分 {sortByScore === "asc" ? "↓" : "↑"}
            </TableHead>
            <TableHead>推荐行为</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((stock, index) => (
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
      <Pagination defaultValue={currentPage + 1}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handleClickPrevious} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={handleClickNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
