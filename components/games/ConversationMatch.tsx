'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface ConversationMatchProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 對話配對數據
const conversations = [
  {
    id: 1,
    question: "ima' lalu' su'?",
    questionMeaning: '你叫什麼名字？',
    answer: "Yumin lalu' mu",
    answerMeaning: '我叫 Yumin',
    category: '姓名'
  },
  {
    id: 2,
    question: "Pira' kawas mu?",
    questionMeaning: '你幾歲？',
    answer: "Mopuw spat kawas maku'",
    answerMeaning: '我十四歲',
    category: '年齡'
  },
  {
    id: 3,
    question: "Ktwa' kinwagiq mu?",
    questionMeaning: '你多高？',
    answer: 'Kbhul ru mspatul inci',
    answerMeaning: '我一百四十公分',
    category: '身高'
  },
  {
    id: 4,
    question: "'tayal su' inu' wah?",
    questionMeaning: '你是哪一族的小孩？',
    answer: "'laqi' saku' na 'Tayal",
    answerMeaning: '我是泰雅族的小孩',
    category: '族群'
  },
  {
    id: 5,
    question: "'tayal kwara' qu ngasal mamu?",
    questionMeaning: '你的家人都是原住民嗎？',
    answer: "'Tayal kwara' sami qutux ngasal",
    answerMeaning: '我們全家都是泰雅族',
    category: '家人'
  },
  {
    id: 6,
    question: "'laqi' su' ni ima?",
    questionMeaning: '你是誰的小孩？',
    answer: "'laqi' saku' ni Silan Nawi",
    answerMeaning: '我是 Silan Nawi 的小孩',
    category: '家人'
  },
];

export default function ConversationMatch({ onFinish, week, day }: ConversationMatchProps) {
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof conversations>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<typeof conversations>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalPairs = conversations.length;
  const maxAttempts = totalPairs + 3;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 打亂問題和回答順序
    setShuffledQuestions(shuffleArray([...conversations]));
    setShuffledAnswers(shuffleArray([...conversations]));

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'ConversationMatch', completed: false });
      }
    };
  }, [week, day]);

  const handleQuestionClick = (id: number) => {
    if (showResult || matchedPairs.has(id)) return;

    if (selectedQuestion === id) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(id);
      if (selectedAnswer !== null) {
        checkMatch(id, selectedAnswer);
      }
    }
  };

  const handleAnswerClick = (id: number) => {
    if (showResult || matchedPairs.has(id)) return;

    if (selectedAnswer === id) {
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(id);
      if (selectedQuestion !== null) {
        checkMatch(selectedQuestion, id);
      }
    }
  };

  const checkMatch = (questionId: number, answerId: number) => {
    setAttempts(prev => prev + 1);

    if (questionId === answerId) {
      // 配對成功
      setScore(prev => prev + 1);
      setMatchedPairs(prev => new Set([...prev, questionId]));
      setSelectedQuestion(null);
      setSelectedAnswer(null);

      // 檢查是否完成所有配對
      if (matchedPairs.size + 1 >= totalPairs) {
        setGameCompleted(true);

        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.round(((score + 1) / totalPairs) * 100);

        trackGameResult({
          week,
          day,
          gameType: 'ConversationMatch',
          score: finalScore,
          attempts,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'ConversationMatch', completed: true, score: finalScore });
        }
      }
    } else {
      // 配對失敗
      setShowResult(true);

      setTimeout(() => {
        setSelectedQuestion(null);
        setSelectedAnswer(null);
        setShowResult(false);

        // 檢查是否達到最大嘗試次數
        if (attempts + 1 >= maxAttempts) {
          setGameCompleted(true);

          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          const finalScore = Math.round((score / totalPairs) * 100);

          trackGameResult({
            week,
            day,
            gameType: 'ConversationMatch',
            score: finalScore,
            attempts: attempts + 1,
            timeSpent,
          });

          if (gameTimer) {
            gameTimer.stop({ week, day, gameType: 'ConversationMatch', completed: true, score: finalScore });
          }
        }
      }, 1500);
    }
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / totalPairs) * 100);
    onFinish(finalScore > 50, finalScore);
  };

  const handleRetry = () => {
    setScore(0);
    setMatchedPairs(new Set());
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
    setAttempts(0);

    // 重新打亂
    setShuffledQuestions(shuffleArray([...conversations]));
    setShuffledAnswers(shuffleArray([...conversations]));
  };

  if (!shuffledQuestions.length || !shuffledAnswers.length) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4">正在準備題目…</p>
      </div>
    );
  }

  if (gameCompleted) {
    const finalScore = Math.round((score / totalPairs) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '💬'}</div>
        <h3 className="text-2xl font-bold mb-4">
          {passed ? '對話高手！' : '繼續加油！'}
        </h3>
        <p className="text-lg mb-6">
          成功配對 <strong className="text-green-600">{score}</strong> / {totalPairs} 組對話
          <br />
          使用了 <strong className="text-blue-600">{attempts}</strong> 次嘗試
          <br />
          正確率：<strong className="text-purple-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要正確率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-3 text-center">對話複習：</h4>
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div key={conv.id} className="p-3 bg-white rounded border">
                <div className="text-xs text-gray-500 mb-2">{conv.category}</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm font-semibold text-blue-600">{conv.question}</div>
                    <div className="text-xs text-gray-600">{conv.questionMeaning}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-sm font-semibold text-green-600">{conv.answer}</div>
                    <div className="text-xs text-gray-600">{conv.answerMeaning}</div>
                  </div>
                </div>
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
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            完成遊戲
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">對話配對遊戲</h2>
        <div className="text-sm text-gray-600 mb-3">
          已配對：{score} / {totalPairs}，嘗試次數：{attempts} / {maxAttempts}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(score / totalPairs) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-center text-gray-600 mb-6">
        點擊左側的問題和右側的回答，配對正確的對話
      </p>

      {showResult && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-800 text-center">
          <div className="flex items-center justify-center gap-2">
            <XMarkIcon className="w-5 h-5" />
            <span className="font-semibold">配對錯誤！請再試一次</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 左側：問題 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-blue-600 mb-3">問題</h3>
          {shuffledQuestions.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleQuestionClick(conv.id)}
              disabled={matchedPairs.has(conv.id) || showResult}
              className={`
                w-full p-4 rounded-lg border-2 transition-all text-left
                ${matchedPairs.has(conv.id)
                  ? 'border-green-500 bg-green-50 opacity-50 cursor-not-allowed'
                  : selectedQuestion === conv.id
                  ? 'border-blue-500 bg-blue-100 scale-105'
                  : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
                ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="font-semibold text-blue-600 text-center">{conv.question}</div>
              {matchedPairs.has(conv.id) && (
                <div className="flex justify-center mt-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 右側：回答 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-green-600 mb-3">回答</h3>
          {shuffledAnswers.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleAnswerClick(conv.id)}
              disabled={matchedPairs.has(conv.id) || showResult}
              className={`
                w-full p-4 rounded-lg border-2 transition-all text-left
                ${matchedPairs.has(conv.id)
                  ? 'border-green-500 bg-green-50 opacity-50 cursor-not-allowed'
                  : selectedAnswer === conv.id
                  ? 'border-blue-500 bg-blue-100 scale-105'
                  : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
                ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="font-semibold text-green-600 text-center">{conv.answer}</div>
              {matchedPairs.has(conv.id) && (
                <div className="flex justify-center mt-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>先點擊左側的問題，再點擊右側的回答進行配對</p>
      </div>
    </div>
  );
}
