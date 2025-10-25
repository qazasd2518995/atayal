const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dotenv = require('dotenv');
const path = require('path');

// 載入環境變數
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const dynamoDb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'atayal';

async function checkAssessments() {
  try {
    console.log('🔍 查詢所有測驗記錄...\n');

    // 掃描所有 pre-assessment 和 post-assessment 類型的記錄
    const result = await dynamoDb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#type = :preType OR #type = :postType',
      ExpressionAttributeNames: {
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':preType': 'pre-assessment',
        ':postType': 'post-assessment'
      }
    }));

    if (result.Items && result.Items.length > 0) {
      console.log(`✅ 找到 ${result.Items.length} 筆測驗記錄：\n`);

      result.Items.forEach((item, index) => {
        console.log(`📝 測驗 #${index + 1}:`);
        console.log(`   用戶名稱: ${item.userName}`);
        console.log(`   測驗類型: ${item.assessmentType === 'pre' ? '📋 課前測驗' : '🎓 課後測驗'}`);
        console.log(`   資料庫分類: ${item.type}`); // 顯示 type 欄位
        console.log(`   分數: ${item.score} 分`);
        console.log(`   答對題數: ${item.correctAnswers} / ${item.totalQuestions}`);
        console.log(`   完成時間: ${new Date(item.completedAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`);
        console.log(`   花費時間: ${Math.floor(item.timeTaken / 60)} 分 ${item.timeTaken % 60} 秒`);
        console.log(`   資料庫 ID: ${item.atayal}`);
        console.log('');
      });
    } else {
      console.log('❌ 沒有找到任何測驗記錄');
      console.log('💡 請確認：');
      console.log('   1. 是否已完成課前測驗？');
      console.log('   2. 測驗完成後是否有看到結果頁面？');
      console.log('   3. 瀏覽器 Console 是否有錯誤訊息？');
    }

    // 列出最近的用戶
    console.log('\n👥 查詢最近登入的用戶...\n');
    const progressResult = await dynamoDb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':type': 'progress'
      },
      Limit: 10
    }));

    if (progressResult.Items && progressResult.Items.length > 0) {
      console.log('最近的用戶:');
      progressResult.Items
        .sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0))
        .forEach(item => {
          const lastUpdated = item.lastUpdated
            ? new Date(item.lastUpdated).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
            : '未知';
          console.log(`   - ${item.userName} (等級 ${item.level}, XP ${item.totalXP}, 最後更新: ${lastUpdated})`);
        });
    }

  } catch (error) {
    console.error('❌ 查詢時發生錯誤:', error);
  }
}

checkAssessments();
