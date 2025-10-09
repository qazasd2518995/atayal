# 泰雅語學習平台 - 數據分析追蹤系統

## 📊 系統概述

此分析追蹤系統會自動記錄學生的所有學習活動並儲存到 AWS DynamoDB（ap-southeast-2, table: atayal）。

## 📈 追蹤的數據指標

### 0. 學習進度持久化
- **當前週次**: 學生目前解鎖到的週次
- **當前天數**: 學生目前解鎖到的天數
- **完成記錄**: 已完成的所有課程（週-天格式）
- **總經驗值**: 學生累計獲得的經驗值
- **等級**: 根據經驗值計算的等級
- **最後更新時間**: 進度最後更新的時間戳記

### 1. 登入/登出記錄
- **登入時間**: 學生每次訪問平台的時間戳記
- **登出時間**: 學生離開平台的時間戳記
- **登入次數**: 累計登入總次數
- **使用時長**: 每次 session 的總時長（分鐘）

### 2. 活動時長分類
- **學習時長**: 閱讀課程內容的時間（分鐘）
- **測驗時長**: 進行課後測驗的時間（分鐘）
- **遊戲時長**: 玩遊戲關卡的時間（分鐘）
- **發音練習時長**: 練習發音的時間（分鐘）

### 3. 課程完成記錄
- **完成課程數量**: 累計完成的課程數
- **完成時間**: 每個課程的完成時間戳記
- **獲得 XP**: 每次完成課程獲得的經驗值

### 4. 測驗成績
- **測驗次數**: 累計參加測驗次數
- **測驗分數**: 每次測驗的得分（0-100）
- **正確率**: 答對題數 / 總題數
- **答對題數**: 每次測驗答對的題目數量
- **測驗時間**: 每次測驗花費的時間（秒）

### 5. 遊戲成績
- **遊戲次數**: 累計玩遊戲次數
- **遊戲類型**: 遊戲名稱（LetterMatch, VocabularyMemory 等）
- **遊戲分數**: 每次遊戲的得分（0-100）
- **嘗試次數**: 某些遊戲記錄的嘗試次數
- **遊戲時間**: 每次遊戲花費的時間（秒）

### 6. 發音練習記錄
- **練習次數**: 累計發音練習次數
- **練習字母/單字**: 練習的具體內容
- **練習分數**: 發音準確度評分（如有）
- **練習嘗試數**: 每個字母/單字的練習次數

### 7. LLM 聊天對話記錄
- **學生輸入**: 學生向 AI 助教提出的問題
- **LLM 輸出**: AI 助教的回應內容
- **學生名稱**: 提問的學生姓名
- **時間點**: 對話發生的時間戳記
- **LLM 來源**: 使用的 AI 模型（groq 或 fallback）
- **聊天次數**: 累計與 AI 助教對話次數

## 🗄️ DynamoDB 數據結構

### 表名: `atayal`
### 區域: `ap-southeast-2`

### 主鍵設計
- **atayal (Partition Key)**: 複合鍵，根據記錄類型不同：
  - `USER#{userName}#PROGRESS` - 學習進度（當前週次、天數、完成記錄、經驗值等）
  - `USER#{userName}#SESSION#{sessionId}` - 登入/登出記錄
  - `USER#{userName}#ACTIVITY#{timestamp}#{activityType}` - 活動時長記錄
  - `USER#{userName}#QUIZ#{timestamp}#W{week}D{day}` - 測驗成績
  - `USER#{userName}#GAME#{timestamp}#{gameType}#W{week}D{day}` - 遊戲成績
  - `USER#{userName}#PRONUNCIATION#{timestamp}` - 發音練習記錄
  - `USER#{userName}#COMPLETION#{timestamp}#W{week}D{day}` - 課程完成記錄
  - `USER#{userName}#CHAT#{timestamp}` - LLM 聊天對話記錄
  - `USER#{userName}#STATS` - 用戶統計匯總
- **無 Sort Key**: 此表使用單一主鍵設計

### 用戶學習進度 (PROGRESS)
```json
{
  "atayal": "USER#學生姓名#PROGRESS",
  "type": "progress",
  "userName": "學生姓名",
  "currentWeek": 2,
  "currentDay": 3,
  "completedDays": {
    "1-1": true,
    "1-2": true,
    "1-3": true,
    "1-4": true,
    "1-5": true,
    "2-1": true,
    "2-2": true
  },
  "totalXP": 700,
  "level": 7,
  "lastUpdated": "2025-10-09T12:00:00.000Z"
}
```

### 用戶統計匯總 (STATS)
```json
{
  "atayal": "USER#學生姓名#STATS",
  "type": "stats",
  "userName": "學生姓名",
  "loginCount": 10,
  "lastLoginTime": "2025-10-09T10:30:00.000Z",
  "learningDuration": 120,
  "quizDuration": 45,
  "gameDuration": 60,
  "pronunciationDuration": 30,
  "quizCount": 15,
  "totalQuizScore": 1350,
  "gameCount": 15,
  "totalGameScore": 1400,
  "pronunciationCount": 50,
  "totalPronunciationScore": 4500,
  "completedCourses": 15,
  "totalXP": 1350,
  "lastCompletionTime": "2025-10-09T12:00:00.000Z",
  "chatCount": 25,
  "lastChatTime": "2025-10-09T14:30:00.000Z"
}
```

## 🔧 技術實現

### 核心文件

1. **`lib/dynamodb.ts`**: DynamoDB 客戶端配置
2. **`lib/analytics.ts`**: 前端追蹤工具函數
3. **`lib/progress.ts`**: 學習進度管理（包含雲端同步）
4. **`app/api/analytics/`**: 後端 API 路由
   - `session/route.ts`: 登入/登出追蹤
   - `activity/route.ts`: 活動時長追蹤
   - `quiz/route.ts`: 測驗成績追蹤
   - `game/route.ts`: 遊戲成績追蹤
   - `pronunciation/route.ts`: 發音練習追蹤
   - `completion/route.ts`: 課程完成追蹤
   - `chat/route.ts`: LLM 聊天對話追蹤
5. **`app/api/user/progress/route.ts`**: 用戶進度保存/載入 API

### 追蹤點整合

#### 1. 主頁面 (`app/page.tsx`)
- **進度載入**：用戶輸入名字後，自動從 DynamoDB 載入進度
  - 新用戶：建立新進度並保存到雲端
  - 舊用戶：載入雲端進度並恢復到本地
- **登入追蹤**：用戶進入平台時
- **登出追蹤**：用戶離開平台時（beforeunload 事件）

#### 2. 課程頁面 (`app/week/[week]/[day]/page.tsx`)
- 學習時長追蹤：使用 `ActivityTimer` 計算頁面停留時間
- 課程完成追蹤：遊戲完成後觸發

#### 3. 測驗組件 (`components/Quiz.tsx`)
- 測驗時長追蹤：使用 `ActivityTimer`
- 測驗成績追蹤：測驗完成時記錄分數、正確率、時間

#### 4. 遊戲組件 (如 `components/games/VocabularyMemory.tsx`)
- 遊戲時長追蹤：使用 `ActivityTimer`
- 遊戲成績追蹤：遊戲完成時記錄分數、嘗試次數、時間

#### 5. 聊天組件 (`components/ChatWidget.tsx`)
- LLM 對話追蹤：每次學生與 AI 助教對話時自動記錄
- 記錄學生輸入、AI 回應、LLM 來源（Groq 或 fallback）
- 自動累計聊天次數

## 🔑 環境變數配置

在 `.env.local` 文件中設置：

```env
AWS_ACCESS_KEY_ID=你的AWS訪問密鑰ID
AWS_SECRET_ACCESS_KEY=你的AWS秘密訪問密鑰
AWS_REGION=ap-southeast-2
```

## 📊 數據查詢範例

### 查詢特定學生的所有記錄
使用 Scan 操作配合 FilterExpression：
```
FilterExpression: begins_with(atayal, :userName)
ExpressionAttributeValues: { ":userName": "USER#學生姓名#" }
```

### 查詢特定學生的統計資料
```
Key: { atayal: "USER#學生姓名#STATS" }
```

### 查詢特定學生的所有測驗記錄
使用 Scan 操作配合 FilterExpression：
```
FilterExpression: begins_with(atayal, :prefix) AND #type = :type
ExpressionAttributeNames: { "#type": "type" }
ExpressionAttributeValues: {
  ":prefix": "USER#學生姓名#QUIZ#",
  ":type": "quiz"
}
```

### 查詢特定學生的所有遊戲記錄
使用 Scan 操作配合 FilterExpression：
```
FilterExpression: begins_with(atayal, :prefix) AND #type = :type
ExpressionAttributeNames: { "#type": "type" }
ExpressionAttributeValues: {
  ":prefix": "USER#學生姓名#GAME#",
  ":type": "game"
}
```

### 查詢特定學生的所有聊天記錄
使用 Scan 操作配合 FilterExpression：
```
FilterExpression: begins_with(atayal, :prefix) AND #type = :type
ExpressionAttributeNames: { "#type": "type" }
ExpressionAttributeValues: {
  ":prefix": "USER#學生姓名#CHAT#",
  ":type": "chat"
}
```

## 🎯 使用方式

系統已完全自動化，無需手動操作。當學生使用平台時，所有活動會自動記錄：

1. **首次訪問**:
   - 輸入姓名後系統檢查 DynamoDB
   - 如果是新名字：建立新學習進度
   - 如果是舊名字：載入上次的進度（週次、天數、經驗值、等級等）
2. **學習活動**: 瀏覽課程內容時自動計時
3. **進度更新**: 每次完成課程、獲得經驗值時自動同步到 DynamoDB
4. **測驗**: 完成測驗時自動記錄成績
5. **遊戲**: 完成遊戲時自動記錄成績
6. **AI 對話**: 與 AI 助教聊天時自動記錄對話內容
7. **登出**: 關閉瀏覽器時自動記錄登出時間

## 📱 API 端點

所有 API 端點都是內部使用，前端自動調用：

- `GET /api/user/progress?userName={name}` - 載入用戶進度
- `POST /api/user/progress` - 保存用戶進度
- `GET /api/leaderboard` - 獲取排行榜數據
- `POST /api/analytics/session` - 登入/登出追蹤
- `POST /api/analytics/activity` - 活動時長追蹤
- `POST /api/analytics/quiz` - 測驗成績追蹤
- `POST /api/analytics/game` - 遊戲成績追蹤
- `POST /api/analytics/pronunciation` - 發音練習追蹤
- `POST /api/analytics/completion` - 課程完成追蹤
- `POST /api/analytics/chat` - LLM 聊天對話追蹤

## ⚠️ 注意事項

1. **名字即帳號**: 學生的名字作為唯一識別，必須完全相同才能載入進度
2. **隱私保護**: 所有數據僅用於教育分析，請遵守隱私法規
3. **網絡連接**: 追蹤功能需要網絡連接，離線時數據會遺失
4. **Session 管理**: 使用 sessionStorage 存儲當前 session ID
5. **雙重儲存**: 進度同時保存在本地（localStorage）和雲端（DynamoDB）
6. **自動同步**: 每次進度更新都會自動同步到雲端
7. **錯誤處理**: 即使追蹤失敗，不會影響學習平台的正常使用

## 🏆 排行榜功能

平台包含即時排行榜，顯示所有學生的學習進度：

### 排行規則
1. **等級優先**: 等級高的學生排名靠前
2. **經驗值次之**: 等級相同時，經驗值高的學生排名靠前
3. **即時更新**: 排行榜每 30 秒自動刷新一次

### 顯示內容
- **排名**: 前三名顯示金、銀、銅獎牌圖標
- **學生名字**: 當前用戶會有藍色高亮標記
- **等級與經驗值**: 顯示每位學生的等級和總經驗值
- **學習進度**: 顯示當前學習週次、天數
- **完成課程數**: 顯示已完成的課程總數
- **排名徽章**: 前三名有特殊的漸層色彩徽章

### 設計特色
- 符合遊戲化風格，使用獎牌、星星、火焰等圖標
- 前三名有特殊視覺效果（漸層背景、獎牌圖標）
- 當前用戶會有藍色邊框高亮，方便快速找到自己
- 只顯示前 10 名學生（如果超過 10 位）

## 🚀 未來擴展

可以基於這些數據開發：
- 學習進度儀表板
- 個人化學習建議
- 班級成績統計
- 學習行為分析
- 預測模型（學習成效預測）
- AI 對話分析（常見問題、學習痛點分析）
- 學習路徑優化建議
- 更多排行榜類別（每週進步最快、連續登入天數等）
