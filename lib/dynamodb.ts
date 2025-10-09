import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// 創建 DynamoDB 客戶端
const client = new DynamoDBClient({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// 創建文檔客戶端（簡化操作）
export const dynamoDb = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = 'atayal';
