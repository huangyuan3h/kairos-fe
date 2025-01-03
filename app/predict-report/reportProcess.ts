import {
  PredictReportDisplayType,
  PredictReportType,
} from "@/types/stock-report";
import stockNameConfig from "../../config/stock_config";
import { InvestmentHorizon, RiskTolerance } from "./types";

const InvestmentHorizonMapping = {
  [InvestmentHorizon.ShortTerm]: [120, 100, 80, 40, 100, 100],
  [InvestmentHorizon.MidTerm]: [100, 120, 80, 60, 100, 100],
  [InvestmentHorizon.LongTerm]: [100, 100, 100, 80, 100, 100],
};

const BE_weights = [0.15, 0.15, 0.15, 0.15, 0.2, 0.2];
// const BE_weights = [0.05, 0.05, 0.05, 0.15, 0.2, 0.2];

export const calculateDecisionScore = (
  report: PredictReportType,
  investmentHorizon: InvestmentHorizon
): number => {
  const { change_1d, change_2d, change_3d, trend, operation_1d, operation_2d } =
    report;

  const [w1, w2, w3, w4, w5, w6] = InvestmentHorizonMapping[investmentHorizon];

  const [s1, s2, s3, s4, s5, s6] = BE_weights;

  const decisionScore =
    change_1d * w1 * s1 +
    change_2d * w2 * s2 +
    change_3d * w3 * s3 +
    trend * w4 * s4 +
    operation_1d * w5 * s5 +
    operation_2d * w6 * s6;
  return decisionScore;
};

export const makeDecision = (
  decisionScore: number,
  riskTolerance: RiskTolerance
): string => {
  // 根据风险偏好设置不同的阈值
  let buyThreshold: number, holdThreshold: number, waitThreshold: number;

  switch (riskTolerance) {
    case RiskTolerance.aggressive:
      buyThreshold = 110;
      holdThreshold = 30;
      waitThreshold = 0;
      break;
    case RiskTolerance.moderate:
      buyThreshold = 150;
      holdThreshold = 70;
      waitThreshold = 40;
      break;
    case RiskTolerance.conservative:
      buyThreshold = 190;
      holdThreshold = 90;
      waitThreshold = 60;
      break;
    default:
      throw new Error(`Invalid risk tolerance: ${riskTolerance}`);
  }

  // 根据决策分数确定操作建议
  if (decisionScore >= buyThreshold) {
    return "买入";
  } else if (decisionScore >= holdThreshold) {
    return "持有/观望";
  } else if (decisionScore >= waitThreshold) {
    return "观望/卖出";
  } else {
    return "卖出";
  }
};

export const getHorizonData = (
  data: PredictReportType[],
  investmentHorizon: InvestmentHorizon,
  tolerance: RiskTolerance
) => {
  const mappedData: PredictReportDisplayType[] = data.map((report) => {
    const score = calculateDecisionScore(report, investmentHorizon);
    return {
      ...report,
      trend: report.trend * 100,
      name: stockNameConfig[report.stock_code],
      score,
      recommendation: makeDecision(score, tolerance),
    };
  });

  return mappedData;
};
