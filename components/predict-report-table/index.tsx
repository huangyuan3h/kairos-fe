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
import { useRouter } from "next/navigation";

export interface ExtraColumnProps {
  stock: PredictReportDisplayType;
  onExtraClick?: (action: string, id: string) => void;
}

interface StockTableProps {
  reportData: PredictReportDisplayType[];
  ExtraHeader?: React.FunctionComponent;
  ExtraColumn?: React.FunctionComponent<ExtraColumnProps>;
  onExtraClick?: (action: string, id: string) => void;
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

interface PaginationNumberProps {
  pageNum: number;
  onChange: (pageNum: number) => void;
}

const PaginationNumber: React.FC<PaginationNumberProps> = ({
  pageNum,
  onChange,
}) => {
  return (
    <PaginationItem>
      <PaginationLink
        onClick={() => onChange(pageNum)}
        className="cursor-pointer"
      >
        {pageNum + 1}
      </PaginationLink>
    </PaginationItem>
  );
};

const PAGE_SIZE = 10;

const Number_Fix = 4;

const predictClass = ["下跌", "震荡", "上涨"];

export const StockTable: React.FC<StockTableProps> = ({
  reportData,
  ExtraHeader,
  ExtraColumn,
  onExtraClick,
}) => {
  const [sortByScore, setSortByScore] = React.useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = React.useState(0);
  const lastPage = Math.floor(reportData.length / PAGE_SIZE);
  const router = useRouter();

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
    setCurrentPage(Math.min(currentPage + 1, lastPage));
  };

  const handleSetPage = (page: number) => {
    setCurrentPage(page);
  };
  const handleClickItem = (reportId: string) => {
    router.push(`/stock-report-detail/${reportId}`);
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
            <TableHead>7天涨跌幅</TableHead>
            <TableHead>10天涨跌幅</TableHead>
            <TableHead>趋势评估</TableHead>
            <TableHead
              onClick={handleUpdateScoreSorting}
              className="cursor-pointer"
            >
              综合评分 {sortByScore === "asc" ? "↓" : "↑"}
            </TableHead>
            <TableHead>推荐行为</TableHead>
            {ExtraHeader && <ExtraHeader />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((stock, index) => (
            <TableRow
              key={index}
              className="cursor-pointer"
              onClick={() =>
                handleClickItem(stock.id + "-" + stock.classifyReportId)
              }
            >
              <TableCell>
                <div className="font-medium">{stock.name}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {stock.stock_code}
                </div>
              </TableCell>
              <TableCell>
                {stock.change_1d > 0 ? (
                  <span className="text-green-500">
                    +{stock.change_1d.toFixed(Number_Fix)}%
                  </span>
                ) : (
                  <span className="text-red-500">
                    {stock.change_1d.toFixed(Number_Fix)}%
                  </span>
                )}
              </TableCell>
              <TableCell>
                {stock.change_3d > 0 ? (
                  <span className="text-green-500">
                    +{stock.change_3d.toFixed(Number_Fix)}%
                  </span>
                ) : (
                  <span className="text-red-500">
                    {stock.change_3d.toFixed(Number_Fix)}%
                  </span>
                )}
              </TableCell>
              <TableCell>
                {stock.change_5d > 0 ? (
                  <span className="text-green-500">
                    +{stock.change_5d.toFixed(Number_Fix)}%
                  </span>
                ) : (
                  <span className="text-red-500">
                    {stock.change_5d.toFixed(Number_Fix)}%
                  </span>
                )}
              </TableCell>
              <TableCell>
                {stock.change_7d > 0 ? (
                  <span className="text-green-500">
                    +{stock.change_7d.toFixed(Number_Fix)}%
                  </span>
                ) : (
                  <span className="text-red-500">
                    {stock.change_7d.toFixed(Number_Fix)}%
                  </span>
                )}
              </TableCell>
              <TableCell>
                {stock.change_10d > 0 ? (
                  <span className="text-green-500">
                    +{stock.change_10d.toFixed(Number_Fix)}%
                  </span>
                ) : (
                  <span className="text-red-500">
                    {stock.change_10d.toFixed(Number_Fix)}%
                  </span>
                )}
              </TableCell>
              <TableCell>{predictClass[stock.predict_class]}</TableCell>
              <TableCell>
                {stock.score > 0 ? (
                  <span className="text-green-500">
                    {stock.score.toFixed(Number_Fix)}
                  </span>
                ) : (
                  <span className="text-red-500">{stock.score.toFixed(2)}</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{stock.recommendation}</Badge>
              </TableCell>
              {ExtraColumn && (
                <ExtraColumn stock={stock} onExtraClick={onExtraClick} />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination defaultValue={currentPage + 1}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handleClickPrevious}
              className="cursor-pointer"
            />
          </PaginationItem>

          {currentPage >= 1 && (
            <PaginationNumber pageNum={0} onChange={handleSetPage} />
          )}
          {currentPage >= 2 && (
            <PaginationNumber pageNum={1} onChange={handleSetPage} />
          )}

          {currentPage >= 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {currentPage >= 4 && (
            <PaginationNumber
              pageNum={currentPage - 2}
              onChange={handleSetPage}
            />
          )}

          {currentPage >= 3 && (
            <PaginationNumber
              pageNum={currentPage - 1}
              onChange={handleSetPage}
            />
          )}
          <PaginationItem>
            <PaginationLink isActive>{currentPage + 1}</PaginationLink>
          </PaginationItem>

          {currentPage <= lastPage - 3 && (
            <PaginationNumber
              pageNum={currentPage + 1}
              onChange={handleSetPage}
            />
          )}

          {currentPage <= lastPage - 4 && (
            <PaginationNumber
              pageNum={currentPage + 2}
              onChange={handleSetPage}
            />
          )}

          {currentPage <= lastPage - 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {currentPage <= lastPage - 2 && (
            <PaginationNumber pageNum={lastPage - 1} onChange={handleSetPage} />
          )}
          {currentPage <= lastPage - 1 && (
            <PaginationNumber pageNum={lastPage} onChange={handleSetPage} />
          )}
          <PaginationItem>
            <PaginationNext
              onClick={handleClickNext}
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
