'use client';

import { useEffect, useState } from 'react';
import { getUserProgress, getLevelProgress } from '@/lib/progress';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

export default function XPBar() {
  const [userProgress, setUserProgress] = useState({
    totalXP: 0,
    level: 1,
    currentWeek: 1,
    currentDay: 1,
    completedDays: {}
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const progress = getUserProgress();
    setUserProgress(progress);
  }, []);

  const levelProgress = getLevelProgress(userProgress.totalXP, userProgress.level);

  // 避免 hydration 錯誤，在客戶端渲染完成前顯示加載狀態
  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          <span className="font-bold text-lg">等級 {userProgress.level}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600">
          <StarIcon className="w-5 h-5" />
          <span className="font-medium">{userProgress.totalXP} XP</span>
        </div>
      </div>

      {/* 經驗值進度條 */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{levelProgress.current} / {levelProgress.required} XP</span>
          <span>{levelProgress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${levelProgress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 下一等級提示 */}
      <div className="text-center text-sm text-gray-500">
        {levelProgress.percentage === 100 ? (
          <span className="text-green-600 font-medium">🎉 準備升級到等級 {userProgress.level + 1}！</span>
        ) : (
          <span>還需要 {levelProgress.required - levelProgress.current} XP 升到等級 {userProgress.level + 1}</span>
        )}
      </div>
    </div>
  );
} 