# 🏔️ 泰雅語學習平台 (Atayal Learning Platform)

> 一個現代化的泰雅語線上學習平台，結合遊戲化學習、AI 助教和系統化課程設計

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)

## 📖 專案介紹

泰雅語學習平台是一個專為學習台灣原住民語言「泰雅語」而設計的互動式學習系統。平台採用現代化的教學方法，結合遊戲化學習、AI 助教和漸進式課程設計，讓學習者能夠有效地掌握泰雅語的發音、詞彙和語法。

### 🎯 專案目標

- **文化傳承**：保護和傳播珍貴的泰雅語文化
- **現代化教學**：運用科技提升語言學習效率
- **互動體驗**：透過遊戲化設計增加學習樂趣
- **系統化學習**：提供結構化的學習路徑

## ✨ 核心功能

### 📚 系統化課程
- **第 1 週：母音學習** - 掌握泰雅語 5 個基礎母音
- **第 2 週：子音學習** - 學習 18 個子音的發音技巧
- **第 3 週：詞彙學習** - 累積日常生活常用詞彙
- **第 4 週：對話練習** - 實際對話場景應用

### 🎵 發音教室
- **23 個字母音檔**：標準泰雅語發音示範
- **分類學習**：按母音、子音、特殊音素分組
- **重複練習**：支援音檔重複播放
- **發音指導**：詳細的發音要領說明

### 🎮 遊戲化學習
- **字母配對遊戲**：訓練字母與發音的關聯
- **圖片選擇遊戲**：強化詞彙記憶
- **句子拼圖遊戲**：練習語序和語法結構

### 🤖 AI 學習助教
- **即時問答**：24/7 泰雅語學習諮詢
- **智能回應**：根據問題類型提供專業建議
- **學習指導**：個人化學習路徑推薦
- **文化背景**：分享泰雅語的文化內涵

### 📊 進度追蹤
- **經驗值系統**：完成學習任務獲得 XP
- **學習進度**：視覺化顯示學習完成度
- **成就解鎖**：逐步解鎖新的學習內容
- **學習記錄**：本地保存學習歷程

## 🛠️ 技術架構

### 前端技術
- **框架**：Next.js 15.3.3 (App Router)
- **語言**：TypeScript 5.0
- **樣式**：Tailwind CSS 3.0
- **圖標**：Heroicons
- **狀態管理**：React Hooks + LocalStorage

### 後端 API
- **API 路由**：Next.js API Routes
- **AI 集成**：Hugging Face Inference API
- **模型**：DeepSeek-R1-0528

### 音檔處理
- **格式**：WebM (高品質壓縮)
- **來源**：標準泰雅語發音
- **優化**：快速載入與播放

### 開發工具
- **包管理器**：npm
- **構建工具**：Turbopack
- **代碼品質**：ESLint + TypeScript
- **版本控制**：Git

## 🚀 快速開始

### 系統需求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- 現代瀏覽器 (Chrome, Firefox, Safari, Edge)

### 安裝步驟

1. **克隆倉庫**
```bash
git clone https://github.com/qazasd2518995/atayal.git
cd atayal
```

2. **安裝依賴**
```bash
npm install
```

3. **環境配置**
```bash
# 創建環境變數檔案
cp .env.example .env.local

# 編輯環境變數 (可選)
# HF_TOKEN=your_hugging_face_token_here
```

4. **啟動開發伺服器**
```bash
npm run dev
```

5. **訪問應用**
```
打開瀏覽器訪問：http://localhost:3000
```

## 📁 專案結構

```
tayal-platform/
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   └── chat/             # AI 聊天 API
│   ├── pronunciation/        # 發音教室頁面
│   ├── week/                 # 週課程動態路由
│   ├── layout.tsx           # 全局布局
│   └── page.tsx             # 首頁
├── components/              # React 組件
│   ├── games/               # 遊戲組件
│   │   ├── LetterMatch.tsx  # 字母配對遊戲
│   │   ├── PictureChoice.tsx # 圖片選擇遊戲
│   │   └── SentencePuzzle.tsx # 句子拼圖遊戲
│   ├── AudioButton.tsx      # 音檔播放按鈕
│   ├── ChatWidget.tsx       # AI 聊天組件
│   ├── GameGate.tsx         # 遊戲門戶組件
│   ├── Quiz.tsx             # 測驗組件
│   └── XPBar.tsx            # 經驗值條組件
├── data/                    # 課程資料
│   ├── week1.ts            # 第一週課程資料
│   ├── week2.ts            # 第二週課程資料
│   ├── week3.ts            # 第三週課程資料
│   └── week4.ts            # 第四週課程資料
├── lib/                     # 工具函數
│   └── progress.ts          # 進度管理工具
├── public/                  # 靜態資源
│   └── alphabet/            # 泰雅語字母音檔
│       ├── a.webm          # 母音 a 音檔
│       ├── i.webm          # 母音 i 音檔
│       └── ...             # 其他 21 個字母音檔
├── .env.local              # 環境變數 (需自行創建)
├── .gitignore             # Git 忽略檔案
├── package.json           # 專案配置
├── tsconfig.json          # TypeScript 配置
└── tailwind.config.js     # Tailwind CSS 配置
```

## 🎯 使用指南

### 基礎學習流程

1. **開始學習**
   - 從首頁點擊「開始學習」
   - 選擇第 1 週第 1 天開始

2. **課程學習**
   - 觀看教材內容
   - 聆聽發音示範
   - 完成課程測驗

3. **遊戲練習**
   - 通過測驗後解鎖遊戲
   - 完成遊戲獲得經驗值
   - 累積經驗值解鎖下一關

4. **發音練習**
   - 使用發音教室功能
   - 按字母分類練習
   - 重複聆聽標準發音

5. **AI 助教**
   - 點擊聊天按鈕開啟助教
   - 詢問學習相關問題
   - 獲得個人化學習建議

### 進階功能

- **進度追蹤**：查看學習完成度和經驗值
- **重複學習**：已完成的課程可重複練習
- **離線記錄**：學習進度本地保存，無需登入

## 🔧 開發指南

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 構建生產版本
npm run build

# 啟動生產伺服器
npm start

# 代碼檢查
npm run lint
```

### 添加新課程

1. 在 `data/` 目錄創建新的週課程檔案
2. 按照現有格式定義課程結構
3. 添加對應的音檔到 `public/alphabet/`
4. 更新首頁的課程導航

### 自定義遊戲

1. 在 `components/games/` 創建新遊戲組件
2. 實現 `GameProps` 介面
3. 在 `GameGate.tsx` 中註冊新遊戲
4. 測試遊戲功能和流程

### API 擴展

1. 在 `app/api/` 目錄創建新的 API 路由
2. 使用 Next.js 13+ App Router 語法
3. 添加適當的錯誤處理和驗證
4. 更新相關組件以使用新 API

## 🚀 部署指南

### Vercel 部署 (推薦)

1. **連接 GitHub**
   - 登入 [Vercel](https://vercel.com)
   - 匯入 GitHub 倉庫

2. **環境配置**
   - 在 Vercel 設定環境變數
   - `HF_TOKEN`: Hugging Face API Token (可選)

3. **自動部署**
   - 推送到 main 分支自動觸發部署
   - 獲得生產環境 URL

### 其他部署平台

- **Netlify**: 支援靜態站點部署
- **Railway**: 支援全棧應用部署
- **DigitalOcean**: 支援容器化部署

## 🤝 貢獻指南

我們歡迎各種形式的貢獻！

### 貢獻方式

- **回報問題**：發現 bug 或提出改善建議
- **功能建議**：提出新功能或改進想法
- **代碼貢獻**：修復問題或新增功能
- **文檔改善**：改進文檔說明或翻譯
- **測試協助**：協助測試新功能或修復

### 開發流程

1. Fork 本倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 創建 Pull Request

### 代碼規範

- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 配置的代碼風格
- 撰寫清晰的提交訊息
- 為新功能添加適當的測試

## 📝 更新日誌

### v1.0.0 (2024-06-11)
- ✨ 完整的 4 週泰雅語學習課程
- 🎵 23 個字母發音教室
- 🎮 三種遊戲化學習模式
- 🤖 AI 學習助教功能
- 📊 經驗值和進度追蹤系統
- 📱 響應式設計支援移動設備

## 🙏 致謝

- **泰雅族文化工作者**：提供珍貴的語言資料和文化指導
- **語言學專家**：協助課程設計和發音標準制定
- **開源社群**：提供優秀的技術框架和工具
- **測試使用者**：提供寶貴的使用反饋和改進建議

## 📄 授權資訊

本專案採用 MIT 授權條款。詳細內容請參見 [LICENSE](LICENSE) 檔案。

## 📞 聯絡資訊

- **專案維護者**：Justin Cheng
- **GitHub**：[@qazasd2518995](https://github.com/qazasd2518995)
- **專案倉庫**：[atayal](https://github.com/qazasd2518995/atayal)

---

**⭐ 如果這個專案對您有幫助，請給我們一個星星！**

**🌱 讓我們一起保護和傳承珍貴的泰雅語文化！**
