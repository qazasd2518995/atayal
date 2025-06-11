'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserProgress, isUnlocked } from '@/lib/progress';
import XPBar from '@/components/XPBar';
import { 
  LockClosedIcon, 
  CheckCircleIcon, 
  PlayCircleIcon,
  BookOpenIcon,
  SpeakerWaveIcon 
} from '@heroicons/react/24/solid';

const weekTitles = [
  '第一週：母音學習',
  '第二週：子音學習', 
  '第三週：詞彙學習',
  '第四週：對話練習'
];

const weekDescriptions = [
  '學習泰雅語的五個基本母音：a, i, u, e, o',
  '掌握泰雅語的子音發音技巧',
  '學習家族、身體、顏色、數字、動物等詞彙',
  '練習日常對話和基本句型'
];

const weekEmojis = ['🅰️', '🅱️', '📚', '💬'];

export default function HomePage() {
  const [userProgress, setUserProgress] = useState({
    currentWeek: 1,
    currentDay: 1,
    completedDays: {} as { [key: string]: boolean },
    totalXP: 0,
    level: 1
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const progress = getUserProgress();
    setUserProgress(progress);
  }, []);

  // 在客戶端渲染完成前顯示加載狀態，避免 hydration 錯誤
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* 標題區域 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🏔️ 泰雅語線上學習平台
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              透過4週系統化課程，輕鬆學會泰雅語基礎
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <Link 
                href="/pronunciation"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <SpeakerWaveIcon className="w-5 h-5" />
                發音教室
              </Link>
            </div>
          </div>

          {/* 加載中狀態 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* 學習進度概覽 - 骨架屏 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(week => (
                    <div key={week} className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 週課程卡片 - 骨架屏 */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(week => (
                <div key={week} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-2 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded mb-4"></div>
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                          <div key={day} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        ))}
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getWeekStatus = (week: number) => {
    if (week < userProgress.currentWeek) return 'completed';
    if (week === userProgress.currentWeek) return 'current';
    if (week === userProgress.currentWeek + 1 && userProgress.currentDay > 7) return 'unlocked';
    return 'locked';
  };

  const getCompletedDaysInWeek = (week: number) => {
    let count = 0;
    for (let day = 1; day <= 7; day++) {
      if (userProgress.completedDays[`${week}-${day}`]) {
        count++;
      }
    }
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏔️ 泰雅語線上學習平台
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            透過4週系統化課程，輕鬆學會泰雅語基礎
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <Link 
              href="/pronunciation"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <SpeakerWaveIcon className="w-5 h-5" />
              發音教室
            </Link>
          </div>
        </div>

        {/* 經驗值條 */}
        <div className="max-w-2xl mx-auto mb-8">
          <XPBar />
        </div>

        {/* 學習進度概覽 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">學習進度</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(week => {
                const completedDays = getCompletedDaysInWeek(week);
                const progress = (completedDays / 7) * 100;
                
                return (
                  <div key={week} className="text-center">
                    <div className="text-2xl mb-2">{weekEmojis[week - 1]}</div>
                    <h3 className="font-semibold text-gray-700 mb-2">第{week}週</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{completedDays}/7 天</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 週課程卡片 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(week => {
              const status = getWeekStatus(week);
              const completedDays = getCompletedDaysInWeek(week);
              const isAccessible = status !== 'locked';
              
              return (
                <div
                  key={week}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                    isAccessible ? 'hover:shadow-lg' : 'opacity-60'
                  }`}
                >
                  <div className={`h-2 ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'current' ? 'bg-blue-500' :
                    status === 'unlocked' ? 'bg-yellow-500' :
                    'bg-gray-300'
                  }`} />
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{weekEmojis[week - 1]}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {weekTitles[week - 1]}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {weekDescriptions[week - 1]}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        {status === 'completed' && (
                          <CheckCircleIcon className="w-8 h-8 text-green-500" />
                        )}
                        {status === 'current' && (
                          <PlayCircleIcon className="w-8 h-8 text-blue-500" />
                        )}
                        {status === 'locked' && (
                          <LockClosedIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>完成進度</span>
                        <span>{completedDays}/7 天</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedDays / 7) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 天數列表 */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {[1, 2, 3, 4, 5, 6, 7].map(day => {
                        const dayCompleted = userProgress.completedDays[`${week}-${day}`];
                        const dayUnlocked = isUnlocked(week, day);
                        
                        return (
                          <div
                            key={day}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              dayCompleted
                                ? 'bg-green-500 text-white'
                                : dayUnlocked
                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>

                    {isAccessible ? (
                      <Link
                        href={`/week/${week}/${week === userProgress.currentWeek ? userProgress.currentDay : 1}`}
                        className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-medium transition-colors duration-200"
                      >
                        {status === 'completed' ? '重新學習' : 
                         status === 'current' ? '繼續學習' : '開始學習'}
                      </Link>
                    ) : (
                      <div className="w-full bg-gray-300 text-gray-500 text-center py-3 rounded-lg font-medium">
                        尚未解鎖
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部資訊 */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-2">
            💡 完成每日課程可獲得經驗值，解鎖新課程和遊戲
          </p>
          <p>
            📱 右下角有AI助教可以隨時協助您學習
          </p>
        </div>
      </div>
    </div>
  );
}
