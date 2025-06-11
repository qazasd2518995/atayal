'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface LetterMatchProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 字母匹配遊戲數據 - 根據新教材內容更新
const gameData = {
  1: { // week 1 - 字母與發音
    letters: ['a', 'i', 'u', 'e', 'o', 'g', 'l', 's', 'b', 'y'],
    words: [
      { letter: 'a', word: 'aba', meaning: '爸爸' },
      { letter: 'a', word: 'abaw', meaning: '葉子' },
      { letter: 'a', word: 'aya', meaning: '媽媽' },
      { letter: 'i', word: 'cyugal', meaning: '三' },
      { letter: 'u', word: 'basu', meaning: '車子' },
      { letter: 'e', word: 'ega', meaning: '電影' },
      { letter: 'g', word: 'gamil', meaning: '根' },
      { letter: 'b', word: 'bonaw', meaning: '花生' },
      { letter: 'c', word: 'cyama', meaning: '商店' },
      { letter: 'e', word: 'enpic', meaning: '鉛筆' }
    ]
  },
  2: { // week 2 - 生活詞彙
    letters: ['y', 'm', 'q', 'k', 'h'],
    words: [
      { letter: 'y', word: "yaba'", meaning: '爸爸' },
      { letter: 'y', word: "yaya'", meaning: '媽媽' },
      { letter: 'm', word: 'mlikuy', meaning: '男孩' },
      { letter: 'k', word: 'kneril', meaning: '女孩' },
      { letter: 'h', word: 'huzil', meaning: '狗' },
      { letter: 'b', word: 'bzyok', meaning: '豬' },
      { letter: 'q', word: "qba'", meaning: '手' },
      { letter: 'r', word: 'roziq', meaning: '眼睛' },
      { letter: 'p', word: 'papak', meaning: '耳朵' },
      { letter: 'n', word: 'nqwaq', meaning: '嘴巴' }
    ]
  }
};

export default function LetterMatch({ onFinish, week }: LetterMatchProps) {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<typeof gameData[1]['words']>([]);

  const data = gameData[week as keyof typeof gameData] || gameData[1];

  // 隨機排序函數
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 初始化時隨機排序
  useEffect(() => {
    setShuffledLetters(shuffleArray(data.letters));
    setShuffledWords(shuffleArray(data.words));
  }, [week]);

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
    data.words.forEach(wordData => {
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
    setShuffledLetters(shuffleArray(data.letters));
    setShuffledWords(shuffleArray(data.words));
  };

  const handleFinish = () => {
    const success = score === data.words.length;
    onFinish(success);
  };

  if (gameCompleted) {
    const success = score === data.words.length;
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
          共 <span className="font-bold">{data.words.length}</span> 題
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
        將左側的字母拖拽到正確的單字上
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
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors min-h-[60px] flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-lg">{wordData.word}</span>
                  <span className="text-gray-600 ml-2">({wordData.meaning})</span>
                </div>
                <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  {matches[wordData.word] && (
                    <span className="font-bold text-xl text-blue-700">
                      {matches[wordData.word].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={checkAnswers}
          disabled={Object.keys(matches).length !== data.words.length}
          className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
        >
          檢查答案
        </button>
      </div>
    </div>
  );
} 