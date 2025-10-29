'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface StorySequenceProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 洪水神話故事片段
const storyParts = [
  {
    id: 1,
    order: 1,
    tayal: 'Kmayal raral qu Tayal',
    meaning: '在太古時代',
    emoji: '🌅'
  },
  {
    id: 2,
    order: 2,
    tayal: 'mqwalax yaba balay2 na qwalx',
    meaning: '下了很久的大雨',
    emoji: '🌧️'
  },
  {
    id: 3,
    order: 3,
    tayal: 'ps\'unan qsya kwara qu babaw hiyal',
    meaning: '洪水泛濫淹沒大地',
    emoji: '🌊'
  },
  {
    id: 4,
    order: 4,
    tayal: 'Tnaqun kmal na Utux qu Tayal',
    meaning: '神指示泰雅族人',
    emoji: '⚡'
  },
  {
    id: 5,
    order: 5,
    tayal: 'mkura squ wagiq bu rgyax Papak waga',
    meaning: '爬上大霸尖山',
    emoji: '⛰️'
  },
  {
    id: 6,
    order: 6,
    tayal: 'pgalu Utux klahang',
    meaning: '族人設立祭壇祭神',
    emoji: '🙏'
  },
  {
    id: 7,
    order: 7,
    tayal: 'Gmwaya mkraki laqi',
    meaning: '獻祭美麗的女孩',
    emoji: '👧'
  },
  {
    id: 8,
    order: 8,
    tayal: 'wal qzitun qsya',
    meaning: '洪水退去了',
    emoji: '☀️'
  },
];

export default function StorySequence({ onFinish, week, day }: StorySequenceProps) {
  const [userSequence, setUserSequence] = useState<typeof storyParts>([]);
  const [availableParts, setAvailableParts] = useState<typeof storyParts>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<typeof storyParts[0] | null>(null);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const maxAttempts = 3;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 隨機打亂故事片段
    setAvailableParts(shuffleArray([...storyParts]));

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'StorySequence', completed: false });
      }
    };
  }, [week, day]);

  const handlePartClick = (part: typeof storyParts[0]) => {
    if (showResult) return;

    // 從可用片段移到用戶序列
    setAvailableParts(prev => prev.filter(p => p.id !== part.id));
    setUserSequence(prev => [...prev, part]);
  };

  const handleRemovePart = (part: typeof storyParts[0]) => {
    if (showResult) return;

    // 從用戶序列移回可用片段
    setUserSequence(prev => prev.filter(p => p.id !== part.id));
    setAvailableParts(prev => [...prev, part]);
  };

  const handleSubmit = () => {
    if (userSequence.length !== storyParts.length) {
      alert('請將所有故事片段排序完成');
      return;
    }

    setAttempts(prev => prev + 1);

    // 檢查順序是否正確
    const isCorrect = userSequence.every((part, index) => part.order === index + 1);

    if (isCorrect) {
      setScore(100);
      setShowResult(true);

      setTimeout(() => {
        setGameCompleted(true);

        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        trackGameResult({
          week,
          day,
          gameType: 'StorySequence',
          score: 100,
          attempts,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'StorySequence', completed: true, score: 100 });
        }
      }, 2000);
    } else {
      setShowResult(true);

      setTimeout(() => {
        if (attempts >= maxAttempts) {
          // 達到最大嘗試次數
          setGameCompleted(true);

          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          const finalScore = 0;

          trackGameResult({
            week,
            day,
            gameType: 'StorySequence',
            score: finalScore,
            attempts,
            timeSpent,
          });

          if (gameTimer) {
            gameTimer.stop({ week, day, gameType: 'StorySequence', completed: true, score: finalScore });
          }
        } else {
          // 重置讓用戶再試一次
          setShowResult(false);
          setAvailableParts(shuffleArray([...storyParts]));
          setUserSequence([]);
        }
      }, 3000);
    }
  };

  const handleFinish = () => {
    onFinish(score > 50, score);
  };

  const handleRetry = () => {
    setUserSequence([]);
    setAvailableParts(shuffleArray([...storyParts]));
    setShowResult(false);
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const passed = score > 50;

    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '📖'}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {passed ? '完美排序！' : '繼續加油！'}
        </h3>
        <p className="text-lg text-gray-900 font-medium mb-6">
          {passed ? (
            <>
              太棒了！你正確地排列了故事順序
              <br />
              使用了 <strong className="text-blue-600">{attempts}</strong> 次嘗試
            </>
          ) : (
            <>
              很可惜，讓我們看看正確的故事順序
              <br />
              <strong className="text-red-600">需要正確排序才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">正確的故事順序：</h4>
          <div className="space-y-3">
            {storyParts.map((part, index) => (
              <div key={part.id} className="flex items-center gap-3 p-3 bg-white rounded border-l-4 border-blue-500">
                <span className="text-2xl font-bold text-blue-500">{index + 1}</span>
                <span className="text-2xl">{part.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{part.tayal}</div>
                  <div className="text-gray-800 font-medium text-xs">{part.meaning}</div>
                </div>
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">故事排序遊戲</h2>
        <p className="text-gray-800 font-medium mb-3">
          將故事片段拖曳或點擊排列成正確的順序
        </p>
        <div className="text-sm text-gray-800 font-medium">
          嘗試次數：{attempts} / {maxAttempts}
        </div>
      </div>

      {showResult && (
        <div
          className={`p-4 mb-4 rounded-lg text-center ${
            score === 100
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {score === 100 ? (
              <>
                <CheckIcon className="w-5 h-5" />
                <span className="font-semibold">太棒了！順序完全正確！</span>
              </>
            ) : (
              <>
                <XMarkIcon className="w-5 h-5" />
                <span className="font-semibold">順序不對，請再試一次</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 左側：可用片段 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-blue-600 mb-3 flex items-center justify-center gap-2">
            <ArrowsUpDownIcon className="w-5 h-5" />
            待排序片段
          </h3>
          <div className="min-h-[400px] bg-blue-50 p-4 rounded-lg space-y-2">
            {availableParts.map((part) => (
              <button
                key={part.id}
                onClick={() => handlePartClick(part)}
                disabled={showResult}
                className="w-full p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{part.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{part.tayal}</div>
                    <div className="text-gray-800 font-medium text-xs">{part.meaning}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右側：用戶排序 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-green-600 mb-3 flex items-center justify-center gap-2">
            <CheckIcon className="w-5 h-5" />
            你的排序
          </h3>
          <div className="min-h-[400px] bg-green-50 p-4 rounded-lg space-y-2">
            {userSequence.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                點擊左側片段來排序
              </div>
            ) : (
              userSequence.map((part, index) => (
                <div
                  key={part.id}
                  onClick={() => handleRemovePart(part)}
                  className="p-3 bg-white rounded-lg border-2 border-green-500 cursor-pointer hover:bg-red-50 hover:border-red-500 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">{index + 1}</span>
                    <span className="text-2xl">{part.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{part.tayal}</div>
                      <div className="text-gray-800 font-medium text-xs">{part.meaning}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={userSequence.length !== storyParts.length || showResult}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-semibold"
        >
          提交答案
        </button>
        <p className="text-sm text-gray-800 font-medium mt-2">
          已排序 {userSequence.length} / {storyParts.length} 個片段
        </p>
      </div>
    </div>
  );
}
