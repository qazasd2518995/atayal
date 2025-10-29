'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface WordImageMatchProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 家庭成員詞彙數據
const familyData = [
  { tayal: "yaba'", meaning: '爸爸', emoji: '👨' },
  { tayal: "yaya'", meaning: '媽媽', emoji: '👩' },
  { tayal: 'yutas', meaning: '祖父/外公', emoji: '👴' },
  { tayal: "yaki'", meaning: '祖母/外婆', emoji: '👵' },
  { tayal: 'qbsuyan kneril', meaning: '姊姊', emoji: '👧' },
  { tayal: 'qbsuyan mlikuy', meaning: '哥哥', emoji: '👦' },
  { tayal: "sswe' mlikuy", meaning: '弟弟', emoji: '🧒' },
  { tayal: "sswe' kneril", meaning: '妹妹', emoji: '👧🏻' },
];

export default function WordImageMatch({ onFinish, week, day }: WordImageMatchProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questions, setQuestions] = useState<Array<{ correct: typeof familyData[0]; options: typeof familyData }>>([]);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalRounds = 8;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 生成題目
    const qs: typeof questions = [];
    const shuffledData = shuffleArray(familyData);

    for (let i = 0; i < totalRounds; i++) {
      const correct = shuffledData[i % familyData.length];
      const wrongOptions = familyData.filter(item => item.tayal !== correct.tayal);
      const selectedWrong = shuffleArray(wrongOptions).slice(0, 3);
      const allOptions = shuffleArray([correct, ...selectedWrong]);

      qs.push({ correct, options: allOptions });
    }

    setQuestions(qs);

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'WordImageMatch', completed: false });
      }
    };
  }, [week, day]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === questions[currentRound].correct.tayal;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentRound + 1 >= totalRounds) {
        setGameCompleted(true);

        // 追蹤遊戲成績
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / totalRounds) * 100);

        trackGameResult({
          week,
          day,
          gameType: 'WordImageMatch',
          score: finalScore,
          attempts: totalRounds,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'WordImageMatch', completed: true, score: finalScore });
        }
      } else {
        setCurrentRound(prev => prev + 1);
        setSelectedAnswer('');
        setShowResult(false);
      }
    }, 2000);
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / totalRounds) * 100);
    onFinish(score >= totalRounds * 0.5, finalScore);
  };

  const handleRetry = () => {
    setCurrentRound(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    setGameCompleted(false);

    // 重新生成題目
    const qs: typeof questions = [];
    const shuffledData = shuffleArray(familyData);

    for (let i = 0; i < totalRounds; i++) {
      const correct = shuffledData[i % familyData.length];
      const wrongOptions = familyData.filter(item => item.tayal !== correct.tayal);
      const selectedWrong = shuffleArray(wrongOptions).slice(0, 3);
      const allOptions = shuffleArray([correct, ...selectedWrong]);

      qs.push({ correct, options: allOptions });
    }

    setQuestions(qs);
  };

  if (!questions.length) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4">正在準備題目…</p>
      </div>
    );
  }

  if (gameCompleted) {
    const finalScore = Math.round((score / totalRounds) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          {passed ? '太棒了！' : '繼續加油！'}
        </h3>
        <p className="text-lg mb-6 text-gray-900">
          答對 <strong className="text-green-600">{score}</strong> / {totalRounds} 題
          <br />
          正確率：<strong className="text-blue-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要正確率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h4 className="font-semibold mb-3 text-center text-gray-900">詞彙複習：</h4>
          <div className="grid grid-cols-2 gap-3">
            {familyData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-blue-600 text-sm">{item.tayal}</div>
                  <div className="text-gray-600 text-xs">{item.meaning}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50"
          >
            重新挑戰
          </button>
          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            完成遊戲
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentRound];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">家庭成員詞彙配對</h2>
        <div className="text-sm text-gray-800 font-medium mb-3">
          第 {currentRound + 1} / {totalRounds} 題，得分 {score}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-center mb-4 text-gray-800 font-medium">請選擇正確的圖片配對：</p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {currentQuestion.correct.tayal}
          </div>
        </div>

        {showResult && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              selectedAnswer === currentQuestion.correct.tayal
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {selectedAnswer === currentQuestion.correct.tayal ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <XMarkIcon className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {selectedAnswer === currentQuestion.correct.tayal ? '正確！' : '錯誤！'}
              </span>
            </div>
            {selectedAnswer !== currentQuestion.correct.tayal && (
              <p className="text-sm text-center mt-1">
                正確答案是：{currentQuestion.correct.emoji} {currentQuestion.correct.meaning}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option) => (
          <button
            key={option.tayal}
            onClick={() => handleAnswerSelect(option.tayal)}
            disabled={showResult}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedAnswer === option.tayal
                ? showResult
                  ? option.tayal === currentQuestion.correct.tayal
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-5xl mb-2">{option.emoji}</div>
            <div className="text-sm font-semibold text-gray-700">{option.meaning}</div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showResult}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          確認答案
        </button>
      </div>
    </div>
  );
}
