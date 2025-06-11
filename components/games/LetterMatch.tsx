'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface LetterMatchProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 第一週的字母匹配遊戲數據
const gameData = {
  1: { // week 1
    letters: ['a', 'i', 'u', 'e', 'o'],
    words: [
      { letter: 'a', word: 'aba', meaning: '爸爸' },
      { letter: 'i', word: 'ima', meaning: '血' },
      { letter: 'u', word: 'uzi', meaning: '水' },
      { letter: 'e', word: 'emaw', meaning: '爺爺' },
      { letter: 'o', word: 'owa', meaning: '是的' }
    ]
  }
};

export default function LetterMatch({ onFinish, week }: LetterMatchProps) {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const data = gameData[week as keyof typeof gameData] || gameData[1];

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
          {data.words.map(wordData => {
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
            {data.letters.map(letter => (
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
            {data.words.map(wordData => (
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