import { PredictReportType } from "@/types/stock-report";

interface PredictReportResponseType {
  predicts: PredictReportType;
}

export const getClassifyById = async (
  id: string
): Promise<PredictReportResponseType> => {
  const response = await fetch(`/api/get-classify-by-id/${id}`, {
    method: "GET",
  });
  const report = await response.json();

  return report.predicts;
};
