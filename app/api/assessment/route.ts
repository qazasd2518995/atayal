import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const dynamoDb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'atayal';

// POST - 儲存測驗結果
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, assessmentType, score, totalQuestions, correctAnswers, answers, completedAt, timeTaken } = body;

    if (!userName || !assessmentType) {
      return NextResponse.json(
        { success: false, message: '缺少必要參數' },
        { status: 400 }
      );
    }

    // 建立測驗結果 ID
    const assessmentId = `USER#${userName}#ASSESSMENT#${assessmentType}`;

    const item = {
      atayal: assessmentId,
      type: assessmentType === 'pre' ? 'pre-assessment' : 'post-assessment', // 明確區分課前/課後測驗
      userName: userName,
      assessmentType: assessmentType, // 'pre' 或 'post'
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      answers: answers, // 詳細作答記錄
      completedAt: completedAt,
      timeTaken: timeTaken, // 花費時間（秒）
      createdAt: new Date().toISOString(),
    };

    await dynamoDb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    }));

    return NextResponse.json({
      success: true,
      message: '測驗結果已儲存',
      data: item,
    });
  } catch (error) {
    console.error('儲存測驗結果錯誤:', error);
    return NextResponse.json(
      { success: false, message: '儲存測驗結果失敗', error: String(error) },
      { status: 500 }
    );
  }
}

// GET - 查詢測驗結果
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userName = searchParams.get('userName');
    const assessmentType = searchParams.get('assessmentType'); // 'pre', 'post', 或 'all'

    if (!userName) {
      return NextResponse.json(
        { success: false, message: '缺少 userName 參數' },
        { status: 400 }
      );
    }

    // 如果指定 assessmentType，查詢特定測驗
    if (assessmentType && assessmentType !== 'all') {
      const assessmentId = `USER#${userName}#ASSESSMENT#${assessmentType}`;

      const result = await dynamoDb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { atayal: assessmentId },
      }));

      if (result.Item) {
        return NextResponse.json({
          success: true,
          exists: true,
          assessment: result.Item,
        });
      } else {
        return NextResponse.json({
          success: true,
          exists: false,
          message: '尚未完成此測驗',
        });
      }
    }

    // 查詢該用戶的所有測驗（課前和課後）
    const preAssessmentId = `USER#${userName}#ASSESSMENT#pre`;
    const postAssessmentId = `USER#${userName}#ASSESSMENT#post`;

    const [preResult, postResult] = await Promise.all([
      dynamoDb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { atayal: preAssessmentId },
      })),
      dynamoDb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { atayal: postAssessmentId },
      }))
    ]);

    return NextResponse.json({
      success: true,
      assessments: {
        pre: preResult.Item || null,
        post: postResult.Item || null,
      },
    });
  } catch (error) {
    console.error('查詢測驗結果錯誤:', error);
    return NextResponse.json(
      { success: false, message: '查詢測驗結果失敗', error: String(error) },
      { status: 500 }
    );
  }
}
