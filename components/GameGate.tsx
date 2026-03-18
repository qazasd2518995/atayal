'use client';

import { useState } from 'react';
import LetterMatch from './games/LetterMatch';
import PictureChoice from './games/PictureChoice';
import SentencePuzzle from './games/SentencePuzzle';
import ListeningQuiz from './games/ListeningQuiz';
import PronunciationPractice from './games/PronunciationPractice';
import VocabularyMemory from './games/VocabularyMemory';
import WordImageMatch from './games/WordImageMatch';
import BodyPartQuiz from './games/BodyPartQuiz';
import AnimalSoundMatch from './games/AnimalSoundMatch';
import ObjectHunt from './games/ObjectHunt';
import ActionSimon from './games/ActionSimon';
import StorySequence from './games/StorySequence';
import StoryChoice from './games/StoryChoice';
import SentenceBuilder from './games/SentenceBuilder';
import ConversationMatch from './games/ConversationMatch';
import CulturalTrivia from './games/CulturalTrivia';
import { LockClosedIcon, PlayIcon } from '@heroicons/react/24/solid';
import { PuzzlePieceIcon, CheckCircleIcon, ArrowPathIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface GameGateProps {
  week: number;
  day: number;
  gameType: string;
  xp: number;
  onGameComplete?: (success: boolean, score?: number) => void;
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

  const handleGameComplete = (success: boolean, score?: number) => {
    setGameCompleted(true);
    onGameComplete?.(success, score);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setGameCompleted(false);
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

      case 'ListeningQuiz':
        return (
          <ListeningQuiz
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'PronunciationPractice':
        return (
          <PronunciationPractice
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'VocabularyMemory':
        return (
          <VocabularyMemory
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

      case 'WordImageMatch':
        return (
          <WordImageMatch
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'BodyPartQuiz':
        return (
          <BodyPartQuiz
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'AnimalSoundMatch':
        return (
          <AnimalSoundMatch
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'ObjectHunt':
        return (
          <ObjectHunt
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'ActionSimon':
        return (
          <ActionSimon
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'StorySequence':
        return (
          <StorySequence
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'StoryChoice':
        return (
          <StoryChoice
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'SentenceBuilder':
        return (
          <SentenceBuilder
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'ConversationMatch':
        return (
          <ConversationMatch
            week={week}
            day={day}
            onFinish={handleGameComplete}
          />
        );

      case 'CulturalTrivia':
        return (
          <CulturalTrivia
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
        <div className="bg-forest-50 border border-forest-200 rounded-lg p-6 mb-4">
          <div className="flex justify-center mb-2">
            <CheckCircleIcon className="w-10 h-10 text-forest-500" />
          </div>
          <h3 className="text-xl font-bold text-forest-800 mb-2">遊戲完成！</h3>
          <p className="text-forest-700 mb-4">
            您已經成功完成了 {gameType} 遊戲，獲得了 {xp} XP！
          </p>
          <button
            onClick={handleRestart}
            className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            再玩一次
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="text-center py-8">
        <div className="bg-forest-50 border border-forest-200 rounded-lg p-6 mb-4">
          <div className="flex justify-center mb-4">
            <PuzzlePieceIcon className="w-10 h-10 text-forest-600" />
          </div>
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
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：拖曳字母到正確位置</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：仔細聽發音，找出對應的字母</p>
                    </div>
                  );
                case 'ListeningQuiz':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：聽音檔選擇正確的字母</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：專心聽發音，選出對應的字母</p>
                    </div>
                  );
                case 'PronunciationPractice':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：跟著音檔練習發音</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：每個字母需要練習3次才能完成</p>
                    </div>
                  );
                case 'VocabularyMemory':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：翻牌配對泰雅語詞彙和中文意思</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：記住卡片位置，找出配對</p>
                    </div>
                  );
                case 'PictureChoice':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：根據圖片選擇正確的詞彙</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：觀察圖片內容，選出對應的泰雅語詞彙</p>
                    </div>
                  );
                case 'SentencePuzzle':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：點擊詞語組成完整句子</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：注意泰雅語的語序結構</p>
                    </div>
                  );
                case 'WordImageMatch':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：點擊正確的圖片配對家庭成員詞彙</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：仔細看圖片，選擇對應的詞彙</p>
                    </div>
                  );
                case 'BodyPartQuiz':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：點擊人體圖上的正確部位</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：根據泰雅語詞彙點擊對應的身體部位</p>
                    </div>
                  );
                case 'AnimalSoundMatch':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：配對動物的泰雅語和中文意思</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：先點擊左側動物，再點擊右側對應的中文</p>
                    </div>
                  );
                case 'ObjectHunt':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：在畫面中找出指定的物品</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：根據泰雅語詞彙找到對應的物品圖示</p>
                    </div>
                  );
                case 'ActionSimon':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：記住動作順序並依序點擊</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：專心記住閃爍的動作順序</p>
                    </div>
                  );
                case 'StorySequence':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：將故事片段排列成正確順序</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：理解故事情節，按照時間順序排列</p>
                    </div>
                  );
                case 'StoryChoice':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：回答關於洪水神話的問題</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：回想故事內容，選擇正確答案</p>
                    </div>
                  );
                case 'SentenceBuilder':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：用詞彙組成完整的泰雅語句子</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：注意泰雅語的語序和用法</p>
                    </div>
                  );
                case 'ConversationMatch':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：配對正確的問題和回答</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：理解對話情境，找出對應的問答</p>
                    </div>
                  );
                case 'CulturalTrivia':
                  return (
                    <div className="text-sm text-gray-600">
                      <p className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-forest-600 inline-block"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><circle cx="12" cy="12" r="6" strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg> 遊戲規則：回答泰雅文化和語言知識問題</p>
                      <p className="inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4 text-forest-600 inline-block" /> 提示：綜合運用三週學到的知識</p>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </div>

          <button
            onClick={() => setGameStarted(true)}
            className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2"
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