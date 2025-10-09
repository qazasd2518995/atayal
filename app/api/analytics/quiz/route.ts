import { NextRequest, NextResponse } from 'next/server';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 保存測驗成績記錄
    const item = {
      atayal: `USER#${data.userName}#QUIZ#${data.timestamp}#W${data.week}D${data.day}`,
      type: 'quiz',
      userName: data.userName,
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      week: data.week,
      day: data.day,
      score: data.score,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
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
            'ADD quizCount :inc, totalQuizScore :score SET userName = :userName, lastQuizTime = :time, #type = :type',
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
      console.error('Failed to update quiz stats:', error);
    }

    return NextResponse.json({ success: true, message: 'Quiz result tracked' });
  } catch (error) {
    console.error('Quiz tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track quiz result' }, { status: 500 });
  }
}
