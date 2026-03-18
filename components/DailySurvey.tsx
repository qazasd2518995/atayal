'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { ClipboardDocumentIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getCurrentSession } from '@/lib/analytics';

interface DailySurveyProps {
  week: number;
  day: number;
  onComplete: () => void;
}

interface SurveyData {
  q1_interesting: string;
  q2_motivation: number;
  q3_effectiveness: number;
  q4_difficulty: number;
  q5_interface: number;
  q6_used_chatbot: 'yes' | 'no' | '';
  q6_1_useful?: number;
  q6_2_motivation?: number;
  q6_3_effectiveness?: number;
  q7_suggestion: string;
}

export default function DailySurvey({ week, day, onComplete }: DailySurveyProps) {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    q1_interesting: '',
    q2_motivation: 0,
    q3_effectiveness: 0,
    q4_difficulty: 0,
    q5_interface: 0,
    q6_used_chatbot: '',
    q7_suggestion: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Likert 量表選項
  const likertOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  // 檢查當前步驟是否可以繼續
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return surveyData.q1_interesting.trim().length > 0;
      case 2:
        return surveyData.q2_motivation > 0;
      case 3:
        return surveyData.q3_effectiveness > 0;
      case 4:
        return surveyData.q4_difficulty > 0;
      case 5:
        return surveyData.q5_interface > 0;
      case 6:
        return surveyData.q6_used_chatbot !== '';
      case 7:
        // 如果使用了 chatbot，必須回答 6-1, 6-2, 6-3
        if (surveyData.q6_used_chatbot === 'yes') {
          return (
            surveyData.q6_1_useful !== undefined &&
            surveyData.q6_1_useful > 0 &&
            surveyData.q6_2_motivation !== undefined &&
            surveyData.q6_2_motivation > 0 &&
            surveyData.q6_3_effectiveness !== undefined &&
            surveyData.q6_3_effectiveness > 0
          );
        }
        return true; // 沒使用 chatbot 直接跳過
      case 8:
        return surveyData.q7_suggestion.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    // 如果在第6題選擇「沒使用」，直接跳到第8題
    if (currentStep === 6 && surveyData.q6_used_chatbot === 'no') {
      setCurrentStep(8);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    // 如果從第8題返回且沒使用 chatbot，跳回第6題
    if (currentStep === 8 && surveyData.q6_used_chatbot === 'no') {
      setCurrentStep(6);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    try {
      // 獲取當前用戶 session 資訊
      const session = getCurrentSession();

      // 發送問卷資料到 API
      await fetch('/api/analytics/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: session?.userName || 'anonymous',
          sessionId: session?.sessionId || 'unknown',
          week,
          day,
          ...surveyData,
        }),
      });

      // 完成問卷
      onComplete();
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('提交問卷時發生錯誤，請稍後再試');
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 1
            </h3>
            <p className="text-gray-700">
              今天的學習活動中，哪一部分最有趣？
            </p>
            <p className="text-sm text-gray-500">
              可描述具體課程或功能
            </p>
            <textarea
              value={surveyData.q1_interesting}
              onChange={(e) =>
                setSurveyData({ ...surveyData, q1_interesting: e.target.value })
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-forest-600 focus:outline-none min-h-[120px] text-gray-900 placeholder:text-gray-400"
              placeholder="請輸入您的想法..."
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 2
            </h3>
            <p className="text-gray-700 mb-4">
              你是否覺得遊戲增加學習意願？
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>1 = 不同意</span>
                <span>5 = 同意</span>
              </div>
              <div className="flex justify-between gap-2">
                {likertOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, q2_motivation: option.value })
                    }
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      surveyData.q2_motivation === option.value
                        ? 'border-forest-600 bg-forest-50 scale-105'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 3
            </h3>
            <p className="text-gray-700 mb-4">
              你是否覺得遊戲增加學習成效？
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>1 = 不同意</span>
                <span>5 = 同意</span>
              </div>
              <div className="flex justify-between gap-2">
                {likertOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, q3_effectiveness: option.value })
                    }
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      surveyData.q3_effectiveness === option.value
                        ? 'border-forest-600 bg-forest-50 scale-105'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 4
            </h3>
            <p className="text-gray-700 mb-4">
              挑戰任務的難度設計得剛好
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>1 = 不同意</span>
                <span>5 = 同意</span>
              </div>
              <div className="flex justify-between gap-2">
                {likertOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, q4_difficulty: option.value })
                    }
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      surveyData.q4_difficulty === option.value
                        ? 'border-forest-600 bg-forest-50 scale-105'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 5
            </h3>
            <p className="text-gray-700 mb-4">
              對應用程式的介面、操作是否滿意？
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>1 = 非常不滿意</span>
                <span>5 = 非常滿意</span>
              </div>
              <div className="flex justify-between gap-2">
                {likertOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSurveyData({ ...surveyData, q5_interface: option.value })
                    }
                    className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                      surveyData.q5_interface === option.value
                        ? 'border-forest-600 bg-forest-50 scale-105'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 6
            </h3>
            <p className="text-gray-700 mb-4">
              你是否使用 AI 機器人功能？
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setSurveyData({ ...surveyData, q6_used_chatbot: 'yes' })
                }
                className={`flex-1 py-6 rounded-lg border-2 transition-all ${
                  surveyData.q6_used_chatbot === 'yes'
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <CheckCircleIcon className="w-7 h-7 text-forest-500" />
                </div>
                <div className="text-lg font-semibold">有使用</div>
              </button>
              <button
                onClick={() =>
                  setSurveyData({
                    ...surveyData,
                    q6_used_chatbot: 'no',
                    q6_1_useful: undefined,
                    q6_2_motivation: undefined,
                    q6_3_effectiveness: undefined,
                  })
                }
                className={`flex-1 py-6 rounded-lg border-2 transition-all ${
                  surveyData.q6_used_chatbot === 'no'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <XCircleIcon className="w-7 h-7 text-red-500" />
                </div>
                <div className="text-lg font-semibold">沒使用</div>
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">
              問題 6 - 追問
            </h3>

            {/* 6-1 */}
            <div className="space-y-3">
              <p className="text-gray-700 font-semibold">
                6-1. 你覺得 AI 機器人是否提供有用的資訊？
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>1 = 不同意</span>
                  <span>5 = 同意</span>
                </div>
                <div className="flex justify-between gap-2">
                  {likertOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSurveyData({ ...surveyData, q6_1_useful: option.value })
                      }
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        surveyData.q6_1_useful === option.value
                          ? 'border-forest-600 bg-forest-50 scale-105'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xl font-bold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6-2 */}
            <div className="space-y-3">
              <p className="text-gray-700 font-semibold">
                6-2. 你覺得 AI 機器人是否有增加學習意願？
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>1 = 不同意</span>
                  <span>5 = 同意</span>
                </div>
                <div className="flex justify-between gap-2">
                  {likertOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSurveyData({ ...surveyData, q6_2_motivation: option.value })
                      }
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        surveyData.q6_2_motivation === option.value
                          ? 'border-forest-600 bg-forest-50 scale-105'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xl font-bold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6-3 */}
            <div className="space-y-3">
              <p className="text-gray-700 font-semibold">
                6-3. 你覺得 AI 機器人是否有增加學習效果？
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>1 = 不同意</span>
                  <span>5 = 同意</span>
                </div>
                <div className="flex justify-between gap-2">
                  {likertOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSurveyData({ ...surveyData, q6_3_effectiveness: option.value })
                      }
                      className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                        surveyData.q6_3_effectiveness === option.value
                          ? 'border-forest-600 bg-forest-50 scale-105'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xl font-bold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              問題 7
            </h3>
            <p className="text-gray-700">
              請提出一項建議，以改進 App 的遊戲化功能。
            </p>
            <textarea
              value={surveyData.q7_suggestion}
              onChange={(e) =>
                setSurveyData({ ...surveyData, q7_suggestion: e.target.value })
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-forest-600 focus:outline-none min-h-[120px] text-gray-900 placeholder:text-gray-400"
              placeholder="請輸入您的建議..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = surveyData.q6_used_chatbot === 'no' ? 7 : 8;
  const displayStep = currentStep === 8 && surveyData.q6_used_chatbot === 'no' ? 7 : currentStep;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 標題 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 inline-flex items-center gap-2">
              <ClipboardDocumentIcon className="w-7 h-7 text-forest-600" />
              每日學習問卷
            </h2>
            <p className="text-gray-600">
              第 {week} 週 第 {day} 天
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>進度</span>
                <span>{displayStep} / {totalSteps}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-forest-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(displayStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 問題內容 */}
          <div className="mb-6">{renderStep()}</div>

          {/* 按鈕 */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                disabled={isSubmitting}
              >
                上一步
              </button>
            )}
            {currentStep < 8 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="flex-1 px-6 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex-1 px-6 py-3 bg-forest-500 text-white rounded-lg hover:bg-forest-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    提交中...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    提交問卷
                  </>
                )}
              </button>
            )}
          </div>

          {/* 提示訊息 */}
          <div className="mt-4 p-3 bg-cream-warm border border-wood-200 rounded-lg">
            <p className="text-sm text-wood-800 inline-flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4 text-wood-800 flex-shrink-0" />
              完成問卷後才能結束今天的課程
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
