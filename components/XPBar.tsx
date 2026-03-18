'use client';

import { useEffect, useState } from 'react';
import { getUserProgress, getLevelProgress, UserProgress } from '@/lib/progress';
import { TrophyIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface XPBarProps {
  userProgress?: UserProgress;
}

export default function XPBar({ userProgress: externalProgress }: XPBarProps) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    level: 1,
    currentWeek: 1,
    currentDay: 1,
    completedDays: {}
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 如果沒有外部傳入的進度，從 localStorage 讀取
    if (!externalProgress) {
      const progress = getUserProgress();
      setUserProgress(progress);
    }
  }, [externalProgress]);

  // 當外部進度改變時，更新顯示
  useEffect(() => {
    if (externalProgress) {
      setUserProgress(externalProgress);
    }
  }, [externalProgress]);

  const levelProgress = getLevelProgress(userProgress.totalXP, userProgress.level);

  // 避免 hydration 錯誤，在客戶端渲染完成前顯示加載狀態
  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-stone-200 rounded"></div>
              <div className="h-6 bg-stone-200 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-stone-200 rounded"></div>
              <div className="h-5 bg-stone-200 rounded w-16"></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <div className="h-4 bg-stone-200 rounded w-24"></div>
              <div className="h-4 bg-stone-200 rounded w-12"></div>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-stone-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-gold-500" />
          <span className="font-serif font-bold text-lg text-gray-900">等級 {userProgress.level}</span>
        </div>
        <div className="flex items-center gap-1 text-forest-600">
          <StarIcon className="w-5 h-5" />
          <span className="font-medium">{userProgress.totalXP} XP</span>
        </div>
      </div>

      {/* 經驗值進度條 */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-800 font-medium mb-1">
          <span>{levelProgress.current} / {levelProgress.required} XP</span>
          <span>{levelProgress.percentage}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-3">
          <div
            className="xp-bar-gradient h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${levelProgress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 下一等級提示 */}
      <div className="text-center text-sm text-gray-700">
        {levelProgress.percentage === 100 ? (
          <span className="text-forest-700 font-medium inline-flex items-center gap-1">
            <SparklesIcon className="w-4 h-4 text-forest-600" />
            準備升級到等級 {userProgress.level + 1}！
          </span>
        ) : (
          <span className="font-medium">還需要 {levelProgress.required - levelProgress.current} XP 升到等級 {userProgress.level + 1}</span>
        )}
      </div>
    </div>
  );
}