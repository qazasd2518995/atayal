'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface ObjectHuntProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 物品數據
const objects = [
  { tayal: "biru'", meaning: '書', emoji: '📚' },
  { tayal: "pila'", meaning: '錢', emoji: '💰' },
  { tayal: "mari'", meaning: '球', emoji: '⚽' },
  { tayal: 'hanray', meaning: '桌子', emoji: '🏓' },
  { tayal: 'kkyalan', meaning: '電話', emoji: '📱' },
  { tayal: 'enpit', meaning: '筆', emoji: '✏️' },
  { tayal: 'thekan', meaning: '椅子', emoji: '🪑' },
  { tayal: "iyu'", meaning: '藥物', emoji: '💊' },
  { tayal: 'tennaw', meaning: '電腦', emoji: '💻' },
  { tayal: 'ruku', meaning: '雨傘', emoji: '☂️' },
  { tayal: "toke'", meaning: '手錶', emoji: '⌚' },
];

interface HuntItem {
  object: typeof objects[0];
  position: { x: number; y: number };
  found: boolean;
}

export default function ObjectHunt({ onFinish, week, day }: ObjectHuntProps) {
  const [currentTarget, setCurrentTarget] = useState(0);
  const [items, setItems] = useState<HuntItem[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalItems = 8;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateRandomPosition = (index: number): { x: number; y: number } => {
    // 生成隨機位置，確保物品不會重疊
    const row = Math.floor(index / 4);
    const col = index % 4;

    const baseX = col * 25 + 5;
    const baseY = row * 40 + 5;

    const x = baseX + Math.random() * 15;
    const y = baseY + Math.random() * 25;

    return { x, y };
  };

  useEffect(() => {
    // 隨機選擇8個物品並放置在畫面上
    const selected = shuffleArray(objects).slice(0, totalItems);
    const huntItems: HuntItem[] = selected.map((obj, index) => ({
      object: obj,
      position: generateRandomPosition(index),
      found: false,
    }));

    setItems(huntItems);

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'ObjectHunt', completed: false });
      }
    };
  }, [week, day]);

  const handleItemClick = (index: number) => {
    if (items[index].found || showFeedback) return;

    setAttempts(prev => prev + 1);
    const clickedItem = items[index];
    const targetItem = items[currentTarget];

    if (clickedItem.object.tayal === targetItem.object.tayal) {
      // 找到正確的物品
      setScore(prev => prev + 1);
      setItems(prev => prev.map((item, i) =>
        i === index ? { ...item, found: true } : item
      ));

      setShowFeedback({
        correct: true,
        message: `太棒了！找到了 ${clickedItem.object.meaning}！`
      });

      setTimeout(() => {
        setShowFeedback(null);

        // 移動到下一個目標
        if (currentTarget + 1 >= totalItems) {
          setGameCompleted(true);

          // 追蹤遊戲成績
          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          const finalScore = Math.round((score + 1) / (attempts + 1) * 100);

          trackGameResult({
            week,
            day,
            gameType: 'ObjectHunt',
            score: finalScore,
            attempts: attempts + 1,
            timeSpent,
          });

          if (gameTimer) {
            gameTimer.stop({ week, day, gameType: 'ObjectHunt', completed: true, score: finalScore });
          }
        } else {
          setCurrentTarget(prev => prev + 1);
        }
      }, 1500);
    } else {
      // 找錯物品
      setShowFeedback({
        correct: false,
        message: `這是 ${clickedItem.object.meaning}，請找 ${targetItem.object.meaning}`
      });

      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / attempts) * 100);
    onFinish(finalScore > 50, finalScore);
  };

  const handleRetry = () => {
    setCurrentTarget(0);
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
    setShowFeedback(null);

    // 重新生成物品
    const selected = shuffleArray(objects).slice(0, totalItems);
    const huntItems: HuntItem[] = selected.map((obj, index) => ({
      object: obj,
      position: generateRandomPosition(index),
      found: false,
    }));

    setItems(huntItems);
  };

  if (!items.length) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4">正在準備遊戲…</p>
      </div>
    );
  }

  if (gameCompleted) {
    const finalScore = Math.round((score / attempts) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '🔍'}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {passed ? '尋寶成功！' : '繼續加油！'}
        </h3>
        <p className="text-lg text-gray-900 font-medium mb-6">
          找到 <strong className="text-green-600">{score}</strong> / {totalItems} 個物品
          <br />
          使用了 <strong className="text-blue-600">{attempts}</strong> 次嘗試
          <br />
          效率：<strong className="text-purple-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要效率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">物品詞彙複習：</h4>
          <div className="grid grid-cols-2 gap-3">
            {objects.map((obj, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="text-2xl">{obj.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-blue-600 text-sm">{obj.tayal}</div>
                  <div className="text-gray-800 font-medium text-xs">{obj.meaning}</div>
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

  const targetItem = items[currentTarget];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">物品尋寶遊戲</h2>
        <div className="text-sm text-gray-800 font-medium mb-3">
          已找到：{score} / {totalItems}，嘗試次數：{attempts}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(score / totalItems) * 100}%` }}
          />
        </div>
      </div>

      {/* 目標提示 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-6 text-center">
        <p className="text-lg text-gray-900 font-medium mb-2">請找出：</p>
        <div className="text-3xl font-bold text-orange-600">
          {targetItem.object.tayal}
        </div>
      </div>

      {/* 反饋提示 */}
      {showFeedback && (
        <div
          className={`p-4 mb-4 rounded-lg text-center ${
            showFeedback.correct
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {showFeedback.correct ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <XMarkIcon className="w-5 h-5" />
            )}
            <span className="font-semibold">{showFeedback.message}</span>
          </div>
        </div>
      )}

      {/* 遊戲區域 */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg p-6 mb-4" style={{ height: '400px' }}>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            disabled={item.found || showFeedback !== null}
            style={{
              position: 'absolute',
              left: `${item.position.x}%`,
              top: `${item.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`
              w-16 h-16 rounded-lg border-2 transition-all
              ${item.found
                ? 'opacity-30 cursor-not-allowed bg-gray-200 border-gray-300'
                : 'hover:scale-125 cursor-pointer bg-white border-gray-400 hover:border-blue-500 shadow-lg hover:shadow-xl'
              }
              ${showFeedback ? 'cursor-not-allowed' : ''}
              flex items-center justify-center text-3xl
            `}
          >
            {item.object.emoji}
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-800 font-medium">
        <p>點擊畫面上的物品來完成尋寶任務</p>
      </div>
    </div>
  );
}
