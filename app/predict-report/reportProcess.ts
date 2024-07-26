import {
  PredictReportDisplayType,
  PredictReportType,
} from "@/types/stock-report";
import stockNameConfig from "../../config/stock_config";
import { InvestmentHorizon, RiskTolerance } from "./types";

const InvestmentHorizonMapping = {
  [InvestmentHorizon.ShortTerm]: [110, 130, 90, 70],
  [InvestmentHorizon.MidTerm]: [80, 130, 110, 80],
  [InvestmentHorizon.LongTerm]: [70, 90, 130, 110],
};

export const calculateDecisionScore = (
  report: PredictReportType,
  investmentHorizon: InvestmentHorizon
): number => {
  const { change_1d, change_3d, change_5d, change_10d } = report;

  const [weight1, weight3, weight5, weight10] =
    InvestmentHorizonMapping[investmentHorizon];

  const decisionScore =
    change_1d * weight1 +
    change_3d * 0.33 * weight3 +
    change_5d * 0.2 * weight5 +
    change_10d * 0.1 * weight10;

  return decisionScore / 4;
};

export const makeDecision = (
  decisionScore: number,
  riskTolerance: RiskTolerance
): string => {
  // 根据风险偏好设置不同的阈值
  let buyThreshold: number, holdThreshold: number, waitThreshold: number;

  switch (riskTolerance) {
    case RiskTolerance.aggressive:
      buyThreshold = 15;
      holdThreshold = 11;
      waitThreshold = 6;
      break;
    case RiskTolerance.moderate:
      buyThreshold = 20;
      holdThreshold = 16;
      waitThreshold = 8;
      break;
    case RiskTolerance.conservative:
      buyThreshold = 30;
      holdThreshold = 22;
      waitThreshold = 12;
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
      name: stockNameConfig[report.stock_code],
      score,
      recommendation: makeDecision(score, tolerance),
    };
  });

  return mappedData;
};
