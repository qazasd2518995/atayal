import { NextRequest, NextResponse } from 'next/server';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 從 session 獲取用戶資訊
    const userName = data.userName || 'anonymous';
    const sessionId = data.sessionId || 'unknown';
    const timestamp = new Date().toISOString();

    // 保存問卷資料
    const item = {
      atayal: `USER#${userName}#SURVEY#${timestamp}`,
      type: 'survey',
      userName,
      sessionId,
      timestamp,
      week: data.week,
      day: data.day,

      // 問卷答案
      q1_interesting: data.q1_interesting,
      q2_motivation: data.q2_motivation,
      q3_effectiveness: data.q3_effectiveness,
      q4_difficulty: data.q4_difficulty,
      q5_interface: data.q5_interface,
      q6_used_chatbot: data.q6_used_chatbot,
      q6_1_useful: data.q6_1_useful,
      q6_2_motivation: data.q6_2_motivation,
      q6_3_effectiveness: data.q6_3_effectiveness,
      q7_suggestion: data.q7_suggestion,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Survey submitted successfully'
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit survey' },
      { status: 500 }
    );
  }
}
