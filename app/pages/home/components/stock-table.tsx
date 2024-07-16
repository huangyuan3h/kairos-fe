"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const testData = [
  {
    code: "AAPL",
    name: "苹果",
    oneDayChange: 0.02,
    threeDayChange: -0.01,
    fiveDayChange: 0.03,
    tenDayChange: 0.05,
    score: 85,
    recommendation: "买入",
  },
  {
    code: "TSLA",
    name: "特斯拉",
    oneDayChange: -0.03,
    threeDayChange: 0.05,
    fiveDayChange: 0.02,
    tenDayChange: 0.1,
    score: 90,
    recommendation: "强力买入",
  },
  {
    code: "GOOG",
    name: "谷歌",
    oneDayChange: 0.01,
    threeDayChange: 0.02,
    fiveDayChange: 0.015,
    tenDayChange: 0.03,
    score: 75,
    recommendation: "持有",
  },
  {
    code: "MSFT",
    name: "微软",
    oneDayChange: 0.015,
    threeDayChange: 0.025,
    fiveDayChange: 0.035,
    tenDayChange: 0.045,
    score: 80,
    recommendation: "买入",
  },
  {
    code: "AMZN",
    name: "亚马逊",
    oneDayChange: -0.02,
    threeDayChange: -0.01,
    fiveDayChange: 0.0,
    tenDayChange: 0.02,
    score: 70,
    recommendation: "观望",
  },
];

export const StockTable: React.FC = () => {
  const [riskPreference, setRiskPreference] = useState("short");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedData = useMemo(() => {
    const sorted = [...testData].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.score - b.score;
      } else {
        return b.score - a.score;
      }
    });
    return sorted;
  }, [sortOrder, testData]);

  const handleRiskPreferenceChange = (value: string) => {
    setRiskPreference(value);
  };

  return (
    <Card className="col-span-8 ">
      <CardHeader className="px-7">
        <CardTitle>股票预测结果</CardTitle>
        <CardDescription>
          根据您的输入参数和模型分析，以下是股票预测结果
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="short" onValueChange={handleRiskPreferenceChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="short">短期</TabsTrigger>
            <TabsTrigger value="mid">中期</TabsTrigger>
            <TabsTrigger value="long">长期</TabsTrigger>
          </TabsList>
          <TabsContent value="short">
            {/* 短期风险偏好的表格内容 */}
          </TabsContent>
          <TabsContent value="mid">{/* 中期风险偏好的表格内容 */}</TabsContent>
          <TabsContent value="long">{/* 长期风险偏好的表格内容 */}</TabsContent>
        </Tabs>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>股票名称/代码</TableHead>
              <TableHead>1天涨跌幅</TableHead>
              <TableHead>3天涨跌幅</TableHead>
              <TableHead>5天涨跌幅</TableHead>
              <TableHead>10天涨跌幅</TableHead>
              <TableHead onClick={handleSort} className="cursor-pointer">
                综合评分
                {sortOrder === "asc" ? " ↑" : " ↓"}
              </TableHead>
              <TableHead>推荐行为</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((stock, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{stock.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {stock.code}
                  </div>
                </TableCell>
                <TableCell>
                  {stock.oneDayChange > 0 ? (
                    <span className="text-green-500">
                      +{stock.oneDayChange.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {stock.oneDayChange.toFixed(2)}%
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {stock.threeDayChange > 0 ? (
                    <span className="text-green-500">
                      +{stock.threeDayChange.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {stock.threeDayChange.toFixed(2)}%
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {stock.fiveDayChange > 0 ? (
                    <span className="text-green-500">
                      +{stock.fiveDayChange.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {stock.fiveDayChange.toFixed(2)}%
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {stock.tenDayChange > 0 ? (
                    <span className="text-green-500">
                      +{stock.tenDayChange.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {stock.tenDayChange.toFixed(2)}%
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
      </CardContent>
    </Card>
  );
};
