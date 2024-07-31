import {
  PredictClassifyReportType,
  PredictReportDisplayType,
  PredictReportType,
} from "@/types/stock-report";
import stockNameConfig from "../../config/stock_config";
import { InvestmentHorizon, RiskTolerance } from "./types";

const InvestmentHorizonMapping = {
  [InvestmentHorizon.ShortTerm]: [70, 85, 130, 115, 100, 85, 70, 55, 40, 25],
  [InvestmentHorizon.MidTerm]: [60, 75, 90, 105, 130, 105, 90, 75, 60, 45],
  [InvestmentHorizon.LongTerm]: [50, 60, 70, 80, 90, 110, 130, 110, 90, 70],
};

const BE_weights = [
  0.15353399, 0.13818059, 0.12436253, 0.11192628, 0.10073365, 0.09066029,
  0.08159426, 0.07343483, 0.06609135, 0.05948221,
];

export const calculateDecisionScore = (
  report: PredictReportType,
  investmentHorizon: InvestmentHorizon,
  predict_class?: number
): number => {
  const {
    change_1d,
    change_2d,
    change_3d,
    change_4d,
    change_5d,
    change_6d,
    change_7d,
    change_8d,
    change_9d,
    change_10d,
  } = report;

  const [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10] =
    InvestmentHorizonMapping[investmentHorizon];

  const [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10] = BE_weights;

  const decisionScore =
    change_1d * w1 * s1 +
    change_2d * w2 * s2 +
    change_3d * w3 * s3 +
    change_4d * w4 * s4 +
    change_5d * w5 * s5 +
    change_6d * w6 * s6 +
    change_7d * w7 * s7 +
    change_8d * w8 * s8 +
    change_9d * w9 * s9 +
    change_10d * w10 * s10;

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
  tolerance: RiskTolerance,
  classify: PredictClassifyReportType[]
) => {
  const mappedData: PredictReportDisplayType[] = data.map((report) => {
    const predict_class =
      classify.find((c) => c.stock_code === report.stock_code)?.predict_class ??
      1;
    const score = calculateDecisionScore(
      report,
      investmentHorizon,
      predict_class
    );
    return {
      ...report,
      name: stockNameConfig[report.stock_code],
      score,
      recommendation: makeDecision(score, tolerance),
      predict_class,
    };
  });

  return mappedData;
};
