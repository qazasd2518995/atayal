const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 載入環境變數
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// 使用 DocumentClient 會自動清理 DynamoDB 格式標記
const dynamoDb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'atayal';

// 將物件轉換為 CSV 安全的字串
function toCsvSafe(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    // 將物件/陣列轉為 JSON 字串，並處理引號
    const jsonStr = JSON.stringify(value);
    return `"${jsonStr.replace(/"/g, '""')}"`;
  }

  const str = String(value);
  // 如果包含逗號、換行或引號，需要用雙引號包裹
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

async function exportToCSV() {
  try {
    console.log('🔄 開始從 DynamoDB 匯出資料...\n');

    // 掃描所有記錄
    const result = await dynamoDb.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    if (!result.Items || result.Items.length === 0) {
      console.log('❌ 沒有找到任何記錄');
      return;
    }

    console.log(`✅ 找到 ${result.Items.length} 筆記錄\n`);

    // 收集所有可能的欄位名稱
    const allFields = new Set();
    result.Items.forEach(item => {
      Object.keys(item).forEach(key => allFields.add(key));
    });

    const fields = Array.from(allFields).sort();

    // 建立 CSV 標題列
    const headers = fields.map(f => `"${f}"`).join(',');

    // 建立 CSV 資料列
    const rows = result.Items.map(item => {
      return fields.map(field => toCsvSafe(item[field])).join(',');
    });

    // 組合 CSV 內容
    const csvContent = [headers, ...rows].join('\n');

    // 儲存檔案
    const outputPath = path.join(__dirname, '..', 'exports');

    // 確保輸出目錄存在
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(outputPath, `atayal-export-${timestamp}.csv`);

    fs.writeFileSync(filename, csvContent, 'utf-8');

    console.log('✅ CSV 匯出成功！');
    console.log(`📁 檔案位置: ${filename}`);
    console.log(`📊 記錄數量: ${result.Items.length}`);
    console.log(`📝 欄位數量: ${fields.length}\n`);

    // 顯示記錄類型統計
    const typeCounts = {};
    result.Items.forEach(item => {
      const type = item.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    console.log('📈 記錄類型統計:');
    Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} 筆`);
      });

    // 檢查 game 記錄
    const gameRecords = result.Items.filter(item => item.type === 'game');
    const activityGameRecords = result.Items.filter(
      item => item.type === 'activity' && item.activityType === 'game'
    );

    console.log('\n🎮 遊戲記錄分析:');
    console.log(`   獨立 game 記錄: ${gameRecords.length} 筆 ✅`);
    console.log(`   activity-game 記錄: ${activityGameRecords.length} 筆 ⚠️`);
    console.log(`   總計: ${gameRecords.length + activityGameRecords.length} 筆\n`);

    // 檢查是否有 DynamoDB 格式殘留（應該沒有了）
    let hasDynamoDBFormat = false;
    result.Items.forEach(item => {
      if (item.details && typeof item.details === 'object') {
        const detailsStr = JSON.stringify(item.details);
        if (detailsStr.includes('{"N":') || detailsStr.includes('{"S":') || detailsStr.includes('{"BOOL":')) {
          hasDynamoDBFormat = true;
        }
      }
    });

    if (hasDynamoDBFormat) {
      console.log('⚠️  警告: 仍檢測到 DynamoDB 格式標記');
      console.log('   這可能是因為 details 欄位在儲存時就已經是字串格式');
    } else {
      console.log('✅ 已清理所有 DynamoDB 格式標記');
    }

    console.log('\n' + '='.repeat(80));
    console.log('✨ 匯出完成！');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ 匯出時發生錯誤:', error);
    process.exit(1);
  }
}

// 執行匯出
exportToCSV();
