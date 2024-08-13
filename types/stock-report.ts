export interface PredictReportType {
  report_date: string;
  stock_code: string;
  change_1d: number;
  change_2d: number;
  change_3d: number;
  trend: number;
  operation_1d: number;
  operation_2d: number;
  id: string;
  score?: number;
}

export interface PredictReportDisplayType extends PredictReportType {
  score: number;
  name: string;
  recommendation: string;
}
