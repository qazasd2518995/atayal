import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (type === 'login') {
      // 創建新的 session 記錄
      const item = {
        atayal: `USER#${data.userName}#SESSION#${data.sessionId}`,
        type: 'session',
        userName: data.userName,
        sessionId: data.sessionId,
        loginTime: data.loginTime,
        timestamp: data.loginTime,
      };

      await dynamoDb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );

      // 更新用戶統計：登入次數
      const userStatsId = `USER#${data.userName}#STATS`;

      try {
        await dynamoDb.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { atayal: userStatsId },
            UpdateExpression: 'ADD loginCount :inc SET lastLoginTime = :time, userName = :userName, #type = :type',
            ExpressionAttributeNames: {
              '#type': 'type',
            },
            ExpressionAttributeValues: {
              ':inc': 1,
              ':time': data.loginTime,
              ':userName': data.userName,
              ':type': 'stats',
            },
          })
        );
      } catch (error) {
        console.error('Failed to update user stats:', error);
      }

      return NextResponse.json({ success: true, message: 'Login tracked' });
    } else if (type === 'logout') {
      // 更新 session 記錄，加入登出時間和總時長
      const sessionId = `USER#${data.userName}#SESSION#${data.sessionId}`;

      await dynamoDb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { atayal: sessionId },
          UpdateExpression: 'SET logoutTime = :logoutTime, totalDuration = :duration',
          ExpressionAttributeValues: {
            ':logoutTime': data.logoutTime,
            ':duration': data.totalDuration,
          },
        })
      );

      return NextResponse.json({ success: true, message: 'Logout tracked' });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track session' }, { status: 500 });
  }
}
