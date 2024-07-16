import { Table, Stack } from "sst/constructs";

export const getTableConfig = (stack: Stack) => {
  const stockPredictReport = new Table(stack, "stockPredict", {
    fields: {
      id: "string",
      report_date: "string",
      stock_code: "string",
      model: "string",
      change_1d: "number",
      change_3d: "number",
      change_5d: "number",
      change_10d: "number",
    },
    primaryIndex: { partitionKey: "id" },
    globalIndexes: {
      all: { partitionKey: "report_date" },
    },
  });

  return { stockPredictReport };
};
