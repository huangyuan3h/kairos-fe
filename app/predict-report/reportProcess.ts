import {
  PredictReportDisplayType,
  PredictReportType,
} from "@/types/stock-report";
import stockNameConfig from "../../config/stock_config";
import { InvestmentHorizon, RiskTolerance } from "./types";

const InvestmentHorizonMapping = {
  [InvestmentHorizon.ShortTerm]: [120, 100, 80, 40],
  [InvestmentHorizon.MidTerm]: [100, 120, 80, 60],
  [InvestmentHorizon.LongTerm]: [100, 100, 100, 80],
};

const BE_weights = [0.15353399, 0.13818059, 0.12436253, 0.08];

export const calculateDecisionScore = (
  report: PredictReportType,
  investmentHorizon: InvestmentHorizon,
  predict_class?: number
): number => {
  const { change_1d, change_2d, change_3d, trend } = report;

  const [w1, w2, w3, w4] = InvestmentHorizonMapping[investmentHorizon];

  const [s1, s2, s3, s4] = BE_weights;

  const decisionScore =
    change_1d * w1 * s1 +
    change_2d * w2 * s2 +
    change_3d * w3 * s3 +
    trend * w4 * s4;

  let finalScore = decisionScore;
  if (predict_class === 0) {
    finalScore = finalScore - 120;
  } else if (predict_class === 2) {
    finalScore = finalScore + 120;
  }

  return finalScore;
};

export const makeDecision = (
  decisionScore: number,
  riskTolerance: RiskTolerance
): string => {
  // 根据风险偏好设置不同的阈值
  let buyThreshold: number, holdThreshold: number, waitThreshold: number;

  switch (riskTolerance) {
    case RiskTolerance.aggressive:
      buyThreshold = 120;
      holdThreshold = 20;
      waitThreshold = 16;
      break;
    case RiskTolerance.moderate:
      buyThreshold = 200;
      holdThreshold = 40;
      waitThreshold = 32;
      break;
    case RiskTolerance.conservative:
      buyThreshold = 280;
      holdThreshold = 60;
      waitThreshold = 64;
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
