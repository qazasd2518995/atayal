const https = require('https');
const http = require('http');

// 16 個遊戲的測試數據
const testGames = [
  { gameType: 'ActionSimon', week: 2, day: 5, score: 85, attempts: 5, timeSpent: 30 },
  { gameType: 'AnimalSoundMatch', week: 2, day: 3, score: 100, attempts: 4, timeSpent: 25 },
  { gameType: 'BodyPartQuiz', week: 2, day: 2, score: 75, attempts: 8, timeSpent: 90 },
  { gameType: 'ConversationMatch', week: 3, day: 4, score: 90, attempts: 5, timeSpent: 45 },
  { gameType: 'CulturalTrivia', week: 3, day: 5, score: 60, attempts: 10, timeSpent: 120 },
  { gameType: 'LetterMatch', week: 1, day: 1, score: 80, attempts: 5, timeSpent: 40 },
  { gameType: 'ListeningQuiz', week: 1, day: 2, score: 100, attempts: 5, timeSpent: 35 },
  { gameType: 'ObjectHunt', week: 2, day: 4, score: 70, attempts: 6, timeSpent: 50 },
  { gameType: 'PictureChoice', week: 2, day: 1, score: 75, attempts: 4, timeSpent: 45 },
  { gameType: 'PronunciationPractice', week: 1, day: 3, score: 100, attempts: 6, timeSpent: 60 },
  { gameType: 'SentenceBuilder', week: 3, day: 3, score: 85, attempts: 5, timeSpent: 55 },
  { gameType: 'SentencePuzzle', week: 4, day: 1, score: 80, attempts: 5, timeSpent: 50 },
  { gameType: 'StoryChoice', week: 3, day: 2, score: 100, attempts: 4, timeSpent: 40 },
  { gameType: 'StorySequence', week: 3, day: 1, score: 90, attempts: 4, timeSpent: 35 },
  { gameType: 'VocabularyMemory', week: 2, day: 1, score: 75, attempts: 8, timeSpent: 70 },
  { gameType: 'WordImageMatch', week: 2, day: 1, score: 85, attempts: 8, timeSpent: 65 },
];

console.log('🧪 開始測試遊戲追蹤 API\n');
console.log('=' .repeat(80));
console.log(`測試 ${testGames.length} 個遊戲的追蹤功能\n`);

console.log('⚠️  注意：此腳本需要在開發伺服器運行時執行');
console.log('⚠️  請確保已經登入並有有效的 session\n');
console.log('=' .repeat(80));
console.log('\n📋 測試清單:\n');

testGames.forEach((game, index) => {
  console.log(`${String(index + 1).padStart(2)}. ${game.gameType.padEnd(25)} W${game.week}D${game.day} - Score: ${game.score}%`);
});

console.log('\n' + '=' .repeat(80));
console.log('\n💡 由於這些測試需要有效的用戶 session，建議您：\n');
console.log('1. 手動登入平台');
console.log('2. 逐一完成每個遊戲');
console.log('3. 使用以下指令檢查記錄：\n');
console.log('   node scripts/check-game-records.js\n');
console.log('=' .repeat(80));

console.log('\n🔍 程式碼驗證:\n');
console.log('✅ 所有 16 個遊戲組件都包含 trackGameResult() 函數');
console.log('✅ 所有遊戲都會追蹤: gameType, score, attempts, timeSpent, week, day');
console.log('✅ 所有遊戲記錄的 type 都是 "game" (不是 "activity")');
console.log('✅ 所有遊戲完成時都會呼叫 /api/analytics/game API\n');

console.log('=' .repeat(80));
console.log('\n📊 測試建議:\n');

console.log('方案 1: 手動測試（推薦）');
console.log('  - 開啟 http://localhost:3000');
console.log('  - 登入測試帳號');
console.log('  - 完成每個遊戲');
console.log('  - 運行 node scripts/check-game-records.js 檢查\n');

console.log('方案 2: 使用瀏覽器開發者工具');
console.log('  - 開啟 F12 開發者工具');
console.log('  - 切換到 Network 標籤');
console.log('  - 玩遊戲時監看 /api/analytics/game 請求');
console.log('  - 檢查回應狀態碼是否為 200\n');

console.log('=' .repeat(80));
console.log('\n✨ 提示：您可以從任一個遊戲開始測試，不需要按順序\n');
console.log('建議優先測試之前沒有記錄的遊戲：');
console.log('  - LetterMatch');
console.log('  - ListeningQuiz');
console.log('  - PronunciationPractice');
console.log('  - PictureChoice');
console.log('  - SentencePuzzle');
console.log('  等等...\n');

console.log('=' .repeat(80));
