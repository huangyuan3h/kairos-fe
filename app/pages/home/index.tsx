import { MajorIntroduction } from "./components/major-intro";
import { StockTable } from "./components/stock-table";

export const Home = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-4 p-4">
      <MajorIntroduction />
      <StockTable />
    </div>
  );
};
