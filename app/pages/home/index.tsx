import { ExchangeRateChart } from "./components/ExchangeRateCard";
import { MajorIntroduction } from "./components/major-intro";

export const Home = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-4 p-4">
      <MajorIntroduction />
      <ExchangeRateChart />
    </div>
  );
};
