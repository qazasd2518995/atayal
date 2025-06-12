// components/ListeningQuiz.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import AudioButton from '../AudioButton';

interface ListeningQuizProps {
  onFinish: (success: boolean) => void;
  week: number;
  day: number;
}

// 提取當天教材中的字母
const extractLettersFromDay = (week: number, day: number) => {
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
      case 4:
        weekData = require('@/data/week4').week4;
        break;
      default:
        weekData = require('@/data/week1').week1;
    }
  } catch (error) {
    weekData = require('@/data/week1').week1;
  }

  const dayData = weekData[day - 1];
  if (!dayData) return { letters: [], title: '聽力測驗' };

  // 提取教材內容中的字母（從音檔路徑）
  const letters: string[] = [];

  dayData.content.forEach((content: any) => {
    if (content.type === 'audio' && content.src) {
      const fileName = content.src.split('/').pop()?.replace('.wav', '') || '';
      if (/^[a-z]$/.test(fileName) || fileName === 'ng' || fileName === "'") {
        if (!letters.includes(fileName)) {
          letters.push(fileName);
        }
      }
    }
  });

  return { 
    letters, 
    title: `第${week}週第${day}天聽力測驗` 
  };
};

export default function ListeningQuiz({ onFinish, week, day }: ListeningQuizProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);
  const [questions, setQuestions] = useState<Array<{ correct: string; options: string[] }>>([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [gameData, setGameData] = useState<{ letters: string[], title: string }>({ letters: [], title: '' });

  const total = 5;

  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    // 獲取當天教材的字母數據
    const data = extractLettersFromDay(week, day);
    setGameData(data);
    
    if (data.letters.length > 0) {
      // generate 5 distinct questions
      const pool = [...data.letters];
      const qs: typeof questions = [];
      for (let i = 0; i < total && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const correct = pool.splice(idx, 1)[0];
        const wrong = shuffle(data.letters.filter((l: string) => l !== correct)).slice(0, 3);
        qs.push({ correct, options: shuffle([correct, ...wrong]) });
      }
      setQuestions(qs);
    }
  }, [week, day]);

  const submit = () => {
    if (!selected) return;
    if (selected === questions[round].correct) setScore(s => s + 1);
    setShowResult(true);
    setTimeout(() => {
      if (round + 1 >= total) setDone(true);
      else {
        setRound(r => r + 1);
        setSelected('');
        setShowResult(false);
      }
    }, 2000);
  };

  const retry = () => {
    setRound(0);
    setScore(0);
    setSelected('');
    setShowResult(false);
    setDone(false);
    setCurrentPlayingIndex(null);
    // regenerate
    if (gameData.letters.length > 0) {
      const pool = [...gameData.letters];
      const qs: typeof questions = [];
      for (let i = 0; i < total && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const correct = pool.splice(idx, 1)[0];
        const wrong = shuffle(gameData.letters.filter((l: string) => l !== correct)).slice(0, 3);
        qs.push({ correct, options: shuffle([correct, ...wrong]) });
      }
      setQuestions(qs);
    }
  };

  // 音檔播放控制函數
  const handleAudioPlay = (index: number) => {
    // 如果點擊的是正在播放的音檔，什麼都不做
    if (currentPlayingIndex === index) {
      return;
    }
    
    // 設置當前播放的索引
    setCurrentPlayingIndex(index);
    
    // 創建新的 Audio 對象來播放
    const audio = new Audio(`/alphabet/${questions[index].correct}.wav`);
    audio.play().catch(console.error);
    
    // 音檔結束時重置狀態
    audio.onended = () => {
      setCurrentPlayingIndex(null);
    };
    
    // 音檔出錯時重置狀態
    audio.onerror = () => {
      setCurrentPlayingIndex(null);
    };
  };

  const finish = () => {
    onFinish(score === total);
  };

  // 如果沒有可用的字母數據
  if (gameData.letters.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">👂</div>
        <h3 className="text-2xl font-bold mb-4">聽力測驗</h3>
        <p className="text-lg mb-6 text-gray-600">
          此課程沒有可練習的字母內容，請繼續學習其他課程。
        </p>
        <button
          onClick={() => onFinish(true)}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          完成
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4">正在準備題目…</p>
      </div>
    );
  }

  if (done) {
    const passed = score === total;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '👂'}</div>
        <h3 className="text-2xl font-bold mb-4">
          {passed ? '聽力測驗完成！' : '繼續加油！'}
        </h3>
        <p className="mb-6">
          答對 <strong>{score}</strong> / {total} 題，正確率 <strong>{pct}%</strong>
          {!passed && <br />}<strong className="text-red-600">{!passed && '需要全對才能完成課程'}</strong>
        </p>

        <div className="bg-gray-50 p-4 rounded mb-6 text-left">
          <h4 className="font-semibold mb-2">題目回顧：</h4>
          {questions.map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span>第 {i + 1} 題：</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAudioPlay(i)}
                  disabled={currentPlayingIndex !== null && currentPlayingIndex !== i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    currentPlayingIndex === i
                      ? 'bg-blue-500 text-white animate-pulse'
                      : currentPlayingIndex !== null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title={currentPlayingIndex === i ? '播放中...' : currentPlayingIndex !== null ? '請等待其他音檔播放完畢' : '播放音檔'}
                >
                  {currentPlayingIndex === i ? (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className="font-mono font-bold">{q.correct.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={retry}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            重新挑戰
          </button>
          <button
            onClick={finish}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            完成遊戲
          </button>
        </div>
      </div>
    );
  }

  const q = questions[round];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{gameData.title}</h2>
        <div className="text-sm text-gray-600">
          第 {round + 1} / {total} 題，得分 {score}
        </div>
        <div className="relative mt-3 h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${((round) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="mb-4">請聽音檔，選擇正確的字母：</p>
        <div className="bg-blue-50 p-6 rounded mb-4 inline-block">
          <AudioButton
            src={`/alphabet/${q.correct}.wav`}
            className="w-16 h-16 mx-auto"
            showDownload={false}
          />
        </div>
        {showResult && (
          <div
            className={`p-4 mb-4 rounded ${
              selected === q.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              {selected === q.correct ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <XMarkIcon className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {selected === q.correct ? '正確！' : '錯誤！'}
              </span>
            </div>
            {selected !== q.correct && (
              <p className="text-sm">
                正確答案：<strong>{q.correct.toUpperCase()}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            disabled={showResult}
            className={`p-4 rounded-lg border-2 transition ${
              selected === opt
                ? showResult
                  ? opt === q.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:bg-gray-50'
            } ${showResult ? 'cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl font-mono font-bold">{opt.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={submit}
          disabled={!selected || showResult}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          確認答案
        </button>
      </div>
    </div>
  );
}
