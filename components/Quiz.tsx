'use client';

import { useState, useEffect } from 'react';
import { QuizQuestion } from '@/data/week1';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackQuizResult, ActivityTimer } from '@/lib/analytics';
import clsx from 'clsx';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  week: number;
  day: number;
}

export default function Quiz({ questions, onComplete, week, day }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizTimer, setQuizTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // 開始計時
    const timer = new ActivityTimer('quiz');
    setQuizTimer(timer);
    setStartTime(Date.now());

    return () => {
      // 清理計時器（如果用戶中途離開）
      if (timer) {
        timer.stop({ week, day, completed: false });
      }
    };
  }, [week, day]);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // 計算分數
      let correctCount = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.answer) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);

      // 追蹤測驗成績
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // 秒
      const finalScore = Math.round((correctCount / questions.length) * 100);

      trackQuizResult({
        week,
        day,
        score: finalScore,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeSpent,
      });

      // 停止計時器
      if (quizTimer) {
        quizTimer.stop({ week, day, completed: true, score: finalScore });
      }
    }
  };

  const handleFinish = () => {
    onComplete(score, questions.length);
  };

  const currentQ = questions[currentQuestion];
  const userAnswer = answers[currentQuestion];
  const isAnswered = userAnswer !== undefined;

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">測驗結果</h3>
          <div className="text-6xl mb-4">
            {score === questions.length ? '🎉' : score >= questions.length * 0.7 ? '👏' : '💪'}
          </div>
          <p className="text-xl mb-2 text-gray-900">
            您答對了 <span className="font-bold text-green-600">{score}</span> 題，
            共 <span className="font-bold">{questions.length}</span> 題
          </p>
          <p className="text-lg mb-6 text-gray-800 font-medium">
            正確率：{Math.round((score / questions.length) * 100)}%
          </p>
          
          {/* 詳細結果 */}
          <div className="text-left mb-6 space-y-3">
            {questions.map((question, index) => {
              const userAns = answers[index];
              const isCorrect = userAns === question.answer;
              
              return (
                <div key={question.id} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XMarkIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{question.question}</p>
                      <p className="text-sm text-gray-800 mt-1">
                        您的答案：<span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{userAns}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1 font-medium">
                          正確答案：{question.answer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleFinish}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {score === questions.length ? '完美！繼續學習' : score >= questions.length * 0.7 ? '不錯！繼續加油' : '再接再厲！'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 進度條 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-800 font-medium mb-2">
          <span>題目 {currentQuestion + 1}/{questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 題目 */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">{currentQ.question}</h3>
        
        {/* 單選題 */}
        {(currentQ.type === 'single' || !currentQ.type) && (
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={clsx(
                  "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:bg-gray-50",
                  userAnswer === option 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-4 h-4 rounded-full border-2 flex-shrink-0",
                    userAnswer === option 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-gray-300"
                  )}>
                    {userAnswer === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 按鈕 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          上一題
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {currentQuestion === questions.length - 1 ? '完成測驗' : '下一題'}
        </button>
      </div>
    </div>
  );
}
