'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface StoryChoiceProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 故事理解問題
const storyQuestions = [
  {
    id: 1,
    question: '神讓泰雅人做了什麼來躲避洪水？',
    tayal: 'Tnaqun kmal na Utux qu Tayal',
    options: ['潛水', '爬山', '種田', '建船'],
    answer: '爬山',
    explanation: '神指示族人爬上大霸尖山（Papak waga）避難'
  },
  {
    id: 2,
    question: '族人第一次祭祀時，神接受了嗎？',
    tayal: 'ana ga ini gali na Utux',
    options: ['接受了', '沒有接受', '部分接受', '不知道'],
    answer: '沒有接受',
    explanation: '神不接受第一次的祭品（ini gali na Utux）'
  },
  {
    id: 3,
    question: '神最後接受了誰的祭品？',
    tayal: 'Gmwaya mkraki laqi',
    options: ['勇敢的戰士', '美麗的女孩', '年長的智者', '強壯的男孩'],
    answer: '美麗的女孩',
    explanation: '最後獻祭了美麗的女孩（mkraki laqi）'
  },
  {
    id: 4,
    question: '當女孩被祭獻後發生了什麼？',
    tayal: 'wal qzitun qsya',
    options: ['雨更大了', '洪水退去', '天黑了', '地震了'],
    answer: '洪水退去',
    explanation: '洪水退去了（qzitun qsya）'
  },
  {
    id: 5,
    question: '這個故事主要告訴我們什麼？',
    tayal: 'Kmayal raral qu Tayal',
    options: [
      '不要爬山',
      '要敬畏神靈',
      '洪水很危險',
      '要學游泳'
    ],
    answer: '要敬畏神靈',
    explanation: '故事展現了泰雅族對神靈的敬畏（Utux）和犧牲精神'
  },
  {
    id: 6,
    question: '大雨大約下了多久？',
    tayal: 'mqwalax yaba balay2 na qwalx',
    options: ['十天', '五十天', '一百天', '兩百天'],
    answer: '一百天',
    explanation: '大雨約下了一百天（balay2 na qwalx）'
  },
  {
    id: 7,
    question: '族人設立了什麼來祭神？',
    tayal: 'pgalu Utux klahang',
    options: ['神殿', '祭壇', '石碑', '神像'],
    answer: '祭壇',
    explanation: '族人設立祭壇（klahang）祭神'
  },
  {
    id: 8,
    question: '泰雅語中「神」怎麼說？',
    tayal: 'Utux',
    options: ['Tayal', 'Utux', 'Papak', 'Kmayal'],
    answer: 'Utux',
    explanation: 'Utux 是神的意思'
  },
];

export default function StoryChoice({ onFinish, week, day }: StoryChoiceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalQuestions = storyQuestions.length;

  useEffect(() => {
    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'StoryChoice', completed: false });
      }
    };
  }, [week, day]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === storyQuestions[currentQuestion].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        setGameCompleted(true);

        // 追蹤遊戲成績
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / totalQuestions) * 100);

        trackGameResult({
          week,
          day,
          gameType: 'StoryChoice',
          score: finalScore,
          attempts: totalQuestions,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'StoryChoice', completed: true, score: finalScore });
        }
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
        setShowResult(false);
      }
    }, 3000);
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / totalQuestions) * 100);
    onFinish(finalScore > 50, finalScore);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const finalScore = Math.round((score / totalQuestions) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {passed ? '理解力超強！' : '繼續加油！'}
        </h3>
        <p className="text-lg text-gray-900 font-medium mb-6">
          答對 <strong className="text-green-600">{score}</strong> / {totalQuestions} 題
          <br />
          正確率：<strong className="text-blue-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要正確率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left max-h-96 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">題目回顧：</h4>
          <div className="space-y-3">
            {storyQuestions.map((q, index) => (
              <div key={q.id} className="p-3 bg-white rounded border">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm font-bold text-blue-500">Q{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{q.question}</p>
                    <p className="text-xs text-gray-700 font-medium italic mt-1">{q.tayal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 pl-6">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-semibold">{q.answer}</span>
                </div>
                <p className="text-xs text-gray-800 font-medium mt-1 pl-6">{q.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50"
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

  const question = storyQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">故事理解測驗</h2>
        <div className="text-sm text-gray-800 font-medium mb-3">
          第 {currentQuestion + 1} / {totalQuestions} 題，得分 {score}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
          <p className="text-lg font-semibold text-gray-800 mb-3">
            {question.question}
          </p>
          <p className="text-sm text-blue-600 italic">
            {question.tayal}
          </p>
        </div>

        {showResult && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              selectedAnswer === question.answer
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === question.answer ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <XMarkIcon className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {selectedAnswer === question.answer ? '正確！' : '錯誤！'}
              </span>
            </div>
            {selectedAnswer !== question.answer && (
              <p className="text-sm mb-1">
                正確答案：<strong>{question.answer}</strong>
              </p>
            )}
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            disabled={showResult}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedAnswer === option
                ? showResult
                  ? option === question.answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-base text-gray-900 font-medium">{option}</span>
            </div>
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
