'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface ActionSimonProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 動作詞彙數據
const actions = [
  { tayal: "ql'i", meaning: '關上', emoji: '🚪', animation: 'close' },
  { tayal: 'gmyah', meaning: '打開', emoji: '📂', animation: 'open' },
  { tayal: 'mosa', meaning: '去', emoji: '🚶', animation: 'walk' },
  { tayal: 'tbaziy', meaning: '賣', emoji: '💸', animation: 'sell' },
  { tayal: 'mbaziy', meaning: '買', emoji: '🛒', animation: 'buy' },
  { tayal: 'miq', meaning: '給', emoji: '🤝', animation: 'give' },
  { tayal: 'uwah', meaning: '過來', emoji: '👋', animation: 'come' },
  { tayal: 'muwah', meaning: '來', emoji: '🏃', animation: 'arrive' },
  { tayal: 'ksyuw', meaning: '借', emoji: '📚', animation: 'borrow' },
  { tayal: "mhkani'", meaning: '走路', emoji: '🚶‍♂️', animation: 'walk' },
  { tayal: 'shriq', meaning: '走(離開)', emoji: '🚶‍♀️', animation: 'leave' },
  { tayal: "mlaka'", meaning: '飛', emoji: '🦅', animation: 'fly' },
  { tayal: 'qinah', meaning: '跑', emoji: '🏃‍♂️', animation: 'run' },
  { tayal: "mtta'", meaning: '抵達', emoji: '🎯', animation: 'arrive' },
];

export default function ActionSimon({ onFinish, week, day }: ActionSimonProps) {
  const [sequence, setSequence] = useState<typeof actions>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [highlightedAction, setHighlightedAction] = useState<string>('');
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const maxRounds = 8;
  const sequenceLength = 3;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'ActionSimon', completed: false });
      }
    };
  }, [week, day]);

  const generateNewSequence = () => {
    const shuffled = shuffleArray(actions);
    return shuffled.slice(0, sequenceLength);
  };

  const startGame = () => {
    const newSequence = generateNewSequence();
    setSequence(newSequence);
    setGameStarted(true);
    setUserSequence([]);
    setCurrentIndex(0);
    showSequenceToUser(newSequence);
  };

  const showSequenceToUser = async (seq: typeof actions) => {
    setShowingSequence(true);

    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setHighlightedAction(seq[i].tayal);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHighlightedAction('');
    }

    setShowingSequence(false);
  };

  const handleActionClick = (actionTayal: string) => {
    if (showingSequence || showFeedback) return;

    const newUserSequence = [...userSequence, actionTayal];
    setUserSequence(newUserSequence);

    // 檢查是否正確
    const isCorrect = actionTayal === sequence[currentIndex].tayal;

    if (!isCorrect) {
      // 回答錯誤
      setShowFeedback({
        correct: false,
        message: `錯誤！正確的動作是：${sequence[currentIndex].meaning}`
      });

      setTimeout(() => {
        setShowFeedback(null);

        if (round >= maxRounds) {
          // 遊戲結束
          setGameCompleted(true);

          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          const finalScore = Math.round((score / maxRounds) * 100);

          trackGameResult({
            week,
            day,
            gameType: 'ActionSimon',
            score: finalScore,
            attempts: maxRounds,
            timeSpent,
          });

          if (gameTimer) {
            gameTimer.stop({ week, day, gameType: 'ActionSimon', completed: true, score: finalScore });
          }
        } else {
          // 開始新回合
          setRound(prev => prev + 1);
          setCurrentIndex(0);
          setUserSequence([]);
          const newSeq = generateNewSequence();
          setSequence(newSeq);
          showSequenceToUser(newSeq);
        }
      }, 2000);
    } else {
      // 回答正確
      if (currentIndex + 1 >= sequenceLength) {
        // 完成一輪
        setScore(prev => prev + 1);
        setShowFeedback({
          correct: true,
          message: '太棒了！順序完全正確！'
        });

        setTimeout(() => {
          setShowFeedback(null);

          if (round >= maxRounds) {
            // 遊戲結束
            setGameCompleted(true);

            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            const finalScore = Math.round(((score + 1) / maxRounds) * 100);

            trackGameResult({
              week,
              day,
              gameType: 'ActionSimon',
              score: finalScore,
              attempts: maxRounds,
              timeSpent,
            });

            if (gameTimer) {
              gameTimer.stop({ week, day, gameType: 'ActionSimon', completed: true, score: finalScore });
            }
          } else {
            // 開始新回合
            setRound(prev => prev + 1);
            setCurrentIndex(0);
            setUserSequence([]);
            const newSeq = generateNewSequence();
            setSequence(newSeq);
            showSequenceToUser(newSeq);
          }
        }, 2000);
      } else {
        // 繼續這一輪
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / maxRounds) * 100);
    onFinish(finalScore > 50, finalScore);
  };

  const handleRetry = () => {
    setSequence([]);
    setCurrentIndex(0);
    setUserSequence([]);
    setShowingSequence(false);
    setGameStarted(false);
    setScore(0);
    setRound(1);
    setGameCompleted(false);
    setShowFeedback(null);
    setHighlightedAction('');
  };

  if (gameCompleted) {
    const finalScore = Math.round((score / maxRounds) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '🎮'}</div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          {passed ? '記憶力超強！' : '繼續加油！'}
        </h3>
        <p className="text-lg mb-6 text-gray-900">
          成功記住 <strong className="text-green-600">{score}</strong> / {maxRounds} 輪
          <br />
          正確率：<strong className="text-blue-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要正確率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h4 className="font-semibold mb-3 text-center text-gray-900">動作詞彙複習：</h4>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="text-2xl">{action.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-blue-600 text-sm">{action.tayal}</div>
                  <div className="text-gray-600 text-xs">{action.meaning}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-50"
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

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">動作記憶遊戲</h2>
        <p className="text-lg text-gray-800 font-medium mb-6">
          記住動作的順序，然後按照正確的順序點擊！
        </p>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-2 text-gray-900">遊戲規則：</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>每輪會顯示 {sequenceLength} 個動作的順序</li>
            <li>記住順序後，依序點擊正確的動作</li>
            <li>共有 {maxRounds} 輪挑戰</li>
            <li>答對越多輪，得分越高</li>
          </ul>
        </div>

        <button
          onClick={startGame}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg"
        >
          開始遊戲
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">動作記憶遊戲</h2>
        <div className="text-sm text-gray-800 font-medium mb-3">
          第 {round} / {maxRounds} 輪，得分 {score}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(round / maxRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* 狀態提示 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6 text-center">
        {showingSequence ? (
          <p className="text-lg font-semibold text-purple-600">
            👀 請記住動作順序...
          </p>
        ) : (
          <p className="text-lg font-semibold text-blue-600">
            🎯 請按照順序點擊動作 ({userSequence.length} / {sequenceLength})
          </p>
        )}
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

      {/* 動作按鈕區 */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.tayal}
            onClick={() => handleActionClick(action.tayal)}
            disabled={showingSequence || showFeedback !== null}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${highlightedAction === action.tayal
                ? 'border-yellow-500 bg-yellow-100 scale-110 animate-pulse'
                : userSequence.includes(action.tayal)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }
              ${showingSequence || showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
              flex flex-col items-center gap-2
            `}
          >
            <span className="text-3xl">{action.emoji}</span>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-700">{action.tayal}</div>
              <div className="text-xs text-gray-500">{action.meaning}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>記住閃爍的動作順序，然後依序點擊</p>
      </div>
    </div>
  );
}
