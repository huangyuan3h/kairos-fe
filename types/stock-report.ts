export interface PredictReportType {
  model: string;
  report_date: string;
  change_10d: number;
  stock_code: string;
  change_1d: number;
  change_3d: number;
  change_5d: number;
  id: string;
  score?: number;
}
