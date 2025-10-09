'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface AnimalSoundMatchProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 動物數據
const animals = [
  { tayal: 'bzyok', meaning: '豬', emoji: '🐷', sound: '呼嚕嚕' },
  { tayal: 'huzil', meaning: '狗', emoji: '🐕', sound: '汪汪' },
  { tayal: 'mit', meaning: '羊', emoji: '🐑', sound: '咩咩' },
  { tayal: 'ngyaw', meaning: '貓', emoji: '🐱', sound: '喵喵' },
  { tayal: 'qbhniq', meaning: '鳥', emoji: '🐦', sound: '啾啾' },
  { tayal: 'qulih', meaning: '魚', emoji: '🐟', sound: '咕嚕' },
  { tayal: "ngta'", meaning: '雞', emoji: '🐔', sound: '咕咕' },
  { tayal: 'yungay', meaning: '猴子', emoji: '🐵', sound: '嗚嗚' },
  { tayal: 'kacing', meaning: '牛', emoji: '🐮', sound: '哞哞' },
  { tayal: "qoli'", meaning: '老鼠', emoji: '🐭', sound: '吱吱' },
  { tayal: 'qpatung', meaning: '青蛙', emoji: '🐸', sound: '呱呱' },
  { tayal: 'nguzyaq', meaning: '貓頭鷹', emoji: '🦉', sound: '咕咕' },
];

export default function AnimalSoundMatch({ onFinish, week, day }: AnimalSoundMatchProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const [selectedMeaning, setSelectedMeaning] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [shuffledAnimals, setShuffledAnimals] = useState<typeof animals>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<typeof animals>([]);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalPairs = 8;
  const totalAttempts = 10;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 隨機選擇8種動物並打亂順序
    const selected = shuffleArray(animals).slice(0, totalPairs);
    setShuffledAnimals(shuffleArray([...selected]));
    setShuffledMeanings(shuffleArray([...selected]));

    // 開始遊戲計時
    const timer = new ActivityTimer('game');
    setGameTimer(timer);
    setStartTime(Date.now());

    return () => {
      if (timer) {
        timer.stop({ week, day, gameType: 'AnimalSoundMatch', completed: false });
      }
    };
  }, [week, day]);

  const handleAnimalClick = (tayal: string) => {
    if (showResult || matchedPairs.has(tayal)) return;

    if (selectedAnimal === tayal) {
      setSelectedAnimal('');
    } else {
      setSelectedAnimal(tayal);
      if (selectedMeaning) {
        checkMatch(tayal, selectedMeaning);
      }
    }
  };

  const handleMeaningClick = (meaning: string) => {
    if (showResult || matchedPairs.has(meaning)) return;

    if (selectedMeaning === meaning) {
      setSelectedMeaning('');
    } else {
      setSelectedMeaning(meaning);
      if (selectedAnimal) {
        checkMatch(selectedAnimal, meaning);
      }
    }
  };

  const checkMatch = (animalTayal: string, meaning: string) => {
    const animal = shuffledAnimals.find(a => a.tayal === animalTayal);

    if (animal && animal.meaning === meaning) {
      // 配對成功
      setScore(prev => prev + 1);
      setMatchedPairs(prev => new Set([...prev, animalTayal]));
      setSelectedAnimal('');
      setSelectedMeaning('');

      // 檢查是否完成所有配對
      if (matchedPairs.size + 1 >= totalPairs) {
        setGameCompleted(true);

        // 追蹤遊戲成績
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.round(((score + 1) / totalPairs) * 100);

        trackGameResult({
          week,
          day,
          gameType: 'AnimalSoundMatch',
          score: finalScore,
          attempts: currentRound + 1,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'AnimalSoundMatch', completed: true, score: finalScore });
        }
      }
    } else {
      // 配對失敗
      setShowResult(true);
      setCurrentRound(prev => prev + 1);

      setTimeout(() => {
        setSelectedAnimal('');
        setSelectedMeaning('');
        setShowResult(false);

        // 檢查是否達到最大嘗試次數
        if (currentRound + 1 >= totalAttempts) {
          setGameCompleted(true);

          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          const finalScore = Math.round((score / totalPairs) * 100);

          trackGameResult({
            week,
            day,
            gameType: 'AnimalSoundMatch',
            score: finalScore,
            attempts: currentRound + 1,
            timeSpent,
          });

          if (gameTimer) {
            gameTimer.stop({ week, day, gameType: 'AnimalSoundMatch', completed: true, score: finalScore });
          }
        }
      }, 1500);
    }
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / totalPairs) * 100);
    onFinish(score >= totalPairs * 0.5, finalScore);
  };

  const handleRetry = () => {
    setCurrentRound(0);
    setScore(0);
    setMatchedPairs(new Set());
    setSelectedAnimal('');
    setSelectedMeaning('');
    setShowResult(false);
    setGameCompleted(false);

    // 重新生成題目
    const selected = shuffleArray(animals).slice(0, totalPairs);
    setShuffledAnimals(shuffleArray([...selected]));
    setShuffledMeanings(shuffleArray([...selected]));
  };

  if (!shuffledAnimals.length || !shuffledMeanings.length) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4">正在準備題目…</p>
      </div>
    );
  }

  if (gameCompleted) {
    const finalScore = Math.round((score / totalPairs) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '🐾'}</div>
        <h3 className="text-2xl font-bold mb-4">
          {passed ? '太棒了！' : '繼續加油！'}
        </h3>
        <p className="text-lg mb-6">
          成功配對 <strong className="text-green-600">{score}</strong> / {totalPairs} 組動物
          <br />
          使用了 <strong className="text-blue-600">{currentRound}</strong> 次嘗試
          <br />
          正確率：<strong className="text-purple-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要正確率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h4 className="font-semibold mb-3 text-center">動物詞彙複習：</h4>
          <div className="grid grid-cols-2 gap-3">
            {animals.map((animal, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="text-2xl">{animal.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-blue-600 text-sm">{animal.tayal}</div>
                  <div className="text-gray-600 text-xs">{animal.meaning} ({animal.sound})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
        <h2 className="text-2xl font-bold mb-2">動物配對遊戲</h2>
        <div className="text-sm text-gray-600 mb-3">
          已配對：{score} / {totalPairs}，嘗試次數：{currentRound} / {totalAttempts}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(score / totalPairs) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-center text-gray-600 mb-6">
        點擊左側的動物和右側的中文，配對正確的動物名稱
      </p>

      {showResult && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-800 text-center">
          <div className="flex items-center justify-center gap-2">
            <XMarkIcon className="w-5 h-5" />
            <span className="font-semibold">配對錯誤！請再試一次</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* 左側：泰雅語動物 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-blue-600 mb-3">泰雅語</h3>
          {shuffledAnimals.map((animal) => (
            <button
              key={animal.tayal}
              onClick={() => handleAnimalClick(animal.tayal)}
              disabled={matchedPairs.has(animal.tayal) || showResult}
              className={`
                w-full p-4 rounded-lg border-2 transition-all
                ${matchedPairs.has(animal.tayal)
                  ? 'border-green-500 bg-green-50 opacity-50 cursor-not-allowed'
                  : selectedAnimal === animal.tayal
                  ? 'border-blue-500 bg-blue-100 scale-105'
                  : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
                ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                flex items-center gap-3
              `}
            >
              <div className="flex-1 text-center">
                <div className="font-semibold text-lg">{animal.tayal}</div>
                <div className="text-sm text-gray-500">{animal.sound}</div>
              </div>
              {matchedPairs.has(animal.tayal) && (
                <CheckIcon className="w-5 h-5 text-green-500" />
              )}
            </button>
          ))}
        </div>

        {/* 右側：中文意思 */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center text-green-600 mb-3">中文</h3>
          {shuffledMeanings.map((animal) => (
            <button
              key={animal.meaning}
              onClick={() => handleMeaningClick(animal.meaning)}
              disabled={matchedPairs.has(animal.tayal) || showResult}
              className={`
                w-full p-4 rounded-lg border-2 transition-all
                ${matchedPairs.has(animal.tayal)
                  ? 'border-green-500 bg-green-50 opacity-50 cursor-not-allowed'
                  : selectedMeaning === animal.meaning
                  ? 'border-blue-500 bg-blue-100 scale-105'
                  : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
                ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="font-semibold text-lg">{animal.meaning}</div>
              {matchedPairs.has(animal.tayal) && (
                <div className="flex items-center justify-center mt-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>先點擊左側的動物，再點擊右側的中文意思進行配對</p>
      </div>
    </div>
  );
}
