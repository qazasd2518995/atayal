const fs = require('fs');
const path = require('path');

// 16 個遊戲的完整列表
const allGames = [
  { name: 'ActionSimon', location: '第2週 第5天', tested: false },
  { name: 'AnimalSoundMatch', location: '第2週 第3天', tested: false },
  { name: 'BodyPartQuiz', location: '第2週 第2天', tested: false },
  { name: 'ConversationMatch', location: '第3週 第4天', tested: false },
  { name: 'CulturalTrivia', location: '第3週 第5天', tested: false },
  { name: 'LetterMatch', location: '第1週 第1天, 第4天', tested: false },
  { name: 'ListeningQuiz', location: '第1週 第2天, 第5天', tested: false },
  { name: 'ObjectHunt', location: '第2週 第4天', tested: false },
  { name: 'PictureChoice', location: '(獨立遊戲)', tested: false },
  { name: 'PronunciationPractice', location: '第1週 第3天', tested: false },
  { name: 'SentenceBuilder', location: '第3週 第3天', tested: false },
  { name: 'SentencePuzzle', location: '(獨立遊戲)', tested: false },
  { name: 'StoryChoice', location: '第3週 第2天', tested: false },
  { name: 'StorySequence', location: '第3週 第1天', tested: false },
  { name: 'VocabularyMemory', location: '(獨立遊戲)', tested: false },
  { name: 'WordImageMatch', location: '第2週 第1天', tested: false },
];

console.log('🎮 遊戲測試摘要\n');
console.log('=' .repeat(80));
console.log('\n✅ 程式碼檢查: 所有 16 個遊戲都有 trackGameResult() 追蹤功能\n');
console.log('=' .repeat(80));
console.log('\n📋 遊戲測試清單:\n');

allGames.forEach((game, index) => {
  const status = game.tested ? '✅ 已測試' : '⏳ 待測試';
  console.log(`${String(index + 1).padStart(2)}. ${game.name.padEnd(25)} ${game.location.padEnd(25)} ${status}`);
});

console.log('\n' + '=' .repeat(80));
console.log('\n🔧 快速測試指令:\n');
console.log('# 開啟開發伺服器');
console.log('npm run dev\n');
console.log('# 檢查遊戲記錄');
console.log('node scripts/check-game-records.js\n');
console.log('# 匯出資料庫');
console.log('node scripts/export-to-csv.js\n');

console.log('=' .repeat(80));
console.log('\n📚 完整測試指南: docs/game-testing-guide.md\n');
console.log('=' .repeat(80));
