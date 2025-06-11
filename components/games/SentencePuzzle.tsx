'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';

interface SentencePuzzleProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 遊戲數據 - 第四週對話句型
const gameData = {
  4: {
    puzzles: [
      {
        id: 1,
        correctSentence: 'Lokah su?',
        meaning: '你好嗎？',
        scrambledWords: ['su?', 'Lokah'],
        hint: '基本打招呼用語'
      },
      {
        id: 2,
        correctSentence: 'Yaki saku Mali.',
        meaning: '我的名字是Mali。',
        scrambledWords: ['saku', 'Mali.', 'Yaki'],
        hint: '自我介紹句型'
      },
      {
        id: 3,
        correctSentence: 'Ima su?',
        meaning: '你是誰？',
        scrambledWords: ['Ima', 'su?'],
        hint: '詢問對方身份'
      },
      {
        id: 4,
        correctSentence: 'Sbalay!',
        meaning: '謝謝！',
        scrambledWords: ['Sbalay!'],
        hint: '感謝用語'
      },
      {
        id: 5,
        correctSentence: 'Kinbahan saku.',
        meaning: '對不起。',
        scrambledWords: ['saku.', 'Kinbahan'],
        hint: '道歉用語'
      }
    ]
  }
};

export default function SentencePuzzle({ onFinish, week }: SentencePuzzleProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userSentences, setUserSentences] = useState<{ [key: number]: string[] }>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const data = gameData[week as keyof typeof gameData] || gameData[4];
  const currentP = data.puzzles[currentPuzzle];
  const userSentence = userSentences[currentPuzzle] || [];

  const addWordToSentence = (word: string) => {
    setUserSentences(prev => ({
      ...prev,
      [currentPuzzle]: [...(prev[currentPuzzle] || []), word]
    }));
  };

  const removeWordFromSentence = (index: number) => {
    setUserSentences(prev => ({
      ...prev,
      [currentPuzzle]: (prev[currentPuzzle] || []).filter((_, i) => i !== index)
    }));
  };

  const clearSentence = () => {
    setUserSentences(prev => ({
      ...prev,
      [currentPuzzle]: []
    }));
  };

  const getAvailableWords = () => {
    return currentP.scrambledWords.filter(word => {
      const usedCount = userSentence.filter(w => w === word).length;
      const availableCount = currentP.scrambledWords.filter(w => w === word).length;
      return usedCount < availableCount;
    });
  };

  const handleNext = () => {
    if (currentPuzzle < data.puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1);
    } else {
      // 計算分數
      let correctCount = 0;
      data.puzzles.forEach((puzzle, index) => {
        const userAnswer = (userSentences[index] || []).join(' ');
        if (userAnswer === puzzle.correctSentence) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentPuzzle(0);
    setUserSentences({});
    setScore(0);
    setGameCompleted(false);
  };

  const handleFinish = () => {
    const success = score === data.puzzles.length;
    onFinish(success);
  };

  if (gameCompleted) {
    const success = score === data.puzzles.length;
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">
          {success ? '🎉' : '💪'}
        </div>
        <h3 className="text-2xl font-bold mb-4">
          {success ? '恭喜完成！' : '再接再厲！'}
        </h3>
        <p className="text-lg mb-6">
          您答對了 <span className="font-bold text-green-600">{score}</span> 題，
          共 <span className="font-bold">{data.puzzles.length}</span> 題
        </p>
        
        {/* 顯示詳細結果 */}
        <div className="text-left mb-6 space-y-3">
          {data.puzzles.map((puzzle, index) => {
            const userAnswer = (userSentences[index] || []).join(' ');
            const isCorrect = userAnswer === puzzle.correctSentence;
            
            return (
              <div key={puzzle.id} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckIcon className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XMarkIcon className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{puzzle.meaning}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      您的答案：<span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer || '未作答'}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600 mt-1">
                        正確答案：{puzzle.correctSentence}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetGame}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">句子拼組遊戲</h2>
      
      {/* 進度條 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>題目 {currentPuzzle + 1}/{data.puzzles.length}</span>
          <span>{Math.round(((currentPuzzle + 1) / data.puzzles.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPuzzle + 1) / data.puzzles.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 題目說明 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">{currentP.meaning}</h3>
        <p className="text-gray-600">將下方的詞語拖拽組成正確的泰雅語句子</p>
        <p className="text-sm text-blue-600 mt-1">💡 {currentP.hint}</p>
      </div>

      {/* 用戶組成的句子 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">您組成的句子：</h4>
        <div className="min-h-[60px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-2">
          {userSentence.length === 0 ? (
            <span className="text-gray-400 italic">請將詞語拖拽到這裡</span>
          ) : (
            userSentence.map((word, index) => (
              <button
                key={index}
                onClick={() => removeWordFromSentence(index)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {word}
              </button>
            ))
          )}
        </div>
        {userSentence.length > 0 && (
          <button
            onClick={clearSentence}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            清空句子
          </button>
        )}
      </div>

      {/* 可用詞語 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">可用詞語：</h4>
        <div className="flex flex-wrap gap-2">
          {getAvailableWords().map((word, index) => (
            <button
              key={`${word}-${index}`}
              onClick={() => addWordToSentence(word)}
              className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors border border-green-300"
            >
              {word}
            </button>
          ))}
        </div>
        {getAvailableWords().length === 0 && (
          <p className="text-gray-400 italic">所有詞語都已使用</p>
        )}
      </div>

      {/* 參考答案長度提示 */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-600">
          正確句子包含 <span className="font-bold">{currentP.scrambledWords.length}</span> 個詞語
        </p>
      </div>

      {/* 按鈕 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentPuzzle(prev => Math.max(0, prev - 1))}
          disabled={currentPuzzle === 0}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一題
        </button>
        
        <button
          onClick={handleNext}
          disabled={userSentence.length === 0}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg"
        >
          {currentPuzzle === data.puzzles.length - 1 ? '完成遊戲' : '下一題'}
        </button>
      </div>
    </div>
  );
} 