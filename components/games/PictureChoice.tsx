'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface PictureChoiceProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 遊戲數據 - 可根據週數調整
const gameData = {
  2: { // week 2 - 子音詞彙
    questions: [
      {
        id: 1,
        word: 'balay',
        meaning: '房子',
        emoji: '🏠',
        options: ['balay', 'palay', 'baway', 'kalay']
      },
      {
        id: 2,
        word: 'tama',
        meaning: '父親',
        emoji: '👨‍🦳',
        options: ['tama', 'dama', 'kama', 'sama']
      },
      {
        id: 3,
        word: 'gaga',
        meaning: '部落',
        emoji: '🏘️',
        options: ['kaga', 'gaga', 'baga', 'yaga']
      },
      {
        id: 4,
        word: 'masu',
        meaning: '你',
        emoji: '👤',
        options: ['nasu', 'masu', 'kasu', 'sasu']
      }
    ]
  },
  3: { // week 3 - 詞彙
    questions: [
      {
        id: 1,
        word: 'wawa',
        meaning: '小孩',
        emoji: '👶',
        options: ['wawa', 'mama', 'yaya', 'kaka']
      },
      {
        id: 2,
        word: 'mata',
        meaning: '眼睛',
        emoji: '👁️',
        options: ['mata', 'mada', 'masa', 'maka']
      },
      {
        id: 3,
        word: 'qasil',
        meaning: '白色',
        emoji: '⚪',
        options: ['qasil', 'qosil', 'gasil', 'kasil']
      },
      {
        id: 4,
        word: 'huling',
        meaning: '狗',
        emoji: '🐕',
        options: ['huling', 'hureng', 'buling', 'kuling']
      }
    ]
  }
};

export default function PictureChoice({ onFinish, week, day }: PictureChoiceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const data = gameData[week as keyof typeof gameData] || gameData[2];
  const currentQ = data.questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // 計算分數
      let correctCount = 0;
      data.questions.forEach((question, index) => {
        if (answers[index] === question.word) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setGameCompleted(false);
  };

  const handleFinish = () => {
    const success = score === data.questions.length;
    onFinish(success);
  };

  if (gameCompleted) {
    const success = score === data.questions.length;
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
          共 <span className="font-bold">{data.questions.length}</span> 題
        </p>
        
        {/* 顯示詳細結果 */}
        <div className="text-left mb-6 space-y-3">
          {data.questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.word;
            
            return (
              <div key={question.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-2xl">{question.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium">{question.meaning}</p>
                    <p className="text-sm text-gray-600">
                      您的答案：<span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600">
                        正確答案：{question.word}
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
      <h2 className="text-2xl font-bold text-center mb-6">看圖選詞遊戲</h2>
      
      {/* 進度條 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>題目 {currentQuestion + 1}/{data.questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / data.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / data.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 題目顯示 */}
      <div className="text-center mb-8">
        <div className="text-8xl mb-4">{currentQ.emoji}</div>
        <h3 className="text-xl font-semibold mb-2">{currentQ.meaning}</h3>
        <p className="text-gray-600">選擇正確的泰雅語詞彙</p>
      </div>

      {/* 選項 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {currentQ.options.map((option, index) => {
          const isSelected = answers[currentQuestion] === option;
          
          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`p-4 text-lg font-medium rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* 按鈕 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一題
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg"
        >
          {currentQuestion === data.questions.length - 1 ? '完成遊戲' : '下一題'}
        </button>
      </div>
    </div>
  );
} 