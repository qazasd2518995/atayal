# 資料匯出指南

## 📊 如何正確匯出資料庫到 CSV

### 問題說明

之前的匯出方式可能包含 DynamoDB 的原始格式標記：
```json
{
  "gameType": {"S": "BodyPartQuiz"},  // ❌ 不正確
  "week": {"N": "2"}                   // ❌ 不正確
}
```

新的匯出腳本會自動清理這些格式，輸出標準 JSON：
```json
{
  "gameType": "BodyPartQuiz",          // ✅ 正確
  "week": 2                             // ✅ 正確
}
```

---

## 🚀 使用方法

### 1. 執行匯出腳本

```bash
cd tayal-platform
node scripts/export-to-csv.js
```

### 2. 查看匯出結果

匯出的檔案會儲存在：
```
tayal-platform/exports/atayal-export-YYYY-MM-DDTHH-MM-SS.csv
```

### 3. 腳本會顯示統計資訊

```
✅ CSV 匯出成功！
📁 檔案位置: /path/to/exports/atayal-export-2025-10-28T12-30-00.csv
📊 記錄數量: 1088
📝 欄位數量: 59

📈 記錄類型統計:
   activity: 478 筆
   session: 256 筆
   quiz: 97 筆
   ...

🎮 遊戲記錄分析:
   獨立 game 記錄: 6 筆 ✅
   activity-game 記錄: 51 筆 ⚠️
   總計: 57 筆

✅ 已清理所有 DynamoDB 格式標記
```

---

## 📋 匯出功能特色

### ✅ 自動清理 DynamoDB 格式

使用 `DynamoDBDocumentClient` 而不是 `DynamoDBClient`：

```javascript
// ✅ 正確做法
const dynamoDb = DynamoDBDocumentClient.from(client);
const result = await dynamoDb.send(new ScanCommand({ ... }));
// result.Items 已經是標準 JSON 格式
```

### ✅ CSV 格式安全處理

- 自動處理包含逗號、換行、引號的內容
- 複雜物件/陣列轉為 JSON 字串
- 確保 Excel/Google Sheets 可正確開啟

### ✅ 統計分析

匯出時自動顯示：
- 記錄總數
- 各類型記錄數量
- 遊戲記錄分析（game vs activity-game）
- DynamoDB 格式檢查

---

## 🔍 如何分析匯出的 CSV

### 方法 1: 使用 Excel/Google Sheets

1. 開啟 CSV 檔案
2. 使用篩選功能查看不同類型記錄
3. 建立樞紐分析表進行統計

### 方法 2: 使用 Python/Pandas

```python
import pandas as pd
import json

# 讀取 CSV
df = pd.read_csv('atayal-export-2025-10-28T12-30-00.csv')

# 統計記錄類型
print(df['type'].value_counts())

# 分析遊戲記錄
games = df[df['type'] == 'game']
activity_games = df[(df['type'] == 'activity') & (df['activityType'] == 'game')]

print(f"獨立 game 記錄: {len(games)} 筆")
print(f"activity-game 記錄: {len(activity_games)} 筆")

# 解析 details 欄位（如果是 JSON 字串）
def parse_details(details_str):
    try:
        return json.loads(details_str) if pd.notna(details_str) else {}
    except:
        return {}

activity_games['details_parsed'] = activity_games['details'].apply(parse_details)
```

### 方法 3: 使用我們提供的分析腳本

```bash
# 檢查測驗記錄
node scripts/check-assessment.js

# 檢查特定用戶的詳細資料
node scripts/check-assessment-detail.js username
```

---

## ⚠️ 注意事項

### 1. 環境變數

確保 `.env.local` 包含正確的 AWS 設定：
```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_NAME=atayal
```

### 2. 權限需求

執行此腳本需要 DynamoDB 的讀取權限：
- `dynamodb:Scan`
- `dynamodb:DescribeTable`

### 3. 大型資料表

如果資料表很大（>1MB），可能需要：
- 使用分頁掃描（目前腳本會自動處理）
- 增加超時時間
- 考慮使用 AWS CLI 或 Data Pipeline

---

## 🔧 故障排除

### 問題：匯出檔案太大

**解決方案**：可以修改腳本加入過濾條件

```javascript
// 只匯出特定類型
const result = await dynamoDb.send(new ScanCommand({
  TableName: TABLE_NAME,
  FilterExpression: '#type = :type',
  ExpressionAttributeNames: { '#type': 'type' },
  ExpressionAttributeValues: { ':type': 'game' }
}));
```

### 問題：仍看到 DynamoDB 格式

**原因**：`details` 欄位在儲存時就已經是字串格式

**解決方案**：修改儲存邏輯，直接儲存物件而不是字串

```javascript
// ❌ 錯誤：儲存字串
details: JSON.stringify({ week: 1, day: 1 })

// ✅ 正確：直接儲存物件
details: { week: 1, day: 1 }
```

### 問題：缺少某些欄位

**原因**：不同記錄類型有不同欄位

**解決方案**：腳本會自動收集所有欄位，空白欄位會顯示為空值

---

## 📚 相關文檔

- [資料庫分析報告](./database-analysis-report.md) - 完整的資料品質分析
- [遊戲記錄追蹤分析](./game-tracking-analysis.md) - 遊戲記錄問題詳解
- [測試課後測驗流程](../scripts/test-post-assessment.md) - 測試指南

---

## 💡 最佳實踐

1. **定期匯出備份**
   - 建議每週匯出一次資料
   - 保留歷史備份以便追蹤變化

2. **匯出前檢查**
   - 確認 AWS 連線正常
   - 檢查磁碟空間是否足夠

3. **資料驗證**
   - 匯出後檢查記錄數量是否正確
   - 抽查幾筆資料確認格式正確

4. **安全性**
   - 匯出檔案包含用戶資料，注意保密
   - 不要將 CSV 檔案提交到 Git
   - `exports/` 目錄已加入 `.gitignore`

---

**文檔更新**: 2025-10-28
**維護者**: 泰雅語學習平台開發團隊
