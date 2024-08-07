import { PredictReportType } from "@/types/stock-report";

type ResponseType = {
  predicts: PredictReportType[];
};

export const fetchStockReportByDate = async (
  date: string
): Promise<PredictReportType[]> => {
  try {
    const result: ResponseType = await (
      await fetch(`api/predict-report/${date}`)
    ).json();
    return result.predicts;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};

export function getLastBusinessDay(date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours();
  const dayOfWeek = date.getDay();

  if (dayOfWeek >= 1 && dayOfWeek <= 5 && hours >= 17) {
    return `${year}-${month}-${day}`;
  } else {
    // Find last business day (Friday if weekend or before 5pm on weekdays)
    const daysToSubtract =
      dayOfWeek === 0 ? 2 : dayOfWeek === 6 ? 1 : hours < 17 ? 1 : 0;
    const lastBusinessDay = new Date(date);
    lastBusinessDay.setDate(date.getDate() - daysToSubtract);
    const lastBusinessDayYear = lastBusinessDay.getFullYear();
    const lastBusinessDayMonth = (lastBusinessDay.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const lastBusinessDayDay = lastBusinessDay
      .getDate()
      .toString()
      .padStart(2, "0");
    return `${lastBusinessDayYear}-${lastBusinessDayMonth}-${lastBusinessDayDay}`;
  }
}
