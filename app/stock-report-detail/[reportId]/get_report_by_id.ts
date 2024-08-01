import { PredictReportType } from "@/types/stock-report";

interface PredictReportResponseType {
  predicts: PredictReportType;
}

export const getReportById = async (
  id: string
): Promise<PredictReportResponseType> => {
  const response = await fetch(`/api/get-report-by-id/${id}`, {
    method: "GET",
  });
  const report = await response.json();

  return report.predicts;
};
