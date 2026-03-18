'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/solid';
import {
  MicrophoneIcon,
  ChartBarIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import VoiceRecorder from '@/components/VoiceRecorder';

// 泰雅語字母數據
const tayalLetters = [
  // 母音
  { letter: 'a', name: '母音 a', audioPath: '/alphabet/a.wav', category: '母音' },
  { letter: 'i', name: '母音 i', audioPath: '/alphabet/i.wav', category: '母音' },
  { letter: 'u', name: '母音 u', audioPath: '/alphabet/u.wav', category: '母音' },
  { letter: 'e', name: '母音 e', audioPath: '/alphabet/e.wav', category: '母音' },
  { letter: 'o', name: '母音 o', audioPath: '/alphabet/o.wav', category: '母音' },

  // 子音
  { letter: 'b', name: '子音 b', audioPath: '/alphabet/b.wav', category: '子音' },
  { letter: 'c', name: '子音 c', audioPath: '/alphabet/c.wav', category: '子音' },
  { letter: 'g', name: '子音 g', audioPath: '/alphabet/g.wav', category: '子音' },
  { letter: 'h', name: '子音 h', audioPath: '/alphabet/h.wav', category: '子音' },
  { letter: 'k', name: '子音 k', audioPath: '/alphabet/k.wav', category: '子音' },
  { letter: 'l', name: '子音 l', audioPath: '/alphabet/l.wav', category: '子音' },
  { letter: 'm', name: '子音 m', audioPath: '/alphabet/m.wav', category: '子音' },
  { letter: 'n', name: '子音 n', audioPath: '/alphabet/n.wav', category: '子音' },
  { letter: 'ng', name: '子音 ng', audioPath: '/alphabet/ng.wav', category: '子音' },
  { letter: 'p', name: '子音 p', audioPath: '/alphabet/p.wav', category: '子音' },
  { letter: 'q', name: '子音 q', audioPath: '/alphabet/q.wav', category: '子音' },
  { letter: 'r', name: '子音 r', audioPath: '/alphabet/r.wav', category: '子音' },
  { letter: 's', name: '子音 s', audioPath: '/alphabet/s.wav', category: '子音' },
  { letter: 't', name: '子音 t', audioPath: '/alphabet/t.wav', category: '子音' },
  { letter: 'w', name: '子音 w', audioPath: '/alphabet/w.wav', category: '子音' },
  { letter: 'x', name: '子音 x', audioPath: '/alphabet/x.wav', category: '子音' },
  { letter: 'y', name: '子音 y', audioPath: '/alphabet/y.wav', category: '子音' },
  { letter: 'z', name: '子音 z', audioPath: '/alphabet/z.wav', category: '子音' },
  { letter: "'", name: "聲門塞音 '", audioPath: "/alphabet/'.wav", category: '子音' },
];

export default function VoiceTrainingPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<'all' | '母音' | '子音'>('all');

  // 篩選字母
  const filteredLetters = tayalLetters.filter(letter =>
    filter === 'all' || letter.category === filter
  );

  // 更新字母分數
  const updateScore = (letter: string, score: number) => {
    setScores(prev => ({ ...prev, [letter]: score }));
  };

  // 計算總體進度
  const calculateProgress = () => {
    const totalLetters = tayalLetters.length;
    const practicedLetters = Object.keys(scores).length;
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const averageScore = practicedLetters > 0 ? Math.round(totalScore / practicedLetters) : 0;

    return {
      practiced: practicedLetters,
      total: totalLetters,
      percentage: Math.round((practicedLetters / totalLetters) * 100),
      averageScore
    };
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-cream bg-nature py-8">
      <div className="container mx-auto px-4">
        {/* 導航欄 */}
        <div className="card-natural p-4 mb-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-wood-600 hover:text-forest-700 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              返回首頁
            </Link>
            <span className="text-wood-400">•</span>
            <span className="font-serif font-medium text-stone-800">語音訓練中心</span>
          </div>
        </div>

        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4 inline-flex items-center gap-3">
            <MicrophoneIcon className="w-9 h-9 text-forest-700" />
            泰雅語語音訓練中心
          </h1>
          <p className="text-lg text-wood-600">
            使用 AI 語音評分系統，精準練習泰雅語字母發音
          </p>
        </div>

        {/* 進度統計 */}
        <div className="card-natural p-6 mb-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4 inline-flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-forest-600" />
            學習進度
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-forest-50 rounded-lg">
              <div className="text-2xl font-bold text-forest-700">{progress.practiced}</div>
              <div className="text-sm text-wood-600">已練習字母</div>
            </div>
            <div className="text-center p-4 bg-forest-50 rounded-lg">
              <div className="text-2xl font-bold text-forest-600">{progress.total}</div>
              <div className="text-sm text-wood-600">總字母數</div>
            </div>
            <div className="text-center p-4 bg-forest-50 rounded-lg">
              <div className="text-2xl font-bold text-forest-500">{progress.percentage}%</div>
              <div className="text-sm text-wood-600">完成度</div>
            </div>
            <div className="text-center p-4 bg-wood-100 rounded-lg">
              <div className="text-2xl font-bold text-wood-700">{progress.averageScore}</div>
              <div className="text-sm text-wood-600">平均分數</div>
            </div>
          </div>

          {/* 進度條 */}
          <div className="mt-4">
            <div className="w-full bg-forest-100 rounded-full h-3">
              <div
                className="progress-forest h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 篩選器 */}
        <div className="text-center mb-6">
          <div className="inline-flex rounded-lg border border-forest-200 bg-white p-1">
            {(['all', '母音', '子音'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-forest-600 text-white'
                    : 'text-wood-600 hover:text-stone-800'
                }`}
              >
                {filterOption === 'all' ? '全部' : filterOption}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左側：字母選擇 */}
            <div className="card-natural p-6">
              <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">
                選擇要練習的字母
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {filteredLetters.map((letterData) => {
                  const hasScore = scores[letterData.letter] !== undefined;
                  const score = scores[letterData.letter] || 0;

                  return (
                    <button
                      key={letterData.letter}
                      onClick={() => setSelectedLetter(letterData.letter)}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        selectedLetter === letterData.letter
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-forest-100 hover:border-forest-300'
                      }`}
                    >
                      <div className="text-lg font-bold text-center text-stone-800">
                        {letterData.letter}
                      </div>
                      <div className="text-xs text-wood-600 text-center mt-1">
                        {letterData.category}
                      </div>

                      {/* 分數指示 */}
                      {hasScore && (
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs text-white flex items-center justify-center ${
                          score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {score}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 右側：語音錄音器 */}
            <div>
              {selectedLetter ? (
                <VoiceRecorder
                  key={selectedLetter}
                  referenceAudioPath={tayalLetters.find(l => l.letter === selectedLetter)?.audioPath || ''}
                  letterName={tayalLetters.find(l => l.letter === selectedLetter)?.name || ''}
                  onScoreUpdate={(score) => updateScore(selectedLetter, score)}
                />
              ) : (
                <div className="card-natural p-8 text-center">
                  <MicrophoneIcon className="w-16 h-16 text-forest-300 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold text-stone-800 mb-2">
                    開始語音練習
                  </h3>
                  <p className="text-wood-600">
                    請從左側選擇一個字母開始練習發音
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 技術說明 */}
        <div className="mt-12 max-w-4xl mx-auto card-natural p-6">
          <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4 inline-flex items-center gap-2">
            <BeakerIcon className="w-6 h-6 text-forest-600" />
            技術說明
          </h2>
          <div className="text-sm text-wood-600 space-y-2">
            <p>• <strong>MFCC 特徵提取：</strong>將語音轉換為機器可理解的特徵向量</p>
            <p>• <strong>DTW 動態時間規整：</strong>比對您的發音與標準發音的相似度</p>
            <p>• <strong>即時評分：</strong>基於語音特徵相似度計算 0-100 分的準確度分數</p>
            <p>• <strong>個人化回饋：</strong>根據分數提供針對性的練習建議</p>
          </div>
        </div>
      </div>
    </div>
  );
}
