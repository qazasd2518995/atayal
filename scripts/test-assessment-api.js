// 測試課前測驗 API
async function testPreAssessment() {
  console.log('🧪 測試課前測驗 API...\n');

  const testData = {
    userName: 'test-api',
    assessmentType: 'pre',
    score: 75,
    totalQuestions: 30,
    correctAnswers: 22,
    answers: [
      { questionId: 'a1', userAnswer: '5個', correct: true },
      { questionId: 'a2', userAnswer: '19個', correct: true },
      { questionId: 'a3', userAnswer: '聲門突然閉合再打開', correct: true },
    ],
    completedAt: new Date().toISOString(),
    timeTaken: 120
  };

  try {
    const response = await fetch('http://localhost:3001/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('✅ 課前測驗儲存成功！');
    console.log('   資料庫分類 (type):', result.data.type);
    console.log('   測驗類型 (assessmentType):', result.data.assessmentType);
    console.log('   用戶名稱:', result.data.userName);
    console.log('   分數:', result.data.score);
    console.log('\n');

    return result.data;
  } catch (error) {
    console.error('❌ 課前測驗儲存失敗:', error);
  }
}

// 測試課後測驗 API
async function testPostAssessment() {
  console.log('🧪 測試課後測驗 API...\n');

  const testData = {
    userName: 'test-api',
    assessmentType: 'post',
    score: 90,
    totalQuestions: 30,
    correctAnswers: 27,
    answers: [
      { questionId: 'a1', userAnswer: '5個', correct: true },
      { questionId: 'a2', userAnswer: '19個', correct: true },
      { questionId: 'a3', userAnswer: '聲門突然閉合再打開', correct: true },
    ],
    completedAt: new Date().toISOString(),
    timeTaken: 90
  };

  try {
    const response = await fetch('http://localhost:3001/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('✅ 課後測驗儲存成功！');
    console.log('   資料庫分類 (type):', result.data.type);
    console.log('   測驗類型 (assessmentType):', result.data.assessmentType);
    console.log('   用戶名稱:', result.data.userName);
    console.log('   分數:', result.data.score);
    console.log('\n');

    return result.data;
  } catch (error) {
    console.error('❌ 課後測驗儲存失敗:', error);
  }
}

// 執行測試
async function runTests() {
  console.log('=' .repeat(80));
  console.log('🚀 開始測試測驗 API');
  console.log('=' .repeat(80));
  console.log('\n');

  await testPreAssessment();
  await testPostAssessment();

  console.log('=' .repeat(80));
  console.log('✅ 測試完成！請執行以下命令查看資料庫記錄：');
  console.log('   node scripts/check-assessment.js');
  console.log('=' .repeat(80));
}

runTests();
