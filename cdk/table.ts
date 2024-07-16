import { Table, Stack } from "sst/constructs";

export const getTableConfig = (stack: Stack) => {
  const stockPredictReport = new Table(stack, "stockPredictReport", {
    fields: {
      id: "string",
      reportDate: "string",
      stockCode: "string",
      model: "string",
      predict1Day: "number",
      predict3Day: "number",
      predict5Day: "number",
      predict10Day: "number",
    },
    primaryIndex: { partitionKey: "id" },
    globalIndexes: {
      all: { partitionKey: "reportDate" },
    },
  });

  return { stockPredictReport };
};
