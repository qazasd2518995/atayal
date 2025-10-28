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

async function checkGameRecords() {
  try {
    console.log('🔍 開始檢查遊戲記錄...\n');

    // 掃描所有記錄
    const result = await dynamoDb.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    if (!result.Items || result.Items.length === 0) {
      console.log('❌ 沒有找到任何記錄');
      return;
    }

    // 篩選出 game 類型的記錄
    const gameRecords = result.Items.filter(item => item.type === 'game');

    // 統計各種遊戲類型
    const gameTypeStats = {};
    const recentGames = [];

    gameRecords.forEach(record => {
      const gameType = record.gameType || 'unknown';
      if (!gameTypeStats[gameType]) {
        gameTypeStats[gameType] = {
          count: 0,
          withScore: 0,
          withTime: 0,
          avgScore: 0,
          totalScore: 0,
          avgTime: 0,
          totalTime: 0,
        };
      }

      gameTypeStats[gameType].count++;

      if (record.score !== undefined && record.score !== null) {
        gameTypeStats[gameType].withScore++;
        gameTypeStats[gameType].totalScore += record.score;
      }

      if (record.timeSpent !== undefined && record.timeSpent !== null) {
        gameTypeStats[gameType].withTime++;
        gameTypeStats[gameType].totalTime += record.timeSpent;
      }

      // 收集最近的遊戲記錄
      if (recentGames.length < 10) {
        recentGames.push({
          gameType: record.gameType,
          score: record.score,
          timeSpent: record.timeSpent,
          week: record.week,
          day: record.day,
          userName: record.userName,
          timestamp: record.timestamp,
        });
      }
    });

    // 計算平均值
    Object.keys(gameTypeStats).forEach(gameType => {
      const stats = gameTypeStats[gameType];
      if (stats.withScore > 0) {
        stats.avgScore = Math.round(stats.totalScore / stats.withScore);
      }
      if (stats.withTime > 0) {
        stats.avgTime = Math.round(stats.totalTime / stats.withTime);
      }
    });

    console.log('📊 遊戲記錄總覽\n');
    console.log(`總記錄數: ${result.Items.length}`);
    console.log(`遊戲記錄 (type: "game"): ${gameRecords.length} 筆\n`);

    console.log('=' .repeat(100));
    console.log('🎮 各遊戲類型統計\n');

    // 按照記錄數量排序
    const sortedGameTypes = Object.entries(gameTypeStats)
      .sort((a, b) => b[1].count - a[1].count);

    sortedGameTypes.forEach(([gameType, stats]) => {
      console.log(`【${gameType}】`);
      console.log(`  記錄數量: ${stats.count} 筆`);
      console.log(`  有分數記錄: ${stats.withScore} 筆 (${stats.withScore === stats.count ? '✅' : '⚠️'})`);
      console.log(`  有時間記錄: ${stats.withTime} 筆 (${stats.withTime === stats.count ? '✅' : '⚠️'})`);
      if (stats.withScore > 0) {
        console.log(`  平均分數: ${stats.avgScore}%`);
      }
      if (stats.withTime > 0) {
        console.log(`  平均時間: ${stats.avgTime} 秒`);
      }
      console.log('');
    });

    console.log('=' .repeat(100));
    console.log('📋 最近 10 筆遊戲記錄\n');

    recentGames.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    recentGames.forEach((game, index) => {
      console.log(`${index + 1}. ${game.gameType} - W${game.week}D${game.day}`);
      console.log(`   用戶: ${game.userName || 'N/A'}`);
      console.log(`   分數: ${game.score !== undefined ? game.score + '%' : '❌ 無'}`);
      console.log(`   時間: ${game.timeSpent !== undefined ? game.timeSpent + '秒' : '❌ 無'}`);
      console.log(`   時間戳: ${game.timestamp}`);
      console.log('');
    });

    console.log('=' .repeat(100));
    console.log('✅ 檢查完成！\n');

    // 檢查是否有問題
    const issues = [];
    sortedGameTypes.forEach(([gameType, stats]) => {
      if (stats.withScore < stats.count) {
        issues.push(`⚠️  ${gameType}: ${stats.count - stats.withScore} 筆記錄缺少分數`);
      }
      if (stats.withTime < stats.count) {
        issues.push(`⚠️  ${gameType}: ${stats.count - stats.withTime} 筆記錄缺少時間`);
      }
    });

    if (issues.length > 0) {
      console.log('⚠️  發現問題:\n');
      issues.forEach(issue => console.log(issue));
    } else {
      console.log('✅ 所有遊戲記錄都包含完整的分數和時間資料！');
    }

  } catch (error) {
    console.error('❌ 檢查時發生錯誤:', error);
    process.exit(1);
  }
}

// 執行檢查
checkGameRecords();
