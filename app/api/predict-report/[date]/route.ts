import { PredictReportType } from "@/types/stock-report";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.STOCK_PREDICT_REPORT;

const fetchStockReportByDate = async (
  date: string
): Promise<PredictReportType[]> => {
  try {
    let hasMoreResults = true;
    let lastEvaluatedKey = undefined;
    let allItems: PredictReportType[] = [];

    // 循环处理分页
    while (hasMoreResults) {
      const command: ScanCommand = new ScanCommand({
        TableName: tableName,
        FilterExpression: "#fieldName = :fieldValue",
        ExpressionAttributeNames: {
          "#fieldName": "report_date",
        },
        ExpressionAttributeValues: {
          ":fieldValue": date,
        },
        ExclusiveStartKey: lastEvaluatedKey, // 设置开始的键值，第一次为空
      });

      const data = await ddbDocClient.send(command);
      allItems = allItems.concat(data.Items as PredictReportType[]);

      // 判断是否还有更多数据
      lastEvaluatedKey = data.LastEvaluatedKey;
      hasMoreResults = !!lastEvaluatedKey;
    }

    return allItems;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};

export async function GET(request: Request) {
  const parts = request.url.split("/");
  const reportDate = parts[parts.length - 1];
  const predicts = await fetchStockReportByDate(reportDate);

  return Response.json({ predicts });
}
