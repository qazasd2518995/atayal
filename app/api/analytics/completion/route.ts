import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 保存課程完成記錄
    const item = {
      atayal: `USER#${data.userName}#COMPLETION#${data.timestamp}#W${data.week}D${data.day}`,
      type: 'completion',
      userName: data.userName,
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      week: data.week,
      day: data.day,
      xpEarned: data.xpEarned,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    // 更新用戶統計
    const userStatsId = `USER#${data.userName}#STATS`;

    try {
      await dynamoDb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { atayal: userStatsId },
          UpdateExpression:
            'ADD completedCourses :inc, totalXP :xp SET userName = :userName, lastCompletionTime = :time, #type = :type',
          ExpressionAttributeNames: {
            '#type': 'type',
          },
          ExpressionAttributeValues: {
            ':inc': 1,
            ':xp': data.xpEarned,
            ':userName': data.userName,
            ':time': data.timestamp,
            ':type': 'stats',
          },
        })
      );
    } catch (error) {
      console.error('Failed to update completion stats:', error);
    }

    return NextResponse.json({ success: true, message: 'Course completion tracked' });
  } catch (error) {
    console.error('Completion tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track completion' }, { status: 500 });
  }
}
