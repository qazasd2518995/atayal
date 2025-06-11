'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { week1 } from '@/data/week1';
import { week2 } from '@/data/week2';
import { week3 } from '@/data/week3';
import { week4 } from '@/data/week4';
import { DayData, ContentItem } from '@/data/week1';
import { 
  getUserProgress, 
  addXP, 
  markCompleted, 
  isUnlocked,
  isCompleted 
} from '@/lib/progress';
import AudioButton from '@/components/AudioButton';
import Quiz from '@/components/Quiz';
import GameGate from '@/components/GameGate';
import XPBar from '@/components/XPBar';
import { 
  HomeIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  LockClosedIcon 
} from '@heroicons/react/24/solid';

// 週數據映射
const weekData: { [key: number]: DayData[] } = {
  1: week1,
  2: week2,
  3: week3,
  4: week4
};

export default function DayLessonPage() {
  const params = useParams();
  const router = useRouter();
  const week = parseInt(params.week as string);
  const day = parseInt(params.day as string);

  const [currentSection, setCurrentSection] = useState<'content' | 'quiz' | 'game'>('content');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 檢查參數有效性
  if (!week || !day || week < 1 || week > 4 || day < 1 || day > 7) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">頁面不存在</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const dayData = weekData[week]?.[day - 1];
  
  if (!dayData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">課程內容不存在</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  // 檢查課程是否已解鎖
  const unlocked = isUnlocked(week, day);
  const completed = isCompleted(week, day);

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    if (score === totalQuestions) {
      // 全對才給經驗值
      addXP(dayData.xp);
      setQuizCompleted(true);
      setCurrentSection('game');
      setRefreshKey(prev => prev + 1); // 觸發重新渲染
    } else {
      // 答錯了，可以重新測驗
      alert('請再試一次！完全答對才能繼續到遊戲關卡。');
    }
  };

  const handleGameComplete = (success: boolean) => {
    if (success) {
      // 遊戲成功，標記課程完成
      markCompleted(week, day);
      addXP(dayData.xp);
      setGameCompleted(true);
      setRefreshKey(prev => prev + 1);
      
      // 自動導向下一天或首頁
      setTimeout(() => {
        if (day < 7) {
          router.push(`/week/${week}/${day + 1}`);
        } else if (week < 4) {
          router.push(`/week/${week + 1}/1`);
        } else {
          router.push('/');
        }
      }, 2000);
    }
  };

  const renderContent = (content: ContentItem, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div key={index} className="mb-6">
            <p className="text-gray-700 leading-relaxed text-lg">{content.value}</p>
          </div>
        );
      
      case 'audio':
        // 更新音檔路徑以使用 alphabet 資料夾
        const audioSrc = content.src?.replace('/audio/', '/alphabet/').replace('.mp3', '.webm') || '';
        return (
          <div key={index} className="mb-6 flex justify-center">
            <AudioButton src={audioSrc} />
          </div>
        );
      
      case 'image':
        return (
          <div key={index} className="mb-6 flex justify-center">
            <img 
              src={content.src} 
              alt={content.alt || '課程圖片'} 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const getNextDayInfo = () => {
    if (day < 7) {
      return { week, day: day + 1, exists: true };
    } else if (week < 4) {
      return { week: week + 1, day: 1, exists: true };
    }
    return { week: 0, day: 0, exists: false };
  };

  const getPrevDayInfo = () => {
    if (day > 1) {
      return { week, day: day - 1, exists: true };
    } else if (week > 1) {
      return { week: week - 1, day: 7, exists: true };
    }
    return { week: 0, day: 0, exists: false };
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <LockClosedIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">課程尚未解鎖</h1>
          <p className="text-gray-600 mb-6">請先完成前面的課程才能解鎖此內容</p>
          <Link 
            href="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const nextDay = getNextDayInfo();
  const prevDay = getPrevDayInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 導航欄 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                首頁
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">第{week}週</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-gray-800">第{day}天</span>
            </div>
            
            <div className="flex items-center gap-2">
              {completed && (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              )}
              <span className="text-sm text-gray-600">
                第{week}週 第{day}天
              </span>
            </div>
          </div>
        </div>

        {/* 經驗值條 */}
        <div key={refreshKey} className="max-w-2xl mx-auto mb-6">
          <XPBar />
        </div>

        {/* 課程標題 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{dayData.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>📚 第{week}週 第{day}天</span>
            <span>⭐ {dayData.xp} XP</span>
            <span>🎮 {dayData.game}</span>
          </div>
        </div>

        {/* 導航標籤 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setCurrentSection('content')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentSection === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📖 學習內容
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              disabled={currentSection === 'content'}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentSection === 'quiz'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : quizCompleted
                  ? 'text-green-600'
                  : 'text-gray-400'
              } ${currentSection === 'content' ? 'cursor-not-allowed' : 'hover:text-gray-800'}`}
            >
              ✏️ 課後測驗 {quizCompleted && '✓'}
            </button>
            <button
              onClick={() => setCurrentSection('game')}
              disabled={!quizCompleted}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentSection === 'game'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : gameCompleted
                  ? 'text-green-600'
                  : !quizCompleted
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎮 遊戲關卡 {gameCompleted && '✓'}
            </button>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {currentSection === 'content' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">學習內容</h2>
              {dayData.content.map((item, index) => renderContent(item, index))}
              
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentSection('quiz')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  開始測驗
                </button>
              </div>
            </div>
          )}

          {currentSection === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">課後測驗</h2>
              <Quiz 
                questions={dayData.quiz} 
                onComplete={handleQuizComplete}
              />
            </div>
          )}

          {currentSection === 'game' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">遊戲關卡</h2>
              <GameGate
                week={week}
                day={day}
                gameType={dayData.game}
                xp={dayData.xp}
                onGameComplete={handleGameComplete}
              />
            </div>
          )}
        </div>

        {/* 底部導航 */}
        <div className="flex justify-between items-center">
          {prevDay.exists ? (
            <Link
              href={`/week/${prevDay.week}/${prevDay.day}`}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              上一課
            </Link>
          ) : (
            <div></div>
          )}

          {nextDay.exists && completed && (
            <Link
              href={`/week/${nextDay.week}/${nextDay.day}`}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              下一課
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          )}
        </div>

        {gameCompleted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">課程完成！</h3>
              <p className="text-gray-600 mb-4">
                恭喜您完成第{week}週第{day}天的學習！
              </p>
              <p className="text-sm text-gray-500">
                即將自動跳轉到下一課程...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 