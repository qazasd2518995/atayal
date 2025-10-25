'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AcademicCapIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { comprehensiveAssessment, AssessmentQuestion, AssessmentResult } from '@/data/assessment';

interface AssessmentModalProps {
  isOpen: boolean;
  assessmentType: 'pre' | 'post'; // 課前或課後
  userName: string;
  onComplete: (result: AssessmentResult) => void | Promise<void>;
}

export default function AssessmentModal({
  isOpen,
  assessmentType,
  userName,
  onComplete
}: AssessmentModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; userAnswer: string }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = comprehensiveAssessment[currentQuestionIndex];
  const totalQuestions = comprehensiveAssessment.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // 重置開始時間
  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
    }
  }, [isOpen]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    // 記錄答案
    const newAnswers = [...userAnswers, {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer
    }];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    // 檢查是否完成所有題目
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 計算結果
      calculateAndShowResult(newAnswers);
    }
  };

  const calculateAndShowResult = (answers: { questionId: string; userAnswer: string }[]) => {
    const detailedAnswers = answers.map(ans => {
      const question = comprehensiveAssessment.find(q => q.id === ans.questionId);
      return {
        questionId: ans.questionId,
        userAnswer: ans.userAnswer,
        correct: question ? ans.userAnswer === question.answer : false
      };
    });

    const correctAnswers = detailedAnswers.filter(ans => ans.correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000); // 秒

    const result: AssessmentResult = {
      userName,
      assessmentType,
      score,
      totalQuestions,
      correctAnswers,
      answers: detailedAnswers,
      completedAt: new Date().toISOString(),
      timeTaken
    };

    setShowResult(true);
    handleSubmitResult(result);
  };

  const handleSubmitResult = async (result: AssessmentResult) => {
    setIsSubmitting(true);
    try {
      await onComplete(result);
    } catch (error) {
      console.error('提交測驗結果失敗:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultMessage = () => {
    const correctAnswers = userAnswers.filter((ans, idx) => {
      const question = comprehensiveAssessment[idx];
      return ans.userAnswer === question.answer;
    }).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    if (score >= 80) return { emoji: '🎉', text: '太棒了！', color: 'text-green-600' };
    if (score >= 60) return { emoji: '👍', text: '做得不錯！', color: 'text-blue-600' };
    return { emoji: '💪', text: '繼續努力！', color: 'text-orange-600' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  if (showResult) {
    const correctCount = userAnswers.filter((ans, idx) => {
      const question = comprehensiveAssessment[idx];
      return ans.userAnswer === question.answer;
    }).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const resultMsg = getResultMessage();

    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{resultMsg.emoji}</div>
                    <Dialog.Title
                      as="h3"
                      className={`text-3xl font-bold mb-4 ${resultMsg.color}`}
                    >
                      {resultMsg.text}
                    </Dialog.Title>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-4xl font-bold text-blue-600">{score}</div>
                          <div className="text-sm text-gray-600">總分</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-4xl font-bold text-green-600">{correctCount}/{totalQuestions}</div>
                          <div className="text-sm text-gray-600">答對題數</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <ClockIcon className="w-5 h-5" />
                        <span>完成時間：{formatTime(timeTaken)}</span>
                      </div>
                    </div>

                    {assessmentType === 'pre' ? (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          這是您的課前測驗成績，讓我們了解您目前的泰雅語程度。
                        </p>
                        <p className="text-gray-700 font-medium">
                          現在開始學習之旅，完成所有課程後將再次測驗，讓我們見證您的進步！
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          disabled={isSubmitting}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400"
                        >
                          {isSubmitting ? '正在儲存結果...' : '開始學習 🚀'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          恭喜完成所有課程與課後測驗！
                        </p>
                        <p className="text-gray-700 font-medium">
                          您的學習成果已經被記錄，可以查看課前與課後的進步對比。
                        </p>
                        <button
                          onClick={() => window.location.href = '/'}
                          disabled={isSubmitting}
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400"
                        >
                          {isSubmitting ? '正在儲存結果...' : '返回首頁 🏠'}
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                {/* 標題區域 */}
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <AcademicCapIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    {assessmentType === 'pre' ? '📝 課前測驗' : '🎓 課後測驗'}
                  </Dialog.Title>
                  <p className="text-gray-600">
                    {assessmentType === 'pre'
                      ? '測試您目前的泰雅語程度，了解學習起點'
                      : '測試您學習後的泰雅語程度，見證您的進步'
                    }
                  </p>
                </div>

                {/* 進度條 */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      題目 {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(progress)}% 完成
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* 題目 */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {currentQuestionIndex + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 flex-1">
                      {currentQuestion.question}
                    </h4>
                  </div>

                  {/* 選項 */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAnswer === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === option
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswer === option && (
                              <CheckCircleIcon className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 底部按鈕 */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                      selectedAnswer
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? '下一題 →' : '完成測驗 ✓'}
                  </button>
                </div>

                {/* 提示 */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  請仔細閱讀題目後選擇答案，無法返回修改
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
