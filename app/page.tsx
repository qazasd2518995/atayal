'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserProgress, isUnlocked, saveUserProgress, loadProgressFromCloud } from '@/lib/progress';
import XPBar from '@/components/XPBar';
import DeveloperMode from '@/components/DeveloperMode';
import NameEntryModal from '@/components/NameEntryModal';
import Leaderboard from '@/components/Leaderboard';
import { trackLogin, trackLogout, incrementLoginCount } from '@/lib/analytics';
import {
  LockClosedIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  ArrowRightOnRectangleIcon,
  GlobeAsiaAustraliaIcon,
  AcademicCapIcon,
  HomeIcon,
  LightBulbIcon,
  DevicePhoneMobileIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/solid';

const weekTitles = [
  '第一週：字母與發音',
  '第二週：生活主題單字',
  '第三週：神話與歷史文本'
];

const weekDescriptions = [
  '建立聲音基礎：學習母音5個 + 子音19個',
  '詞彙分類建構：家庭、身份、身體部位、動物、物品、行動',
  '文化導讀與閱讀任務：洪水與祭神神話故事'
];

const WeekIcons = [
  (props: { className?: string }) => <AcademicCapIcon {...props} />,
  (props: { className?: string }) => <HomeIcon {...props} />,
  (props: { className?: string }) => <BookOpenIcon {...props} />,
];

export default function HomePage() {
  const [userProgress, setUserProgress] = useState({
    currentWeek: 1,
    currentDay: 1,
    completedDays: {} as { [key: string]: boolean },
    totalXP: 0,
    level: 1
  });

  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      setMounted(true);

      // 檢查是否已有用戶名稱
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        setUserName(savedName);
        setIsLoadingProgress(true);

        // 先從本地載入（快速顯示）
        const localProgress = getUserProgress();
        setUserProgress(localProgress);

        // 從雲端載入最新進度
        try {
          const cloudProgress = await loadProgressFromCloud(savedName);
          if (cloudProgress) {
            // 找到雲端進度，使用雲端進度（更可靠）
            await saveUserProgress(cloudProgress);
            setUserProgress(cloudProgress);
          }
          // 如果雲端沒有進度，保留本地進度（不覆蓋）
        } catch (error) {
          console.error('載入雲端進度失敗:', error);
          // 出錯時保留本地進度（不重置）
        } finally {
          setIsLoadingProgress(false);
        }

        // 追蹤登入
        trackLogin(savedName);
        incrementLoginCount();
      } else {
        // 沒有用戶名稱，清除所有本地資料
        localStorage.removeItem('tayal-progress');
        setShowNameModal(true);
      }

      // 追蹤登出（當用戶離開頁面時）
      const handleBeforeUnload = () => {
        trackLogout();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    initializeUser();
  }, []);

  const handleNameSubmit = async (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setIsLoadingProgress(true);

    try {
      // 嘗試從雲端載入進度
      const cloudProgress = await loadProgressFromCloud(name);

      if (cloudProgress) {
        // 找到雲端進度，使用它
        await saveUserProgress(cloudProgress);
        setUserProgress(cloudProgress);
        console.log('歡迎回來！已載入您的進度。');
      } else {
        // 沒有雲端進度，檢查本地是否有進度
        const localProgress = getUserProgress();
        if (localProgress.totalXP > 0 || Object.keys(localProgress.completedDays).length > 0) {
          // 本地有進度，使用本地進度並上傳到雲端
          await saveUserProgress(localProgress);
          setUserProgress(localProgress);
          console.log('歡迎回來！已載入您的本地進度。');
        } else {
          // 本地也沒有進度，使用預設進度（新用戶直接進入大廳）
          const defaultProgress = {
            currentWeek: 1,
            currentDay: 1,
            completedDays: {},
            totalXP: 0,
            level: 1,
          };
          await saveUserProgress(defaultProgress);
          setUserProgress(defaultProgress);
          console.log('歡迎新同學！');
        }
      }
      setShowNameModal(false);
    } catch (error) {
      console.error('載入進度時發生錯誤:', error);
      // 出錯時檢查本地進度
      const localProgress = getUserProgress();
      setUserProgress(localProgress);
      setShowNameModal(false);
    } finally {
      setIsLoadingProgress(false);
    }

    // 追蹤登入
    trackLogin(name);
    incrementLoginCount();
  };

  const handleLogout = async () => {
    if (confirm('確定要登出嗎？您的進度已自動保存到雲端。')) {
      // 追蹤登出
      await trackLogout();

      // 清除本地用戶資訊和進度
      localStorage.removeItem('userName');
      localStorage.removeItem('tayal-progress');

      // 重新載入頁面
      window.location.reload();
    }
  };

  // 在客戶端渲染完成前顯示加載狀態，避免 hydration 錯誤
  if (!mounted) {
    return (
      <div className="min-h-screen bg-nature">
        <div className="container mx-auto px-4 py-8">
          {/* 標題區域 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-stone-800 mb-4 font-serif">
              <GlobeAsiaAustraliaIcon className="w-9 h-9 inline-block text-forest-600 mr-2 align-middle" />
              泰雅語線上學習平台
            </h1>
            <p className="text-lg text-stone-600 mb-6">
              透過4週系統化課程，輕鬆學會泰雅語基礎
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <Link
                href="/pronunciation"
                className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <SpeakerWaveIcon className="w-5 h-5" />
                發音教室
              </Link>
              <Link
                href="/voice-training"
                className="flex items-center gap-2 bg-wood-700 hover:bg-wood-800 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                <MicrophoneIcon className="w-5 h-5" />
                語音訓練中心
              </Link>
            </div>
          </div>

          {/* 加載中狀態 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="card-natural p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-forest-100 rounded mb-4"></div>
                <div className="h-6 bg-forest-100 rounded"></div>
              </div>
            </div>
          </div>

          {/* 學習進度概覽 - 骨架屏 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="card-natural p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-forest-100 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(week => (
                    <div key={week} className="text-center">
                      <div className="w-12 h-12 bg-forest-100 rounded-full mx-auto mb-2"></div>
                      <div className="h-4 bg-forest-100 rounded mb-2"></div>
                      <div className="h-2 bg-forest-100 rounded mb-2"></div>
                      <div className="h-3 bg-forest-100 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 週課程卡片 - 骨架屏 */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map(week => (
                <div key={week} className="card-natural overflow-hidden">
                  <div className="h-2 bg-forest-100"></div>
                  <div className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-forest-100 rounded"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-forest-100 rounded mb-2"></div>
                          <div className="h-4 bg-forest-100 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-forest-100 rounded mb-2"></div>
                      <div className="h-2 bg-forest-100 rounded mb-4"></div>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(day => (
                          <div key={day} className="w-10 h-10 bg-forest-100 rounded-full"></div>
                        ))}
                      </div>
                      <div className="h-10 bg-forest-100 rounded"></div>
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
    if (week === userProgress.currentWeek + 1 && userProgress.currentDay > 5) return 'unlocked';
    return 'locked';
  };

  const getCompletedDaysInWeek = (week: number) => {
    let count = 0;
    for (let day = 1; day <= 5; day++) {
      if (userProgress.completedDays[`${week}-${day}`]) {
        count++;
      }
    }
    return count;
  };

  return (
    <div className="min-h-screen bg-nature">
      <div className="container mx-auto px-4 py-8">
        {/* 標題區域 */}
        <div className="text-center mb-8 relative">
          {/* 登出按鈕 - 右上角 */}
          {userName && (
            <button
              onClick={handleLogout}
              className="absolute top-0 right-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              title="登出"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              登出
            </button>
          )}

          <h1 className="text-4xl font-bold text-stone-800 mb-4 font-serif">
            <GlobeAsiaAustraliaIcon className="w-9 h-9 inline-block text-forest-600 mr-2 align-middle" />
            泰雅語線上學習平台
          </h1>
          {userName && (
            <p className="text-xl text-forest-700 font-semibold mb-2">
              歡迎回來，{userName}！
            </p>
          )}
          <p className="text-lg text-stone-600 mb-6">
            透過3週系統化課程，輕鬆學會泰雅語基礎
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <Link
              href="/pronunciation"
              className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <SpeakerWaveIcon className="w-5 h-5" />
              發音教室
            </Link>
            <Link
              href="/voice-training"
              className="flex items-center gap-2 bg-wood-700 hover:bg-wood-800 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <MicrophoneIcon className="w-5 h-5" />
              語音訓練中心
            </Link>
          </div>
        </div>

        {/* 經驗值條 */}
        <div className="max-w-2xl mx-auto mb-8">
          <XPBar userProgress={userProgress} />
        </div>

        {/* 學習進度概覽 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="card-natural p-6">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 font-serif">學習進度</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(week => {
                const completedDays = getCompletedDaysInWeek(week);
                const progress = (completedDays / 5) * 100;
                const WeekIcon = WeekIcons[week - 1];

                return (
                  <div key={week} className="text-center stagger-item" style={{ animationDelay: `${(week - 1) * 100}ms` }}>
                    <div className="mb-2 flex justify-center">
                      <WeekIcon className="w-7 h-7 text-forest-600" />
                    </div>
                    <h3 className="font-semibold text-stone-700 mb-2 font-serif">第{week}週</h3>
                    <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                      <div
                        className="progress-forest h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-stone-700 font-medium">{completedDays}/5 天</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 排行榜 */}
        <div className="max-w-4xl mx-auto mb-8">
          <Leaderboard currentUserName={userName} />
        </div>

        {/* 週課程卡片 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map(week => {
              const status = getWeekStatus(week);
              const completedDays = getCompletedDaysInWeek(week);
              const isAccessible = status !== 'locked';
              const WeekIcon = WeekIcons[week - 1];

              return (
                <div
                  key={week}
                  className={`card-natural overflow-hidden transition-all duration-200 ${
                    isAccessible ? 'hover:shadow-lg' : 'opacity-60'
                  } ${week === 3 ? 'md:col-span-2' : ''} stagger-item`}
                  style={{ animationDelay: `${(week - 1) * 120}ms` }}
                >
                  <div className={`h-2 ${
                    status === 'completed' ? 'bg-forest-500' :
                    status === 'current' ? 'bg-forest-gradient' :
                    status === 'unlocked' ? 'bg-gold-500' :
                    'bg-stone-300'
                  }`} />

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-forest-50 flex items-center justify-center">
                          <WeekIcon className="w-7 h-7 text-forest-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-stone-800 font-serif">
                            {weekTitles[week - 1]}
                          </h3>
                          <p className="text-stone-600 text-sm">
                            {weekDescriptions[week - 1]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        {status === 'completed' && (
                          <CheckCircleIcon className="w-8 h-8 text-forest-500" />
                        )}
                        {status === 'current' && (
                          <PlayCircleIcon className="w-8 h-8 text-forest-600" />
                        )}
                        {status === 'locked' && (
                          <LockClosedIcon className="w-8 h-8 text-stone-400" />
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-stone-800 font-medium mb-1">
                        <span>完成進度</span>
                        <span>{completedDays}/5 天</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="progress-forest h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedDays / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 天數列表 */}
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(day => {
                        const dayCompleted = userProgress.completedDays[`${week}-${day}`];
                        const dayUnlocked = isUnlocked(week, day);
                        const isClickable = dayCompleted || dayUnlocked;

                        const dayCircleClasses = `w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          dayCompleted
                            ? 'bg-forest-500 text-white'
                            : dayUnlocked
                            ? 'bg-forest-50 text-forest-700 border-2 border-forest-300'
                            : 'bg-stone-200 text-stone-400'
                        } ${isClickable ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}`;

                        return isClickable ? (
                          <Link
                            key={day}
                            href={`/week/${week}/${day}`}
                            className={dayCircleClasses}
                            title={dayCompleted ? `回到第 ${day} 天` : `前往第 ${day} 天`}
                          >
                            {day}
                          </Link>
                        ) : (
                          <div
                            key={day}
                            className={dayCircleClasses}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>

                    {isAccessible ? (
                      <Link
                        href={`/week/${week}/${week === userProgress.currentWeek ? userProgress.currentDay : 1}`}
                        className="block w-full bg-forest-gradient text-white text-center py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                      >
                        {status === 'completed' ? '重新學習' :
                         status === 'current' ? '繼續學習' : '開始學習'}
                      </Link>
                    ) : (
                      <div className="w-full bg-stone-300 text-stone-500 text-center py-3 rounded-lg font-medium">
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
        <div className="text-center mt-12 text-stone-600">
          <p className="mb-2 flex items-center justify-center gap-2">
            <LightBulbIcon className="w-5 h-5 text-gold-500" />
            完成每日課程可獲得經驗值，解鎖新課程和遊戲
          </p>
          <p className="flex items-center justify-center gap-2">
            <DevicePhoneMobileIcon className="w-5 h-5 text-mist-600" />
            右下角有AI助教可以隨時協助您學習
          </p>
        </div>
      </div>

      {/* 名字輸入模態框 */}
      <NameEntryModal isOpen={showNameModal} onNameSubmit={handleNameSubmit} />

      {/* 開發者模式組件 */}
      <DeveloperMode />
    </div>
  );
}
