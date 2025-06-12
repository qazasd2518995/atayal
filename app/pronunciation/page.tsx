'use client';

import { useState } from 'react';
import Link from 'next/link';
import AudioButton from '@/components/AudioButton';
import { HomeIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

// 泰雅語字母數據
const vowels = [
  { letter: 'a', sound: 'ㄚ', example: 'aba (爸爸)', description: '開口音，如中文「啊」' },
  { letter: 'i', sound: 'ㄧ', example: 'ima (血)', description: '閉口音，如中文「衣」' },
  { letter: 'u', sound: 'ㄨ', example: 'uzi (水)', description: '圓唇音，如中文「烏」' },
  { letter: 'e', sound: 'ㄝ', example: 'emaw (爺爺)', description: '中開音，如中文「耶」' },
  { letter: 'o', sound: 'ㄛ', example: 'owa (是的)', description: '後開音，如中文「喔」' },
];

const consonants = [
  { letter: 'p', sound: 'ㄆ', example: 'pila (幾個)', description: '雙唇無聲塞音' },
  { letter: 'b', sound: 'ㄅ', example: 'balay (房子)', description: '雙唇有聲塞音' },
  { letter: 't', sound: 'ㄊ', example: 'tama (父親)', description: '舌尖無聲塞音' },
  { letter: 'k', sound: 'ㄎ', example: 'kmal (真的)', description: '舌根無聲塞音' },
  { letter: 'g', sound: 'ㄍ', example: 'gaga (部落)', description: '舌根有聲塞音' },
  { letter: 'q', sound: 'ㄑ', example: 'qutux (一)', description: '小舌無聲塞音' },
  { letter: 'm', sound: 'ㄇ', example: 'masu (你)', description: '雙唇鼻音' },
  { letter: 'n', sound: 'ㄋ', example: 'nanu (什麼)', description: '舌尖鼻音' },
  { letter: 'ng', sound: 'ㄫ', example: 'ngalan (耳朵)', description: '舌根鼻音' },
  { letter: 's', sound: 'ㄙ', example: 'saku (我)', description: '舌尖無聲擦音' },
  { letter: 'z', sound: 'ㄗ', example: 'zimu (你們)', description: '舌尖有聲擦音' },
  { letter: 'c', sound: 'ㄘ', example: 'cyugal (三)', description: '舌尖無聲擦音' },
  { letter: 'l', sound: 'ㄌ', example: 'lalu (綠色)', description: '舌尖邊音' },
  { letter: 'r', sound: 'ㄖ', example: 'rudan (路)', description: '舌尖顫音' },
  { letter: 'w', sound: 'ㄨ', example: 'wawa (小孩)', description: '雙唇半元音' },
  { letter: 'y', sound: 'ㄧ', example: 'yaki (名字)', description: '舌面半元音' },
  { letter: 'h', sound: 'ㄏ', example: 'huling (狗)', description: '聲門無聲擦音' },
  { letter: 'x', sound: 'ㄒ', example: 'xiral (太陽)', description: '舌根無聲擦音' },
];

const specialSounds = [
  { letter: "'", sound: '？', example: "ta'aw (人)", description: '聲門塞音' },
];

type TabType = 'vowels' | 'consonants' | 'special';

export default function PronunciationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vowels');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const renderLetterCard = (letterData: any, index: number) => (
    <div 
      key={index} 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {letterData.letter.toUpperCase()}
        </div>
        <div className="text-sm text-gray-500 mb-2">
          發音: {letterData.sound}
        </div>
        <AudioButton 
          src={`/alphabet/${letterData.letter}.wav`}
          showDownload={true}
          className="justify-center"
        />
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-2">範例詞彙</h3>
        <p className="text-gray-700 mb-2">{letterData.example}</p>
        <p className="text-sm text-gray-600">{letterData.description}</p>
      </div>
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'vowels':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">母音 (Vowels)</h2>
            <p className="text-gray-600 mb-6">
              泰雅語有五個基本母音，是學習發音的基礎。每個母音都有其獨特的發音方式。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vowels.map((vowel, index) => renderLetterCard(vowel, index))}
            </div>
          </div>
        );
      
      case 'consonants':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">子音 (Consonants)</h2>
            <p className="text-gray-600 mb-6">
              泰雅語的子音系統相當豐富，包含多種不同的發音方式。掌握子音發音是說好泰雅語的關鍵。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consonants.map((consonant, index) => renderLetterCard(consonant, index))}
            </div>
          </div>
        );
      
      case 'special':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">特殊音素 (Special Sounds)</h2>
            <p className="text-gray-600 mb-6">
              泰雅語中有一些特殊的音素，需要特別注意其發音方式。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialSounds.map((sound, index) => renderLetterCard(sound, index))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 導航欄 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              返回首頁
            </Link>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-800">發音教室</span>
          </div>
        </div>

        {/* 標題區域 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <SpeakerWaveIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">泰雅語發音教室</h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              學習泰雅語字母的正確發音，建立良好的語音基礎
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>🎧 點擊播放按鈕聽發音</span>
              <span>📥 可下載音檔離線練習</span>
              <span>📚 查看範例詞彙和發音說明</span>
            </div>
          </div>
        </div>

        {/* 分類標籤 */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('vowels')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'vowels'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🅰️ 母音 ({vowels.length}個)
            </button>
            <button
              onClick={() => setActiveTab('consonants')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'consonants'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🅱️ 子音 ({consonants.length}個)
            </button>
            <button
              onClick={() => setActiveTab('special')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'special'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✨ 特殊音素 ({specialSounds.length}個)
            </button>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {getTabContent()}
        </div>

        {/* 學習建議 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 發音學習建議</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🎯 練習方法</h4>
              <ul className="space-y-1 text-sm">
                <li>• 反覆聽取標準發音</li>
                <li>• 模仿錄音跟讀練習</li>
                <li>• 注意口型和舌位</li>
                <li>• 從母音開始練習</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📝 學習重點</h4>
              <ul className="space-y-1 text-sm">
                <li>• 母音是發音基礎</li>
                <li>• 注意聲調的變化</li>
                <li>• 特殊音素需特別練習</li>
                <li>• 結合詞彙一起學習</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
            >
              <HomeIcon className="w-5 h-5" />
              開始週課程學習
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 