'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

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
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<Array<{ letter: string; word: string; meaning: string }>>([]);
  const [gameData, setGameData] = useState<{ letters: string[], words: Array<{ letter: string; word: string; meaning: string }> }>({ letters: [], words: [] });

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

  const checkAnswers = () => {
    let correctCount = 0;
    gameData.words.forEach(wordData => {
      if (matches[wordData.word] === wordData.letter) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setGameCompleted(true);
  };

  const resetGame = () => {
    setMatches({});
    setScore(0);
    setGameCompleted(false);
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
        <h3 className="text-2xl font-bold mb-4">
          {success ? '恭喜完成！' : '再接再厲！'}
        </h3>
        <p className="text-lg mb-6">
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
                <span className="font-medium">{wordData.word}</span>
                <span className="text-gray-600">({wordData.meaning})</span>
                <span className="text-gray-500">→</span>
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
      <h2 className="text-2xl font-bold text-center mb-6">字母配對遊戲</h2>
      <p className="text-center text-gray-600 mb-8">
        將左側的字母拖拽到正確的單字上（第{week}週第{day}天教材內容）
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 字母區域 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">字母</h3>
          <div className="space-y-3">
            {shuffledLetters.map(letter => (
              <div
                key={letter}
                draggable
                onDragStart={() => handleDragStart(letter)}
                className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 cursor-move hover:bg-blue-200 transition-colors text-center font-bold text-xl text-blue-700"
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* 單字區域 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">單字</h3>
          <div className="space-y-3">
            {shuffledWords.map(wordData => (
              <div
                key={wordData.word}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, wordData.word)}
                className={`border-2 border-dashed rounded-lg p-4 min-h-[60px] flex items-center justify-between transition-colors ${
                  matches[wordData.word] 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div>
                  <span className="font-medium">{wordData.word}</span>
                  <span className="text-sm text-gray-600 ml-2">({wordData.meaning})</span>
                </div>
                {matches[wordData.word] && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded font-bold">
                    {matches[wordData.word].toUpperCase()}
                  </span>
                )}
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
    </div>
  );
} 