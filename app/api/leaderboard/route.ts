import { NextResponse } from 'next/server';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, TABLE_NAME } from '@/lib/dynamodb';

export async function GET() {
  try {
    // 掃描所有進度記錄
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: '#type = :type',
        ExpressionAttributeNames: {
          '#type': 'type',
        },
        ExpressionAttributeValues: {
          ':type': 'progress',
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json({ leaderboard: [] });
    }

    // 整理數據
    const leaderboard = result.Items.map((item) => ({
      userName: item.userName,
      level: item.level || 1,
      totalXP: item.totalXP || 0,
      currentWeek: item.currentWeek || 1,
      currentDay: item.currentDay || 1,
      completedCourses: Object.keys(item.completedDays || {}).length,
    }));

    // 排序：等級高的在前，等級相同時經驗值高的在前
    leaderboard.sort((a, b) => {
      if (b.level !== a.level) {
        return b.level - a.level;
      }
      return b.totalXP - a.totalXP;
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('獲取排行榜錯誤:', error);
    return NextResponse.json(
      { error: '無法獲取排行榜數據' },
      { status: 500 }
    );
  }
}
