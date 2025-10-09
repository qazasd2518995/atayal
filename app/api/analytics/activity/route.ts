import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 保存活動記錄
    const item = {
      atayal: `USER#${data.userName}#ACTIVITY#${data.timestamp}#${data.activityType}`,
      type: 'activity',
      userName: data.userName,
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      activityType: data.activityType,
      duration: data.duration,
      details: data.details || {},
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    // 更新用戶統計中的時長
    const userStatsId = `USER#${data.userName}#STATS`;

    let updateExpression = '';
    const expressionAttributeValues: any = {};

    switch (data.activityType) {
      case 'learning':
        updateExpression = 'ADD learningDuration :duration SET userName = :userName';
        expressionAttributeValues[':duration'] = data.duration;
        break;
      case 'quiz':
        updateExpression = 'ADD quizDuration :duration SET userName = :userName';
        expressionAttributeValues[':duration'] = data.duration;
        break;
      case 'game':
        updateExpression = 'ADD gameDuration :duration SET userName = :userName';
        expressionAttributeValues[':duration'] = data.duration;
        break;
      case 'pronunciation':
        updateExpression = 'ADD pronunciationDuration :duration SET userName = :userName';
        expressionAttributeValues[':duration'] = data.duration;
        break;
    }

    expressionAttributeValues[':userName'] = data.userName;

    if (updateExpression) {
      try {
        await dynamoDb.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { atayal: userStatsId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
          })
        );
      } catch (error) {
        console.error('Failed to update activity stats:', error);
      }
    }

    return NextResponse.json({ success: true, message: 'Activity tracked' });
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track activity' }, { status: 500 });
  }
}
