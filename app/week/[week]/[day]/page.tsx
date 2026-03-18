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
import AssessmentModal from '@/components/AssessmentModal';
import { AssessmentResult } from '@/data/assessment';
import {
  HomeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LockClosedIcon,
  BookOpenIcon,
  StarIcon,
  PuzzlePieceIcon,
  PencilIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  LockOpenIcon
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
  const [showPostAssessment, setShowPostAssessment] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // 確保在客戶端渲染完成後才顯示內容，避免 hydration 錯誤
  useEffect(() => {
    setMounted(true);
    setIsDevMode(isDeveloperMode());

    // 獲取用戶名稱
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('userName');
      setUserName(savedName);
    }

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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-stone-800 mb-4">頁面不存在</h1>
          <Link href="/" className="text-forest-600 hover:text-forest-700">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const dayData = weekData[week]?.[day - 1];

  if (!dayData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-stone-800 mb-4">課程內容不存在</h1>
          <Link href="/" className="text-forest-600 hover:text-forest-700">
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  // 在客戶端渲染完成前顯示加載狀態，避免 hydration 錯誤
  if (!mounted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="card-natural p-8 text-center max-w-md">
          <div className="animate-spin h-10 w-10 border-2 border-forest-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">載入課程中...</p>
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

      console.log('[DEBUG] 遊戲完成:', { week, day, score, wasAlreadyCompleted, userName });

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
        console.log('[DEBUG] 顯示問卷');
        setShowSurvey(true);
      } else {
        console.log('[DEBUG] 已經完成過，不顯示問卷');
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

  const handleSurveyComplete = async () => {
    setShowSurvey(false);

    console.log('[DEBUG] 問卷完成 - 檢查後測條件:', { week, day, userName });

    // 檢查是否為最後一週最後一天（第3週第5天）
    if (week === 3 && day === 5 && userName) {
      console.log('[DEBUG] 符合後測條件，檢查是否已完成後測...');

      // 檢查是否已完成課後測驗
      try {
        const response = await fetch(`/api/assessment?userName=${encodeURIComponent(userName)}&assessmentType=post`);
        const data = await response.json();

        console.log('[DEBUG] API 回應:', data);

        if (!data.exists) {
          // 尚未完成課後測驗，顯示測驗
          console.log('[DEBUG] 後測不存在，顯示後測模態框');
          setShowPostAssessment(true);
          return; // 提前結束函數，不執行下面的跳轉
        } else {
          console.log('[DEBUG] 後測已完成，不顯示');
        }
      } catch (error) {
        console.error('檢查課後測驗狀態失敗:', error);
        // 如果檢查失敗，為了安全起見，也顯示測驗
        console.log('[DEBUG] API 錯誤，顯示後測模態框');
        setShowPostAssessment(true);
        return; // 提前結束函數，不執行下面的跳轉
      }
    } else {
      console.log('[DEBUG] 不符合後測條件，跳過後測');
      if (!userName) {
        console.log('[DEBUG] userName 是空的！');
      }
    }

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

  const handlePostAssessmentComplete = async (result: AssessmentResult) => {
    try {
      // 儲存測驗結果到 DynamoDB
      await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      setShowPostAssessment(false);

      // 課後測驗完成後返回首頁
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      console.error('儲存課後測驗結果失敗:', error);
    }
  };

  const renderContent = (content: ContentItem, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div key={index} className="mb-6">
            <p className="text-stone-700 leading-relaxed text-lg">{content.value}</p>
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="card-natural p-8 text-center max-w-md">
          <LockClosedIcon className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-serif text-stone-800 mb-2">課程尚未解鎖</h1>
          <p className="text-stone-600 mb-6">請先完成前面的課程才能解鎖此內容</p>
          <Link
            href="/"
            className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
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
    <div className="min-h-screen bg-nature">
      <div className="container mx-auto px-4 py-8">
        {/* 導航欄 */}
        <div className="card-natural p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                首頁
              </Link>
              <span className="text-stone-400">&bull;</span>
              <span className="text-stone-600">第{week}週</span>
              <span className="text-stone-400">&bull;</span>
              <span className="font-medium text-stone-800">第{day}天</span>
            </div>

            <div className="flex items-center gap-2">
              {completed && (
                <CheckCircleIcon className="w-6 h-6 text-forest-500" />
              )}
              <span className="text-sm text-stone-600">
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
        <div className="card-natural p-6 mb-6">
          <h1 className="text-3xl font-bold font-serif text-stone-800 mb-2">{dayData.title}</h1>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <span className="flex items-center gap-1">
              <BookOpenIcon className="w-4 h-4 text-forest-600" />
              第{week}週 第{day}天
            </span>
            <span className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-gold-500" />
              {dayData.xp} XP
            </span>
            <span className="flex items-center gap-1">
              <PuzzlePieceIcon className="w-4 h-4 text-wood-600" />
              {dayData.game}
            </span>
          </div>
        </div>

        {/* 導航標籤 */}
        <div className="card-natural mb-6">
          <div className="flex border-b border-forest-100">
            <button
              onClick={() => setCurrentSection('content')}
              className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
                currentSection === 'content'
                  ? 'text-forest-700 border-b-2 border-forest-700 bg-forest-50'
                  : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              <BookOpenIcon className="w-4 h-4" /> 學習內容
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              disabled={currentSection === 'content' && !isDevMode && !completed}
              className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
                currentSection === 'quiz'
                  ? 'text-forest-700 border-b-2 border-forest-700 bg-forest-50'
                  : quizCompleted
                  ? 'text-forest-500'
                  : isDevMode || currentSection !== 'content' || completed
                  ? 'text-stone-600 hover:text-stone-800'
                  : 'text-stone-400'
              } ${currentSection === 'content' && !isDevMode && !completed ? 'cursor-not-allowed' : 'hover:text-stone-800'}`}
            >
              <PencilIcon className="w-4 h-4" /> 課後測驗 {quizCompleted && <CheckCircleIcon className="w-4 h-4 text-forest-500" />} {isDevMode && <LockOpenIcon className="w-4 h-4 text-wood-600" />}
            </button>
            <button
              onClick={() => setCurrentSection('game')}
              disabled={!quizCompleted && !isDevMode && !completed}
              className={`flex-1 py-4 px-6 font-medium transition-colors flex items-center justify-center gap-2 ${
                currentSection === 'game'
                  ? 'text-forest-700 border-b-2 border-forest-700 bg-forest-50'
                  : gameCompleted
                  ? 'text-forest-500'
                  : !quizCompleted && !isDevMode && !completed
                  ? 'text-stone-400 cursor-not-allowed'
                  : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              <PuzzlePieceIcon className="w-4 h-4" /> 遊戲關卡 {gameCompleted && <CheckCircleIcon className="w-4 h-4 text-forest-500" />} {isDevMode && !quizCompleted && <LockOpenIcon className="w-4 h-4 text-wood-600" />}
            </button>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="card-natural p-6 mb-6">
          {currentSection === 'content' && (
            <div>
              <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">學習內容</h2>
              {dayData.content.map((item, index) => renderContent(item, index))}

              <div className="text-center mt-8">
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setCurrentSection('quiz')}
                    className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    開始測驗
                  </button>
                  {isDevMode && (
                    <button
                      onClick={() => setCurrentSection('game')}
                      className="bg-forest-500 hover:bg-forest-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <LockOpenIcon className="w-4 h-4" /> 直接進入遊戲
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentSection === 'quiz' && (
            <div>
              <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">課後測驗</h2>

              {/* 測驗失敗提示 */}
              {quizFailed && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ExclamationCircleIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold font-serif text-red-800">測驗未通過</h3>
                      <p className="text-red-600">
                        您答對了 {failedScore.correct} / {failedScore.total} 題，需要全對才能進入下一關卡
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm flex items-start gap-2">
                      <LightBulbIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span><strong>建議：</strong>複習課程教材可以幫助您更好地掌握知識點，然後再重新挑戰測驗！</span>
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleReturnToContent}
                      className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      <BookOpenIcon className="w-5 h-5" /> 返回課程教材
                    </button>
                    <button
                      onClick={handleRetryQuiz}
                      className="flex items-center gap-2 bg-wood-600 hover:bg-wood-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      <ArrowPathIcon className="w-5 h-5" /> 重新測驗
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
              <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6">遊戲關卡</h2>

              {/* 遊戲失敗提示 */}
              {gameFailed && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ExclamationCircleIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold font-serif text-red-800">遊戲挑戰失敗</h3>
                      <p className="text-red-600">
                        您需要達到完美成績才能完成課程並進入下一天的學習
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm flex items-start gap-2">
                      <LightBulbIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span><strong>建議：</strong>重新複習課程教材中的重點內容，熟悉詞彙和發音後再次挑戰遊戲！</span>
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleGameReturnToContent}
                      className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      <BookOpenIcon className="w-5 h-5" /> 返回課程教材
                    </button>
                    <button
                      onClick={handleRetryGame}
                      className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      <PuzzlePieceIcon className="w-5 h-5" /> 重新挑戰遊戲
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
              className="flex items-center gap-2 bg-wood-600 hover:bg-wood-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
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
              className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
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

      {/* 課後測驗（僅第3週第5天） */}
      {userName && (
        <AssessmentModal
          isOpen={showPostAssessment}
          assessmentType="post"
          userName={userName}
          onComplete={handlePostAssessmentComplete}
        />
      )}

      {/* 開發者模式組件 */}
      <DeveloperMode />
    </div>
  );
}