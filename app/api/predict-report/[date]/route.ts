import { PredictReportType } from "@/types/stock-report";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.NEXT_PUBLIC_STOCK_TABLE_NAME;

const fetchStockReportByDate = async (
  date: string
): Promise<PredictReportType[]> => {
  try {
    // Define the filter expression and values
    const filterExpression = "#fieldName = :fieldValue";
    const expressionAttributeNames = {
      "#fieldName": "report_date", // Replace with the actual field name
    };
    const expressionAttributeValues = {
      ":fieldValue": date, // Replace with the value to filter
    };

    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const data = await ddbDocClient.send(command);
    return data.Items as PredictReportType[];
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
