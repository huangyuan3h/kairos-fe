import {
  PredictReportDisplayType,
  PredictReportType,
} from "@/types/stock-report";
import stockNameConfig from "../../config/stock_config";
import { InvestmentHorizon, RiskTolerance } from "./types";

const ristFactConfig = {
  aggressive: 1.2,
  moderate: 1.0,
  conservative: 0.8,
};

export const calculateDecisionScore = (
  report: PredictReportType,
  riskTolerance: RiskTolerance,
  volatilities: number[] = [0.02, 0.03, 0.04, 0.05]
): number => {
  const { change_3d, change_5d, change_10d } = report;

  const [
    _,
    short_term_volatility,
    medium_term_volatility,
    long_term_volatility,
  ] = volatilities;

  let risk_factor = ristFactConfig[riskTolerance];

  // 使用夏普比率调整收益率，考虑波动率和风险偏好
  const short_sharpe_ratio = (change_3d / short_term_volatility) * risk_factor;
  const medium_sharpe_ratio =
    (change_5d / medium_term_volatility) * risk_factor;
  const long_sharpe_ratio = (change_10d / long_term_volatility) * risk_factor;

  // 动态调整权重，短期收益率权重更高
  const total_sharpe =
    short_sharpe_ratio + medium_sharpe_ratio + long_sharpe_ratio;
  const short_weight = short_sharpe_ratio / total_sharpe;
  const medium_weight = medium_sharpe_ratio / total_sharpe;
  const long_weight = long_sharpe_ratio / total_sharpe;

  const decisionScore =
    change_3d * short_weight +
    change_5d * medium_weight +
    change_10d * long_weight;

  return decisionScore;
};

export const makeDecision = (
  decisionScore: number,
  riskTolerance: RiskTolerance
): string => {
  // 根据风险偏好设置不同的阈值
  let buyThreshold: number, holdThreshold: number, waitThreshold: number;

  switch (riskTolerance) {
    case "aggressive":
      buyThreshold = 0.8;
      holdThreshold = 0.3;
      waitThreshold = -0.2;
      break;
    case "moderate":
      buyThreshold = 0.5;
      holdThreshold = 0.2;
      waitThreshold = -0.1;
      break;
    case "conservative":
      buyThreshold = 0.3;
      holdThreshold = 0.1;
      waitThreshold = 0;
      break;
    default:
      throw new Error(`Invalid risk tolerance: ${riskTolerance}`);
  }

  // 根据决策分数确定操作建议
  if (decisionScore >= buyThreshold) {
    return "买入（Buy）";
  } else if (decisionScore >= holdThreshold) {
    return "持有（Hold）";
  } else if (decisionScore >= waitThreshold) {
    return "观望（Wait）";
  } else {
    return "卖出（Sell）";
  }
};

export const getHorizonData = (
  tolerance: RiskTolerance,
  data: PredictReportType[]
) => {
  const mappedData: PredictReportDisplayType[] = data.map((report) => {
    const score = calculateDecisionScore(report, tolerance);
    return {
      ...report,
      name: stockNameConfig[report.stock_code],
      score,
      recommendation: makeDecision(score, tolerance),
    };
  });

  const sortedData = mappedData.sort((a, b) => b.score - a.score);

  return sortedData;
};
