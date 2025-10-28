# 遊戲記錄追蹤問題分析報告

**分析日期**: 2025-10-28
**問題**: 為何資料庫中 game type 記錄很少？DynamoDB 格式是否正常？

---

## 📊 一、問題分析

### 1.1 發現的記錄數量

從 `results (1).csv` 分析：

| 記錄類型 | 數量 | 說明 |
|---------|------|------|
| `type: "game"` | **6 筆** | ✅ 正確的獨立 game 記錄 |
| `type: "activity"`, `activityType: "game"` | **51 筆** | ⚠️ 作為 activity 記錄的 game |
| **總計** | **57 筆** | 遊戲相關記錄總數 |

### 1.2 兩種記錄方式範例

#### ✅ **方式 1: 正確的獨立 GAME 記錄**
```csv
"USER#鄭兆翔#GAME#2025-10-09T08:54:11.164Z#BodyPartQuiz#W2D2"
type: "game"
gameType: "BodyPartQuiz"
score: 38
attempts: 8
timeSpent: 91
week: 2
day: 2
```

**特徵**:
- ✅ `type: "game"` (獨立類型)
- ✅ 使用 `/api/analytics/game` API
- ✅ 記錄在專用的 game 欄位
- ✅ 有完整的遊戲數據（score, attempts, timeSpent）

---

#### ⚠️ **方式 2: 作為 activity 記錄的 game**
```csv
"USER#鄭兆翔#ACTIVITY#2025-10-09T08:52:40.652Z#game"
type: "activity"
activityType: "game"
details: '{"gameType":{"S":"BodyPartQuiz"},"week":{"N":"2"},"completed":{"BOOL":false},"day":{"N":"2"}}'
duration: 0
```

**特徵**:
- ⚠️ `type: "activity"` (通用類型)
- ⚠️ 使用 `/api/analytics/activity` API
- ⚠️ 遊戲數據埋在 `details` 欄位中
- ⚠️ 格式不一致（DynamoDB 格式未清理）

---

## 🔍 二、根本原因分析

### 2.1 程式碼架構

系統有**兩個獨立的追蹤函數**：

#### **函數 1: `trackGameResult()`** (lib/analytics.ts:196)
```typescript
export async function trackGameResult(result: Omit<GameResult, ...>) {
  // ...
  await fetch('/api/analytics/game', { // ✅ 正確的 game API
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData),
  });
}
```
→ 呼叫 `/api/analytics/game` → 產生 `type: "game"` 記錄 ✅

---

#### **函數 2: `trackActivity('game', ...)` **(lib/analytics.ts:150)
```typescript
export async function trackActivity(activityType: 'game', duration, details) {
  // ...
  await fetch('/api/analytics/activity', { // ⚠️ 通用 activity API
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData),
  });
}
```
→ 呼叫 `/api/analytics/activity` → 產生 `type: "activity"`, `activityType: "game"` 記錄 ⚠️

---

### 2.2 問題根源

**遊戲完成時，程式碼同時呼叫了兩個函數**：

可能的情況：
1. **老舊程式碼**: 早期使用 `trackActivity('game')` 記錄遊戲
2. **新版程式碼**: 後來改為使用 `trackGameResult()` 專用函數
3. **混用情況**: 某些地方還在用舊方法，某些地方已改用新方法

**結果**:
- 只有 **6 筆** (10%) 使用正確的 `trackGameResult()` → `type: "game"` ✅
- 大部分 **51 筆** (90%) 使用舊的 `trackActivity('game')` → `type: "activity"` ⚠️

---

## 📋 三、DynamoDB 格式問題

### 3.1 問題: 未清理的 DynamoDB 類型標記

**CSV 中的 details 欄位**:
```json
{
  "gameType": {"S": "BodyPartQuiz"},    // ❌ {"S": ...} 是 DynamoDB String 類型
  "week": {"N": "2"},                   // ❌ {"N": ...} 是 DynamoDB Number 類型
  "completed": {"BOOL": false},         // ❌ {"BOOL": ...} 是 DynamoDB Boolean 類型
  "day": {"N": "2"}
}
```

### 3.2 這樣是正常的嗎？

**❌ 不正常！應該要清理成標準 JSON：**
```json
{
  "gameType": "BodyPartQuiz",           // ✅ 純字串
  "week": 2,                            // ✅ 純數字
  "completed": false,                   // ✅ 純布林值
  "day": 2
}
```

### 3.3 為什麼會這樣？

**原因**: CSV 匯出時，直接把 DynamoDB 的原始格式匯出了

DynamoDB 內部儲存格式包含類型標記：
- `{"S": "value"}` = String
- `{"N": "123"}` = Number
- `{"BOOL": true}` = Boolean
- `{"M": {...}}` = Map (物件)
- `{"L": [...]}` = List (陣列)

**正確做法**: 匯出 CSV 前應該使用 `DynamoDBDocumentClient` 自動轉換

---

## ⚠️ 四、影響評估

### 4.1 對分析的影響

| 影響項目 | 嚴重程度 | 說明 |
|---------|----------|------|
| 遊戲記錄統計 | 🔴 高 | 只能看到 10% 的正確記錄 |
| 資料完整性 | 🟡 中 | 資料都有記錄，只是格式不統一 |
| 資料分析難度 | 🟡 中 | 需要同時查詢兩種記錄類型 |
| CSV 格式 | 🟡 中 | 需要手動清理 DynamoDB 格式 |

### 4.2 資料並未遺失

**好消息**:
- ✅ 遊戲數據都有被記錄（57 筆）
- ✅ 只是記錄方式不統一
- ✅ 可以透過分析兩種記錄來還原完整數據

---

## 🎯 五、解決方案

### 🔴 優先級 1: 統一遊戲記錄方式

#### **建議方案 A: 完全使用 `trackGameResult()`**

**修改所有遊戲組件**，確保使用正確的追蹤函數：

```typescript
// ❌ 錯誤：不要用 trackActivity
await trackActivity('game', duration, { gameType, score, ... });

// ✅ 正確：使用 trackGameResult
await trackGameResult({
  week,
  day,
  gameType,
  score,
  attempts,
  timeSpent
});
```

**優點**:
- 資料結構清晰
- 專用欄位易於查詢
- 未來擴展容易

**需要修改的地方**:
- 檢查所有遊戲組件（LetterMatch, VocabularyMemory 等）
- 確認每個遊戲完成時使用 `trackGameResult()`

---

#### **建議方案 B: 保留 activity 記錄，但改善格式**

如果想保留 activity 記錄作為時長追蹤：

```typescript
// 同時記錄兩種
await trackGameResult({ ... }); // 遊戲成績
await trackActivity('game', duration, { week, day }); // 時長統計
```

**優點**:
- 保留時長統計功能
- 遊戲成績有專用記錄

**缺點**:
- 資料重複
- 查詢時需要注意去重

---

### 🟡 優先級 2: 修正 CSV 匯出格式

**修改匯出程式**，清理 DynamoDB 格式：

```typescript
// 使用 DynamoDBDocumentClient 而不是直接使用 DynamoDBClient
// 這樣會自動清理類型標記

import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const result = await dynamoDb.send(new ScanCommand({ TableName: TABLE_NAME }));
// result.Items 已經是清理過的標準 JSON ✅
```

---

### 🟢 優先級 3: 資料遷移（可選）

如果需要清理歷史資料：

1. **匯出現有的 activity-game 記錄**
2. **轉換為 game 記錄格式**
3. **重新寫入資料庫**

（這是可選的，因為歷史資料可以透過查詢兩種類型來分析）

---

## 📊 六、如何正確分析現有資料

### 6.1 查詢所有遊戲記錄的方法

```typescript
// 方法 1: 查詢獨立 game 記錄
const games1 = items.filter(item => item.type === 'game');

// 方法 2: 查詢 activity 中的 game
const games2 = items.filter(item =>
  item.type === 'activity' && item.activityType === 'game'
);

// 合併
const allGames = [...games1, ...games2];
```

### 6.2 資料標準化

```typescript
function normalizeGameRecord(record: any) {
  if (record.type === 'game') {
    // 已經是標準格式
    return record;
  } else if (record.type === 'activity' && record.activityType === 'game') {
    // 從 details 中提取資料
    return {
      type: 'game',
      userName: record.userName,
      gameType: record.details.gameType?.S || record.details.gameType,
      week: parseInt(record.details.week?.N || record.details.week),
      day: parseInt(record.details.day?.N || record.details.day),
      score: parseInt(record.details.score?.N || record.details.score || 0),
      completed: record.details.completed?.BOOL ?? record.details.completed,
      timestamp: record.timestamp
    };
  }
}
```

---

## ✅ 七、總結與建議

### 7.1 問題總結

1. **遊戲記錄分散**:
   - 6 筆正確的 `type: "game"` ✅
   - 51 筆作為 `type: "activity"` 記錄 ⚠️

2. **DynamoDB 格式未清理**:
   - CSV 中包含 `{"S":"..."}`, `{"N":"..."}` 等類型標記 ❌
   - 應該轉換為標準 JSON ✅

### 7.2 是否有資料遺失？

**❌ 沒有！** 所有遊戲數據都有被記錄，只是記錄方式不統一。

### 7.3 立即行動建議

#### 🔴 **立即處理**:
1. **統一程式碼**: 檢查並修改所有遊戲組件，統一使用 `trackGameResult()`
2. **修正 CSV 匯出**: 使用 `DynamoDBDocumentClient` 清理格式

#### 🟡 **短期處理**:
3. **建立資料分析腳本**: 能夠同時查詢兩種記錄類型
4. **監控新記錄**: 確認修改後只產生 `type: "game"` 記錄

#### 🟢 **長期規劃**:
5. **資料遷移** (可選): 將舊的 activity-game 記錄轉換為 game 記錄
6. **建立資料驗證**: 定期檢查記錄格式一致性

---

## 📝 八、檢查清單

- [ ] 檢查所有遊戲組件是否使用 `trackGameResult()`
- [ ] 修改 CSV 匯出邏輯，清理 DynamoDB 格式
- [ ] 測試新的遊戲記錄是否正確儲存
- [ ] 建立能處理兩種格式的分析腳本
- [ ] 更新文檔說明正確的追蹤方式
- [ ] 考慮是否需要遷移歷史資料

---

**報告製作**: Claude Code
**技術支援**: 泰雅語學習平台開發團隊
