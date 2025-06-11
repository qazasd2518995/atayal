'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import AudioButton from '../AudioButton';

interface PronunciationPracticeProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 發音練習遊戲數據 - 根據新教材內容更新
const gameData = {
  1: { // week 1 - 字母發音練習
    letters: [
      { letter: 'a', tips: '嘴張大，舌頭平放，類似中文「啊」' },
      { letter: 'i', tips: '嘴角往兩側拉，舌頭高起，類似中文「衣」' },
      { letter: 'u', tips: '嘴唇圓起來，類似中文「烏」' },
      { letter: 'e', tips: '嘴巴半開，舌頭稍微抬起，類似中文「耶」' },
      { letter: 'o', tips: '嘴唇圓起，開口比 u 大一些，類似中文「喔」' },
      { letter: 'b', tips: '雙唇緊閉後突然打開，聲帶振動' },
      { letter: 'g', tips: '舌根接觸軟顎，聲帶振動' },
      { letter: 's', tips: '舌尖接近上牙，氣流摩擦發聲' }
    ],
    title: '字母發音練習'
  },
  2: { // week 2 - 詞彙發音練習
    letters: [
      { letter: 'y', tips: '舌頭中部抬起接近硬顎，聲帶振動' },
      { letter: 'm', tips: '雙唇緊閉，氣流從鼻腔通過，聲帶振動' },
      { letter: 'n', tips: '舌尖接觸上牙齦，氣流從鼻腔通過' },
      { letter: 'k', tips: '舌根接觸軟顎，不振動聲帶' },
      { letter: 'h', tips: '氣流從喉嚨輕輕呼出，不振動聲帶' }
    ],
    title: '詞彙發音練習'
  },
  3: { // week 3 - 神話詞彙發音
    letters: [
      { letter: 's', tips: '舌尖接近上牙，氣流摩擦發聲' },
      { letter: 'q', tips: '舌根後部緊貼軟顎，然後突然放開' },
      { letter: 'r', tips: '舌尖輕彈或顫動，類似彈舌音' },
      { letter: 'l', tips: '舌尖接觸上牙齦，氣流從舌邊通過' },
      { letter: 'ng', tips: '舌根接觸軟顎，氣流從鼻腔通過' }
    ],
    title: '神話詞彙發音練習'
  },
  4: { // week 4 - 對話發音練習  
    letters: [
      { letter: 'ima', tips: '連續發音：i-ma，注意音節的連接' },
      { letter: 'lalu', tips: '連續發音：la-lu，舌頭快速運動' },
      { letter: 'kawas', tips: '連續發音：ka-was，注意重音在第一音節' },
      { letter: 'Tayal', tips: '連續發音：Ta-yal，注意首字母大寫的發音' },
      { letter: 'kinwagiq', tips: '多音節詞：kin-wa-giq，練習音節切分' }
    ],
    title: '對話句型發音練習'
  }
};

export default function PronunciationPractice({ onFinish, week }: PronunciationPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [practiceCount, setPracticeCount] = useState<{ [key: string]: number }>({});
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);

  const data = gameData[week as keyof typeof gameData] || gameData[1];
  const currentLetter = data.letters[currentIndex];
  const requiredPractices = 3; // 每個字母需要練習 3 次

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
    if (currentIndex < data.letters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 檢查是否所有字母都完成了
      if (completedLetters.size === data.letters.length) {
        setGameCompleted(true);
      } else {
        // 回到第一個未完成的字母
        const firstIncomplete = data.letters.findIndex(l => !completedLetters.has(l.letter));
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
    const success = completedLetters.size === data.letters.length;
    onFinish(success);
  };

  if (gameCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold mb-4">發音練習完成！</h3>
        <p className="text-lg mb-6">
          恭喜您完成了所有 <span className="font-bold text-green-600">{data.letters.length}</span> 個字母的發音練習！
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3">練習統計：</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.letters.map(letterData => (
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

  const currentProgress = practiceCount[currentLetter.letter] || 0;
  const isLetterCompleted = completedLetters.has(currentLetter.letter);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <span>字母 {currentIndex + 1} / {data.letters.length}</span>
          <span>已完成：{completedLetters.size} / {data.letters.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedLetters.size / data.letters.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="bg-blue-50 rounded-lg p-8 mb-6">
          <div className="text-8xl font-bold font-mono text-blue-600 mb-4">
            {currentLetter.letter.toUpperCase()}
          </div>
          
          <div className="flex justify-center gap-4 mb-4">
            <AudioButton 
              src={`/alphabet/${currentLetter.letter}.webm`}
              className="w-16 h-16"
            />
            <button
              onClick={() => handlePractice(currentLetter.letter)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              <SpeakerWaveIcon className="w-5 h-5" />
              練習發音
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p className="font-semibold mb-2">發音要領：</p>
            <p>{currentLetter.tips}</p>
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
            {Math.round((completedLetters.size / data.letters.length) * 100)}%
          </div>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          {currentIndex === data.letters.length - 1 ? '檢查完成度' : '下一個'}
        </button>
      </div>

      {completedLetters.size === data.letters.length && (
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