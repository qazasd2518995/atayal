import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 保存遊戲成績記錄
    const item = {
      atayal: `USER#${data.userName}#GAME#${data.timestamp}#${data.gameType}#W${data.week}D${data.day}`,
      type: 'game',
      userName: data.userName,
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      week: data.week,
      day: data.day,
      gameType: data.gameType,
      score: data.score,
      attempts: data.attempts || 0,
      timeSpent: data.timeSpent,
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
            'ADD gameCount :inc, totalGameScore :score SET userName = :userName, lastGameTime = :time, #type = :type',
          ExpressionAttributeNames: {
            '#type': 'type',
          },
          ExpressionAttributeValues: {
            ':inc': 1,
            ':score': data.score,
            ':userName': data.userName,
            ':time': data.timestamp,
            ':type': 'stats',
          },
        })
      );
    } catch (error) {
      console.error('Failed to update game stats:', error);
    }

    return NextResponse.json({ success: true, message: 'Game result tracked' });
  } catch (error) {
    console.error('Game tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track game result' }, { status: 500 });
  }
}
