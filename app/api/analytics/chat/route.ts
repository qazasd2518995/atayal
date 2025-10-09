import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 保存聊天對話記錄
    const item = {
      atayal: `USER#${data.userName}#CHAT#${data.timestamp}`,
      type: 'chat',
      userName: data.userName,
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      userInput: data.userInput,
      llmOutput: data.llmOutput,
      llmSource: data.llmSource, // 'groq' 或 'fallback'
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    // 更新用戶統計中的聊天次數
    const userStatsId = `USER#${data.userName}#STATS`;

    try {
      await dynamoDb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { atayal: userStatsId },
          UpdateExpression: 'ADD chatCount :inc SET userName = :userName, lastChatTime = :time, #type = :type',
          ExpressionAttributeNames: {
            '#type': 'type',
          },
          ExpressionAttributeValues: {
            ':inc': 1,
            ':userName': data.userName,
            ':time': data.timestamp,
            ':type': 'stats',
          },
        })
      );
    } catch (error) {
      console.error('Failed to update chat stats:', error);
    }

    return NextResponse.json({ success: true, message: 'Chat tracked' });
  } catch (error) {
    console.error('Chat tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track chat' }, { status: 500 });
  }
}
