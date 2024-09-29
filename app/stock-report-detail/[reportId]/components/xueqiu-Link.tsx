import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface XueqiuStockLinkProps {
  stockCode?: string;
}

const XueqiuStockLink: React.FC<XueqiuStockLinkProps> = ({
  stockCode,
}: XueqiuStockLinkProps) => {
  const getMarketPrefix = (code?: string) => {
    if (!code) {
      return "";
    }
    if (code.startsWith("6")) {
      return "SH";
    } else if (code.startsWith("0") || code.startsWith("3")) {
      return "SZ";
    }
    return "";
  };

  const marketPrefix = getMarketPrefix(stockCode);
  const xueqiuUrl = `https://xueqiu.com/S/${marketPrefix}${stockCode}`;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>雪球链接</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href={xueqiuUrl} target="_blank" rel="noopener noreferrer">
          {`查看 ${stockCode} 的雪球页面`}
        </Link>
      </CardContent>
    </Card>
  );
};

export default XueqiuStockLink;
