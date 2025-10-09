'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { trackGameResult, ActivityTimer } from '@/lib/analytics';

interface SentenceBuilderProps {
  onFinish: (success: boolean, score?: number) => void;
  week: number;
  day: number;
}

// 句子構建題目
const sentences = [
  {
    id: 1,
    tayal: "'laqi' saku' na 'Tayal",
    meaning: '我是泰雅族的小孩',
    words: ["'laqi'", 'saku', 'na', "'Tayal'"],
    category: '身分介紹'
  },
  {
    id: 2,
    tayal: "ima' lalu' su'?",
    meaning: '你叫什麼名字？',
    words: ["ima'", "lalu'", "su'?"],
    category: '自我介紹'
  },
  {
    id: 3,
    tayal: "Yumin lalu' mu",
    meaning: '我叫 Yumin',
    words: ['Yumin', "lalu'", 'mu'],
    category: '自我介紹'
  },
  {
    id: 4,
    tayal: "Pira' kawas mu?",
    meaning: '你幾歲？',
    words: ["Pira'", 'kawas', 'mu?'],
    category: '年齡詢問'
  },
  {
    id: 5,
    tayal: "Mopuw spat kawas maku'",
    meaning: '我十四歲',
    words: ['Mopuw', 'spat', 'kawas', "maku'"],
    category: '年齡回答'
  },
  {
    id: 6,
    tayal: "'Tayal kwara' sami qutux ngasal",
    meaning: '我們全家都是泰雅族',
    words: ["'Tayal", "kwara'", 'sami', 'qutux', 'ngasal'],
    category: '家人身分'
  },
  {
    id: 7,
    tayal: "Ktwa' kinwagiq mu?",
    meaning: '你多高？',
    words: ["Ktwa'", 'kinwagiq', 'mu?'],
    category: '身高詢問'
  },
  {
    id: 8,
    tayal: 'Kbhul ru mspatul inci',
    meaning: '我一百四十公分',
    words: ['Kbhul', 'ru', 'mspatul', 'inci'],
    category: '身高回答'
  },
];

export default function SentenceBuilder({ onFinish, week, day }: SentenceBuilderProps) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [score, setScore] = useState(0);
  const [userSentence, setUserSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameTimer, setGameTimer] = useState<ActivityTimer | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const totalSentences = sentences.length;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // 打亂當前句子的詞彙
    setAvailableWords(shuffleArray([...sentences[currentSentence].words]));
    setUserSentence([]);

    // 開始遊戲計時
    if (currentSentence === 0) {
      const timer = new ActivityTimer('game');
      setGameTimer(timer);
      setStartTime(Date.now());

      return () => {
        if (timer) {
          timer.stop({ week, day, gameType: 'SentenceBuilder', completed: false });
        }
      };
    }
  }, [currentSentence, week, day]);

  const handleWordClick = (word: string) => {
    if (showResult) return;

    // 從可用詞彙移到用戶句子
    setAvailableWords(prev => prev.filter(w => w !== word));
    setUserSentence(prev => [...prev, word]);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (showResult) return;

    // 從用戶句子移回可用詞彙
    setUserSentence(prev => prev.filter((_, i) => i !== index));
    setAvailableWords(prev => [...prev, word]);
  };

  const handleSubmit = () => {
    if (userSentence.length !== sentences[currentSentence].words.length) {
      alert('請將所有詞彙排列完成');
      return;
    }

    // 檢查句子是否正確
    const correctSentence = sentences[currentSentence].words.join(' ');
    const userSentenceStr = userSentence.join(' ');
    const isCorrect = correctSentence === userSentenceStr;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentSentence + 1 >= totalSentences) {
        setGameCompleted(true);

        // 追蹤遊戲成績
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / totalSentences) * 100);

        trackGameResult({
          week,
          day,
          gameType: 'SentenceBuilder',
          score: finalScore,
          attempts: totalSentences,
          timeSpent,
        });

        if (gameTimer) {
          gameTimer.stop({ week, day, gameType: 'SentenceBuilder', completed: true, score: finalScore });
        }
      } else {
        setCurrentSentence(prev => prev + 1);
        setShowResult(false);
      }
    }, 3000);
  };

  const handleFinish = () => {
    const finalScore = Math.round((score / totalSentences) * 100);
    onFinish(finalScore > 50, finalScore);
  };

  const handleRetry = () => {
    setCurrentSentence(0);
    setScore(0);
    setUserSentence([]);
    setShowResult(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const finalScore = Math.round((score / totalSentences) * 100);
    const passed = finalScore > 50;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '📝'}</div>
        <h3 className="text-2xl font-bold mb-4">
          {passed ? '造句高手！' : '繼續加油！'}
        </h3>
        <p className="text-lg mb-6">
          成功造句 <strong className="text-green-600">{score}</strong> / {totalSentences} 句
          <br />
          正確率：<strong className="text-blue-600">{finalScore}%</strong>
          {!passed && (
            <>
              <br />
              <strong className="text-red-600">需要正確率大於 50% 才能獲得經驗值</strong>
            </>
          )}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-3 text-center">句子複習：</h4>
          <div className="space-y-3">
            {sentences.map((sentence, index) => (
              <div key={sentence.id} className="p-3 bg-white rounded border">
                <div className="text-xs text-gray-500 mb-1">{sentence.category}</div>
                <div className="font-semibold text-blue-600 mb-1">{sentence.tayal}</div>
                <div className="text-sm text-gray-600">{sentence.meaning}</div>
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

  const sentence = sentences[currentSentence];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">句子構建遊戲</h2>
        <div className="text-sm text-gray-600 mb-3">
          第 {currentSentence + 1} / {totalSentences} 句，得分 {score}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentSentence / totalSentences) * 100}%` }}
          />
        </div>
      </div>

      {/* 目標句子 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6 text-center">
        <div className="text-xs text-gray-500 mb-2">{sentence.category}</div>
        <p className="text-lg font-semibold text-gray-800">
          {sentence.meaning}
        </p>
      </div>

      {/* 反饋提示 */}
      {showResult && (
        <div
          className={`p-4 mb-4 rounded-lg text-center ${
            userSentence.join(' ') === sentence.words.join(' ')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {userSentence.join(' ') === sentence.words.join(' ') ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <XMarkIcon className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {userSentence.join(' ') === sentence.words.join(' ') ? '正確！' : '錯誤！'}
            </span>
          </div>
          <div className="text-sm">
            正確句子：<strong>{sentence.tayal}</strong>
          </div>
        </div>
      )}

      {/* 用戶構建的句子 */}
      <div className="mb-6">
        <h3 className="font-semibold text-center mb-3 text-green-600">你的句子：</h3>
        <div className="min-h-[80px] bg-green-50 p-4 rounded-lg border-2 border-green-300">
          {userSentence.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              點擊下方詞彙來組成句子
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {userSentence.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleRemoveWord(word, index)}
                  disabled={showResult}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-red-500 transition-colors disabled:cursor-not-allowed"
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 可用詞彙 */}
      <div className="mb-6">
        <h3 className="font-semibold text-center mb-3 text-blue-600">可用詞彙：</h3>
        <div className="min-h-[80px] bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
          {availableWords.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              所有詞彙已使用
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word)}
                  disabled={showResult}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:cursor-not-allowed"
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={userSentence.length !== sentence.words.length || showResult}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-semibold"
        >
          提交答案
        </button>
        <p className="text-sm text-gray-500 mt-2">
          已使用 {userSentence.length} / {sentence.words.length} 個詞彙
        </p>
      </div>
    </div>
  );
}
