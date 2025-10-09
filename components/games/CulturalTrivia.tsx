'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface CulturalTriviaProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 文化知識問答題
const triviaQuestions = [
  {
    id: 1,
    question: '泰雅語中「神」的說法是？',
    options: ['Tayal', 'Utux', 'Kmayal', 'Papak'],
    answer: 'Utux',
    explanation: 'Utux 是泰雅語中神靈的意思，在泰雅文化中非常重要',
    category: '詞彙知識'
  },
  {
    id: 2,
    question: '洪水神話中，神指示族人爬上哪座山？',
    options: ['玉山', '大霸尖山', '雪山', '阿里山'],
    answer: '大霸尖山',
    explanation: '大霸尖山（Papak waga）是泰雅族的聖山',
    category: '神話故事'
  },
  {
    id: 3,
    question: '泰雅語「squliq」是什麼意思？',
    options: ['山', '雨', '神', '人'],
    answer: '雨',
    explanation: 'squliq 意思是雨，在洪水神話中反覆出現',
    category: '詞彙知識'
  },
  {
    id: 4,
    question: '泰雅語中「klahang」指的是？',
    options: ['房子', '祭壇', '河流', '森林'],
    answer: '祭壇',
    explanation: 'klahang 是祭壇，族人用來祭祀神靈的地方',
    category: '文化詞彙'
  },
  {
    id: 5,
    question: '「你叫什麼名字？」的泰雅語是？',
    options: ["ima' lalu' su'?", "Pira' kawas mu?", "Ktwa' kinwagiq mu?", "'tayal su'?"],
    answer: "ima' lalu' su'?",
    explanation: "ima' 是「什麼」，lalu' 是「名字」，su' 是「你的」",
    category: '日常對話'
  },
  {
    id: 6,
    question: '泰雅語「ngasal」是什麼意思？',
    options: ['朋友', '家人', '老師', '學生'],
    answer: '家人',
    explanation: 'ngasal 指家人或家族成員',
    category: '家庭詞彙'
  },
  {
    id: 7,
    question: '「我是泰雅族的小孩」的泰雅語是？',
    options: [
      "'laqi' saku' na 'Tayal",
      "'Tayal saku'",
      "saku' 'laqi'",
      "'Tayal na 'laqi'"
    ],
    answer: "'laqi' saku' na 'Tayal",
    explanation: "'laqi' 是小孩，saku' 是我，na 表示「的」，'Tayal 是泰雅族",
    category: '日常對話'
  },
  {
    id: 8,
    question: '泰雅語「kawas」指的是？',
    options: ['身高', '歲數', '體重', '年級'],
    answer: '歲數',
    explanation: 'kawas 用來表示年齡歲數',
    category: '數字詞彙'
  },
  {
    id: 9,
    question: '泰雅語「kinwagiq」是什麼意思？',
    options: ['年齡', '身高', '名字', '家人'],
    answer: '身高',
    explanation: 'kinwagiq 表示身高',
    category: '身體詞彙'
  },
  {
    id: 10,
    question: '在洪水神話中，最後什麼讓洪水退去？',
    options: [
      '祭獻美麗的女孩',
      '祭獻勇敢的戰士',
      '族人的祈禱',
      '神的憐憫'
    ],
    answer: '祭獻美麗的女孩',
    explanation: '族人獻祭了美麗的女孩（mkraki laqi）後，洪水才退去',
    category: '神話故事'
  },
  {
    id: 11,
    question: '「Kmayal」在泰雅語中表示？',
    options: ['現在', '很久以前', '明天', '昨天'],
    answer: '很久以前',
    explanation: 'Kmayal 表示很久以前、太古時代',
    category: '時間詞彙'
  },
  {
    id: 12,
    question: '泰雅語「iyat」是什麼意思？',
    options: ['是的', '不是', '可以', '謝謝'],
    answer: '不是',
    explanation: 'iyat 表示否定，意思是「不是」',
    category: '基本詞彙'
  },
];

export default function CulturalTrivia({ onFinish, week, day }: CulturalTriviaProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questions, setQuestions] = useState<typeof triviaQuestions>([]);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalQuestions = 10;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 隨機選擇 10 題
    const shuffled = shuffleArray([...triviaQuestions]);
    setQuestions(shuffled.slice(0, totalQuestions));

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'CulturalTrivia', completed: false });
      }
    };
  }, [week, day]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].answer;
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
          gameType: 'CulturalTrivia',
          score: finalScore,
          attempts: totalQuestions,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'CulturalTrivia', completed: true, score: finalScore });
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

    // 重新隨機選擇題目
    const shuffled = shuffleArray([...triviaQuestions]);
    setQuestions(shuffled.slice(0, totalQuestions));
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
    const finalScore = Math.round((score / totalQuestions) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
        <h3 className="text-2xl font-bold mb-4">
          {passed ? '文化知識達人！' : '繼續學習！'}
        </h3>
        <p className="text-lg mb-6">
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

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">🎓 恭喜完成三週學習！</h4>
          <p className="text-gray-700 mb-3">
            您已經掌握了泰雅語的基礎：
          </p>
          <ul className="text-left space-y-2 text-sm text-gray-600">
            <li>✅ 第一週：字母發音與基礎單字</li>
            <li>✅ 第二週：生活主題詞彙與對話</li>
            <li>✅ 第三週：神話故事與文化理解</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left max-h-80 overflow-y-auto">
          <h4 className="font-semibold mb-3 text-center">題目回顧：</h4>
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={q.id} className="p-3 bg-white rounded border">
                <div className="text-xs text-purple-500 mb-1">{q.category}</div>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm font-bold text-blue-500">Q{index + 1}</span>
                  <p className="text-sm font-semibold flex-1">{q.question}</p>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-semibold">{q.answer}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 pl-6">{q.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            重新挑戰
          </button>
          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold"
          >
            完成遊戲
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">文化知識問答</h2>
        <div className="text-sm text-gray-600 mb-3">
          第 {currentQuestion + 1} / {totalQuestions} 題，得分 {score}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-4">
          <div className="text-xs text-purple-500 mb-2">{question.category}</div>
          <p className="text-lg font-semibold text-gray-800">
            {question.question}
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
                {selectedAnswer === question.answer ? '答對了！' : '答錯了！'}
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
                  : 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-base">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showResult}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          確認答案
        </button>
      </div>
    </div>
  );
}
