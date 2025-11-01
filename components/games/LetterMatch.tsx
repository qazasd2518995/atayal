'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult } from '@/lib/analytics';

interface LetterMatchProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 提取當天教材中的字母和詞彙
const extractGameDataFromDay = (week: number, day: number) => {
  // 動態導入對應週的數據
  let weekData;
  try {
    switch (week) {
      case 1:
        weekData = require('@/data/week1').week1;
        break;
      case 2:
        weekData = require('@/data/week2').week2;
        break;
      case 3:
        weekData = require('@/data/week3').week3;
        break;
      default:
        weekData = require('@/data/week1').week1;
    }
  } catch (error) {
    weekData = require('@/data/week1').week1;
  }

  const dayData = weekData[day - 1];
  if (!dayData) return { letters: [], words: [] };

  // 提取教材內容中的字母（從音檔路徑）
  const letters: string[] = [];
  const words: Array<{ letter: string; word: string; meaning: string }> = [];

  dayData.content.forEach((content: any) => {
    if (content.type === 'audio' && content.src) {
      const fileName = content.src.split('/').pop()?.replace('.wav', '') || '';
      if (/^[a-z]$/.test(fileName) || fileName === 'ng' || fileName === "'") {
        if (!letters.includes(fileName)) {
          letters.push(fileName);
        }
      }
    }
    
    // 提取文本中的詞彙（格式：詞彙 (意思) 或 單字：詞彙 (意思)）
    if (content.type === 'text' && content.value) {
      const matches = content.value.match(/(?:單字：)?([a-zA-Z']+)\s*\(([^)]+)\)/g);
      if (matches) {
        matches.forEach((match: string) => {
          const parts = match.match(/(?:單字：)?([a-zA-Z']+)\s*\(([^)]+)\)/);
          if (parts) {
            const word = parts[1];
            const meaning = parts[2];
            const firstLetter = word.toLowerCase().charAt(0);
            
            if (letters.includes(firstLetter)) {
              words.push({ letter: firstLetter, word, meaning });
            }
          }
        });
      }
    }
  });

  return { letters, words };
};

export default function LetterMatch({ onFinish, week, day }: LetterMatchProps) {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null); // 用於點擊選擇模式
  const [touchDragLetter, setTouchDragLetter] = useState<string | null>(null); // 觸控拖移中的字母
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null); // 拖移位置
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null); // 觸控開始位置
  const [pendingDragLetter, setPendingDragLetter] = useState<string | null>(null); // 等待拖曳的字母
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<Array<{ letter: string; word: string; meaning: string }>>([]);
  const [gameData, setGameData] = useState<{ letters: string[], words: Array<{ letter: string; word: string; meaning: string }> }>({ letters: [], words: [] });
  const [startTime, setStartTime] = useState<number>(Date.now());

  // 隨機排序函數
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 初始化遊戲數據
  useEffect(() => {
    const data = extractGameDataFromDay(week, day);
    setGameData(data);
    
    if (data.letters.length > 0 && data.words.length > 0) {
      setShuffledLetters(shuffleArray(data.letters));
      setShuffledWords(shuffleArray(data.words));
    }
  }, [week, day]);

  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWord: string) => {
    e.preventDefault();
    if (draggedLetter) {
      setMatches(prev => ({
        ...prev,
        [targetWord]: draggedLetter
      }));
      setDraggedLetter(null);
    }
  };

  // 點擊選擇字母（行動裝置友善）
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
  };

  // 點擊單字進行配對（行動裝置友善）
  const handleWordClick = (targetWord: string) => {
    if (selectedLetter) {
      setMatches(prev => ({
        ...prev,
        [targetWord]: selectedLetter
      }));
      setSelectedLetter(null);
    }
  };

  // 觸控開始拖移
  const handleTouchStart = (e: React.TouchEvent, letter: string) => {
    const touch = e.touches[0];
    const startPos = { x: touch.clientX, y: touch.clientY };
    setTouchStartPos(startPos);
    setDragPosition(startPos);
    setPendingDragLetter(letter); // 記錄可能要拖曳的字母
  };

  // 觸控拖移中
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos || !pendingDragLetter) return;

    const touch = e.touches[0];
    const newPosition = { x: touch.clientX, y: touch.clientY };

    // 計算移動距離
    const distance = Math.sqrt(
      Math.pow(newPosition.x - touchStartPos.x, 2) +
      Math.pow(newPosition.y - touchStartPos.y, 2)
    );

    // 如果移動距離超過 15px，認為是拖曳操作
    if (distance > 15) {
      // 阻止頁面滾動
      e.preventDefault();

      // 設置拖曳狀態
      if (!touchDragLetter) {
        setTouchDragLetter(pendingDragLetter);
      }

      setDragPosition(newPosition);
    }
  };

  // 觸控結束拖移
  const handleTouchEnd = (e: React.TouchEvent) => {
    // 如果有拖曳操作
    if (touchDragLetter && dragPosition) {
      e.preventDefault();

      const touch = e.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      // 尋找最接近的單字元素
      let wordElement = element;
      let attempts = 0;
      while (wordElement && attempts < 5) {
        if (wordElement.hasAttribute('data-word')) {
          const targetWord = wordElement.getAttribute('data-word');
          if (targetWord) {
            setMatches(prev => ({
              ...prev,
              [targetWord]: touchDragLetter
            }));
          }
          break;
        }
        wordElement = wordElement.parentElement;
        attempts++;
      }
    }

    // 清理所有拖曳狀態
    setTouchDragLetter(null);
    setDragPosition(null);
    setTouchStartPos(null);
    setPendingDragLetter(null);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    gameData.words.forEach(wordData => {
      if (matches[wordData.word] === wordData.letter) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setGameCompleted(true);

    // 追蹤遊戲成績
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // 秒
    const scorePercentage = Math.round((correctCount / gameData.words.length) * 100);

    trackGameResult({
      week,
      day,
      gameType: 'LetterMatch',
      score: scorePercentage,
      attempts: gameData.words.length, // 總題數
      timeSpent,
    });
  };

  const resetGame = () => {
    setMatches({});
    setScore(0);
    setGameCompleted(false);
    setSelectedLetter(null);
    setTouchDragLetter(null);
    setDragPosition(null);
    setTouchStartPos(null);
    setPendingDragLetter(null);
    setStartTime(Date.now()); // 重置計時器
    // 重新隨機排序
    setShuffledLetters(shuffleArray(gameData.letters));
    setShuffledWords(shuffleArray(gameData.words));
  };

  const handleFinish = () => {
    const success = score >= Math.ceil(gameData.words.length * 0.6); // 60%通過率
    const scorePercentage = Math.round((score / gameData.words.length) * 100);
    onFinish(success, scorePercentage);
  };

  // 如果沒有可用的遊戲數據，顯示替代內容
  if (gameData.letters.length === 0 || gameData.words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold mb-4">字母配對遊戲</h3>
        <p className="text-lg mb-6 text-gray-600">
          此課程沒有可配對的字母和詞彙內容，請繼續學習其他課程。
        </p>
        <button
          onClick={() => onFinish(true, 100)}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          完成
        </button>
      </div>
    );
  }

  if (gameCompleted) {
    const success = score === gameData.words.length;
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">
          {success ? '🎉' : '💪'}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          {success ? '恭喜完成！' : '再接再厲！'}
        </h3>
        <p className="text-lg mb-6 text-gray-900">
          您答對了 <span className="font-bold text-green-600">{score}</span> 題，
          共 <span className="font-bold">{gameData.words.length}</span> 題
        </p>
        
        {/* 顯示正確答案 */}
        <div className="text-left mb-6 space-y-2">
          {shuffledWords.map(wordData => {
            const userAnswer = matches[wordData.word];
            const isCorrect = userAnswer === wordData.letter;
            
            return (
              <div key={wordData.word} className="flex items-center gap-3 p-2 border rounded">
                {isCorrect ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <XMarkIcon className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium text-gray-900">{wordData.word}</span>
                <span className="text-gray-800">({wordData.meaning})</span>
                <span className="text-gray-700">→</span>
                <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {userAnswer || '未作答'}
                </span>
                {!isCorrect && (
                  <span className="text-sm text-green-600">
                    正解: {wordData.letter}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetGame}
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

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg relative"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">字母配對遊戲</h2>
      <p className="text-center text-gray-800 font-medium mb-2">
        將左側的字母配對到正確的單字上（第{week}週第{day}天教材內容）
      </p>
      <div className="text-center mb-8 space-y-1">
        <p className="text-sm text-blue-600 font-medium">
          📱 手機用戶：點擊字母後，再點擊要配對的單字
        </p>
        <p className="text-sm text-gray-600">
          💻 電腦用戶：可以拖曳字母到單字上
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 字母區域 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            字母 {selectedLetter && <span className="text-blue-600 text-sm">(已選擇: {selectedLetter.toUpperCase()})</span>}
          </h3>
          <div className="space-y-3">
            {shuffledLetters.map(letter => (
              <div
                key={letter}
                draggable
                onDragStart={() => handleDragStart(letter)}
                onTouchStart={(e) => handleTouchStart(e, letter)}
                onClick={() => handleLetterClick(letter)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center font-bold text-xl select-none ${
                  touchDragLetter === letter
                    ? 'opacity-50'
                    : selectedLetter === letter
                    ? 'bg-blue-500 border-blue-600 text-white scale-105 shadow-lg ring-4 ring-blue-200'
                    : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 active:scale-95'
                }`}
              >
                {letter.toUpperCase()}
                {selectedLetter === letter && (
                  <div className="text-xs mt-1 font-normal">✓ 已選擇</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 單字區域 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            單字 {selectedLetter && <span className="text-blue-600 text-sm">(點擊單字進行配對)</span>}
          </h3>
          <div className="space-y-3">
            {shuffledWords.map(wordData => (
              <div
                key={wordData.word}
                data-word={wordData.word}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, wordData.word)}
                onClick={() => handleWordClick(wordData.word)}
                className={`border-2 border-dashed rounded-lg p-4 min-h-[60px] flex items-center justify-between transition-all ${
                  matches[wordData.word]
                    ? 'border-green-500 bg-green-50'
                    : selectedLetter
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer active:scale-95 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div>
                  <span className="font-medium text-gray-900">{wordData.word}</span>
                  <span className="text-sm text-gray-700 ml-2">({wordData.meaning})</span>
                </div>
                {matches[wordData.word] ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded font-bold">
                    {matches[wordData.word].toUpperCase()}
                  </span>
                ) : selectedLetter ? (
                  <span className="text-blue-500 text-sm">👈 點擊配對</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={checkAnswers}
          disabled={Object.keys(matches).length !== gameData.words.length}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
        >
          檢查答案
        </button>
      </div>

      {/* 拖移中的浮動字母 */}
      {touchDragLetter && dragPosition && (
        <div
          className="fixed pointer-events-none z-50 bg-blue-500 border-2 border-blue-600 text-white rounded-lg p-4 font-bold text-xl shadow-2xl"
          style={{
            left: `${dragPosition.x - 30}px`,
            top: `${dragPosition.y - 30}px`,
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'scale(1.1)',
          }}
        >
          {touchDragLetter.toUpperCase()}
        </div>
      )}
    </div>
  );
} 