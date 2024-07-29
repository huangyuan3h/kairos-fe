import useSWR from "swr";
import { codeIdMapEm } from "./get_stock_daily";

const StockReportDetail: React.FC<{}> = () => {
  const { data: codeMap } = useSWR(`api/codeIdMapEm`, () => codeIdMapEm());

  return <div className="bg-muted/40 p-4">{JSON.stringify(codeMap)}</div>;
};

export default StockReportDetail;
