import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 保存發音練習記錄
    const item = {
      atayal: `USER#${data.userName}#PRONUNCIATION#${data.timestamp}`,
      type: 'pronunciation',
      userName: data.userName,
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      letter: data.letter || null,
      word: data.word || null,
      score: data.score || null,
      attempts: data.attempts,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    // 更新用戶統計
    const userStatsId = `USER#${data.userName}#STATS`;

    const updateValues: any = {
      ':inc': 1,
      ':userName': data.userName,
      ':time': data.timestamp,
    };

    let updateExpression = 'ADD pronunciationCount :inc SET userName = :userName, lastPronunciationTime = :time, #type = :type';
    updateValues[':type'] = 'stats';

    if (data.score !== null && data.score !== undefined) {
      updateExpression += ', totalPronunciationScore = if_not_exists(totalPronunciationScore, :zero) + :score';
      updateValues[':score'] = data.score;
      updateValues[':zero'] = 0;
    }

    try {
      await dynamoDb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { atayal: userStatsId },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: {
            '#type': 'type',
          },
          ExpressionAttributeValues: updateValues,
        })
      );
    } catch (error) {
      console.error('Failed to update pronunciation stats:', error);
    }

    return NextResponse.json({ success: true, message: 'Pronunciation practice tracked' });
  } catch (error) {
    console.error('Pronunciation tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track pronunciation' }, { status: 500 });
  }
}
