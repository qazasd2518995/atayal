'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import AudioButton from '../AudioButton';

interface PronunciationPracticeProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 提取當天教材中的字母和發音要領
const extractPronunciationDataFromDay = (week: number, day: number) => {
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
  if (!dayData) return { letters: [], title: '發音練習' };

  // 提取教材內容中的字母（從音檔路徑）
  const letters: Array<{ letter: string; tips: string }> = [];

  // 基本發音要領數據庫
  const pronunciationTips: { [key: string]: string } = {
    'a': '嘴張大，舌頭平放，類似中文「啊」',
    'i': '嘴角往兩側拉，舌頭高起，類似中文「衣」',
    'u': '嘴唇圓起來，類似中文「烏」',
    'e': '嘴巴半開，舌頭稍微抬起，類似中文「耶」',
    'o': '嘴唇圓起，開口比 u 大一些，類似中文「喔」',
    'b': '雙唇緊閉後突然打開，聲帶振動',
    'g': '舌根接觸軟顎，聲帶振動',
    's': '舌尖接近上牙，氣流摩擦發聲',
    'y': '舌頭中部抬起接近硬顎，聲帶振動',
    'm': '雙唇緊閉，氣流從鼻腔通過，聲帶振動',
    'n': '舌尖接觸上牙齦，氣流從鼻腔通過',
    'k': '舌根接觸軟顎，不振動聲帶',
    'h': '氣流從喉嚨輕輕呼出，不振動聲帶',
    'q': '舌根後部緊貼軟顎，然後突然放開',
    'r': '舌尖輕彈或顫動，類似彈舌音',
    'l': '舌尖接觸上牙齦，氣流從舌邊通過',
    'ng': '舌根接觸軟顎，氣流從鼻腔通過',
    'p': '雙唇緊閉後突然打開，不振動聲帶',
    't': '舌尖接觸上牙齦，然後突然放開',
    'c': '舌面接觸硬顎，然後突然放開',
    'z': '舌尖接近上牙，聲帶振動',
    'w': '雙唇圓起，然後迅速張開',
    'x': '舌根接觸軟顎，氣流摩擦發聲',
    "'": '聲門塞音：聲門突然閉合再打開，類似咳嗽前的瞬間停頓'
  };

  dayData.content.forEach((content: any) => {
    if (content.type === 'audio' && content.src) {
      const fileName = content.src.split('/').pop()?.replace('.wav', '') || '';
      if (/^[a-z]$/.test(fileName) || fileName === 'ng' || fileName === "'") {
        const tips = pronunciationTips[fileName] || '按照音檔模仿發音';
        if (!letters.find(l => l.letter === fileName)) {
          letters.push({ letter: fileName, tips });
        }
      }
    }
  });

  return { 
    letters, 
    title: `第${week}週第${day}天發音練習` 
  };
};

export default function PronunciationPractice({ onFinish, week, day }: PronunciationPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceCount, setPracticeCount] = useState<{ [key: string]: number }>({});
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameData, setGameData] = useState<{ letters: Array<{ letter: string; tips: string }>, title: string }>({ letters: [], title: '' });

  const currentLetter = gameData.letters[currentIndex];
  const requiredPractices = 3; // 每個字母需要練習 3 次

  // 初始化遊戲數據
  useEffect(() => {
    const data = extractPronunciationDataFromDay(week, day);
    setGameData(data);
  }, [week, day]);

  // 處理發音練習
  const handlePractice = (letter: string) => {
    const newCount = (practiceCount[letter] || 0) + 1;
    setPracticeCount(prev => ({
      ...prev,
      [letter]: newCount
    }));

    if (newCount >= requiredPractices) {
      setCompletedLetters(prev => new Set([...prev, letter]));
    }
  };

  // 下一個字母
  const handleNext = () => {
    if (currentIndex < gameData.letters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 檢查是否所有字母都完成了
      if (completedLetters.size === gameData.letters.length) {
        setGameCompleted(true);
      } else {
        // 回到第一個未完成的字母
        const firstIncomplete = gameData.letters.findIndex((l: { letter: string; tips: string }) => !completedLetters.has(l.letter));
        setCurrentIndex(firstIncomplete);
      }
    }
  };

  // 上一個字母
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setCurrentIndex(0);
    setPracticeCount({});
    setCompletedLetters(new Set());
    setGameCompleted(false);
  };

  const handleFinish = () => {
    const success = completedLetters.size === gameData.letters.length;
    const scorePercentage = Math.round((completedLetters.size / gameData.letters.length) * 100);
    onFinish(success, scorePercentage);
  };

  // 如果沒有可用的字母數據
  if (gameData.letters.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🗣️</div>
        <h3 className="text-2xl font-bold mb-4">發音練習</h3>
        <p className="text-lg mb-6 text-gray-600">
          此課程沒有可練習的字母內容，請繼續學習其他課程。
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
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold mb-4">發音練習完成！</h3>
        <p className="text-lg mb-6">
          恭喜您完成了所有 <span className="font-bold text-green-600">{gameData.letters.length}</span> 個字母的發音練習！
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3">練習統計：</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {gameData.letters.map((letterData: { letter: string; tips: string }) => (
              <div key={letterData.letter} className="flex items-center justify-between">
                <span className="font-mono font-bold">
                  {letterData.letter.toUpperCase()}
                </span>
                <span className="text-green-600">
                  {practiceCount[letterData.letter] || 0} 次練習
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetGame}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            重新練習
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

  const currentProgress = practiceCount[currentLetter?.letter] || 0;
  const isLetterCompleted = completedLetters.has(currentLetter?.letter || '');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{gameData.title}</h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <span>字母 {currentIndex + 1} / {gameData.letters.length}</span>
          <span>已完成：{completedLetters.size} / {gameData.letters.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedLetters.size / gameData.letters.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="bg-blue-50 rounded-lg p-8 mb-6">
          <div className="text-8xl font-bold font-mono text-blue-600 mb-4">
            {currentLetter?.letter.toUpperCase()}
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
            <AudioButton 
              src={`/alphabet/${currentLetter?.letter}.wav`}
              className="w-16 h-16"
            />
            <button
              onClick={() => handlePractice(currentLetter?.letter || '')}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              <SpeakerWaveIcon className="w-5 h-5" />
              練習發音
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p className="font-semibold mb-2">發音要領：</p>
            <p>{currentLetter?.tips}</p>
          </div>

          <div className="flex justify-center items-center gap-2">
            <span className="text-sm">練習進度：</span>
            <div className="flex gap-1">
              {Array.from({ length: requiredPractices }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < currentProgress ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({currentProgress}/{requiredPractices})
            </span>
            {isLetterCompleted && (
              <CheckIcon className="w-5 h-5 text-green-500 ml-2" />
            )}
          </div>
        </div>

        {currentProgress > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700">
              {currentProgress < requiredPractices 
                ? `很好！再練習 ${requiredPractices - currentProgress} 次就完成了！`
                : '完美！您已經掌握了這個字母的發音！'
              }
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一個
        </button>

                  <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">總進度</div>
            <div className="text-lg font-semibold">
              {Math.round((completedLetters.size / gameData.letters.length) * 100)}%
            </div>
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {currentIndex === gameData.letters.length - 1 ? '檢查完成度' : '下一個'}
          </button>
        </div>

        {completedLetters.size === gameData.letters.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setGameCompleted(true)}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
          >
            完成發音練習 🎉
          </button>
        </div>
      )}
    </div>
  );
} 