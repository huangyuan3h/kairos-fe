export interface PredictReportType {
  model_version: string;
  report_date: string;
  stock_code: string;
  change_1d: number;
  change_2d: number;
  change_3d: number;
  change_4d: number;
  change_5d: number;
  change_6d: number;
  change_7d: number;
  change_8d: number;
  change_9d: number;
  change_10d: number;
  id: string;
  score?: number;
}

export interface PredictReportDisplayType extends PredictReportType {
  score: number;
  name: string;
  recommendation: string;
  predict_class: number;
  classifyReportId: string;
}

export interface PredictClassifyReportType {
  model_version: string;
  report_date: string;
  stock_code: string;
  rise: number;
  jitter: number;
  fall: number;
  predict_class: number;
  id: string;
  score?: number;
}
