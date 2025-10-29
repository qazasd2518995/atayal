'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface BodyPartQuizProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 身體部位數據
const bodyParts = [
  { tayal: 'papak', meaning: '耳朵', emoji: '👂', position: { top: '20%', left: '15%' } },
  { tayal: 'roziq', meaning: '眼睛', emoji: '👁️', position: { top: '25%', left: '40%' } },
  { tayal: 'nqwaq', meaning: '嘴巴', emoji: '👄', position: { top: '45%', left: '50%' } },
  { tayal: 'tunux', meaning: '頭', emoji: '🗣️', position: { top: '10%', left: '50%' } },
  { tayal: 'nguhuw', meaning: '鼻子', emoji: '👃', position: { top: '35%', left: '50%' } },
  { tayal: 'qba\'', meaning: '手', emoji: '✋', position: { top: '60%', left: '20%' } },
  { tayal: 'kakay', meaning: '腳', emoji: '🦵', position: { top: '85%', left: '50%' } },
  { tayal: 'rqyas', meaning: '臉', emoji: '😊', position: { top: '30%', left: '50%' } },
];

export default function BodyPartQuiz({ onFinish, week, day }: BodyPartQuizProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questions, setQuestions] = useState<typeof bodyParts>([]);
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
    const shuffled = shuffleArray(bodyParts);
    setQuestions(shuffled.slice(0, totalRounds));

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'BodyPartQuiz', completed: false });
      }
    };
  }, [week, day]);

  const handlePartClick = (partTayal: string) => {
    if (showResult) return;
    setSelectedPart(partTayal);
  };

  const handleSubmit = () => {
    if (!selectedPart) return;

    const isCorrect = selectedPart === questions[currentRound].tayal;
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
          gameType: 'BodyPartQuiz',
          score: finalScore,
          attempts: totalRounds,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'BodyPartQuiz', completed: true, score: finalScore });
        }
      } else {
        setCurrentRound(prev => prev + 1);
        setSelectedPart('');
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
    setSelectedPart('');
    setShowResult(false);
    setGameCompleted(false);

    // 重新生成題目
    const shuffled = shuffleArray(bodyParts);
    setQuestions(shuffled.slice(0, totalRounds));
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
        <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>
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
          <h4 className="font-semibold mb-3 text-center text-gray-900">身體部位複習：</h4>
          <div className="grid grid-cols-2 gap-3">
            {bodyParts.map((part, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="text-2xl">{part.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-blue-600 text-sm">{part.tayal}</div>
                  <div className="text-gray-600 text-xs">{part.meaning}</div>
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">身體部位點擊測驗</h2>
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
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 text-center">
          <p className="text-lg text-gray-800 font-medium mb-2">請點擊：</p>
          <div className="text-3xl font-bold text-blue-600">
            {currentQuestion.tayal}
          </div>
        </div>

        {showResult && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              selectedPart === currentQuestion.tayal
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {selectedPart === currentQuestion.tayal ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <XMarkIcon className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {selectedPart === currentQuestion.tayal ? '正確！' : '錯誤！'}
              </span>
            </div>
            {selectedPart !== currentQuestion.tayal && (
              <p className="text-sm text-center mt-1">
                正確答案是：{currentQuestion.emoji} {currentQuestion.meaning}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 人體圖示區域 */}
      <div className="relative bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg p-8 mb-6" style={{ height: '500px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ fontSize: '27rem' }} className="opacity-20">🧍</div>
        </div>

        {/* 可點擊的身體部位按鈕 */}
        {bodyParts.map((part) => (
          <button
            key={part.tayal}
            onClick={() => handlePartClick(part.tayal)}
            disabled={showResult}
            style={{
              position: 'absolute',
              top: part.position.top,
              left: part.position.left,
              transform: 'translate(-50%, -50%)',
            }}
            className={`
              w-16 h-16 rounded-full border-2 transition-all transform hover:scale-110
              ${selectedPart === part.tayal
                ? showResult
                  ? part.tayal === currentQuestion.tayal
                    ? 'border-green-500 bg-green-100 scale-110'
                    : 'border-red-500 bg-red-100'
                  : 'border-blue-500 bg-blue-100 scale-110'
                : 'border-gray-400 bg-white hover:bg-gray-50'
              }
              ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
              flex items-center justify-center text-2xl
              shadow-lg hover:shadow-xl
            `}
          >
            {part.emoji}
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mb-4">
        點擊人體圖上的部位來回答問題
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedPart || showResult}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          確認答案
        </button>
      </div>
    </div>
  );
}
