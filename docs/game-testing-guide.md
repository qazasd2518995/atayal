# 🎮 遊戲追蹤功能測試指南

**測試日期**: 2025-10-28
**目的**: 驗證所有 16 個遊戲都能正確追蹤並儲存到資料庫

---

## ✅ 檢查結果

### 程式碼檢查

所有 **16 個遊戲組件**都已經包含 `trackGameResult()` 追蹤功能 ✅

```
1. ✅ ActionSimon.tsx
2. ✅ AnimalSoundMatch.tsx
3. ✅ BodyPartQuiz.tsx
4. ✅ ConversationMatch.tsx
5. ✅ CulturalTrivia.tsx
6. ✅ LetterMatch.tsx
7. ✅ ListeningQuiz.tsx
8. ✅ ObjectHunt.tsx
9. ✅ PictureChoice.tsx
10. ✅ PronunciationPractice.tsx
11. ✅ SentenceBuilder.tsx
12. ✅ SentencePuzzle.tsx
13. ✅ StoryChoice.tsx
14. ✅ StorySequence.tsx
15. ✅ VocabularyMemory.tsx
16. ✅ WordImageMatch.tsx
```

---

## 🎯 遊戲測試清單

請依照以下清單逐一測試每個遊戲，確認資料是否正確存入資料庫。

### **第 1 週 - 字母與發音**

| 遊戲 | 位置 | 遊戲類型 | 測試狀態 |
|------|------|----------|----------|
| 字母配對遊戲 | 第1週 第1天 | LetterMatch | ⏳ 待測試 |
| 聽力測驗 | 第1週 第2天 | ListeningQuiz | ⏳ 待測試 |
| 發音練習 | 第1週 第3天 | PronunciationPractice | ⏳ 待測試 |
| 字母配對遊戲 | 第1週 第4天 | LetterMatch | ⏳ 待測試 |
| 聽力測驗 | 第1週 第5天 | ListeningQuiz | ⏳ 待測試 |

### **第 2 週 - 生活主題單字**

| 遊戲 | 位置 | 遊戲類型 | 測試狀態 |
|------|------|----------|----------|
| 圖文配對遊戲 | 第2週 第1天 | WordImageMatch | ⏳ 待測試 |
| 身體部位測驗 | 第2週 第2天 | BodyPartQuiz | ⏳ 待測試 |
| 動物聲音配對 | 第2週 第3天 | AnimalSoundMatch | ⏳ 待測試 |
| 物品尋找遊戲 | 第2週 第4天 | ObjectHunt | ⏳ 待測試 |
| 動作指令遊戲 | 第2週 第5天 | ActionSimon | ⏳ 待測試 |

### **第 3 週 - 神話故事與對話**

| 遊戲 | 位置 | 遊戲類型 | 測試狀態 |
|------|------|----------|----------|
| 故事順序排列 | 第3週 第1天 | StorySequence | ⏳ 待測試 |
| 故事選擇題 | 第3週 第2天 | StoryChoice | ⏳ 待測試 |
| 句子建造器 | 第3週 第3天 | SentenceBuilder | ⏳ 待測試 |
| 對話配對 | 第3週 第4天 | ConversationMatch | ⏳ 待測試 |
| 文化知識問答 | 第3週 第5天 | CulturalTrivia | ⏳ 待測試 |

### **其他遊戲（未在特定課程中）**

| 遊戲類型 | 測試狀態 | 備註 |
|----------|----------|------|
| PictureChoice | ⏳ 待測試 | 看圖選詞遊戲 |
| SentencePuzzle | ⏳ 待測試 | 句子拼組遊戲 |
| VocabularyMemory | ⏳ 待測試 | 詞彙記憶遊戲 |

---

## 📝 測試步驟

### 1. 準備測試環境

```bash
# 確保開發伺服器正在運行
npm run dev

# 開啟瀏覽器訪問
http://localhost:3000
```

### 2. 測試單個遊戲

1. **登入平台**
   - 使用測試帳號登入

2. **進入課程**
   - 選擇對應的週次和天數
   - 點擊「開始遊戲」按鈕

3. **完成遊戲**
   - 玩完整個遊戲
   - 注意記錄：
     - 遊戲開始時間
     - 遊戲結束時間
     - 最終分數

4. **檢查資料庫記錄**
   ```bash
   # 執行檢查腳本
   node scripts/check-game-records.js
   ```

5. **驗證記錄內容**
   - ✅ type 應該是 `"game"`（不是 `"activity"`）
   - ✅ gameType 應該正確（例如 `"LetterMatch"`）
   - ✅ score 應該有值（0-100）
   - ✅ timeSpent 應該有值（秒數）
   - ✅ attempts 應該有值（題目數量）
   - ✅ week 和 day 應該正確

---

## 🔍 驗證資料格式

### 正確的遊戲記錄格式

```json
{
  "PK": "USER#用戶名#GAME#2025-10-28T12:30:00.000Z#LetterMatch#W1D1",
  "SK": "GAME#2025-10-28T12:30:00.000Z",
  "type": "game",          ✅ 必須是 "game"
  "gameType": "LetterMatch", ✅ 遊戲類型名稱
  "userName": "測試用戶",
  "week": 1,               ✅ 週數
  "day": 1,                ✅ 天數
  "score": 80,             ✅ 分數 (0-100)
  "attempts": 5,           ✅ 嘗試次數
  "timeSpent": 45,         ✅ 花費時間（秒）
  "timestamp": "2025-10-28T12:30:00.000Z"
}
```

### ❌ 錯誤的記錄格式（舊版）

```json
{
  "type": "activity",           ❌ 不應該是 "activity"
  "activityType": "game",       ❌ 不應該用 activityType
  "details": "{...}",           ❌ 資料不應該埋在 details 裡
  "duration": 0                 ❌ 應該用 timeSpent
}
```

---

## 🛠️ 檢查工具使用

### 1. 檢查所有遊戲記錄

```bash
node scripts/check-game-records.js
```

**輸出內容**:
- 總記錄數
- 遊戲記錄數量（type: "game"）
- 各遊戲類型統計
- 平均分數和時間
- 最近 10 筆記錄
- 問題報告

### 2. 匯出資料庫到 CSV

```bash
node scripts/export-to-csv.js
```

**輸出位置**: `exports/atayal-export-YYYY-MM-DDTHH-MM-SS.csv`

### 3. 檢查特定用戶

```bash
node scripts/check-assessment-detail.js 用戶名
```

---

## ✅ 測試通過標準

每個遊戲測試通過需滿足：

1. ✅ 遊戲可以正常啟動和運行
2. ✅ 遊戲可以完整玩完
3. ✅ 完成後有顯示分數
4. ✅ 資料庫中出現新記錄
5. ✅ 記錄的 `type` 是 `"game"`
6. ✅ 記錄包含 `score`、`timeSpent`、`attempts`
7. ✅ `week` 和 `day` 正確
8. ✅ 沒有報錯或異常

---

## 📊 目前資料庫狀態

### 最近檢查結果（2025-10-28）

```
總記錄數: 1088
遊戲記錄 (type: "game"): 6 筆

已有遊戲記錄的類型:
- StoryChoice: 1 筆 ✅
- CulturalTrivia: 1 筆 ✅
- BodyPartQuiz: 1 筆 ✅
- StorySequence: 1 筆 ✅
- WordImageMatch: 1 筆 ✅
- AnimalSoundMatch: 1 筆 ✅

所有現有記錄都包含完整的分數和時間資料 ✅
```

**注意**: 這些是修正之前的舊記錄，現在需要測試新修正的遊戲。

---

## 🐛 常見問題排查

### 問題 1: 遊戲完成後沒有記錄

**可能原因**:
- 網路連線問題
- API 端點錯誤
- AWS 憑證問題

**檢查方法**:
1. 開啟瀏覽器開發者工具（F12）
2. 查看 Network 標籤
3. 找到 `/api/analytics/game` 請求
4. 檢查回應狀態碼

### 問題 2: 記錄的 type 不是 "game"

**可能原因**:
- 使用了錯誤的追蹤函數
- 調用了 `trackActivity('game')` 而不是 `trackGameResult()`

**解決方法**:
- 檢查遊戲組件中是否正確引入和使用 `trackGameResult()`

### 問題 3: score 或 timeSpent 為空

**可能原因**:
- 沒有正確計算分數或時間
- startTime 沒有初始化

**解決方法**:
- 檢查遊戲組件的 `startTime` state
- 確認在遊戲完成時正確計算

---

## 📋 測試記錄表

請在測試時填寫此表：

| 日期 | 測試者 | 遊戲名稱 | 週/天 | 結果 | 備註 |
|------|--------|----------|-------|------|------|
| | | | | ⏳/✅/❌ | |
| | | | | ⏳/✅/❌ | |
| | | | | ⏳/✅/❌ | |

---

## 🎉 測試完成後

當所有 16 個遊戲測試通過後：

1. ✅ 所有遊戲都能正確追蹤
2. ✅ 資料庫格式統一
3. ✅ 可以進行準確的學習分析
4. ✅ 用戶學習數據完整

---

**文檔建立**: 2025-10-28
**維護者**: 泰雅語學習平台開發團隊
**最後更新**: 修正所有遊戲追蹤功能後
