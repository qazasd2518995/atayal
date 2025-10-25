const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
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

async function checkUserAssessments(userName) {
  console.log(`\n🔍 查詢用戶 "${userName}" 的測驗記錄...\n`);
  console.log('='.repeat(80));

  try {
    // 查詢課前測驗
    const preId = `USER#${userName}#ASSESSMENT#pre`;
    const preResult = await dynamoDb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { atayal: preId }
    }));

    if (preResult.Item) {
      console.log('\n📋 課前測驗 (Pre-Assessment)');
      console.log('-'.repeat(80));
      displayAssessment(preResult.Item);
    } else {
      console.log('\n❌ 課前測驗：未找到記錄');
    }

    // 查詢課後測驗
    const postId = `USER#${userName}#ASSESSMENT#post`;
    const postResult = await dynamoDb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { atayal: postId }
    }));

    if (postResult.Item) {
      console.log('\n🎓 課後測驗 (Post-Assessment)');
      console.log('-'.repeat(80));
      displayAssessment(postResult.Item);
    } else {
      console.log('\n❌ 課後測驗：未找到記錄');
      console.log('💡 提示：完成第3週第5天的課程和問卷後，會自動顯示課後測驗');
    }

    // 如果兩個都有，顯示進步對比
    if (preResult.Item && postResult.Item) {
      console.log('\n📈 學習進步對比');
      console.log('='.repeat(80));
      const preScore = preResult.Item.score;
      const postScore = postResult.Item.score;
      const improvement = postScore - preScore;

      console.log(`課前分數: ${preScore} 分`);
      console.log(`課後分數: ${postScore} 分`);
      console.log(`進步幅度: ${improvement > 0 ? '+' : ''}${improvement} 分 (${improvement > 0 ? '↑' : improvement < 0 ? '↓' : '→'} ${Math.abs(improvement / preScore * 100).toFixed(1)}%)`);

      if (improvement > 0) {
        console.log('✨ 恭喜！學習有顯著進步！');
      } else if (improvement === 0) {
        console.log('📊 分數維持不變');
      } else {
        console.log('💪 繼續加油！');
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ 查詢時發生錯誤:', error);
  }
}

function displayAssessment(assessment) {
  console.log(`✓ 分數: ${assessment.score} 分`);
  console.log(`✓ 答對: ${assessment.correctAnswers} / ${assessment.totalQuestions} 題 (${Math.round(assessment.correctAnswers / assessment.totalQuestions * 100)}%)`);
  console.log(`✓ 完成時間: ${new Date(assessment.completedAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`);
  console.log(`✓ 花費時間: ${Math.floor(assessment.timeTaken / 60)} 分 ${assessment.timeTaken % 60} 秒`);

  if (assessment.answers && assessment.answers.length > 0) {
    console.log(`\n📝 答題詳情:`);
    const correct = assessment.answers.filter(a => a.correct).length;
    const wrong = assessment.answers.filter(a => !a.correct).length;
    console.log(`   答對: ${correct} 題 ✓`);
    console.log(`   答錯: ${wrong} 題 ✗`);

    // 顯示前5題的答題狀況
    console.log(`\n   前5題作答狀況:`);
    assessment.answers.slice(0, 5).forEach((ans, idx) => {
      const status = ans.correct ? '✓' : '✗';
      console.log(`   ${idx + 1}. ${status} (題目ID: ${ans.questionId})`);
    });

    if (assessment.answers.length > 5) {
      console.log(`   ... 還有 ${assessment.answers.length - 5} 題`);
    }
  }
}

// 從命令列參數獲取用戶名，或使用預設值
const userName = process.argv[2] || 'test';
checkUserAssessments(userName);
