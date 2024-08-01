import { PredictClassifyReportType } from "@/types/stock-report";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.STOCK_PREDICT_CLASSIFY_REPORT;

const fetchStockReportById = async (
  id: string
): Promise<PredictClassifyReportType | null> => {
  try {
    const filterExpression = "#fieldName = :fieldValue";
    const expressionAttributeNames = {
      "#fieldName": "id", // Replace with the actual field name
    };
    const expressionAttributeValues = {
      ":fieldValue": id, // Replace with the value to filter
    };

    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const data = await ddbDocClient.send(command);
    if (data.Items && data.Items.length > 0) {
      return data.Items[0] as PredictClassifyReportType;
    }
    return null;
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    throw error;
  }
};

export async function GET(request: Request) {
  const parts = request.url.split("/");
  const id = parts[parts.length - 1];
  const predicts = await fetchStockReportById(id);

  return Response.json({ predicts });
}
