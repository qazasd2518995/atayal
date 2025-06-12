'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface VocabularyMemoryProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 詞彙記憶遊戲數據 - 根據新教材內容更新（移除音檔）
const gameData = {
  2: { // week 2 - 生活主題詞彙
    vocabulary: [
      { tayal: "yaba'", meaning: '爸爸' },
      { tayal: "yaya'", meaning: '媽媽' },
      { tayal: 'qbsuyan', meaning: '兄長' },
      { tayal: 'mlikuy', meaning: '男孩' },
      { tayal: 'kneril', meaning: '女孩' },
      { tayal: 'huzil', meaning: '狗' },
      { tayal: 'bzyok', meaning: '豬' },
      { tayal: 'biru', meaning: '書' }
    ],
    title: '生活詞彙記憶遊戲'
  },
  3: { // week 3 - 神話故事詞彙
    vocabulary: [
      { tayal: 'squliq', meaning: '雨' },
      { tayal: 'Utux', meaning: '神' },
      { tayal: 'rgyax', meaning: '山' },
      { tayal: 'klahang', meaning: '祭壇' },
      { tayal: 'laqi', meaning: '女孩' },
      { tayal: 'hngiyang', meaning: '聲音' },
      { tayal: 'Kmayal', meaning: '很久以前' },
      { tayal: 'qzitun', meaning: '退去' }
    ],
    title: '神話故事詞彙記憶遊戲'
  },
  4: { // week 4 - 對話詞彙
    vocabulary: [
      { tayal: "lalu'", meaning: '名字' },
      { tayal: 'kawas', meaning: '歲' },
      { tayal: "'Tayal", meaning: '泰雅族' },
      { tayal: 'ngasal', meaning: '家人' },
      { tayal: 'kinwagiq', meaning: '身高' },
      { tayal: 'mspatul', meaning: '四十' },
      { tayal: 'kbhul', meaning: '一百' },
      { tayal: 'inci', meaning: '公分' }
    ],
    title: '對話詞彙記憶遊戲'
  }
};

interface Card {
  id: string;
  content: string;
  type: 'tayal' | 'meaning';
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function VocabularyMemory({ onFinish, week, day }: VocabularyMemoryProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showMismatch, setShowMismatch] = useState(false);


  const data = gameData[week as keyof typeof gameData] || gameData[2];

  // 隨機排序函數
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 初始化卡片
  const initializeCards = () => {
    const cardPairs: Card[] = [];
    
    data.vocabulary.forEach((item, index) => {
      // 泰雅語卡片
      cardPairs.push({
        id: `tayal-${index}`,
        content: item.tayal,
        type: 'tayal',
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false
      });
      
      // 中文意思卡片
      cardPairs.push({
        id: `meaning-${index}`,
        content: item.meaning,
        type: 'meaning',
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false
      });
    });

    setCards(shuffleArray(cardPairs));
  };

  useEffect(() => {
    initializeCards();
  }, [week]);

  // 處理卡片點擊
  const handleCardClick = (cardId: string) => {
    if (flippedCards.length >= 2 || showMismatch) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // 翻轉卡片
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // 如果翻轉了兩張卡片，檢查是否配對
    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      setAttempts(prev => prev + 1);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // 配對成功
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);

          // 檢查是否完成遊戲
          if (matches + 1 === data.vocabulary.length) {
            setGameCompleted(true);
          }
        }, 1000);
      } else {
        // 配對失敗
        setShowMismatch(true);
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setShowMismatch(false);
        }, 1500);
      }
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setFlippedCards([]);
    setMatches(0);
    setAttempts(0);
    setGameCompleted(false);
    setShowMismatch(false);
    initializeCards();
  };



  const handleFinish = () => {
    const success = matches === data.vocabulary.length;
    onFinish(success);
  };

  if (gameCompleted) {
    const score = Math.max(0, 100 - (attempts - data.vocabulary.length) * 5);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🧠</div>
        <h3 className="text-2xl font-bold mb-4">記憶遊戲完成！</h3>
        <p className="text-lg mb-6">
          您成功配對了 <span className="font-bold text-green-600">{matches}</span> 組詞彙
          <br />
          嘗試次數：<span className="font-bold text-blue-600">{attempts}</span> 次
          <br />
          得分：<span className="font-bold text-purple-600">{score}</span> 分
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-3">詞彙複習：</h4>
          <div className="space-y-3">
            {data.vocabulary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="font-semibold text-blue-600">
                  {item.tayal}
                </span>
                <span className="text-gray-700">
                  {item.meaning}
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
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
          <span>配對完成：{matches} / {data.vocabulary.length}</span>
          <span>嘗試次數：{attempts}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(matches / data.vocabulary.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <p className="text-center text-gray-600 mb-6">
        翻轉卡片找到泰雅語詞彙和中文意思的配對
      </p>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              relative h-24 cursor-pointer transition-all duration-300 transform hover:scale-105
              ${card.isMatched ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className={`
              absolute inset-0 rounded-lg border-2 transition-all duration-300
              ${card.isFlipped || card.isMatched 
                ? card.type === 'tayal' 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-green-100 border-green-300'
                : 'bg-gray-100 border-gray-300 hover:border-gray-400'
              }
              ${showMismatch && flippedCards.includes(card.id) ? 'border-red-400 bg-red-50' : ''}
            `}>
              {card.isFlipped || card.isMatched ? (
                <div className="p-3 h-full flex flex-col items-center justify-center text-center">
                  {card.isMatched && (
                    <CheckIcon className="w-5 h-5 text-green-500 absolute top-1 right-1" />
                  )}
                  <span className={`text-sm font-semibold ${
                    card.type === 'tayal' ? 'text-blue-700' : 'text-green-700'
                  }`}>
                    {card.content}
                  </span>

                </div>
              ) : (
                <div className="p-3 h-full flex items-center justify-center">
                  <div className="text-2xl">❓</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>藍色卡片是泰雅語，綠色卡片是中文意思</p>
      </div>
    </div>
  );
} 