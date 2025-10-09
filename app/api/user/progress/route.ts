import { NextRequest, NextResponse } from 'next/server';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

// 獲取用戶進度
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get('userName');

    if (!userName) {
      return NextResponse.json({ error: '缺少用戶名稱' }, { status: 400 });
    }

    const progressId = `USER#${userName}#PROGRESS`;

    const result = await dynamoDb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { atayal: progressId },
      })
    );

    if (result.Item) {
      // 用戶存在，返回進度
      return NextResponse.json({
        exists: true,
        progress: {
          currentWeek: result.Item.currentWeek,
          currentDay: result.Item.currentDay,
          completedDays: result.Item.completedDays || {},
          totalXP: result.Item.totalXP || 0,
          level: result.Item.level || 1,
        },
      });
    } else {
      // 新用戶
      return NextResponse.json({
        exists: false,
        progress: {
          currentWeek: 1,
          currentDay: 1,
          completedDays: {},
          totalXP: 0,
          level: 1,
        },
      });
    }
  } catch (error) {
    console.error('獲取用戶進度錯誤:', error);
    return NextResponse.json({ error: '無法獲取用戶進度' }, { status: 500 });
  }
}

// 保存用戶進度
export async function POST(request: NextRequest) {
  try {
    const { userName, progress } = await request.json();

    if (!userName || !progress) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 });
    }

    const progressId = `USER#${userName}#PROGRESS`;

    const item = {
      atayal: progressId,
      type: 'progress',
      userName: userName,
      currentWeek: progress.currentWeek,
      currentDay: progress.currentDay,
      completedDays: progress.completedDays || {},
      totalXP: progress.totalXP || 0,
      level: progress.level || 1,
      lastUpdated: new Date().toISOString(),
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return NextResponse.json({ success: true, message: '進度已保存' });
  } catch (error) {
    console.error('保存用戶進度錯誤:', error);
    return NextResponse.json({ error: '無法保存用戶進度' }, { status: 500 });
  }
}
