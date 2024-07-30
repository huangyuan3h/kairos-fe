import { PredictClassifyReportType } from "@/types/stock-report";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.STOCK_PREDICT_CLASSIFY_REPORT;

const fetchStockReportByDate = async (
  date: string
): Promise<PredictClassifyReportType[]> => {
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
    return data.Items as PredictClassifyReportType[];
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
