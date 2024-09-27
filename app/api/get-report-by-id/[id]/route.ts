import { PredictReportType } from "@/types/stock-report";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.STOCK_PREDICT_REPORT;

const fetchStockReportById = async (
  id: string
): Promise<PredictReportType | null> => {
  try {
    // Use QueryCommand instead of ScanCommand
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#idField = :idValue",
      ExpressionAttributeNames: {
        "#idField": "id", // Replace with actual partition key if needed
      },
      ExpressionAttributeValues: {
        ":idValue": id,
      },
    });

    const data = await ddbDocClient.send(command);
    if (data.Items && data.Items.length > 0) {
      return data.Items[0] as PredictReportType;
    }
    return null;
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    throw error;
  }
};

export async function GET(request: Request) {
  const parts = request.url.split("/");
  const id = parts[parts.length - 1];
  const predicts = await fetchStockReportById(id);

  return Response.json({ predicts });
}
