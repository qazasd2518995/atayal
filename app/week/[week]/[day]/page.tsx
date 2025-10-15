'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { week1 } from '@/data/week1';
import { week2 } from '@/data/week2';
import { week3 } from '@/data/week3';
import { DayData, ContentItem } from '@/data/week1';
import {
  getUserProgress,
  addXP,
  markCompleted,
  isUnlocked,
  isCompleted,
  isDeveloperMode
} from '@/lib/progress';
import { trackCourseCompletion, ActivityTimer } from '@/lib/analytics';
import AudioButton from '@/components/AudioButton';
import Quiz from '@/components/Quiz';
import GameGate from '@/components/GameGate';
import XPBar from '@/components/XPBar';
import DeveloperMode from '@/components/DeveloperMode';
import DailySurvey from '@/components/DailySurvey';
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
  3: week3
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
  const [quizFailed, setQuizFailed] = useState(false);
  const [failedScore, setFailedScore] = useState({ correct: 0, total: 0 });
  const [gameFailed, setGameFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [learningTimer, setLearningTimer] = useState<ActivityTimer | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);

  // 確保在客戶端渲染完成後才顯示內容，避免 hydration 錯誤
  useEffect(() => {
    setMounted(true);
    setIsDevMode(isDeveloperMode());

    // 開始追蹤學習時間
    const timer = new ActivityTimer('learning');
    setLearningTimer(timer);

    // 監聽開發者模式變化
    const checkDevMode = () => {
      setIsDevMode(isDeveloperMode());
    };

    // 定期檢查開發者模式狀態（每秒檢查一次）
    const interval = setInterval(checkDevMode, 1000);

    return () => {
      clearInterval(interval);
      // 停止學習計時器
      if (timer) {
        timer.stop({ week, day });
      }
    };
  }, [week, day]);

  // 檢查參數有效性
  if (!week || !day || week < 1 || week > 3 || day < 1 || day > 5) {
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

  // 在客戶端渲染完成前顯示加載狀態，避免 hydration 錯誤
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">載入課程中...</p>
        </div>
      </div>
    );
  }

  // 檢查課程是否已解鎖
  const unlocked = isUnlocked(week, day);
  const completed = isCompleted(week, day);

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    if (score === totalQuestions) {
      // 全對，進入遊戲關卡（經驗值在遊戲完成時給予）
      setQuizCompleted(true);
      setQuizFailed(false);
      setCurrentSection('game');
      setRefreshKey(prev => prev + 1); // 觸發重新渲染
    } else {
      // 答錯了，顯示失敗提示
      setQuizFailed(true);
      setFailedScore({ correct: score, total: totalQuestions });
    }
  };

  const handleRetryQuiz = () => {
    setQuizFailed(false);
    setFailedScore({ correct: 0, total: 0 });
    setRefreshKey(prev => prev + 1); // 觸發測驗重新渲染
  };

  const handleReturnToContent = () => {
    setQuizFailed(false);
    setCurrentSection('content');
  };

  const handleGameComplete = (success: boolean, score?: number) => {
    if (success && score !== undefined && score > 50) {
      // 檢查這是否是第一次完成
      const wasAlreadyCompleted = completed;

      // 遊戲成功且分數 > 50%，標記課程完成並給經驗值
      markCompleted(week, day);

      // 每次完成都給經驗值（允許重複遊玩獲得經驗）
      addXP(dayData.xp);

      // 追蹤課程完成
      trackCourseCompletion({
        week,
        day,
        xpEarned: dayData.xp,
      });

      setGameCompleted(true);
      setGameFailed(false);
      setRefreshKey(prev => prev + 1);

      // 停止學習計時器
      if (learningTimer) {
        learningTimer.stop({ week, day, completed: true });
      }

      // 只有第一次完成才顯示問卷
      if (!wasAlreadyCompleted) {
        setShowSurvey(true);
      }
    } else {
      // 遊戲失敗或分數 <= 50%，顯示失敗提示
      setGameFailed(true);
    }
  };

  const handleRetryGame = () => {
    setGameFailed(false);
    setRefreshKey(prev => prev + 1); // 觸發遊戲重新渲染
  };

  const handleGameReturnToContent = () => {
    setGameFailed(false);
    setCurrentSection('content');
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);

    // 問卷完成後，自動導向下一天或首頁
    setTimeout(() => {
      if (day < 5) {
        router.push(`/week/${week}/${day + 1}`);
      } else if (week < 3) {
        router.push(`/week/${week + 1}/1`);
      } else {
        router.push('/');
      }
    }, 500);
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
        // 只顯示字母的音檔，單字不顯示音檔
        const audioSrc = content.src?.replace('/audio/', '/alphabet/').replace('.webm', '.wav') || '';
        // 檢查是否為字母音檔（單個字母、ng 或 '）
        const fileName = audioSrc.split('/').pop()?.replace('.wav', '') || '';
        const isLetterAudio = /^[a-z]$/.test(fileName) || fileName === 'ng' || fileName === "'";
        
        if (isLetterAudio) {
          return (
            <div key={index} className="mb-6 flex justify-center">
              <AudioButton src={audioSrc} />
            </div>
          );
        } else {
          // 如果不是字母音檔，就不顯示
          return null;
        }
      
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
    if (day < 5) {
      return { week, day: day + 1, exists: true };
    } else if (week < 3) {
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
              disabled={currentSection === 'content' && !isDevMode && !completed}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentSection === 'quiz'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : quizCompleted
                  ? 'text-green-600'
                  : isDevMode || currentSection !== 'content' || completed
                  ? 'text-gray-600 hover:text-gray-800'
                  : 'text-gray-400'
              } ${currentSection === 'content' && !isDevMode && !completed ? 'cursor-not-allowed' : 'hover:text-gray-800'}`}
            >
              ✏️ 課後測驗 {quizCompleted && '✓'} {isDevMode && '🔓'}
            </button>
            <button
              onClick={() => setCurrentSection('game')}
              disabled={!quizCompleted && !isDevMode && !completed}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentSection === 'game'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : gameCompleted
                  ? 'text-green-600'
                  : !quizCompleted && !isDevMode && !completed
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎮 遊戲關卡 {gameCompleted && '✓'} {isDevMode && !quizCompleted && '🔓'}
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
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setCurrentSection('quiz')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    開始測驗
                  </button>
                  {isDevMode && (
                    <button
                      onClick={() => setCurrentSection('game')}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      🔓 直接進入遊戲
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentSection === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">課後測驗</h2>
              
              {/* 測驗失敗提示 */}
              {quizFailed && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">😔</div>
                    <div>
                      <h3 className="text-lg font-bold text-red-800">測驗未通過</h3>
                      <p className="text-red-600">
                        您答對了 {failedScore.correct} / {failedScore.total} 題，需要全對才能進入下一關卡
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      💡 <strong>建議：</strong>複習課程教材可以幫助您更好地掌握知識點，然後再重新挑戰測驗！
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleReturnToContent}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      📖 返回課程教材
                    </button>
                    <button
                      onClick={handleRetryQuiz}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      🔄 重新測驗
                    </button>
                  </div>
                </div>
              )}
              
              {/* 測驗組件 */}
              {!quizFailed && (
                <Quiz
                  key={refreshKey}
                  questions={dayData.quiz}
                  onComplete={handleQuizComplete}
                  week={week}
                  day={day}
                />
              )}
            </div>
          )}

          {currentSection === 'game' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">遊戲關卡</h2>
              
              {/* 遊戲失敗提示 */}
              {gameFailed && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">😔</div>
                    <div>
                      <h3 className="text-lg font-bold text-red-800">遊戲挑戰失敗</h3>
                      <p className="text-red-600">
                        您需要達到完美成績才能完成課程並進入下一天的學習
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      💡 <strong>建議：</strong>重新複習課程教材中的重點內容，熟悉詞彙和發音後再次挑戰遊戲！
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleGameReturnToContent}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      📖 返回課程教材
                    </button>
                    <button
                      onClick={handleRetryGame}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      🎮 重新挑戰遊戲
                    </button>
                  </div>
                </div>
              )}
              
              {/* 遊戲組件 */}
              {!gameFailed && (
                <GameGate
                  key={refreshKey}
                  week={week}
                  day={day}
                  gameType={dayData.game}
                  xp={dayData.xp}
                  onGameComplete={handleGameComplete}
                />
              )}
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

      </div>

      {/* 問卷調查 */}
      {showSurvey && (
        <DailySurvey
          week={week}
          day={day}
          onComplete={handleSurveyComplete}
        />
      )}

      {/* 開發者模式組件 */}
      <DeveloperMode />
    </div>
  );
} 