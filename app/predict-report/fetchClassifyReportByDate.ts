import {
  PredictClassifyReportType,
  PredictReportType,
} from "@/types/stock-report";

type ResponseType = {
  predicts: PredictClassifyReportType[];
};

export const fetchClassifyStockReportByDate = async (
  date: string
): Promise<PredictClassifyReportType[]> => {
  try {
    const result: ResponseType = await (
      await fetch(`api/predict-classify-report/${date}`)
    ).json();
    return result.predicts;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};
