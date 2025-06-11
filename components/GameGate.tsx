'use client';

import { useState, useEffect } from 'react';
import { isCompleted } from '@/lib/progress';
import LetterMatch from './games/LetterMatch';
import PictureChoice from './games/PictureChoice';
import SentencePuzzle from './games/SentencePuzzle';
import { LockClosedIcon, PlayIcon } from '@heroicons/react/24/solid';

interface GameGateProps {
  week: number;
  day: number;
  gameType: string;
  xp: number;
  onGameComplete?: (success: boolean) => void;
}

export default function GameGate({ 
  week, 
  day, 
  gameType, 
  xp, 
  onGameComplete 
}: GameGateProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 檢查課程是否已完成
  const completed = isCompleted(week, day);

  useEffect(() => {
    setGameCompleted(completed);
  }, [completed]);

  const handleGameComplete = (success: boolean) => {
    if (success) {
      setGameCompleted(true);
      onGameComplete?.(true);
    }
  };

  const renderGame = () => {
    switch (gameType) {
      case 'LetterMatch':
        return (
          <LetterMatch
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );
      
      case 'PictureChoice':
        return (
          <PictureChoice
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );
      
      case 'SentencePuzzle':
        return (
          <SentencePuzzle
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">遊戲類型不支援：{gameType}</p>
          </div>
        );
    }
  };

  if (gameCompleted) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">遊戲完成！</h3>
          <p className="text-green-700">
            您已經成功完成了 {gameType} 遊戲，獲得了 {xp} XP！
          </p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="text-center py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <div className="text-4xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{gameType}</h3>
          <p className="text-gray-600 mb-4">
            準備開始遊戲關卡！完成遊戲可獲得 {xp} XP
          </p>
          
          <div className="mb-4">
            {(() => {
              switch (gameType) {
                case 'LetterMatch':
                  return (
                    <div className="text-sm text-gray-600">
                      <p>🎯 遊戲規則：拖曳字母到正確位置</p>
                      <p>💡 提示：仔細聽發音，找出對應的字母</p>
                    </div>
                  );
                case 'PictureChoice':
                  return (
                    <div className="text-sm text-gray-600">
                      <p>🎯 遊戲規則：根據圖片選擇正確的詞彙</p>
                      <p>💡 提示：觀察圖片內容，選出對應的泰雅語詞彙</p>
                    </div>
                  );
                case 'SentencePuzzle':
                  return (
                    <div className="text-sm text-gray-600">
                      <p>🎯 遊戲規則：點擊詞語組成完整句子</p>
                      <p>💡 提示：注意泰雅語的語序結構</p>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </div>
          
          <button
            onClick={() => setGameStarted(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2"
          >
            <PlayIcon className="w-5 h-5" />
            開始遊戲
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderGame()}
    </div>
  );
} 