// components/AudioButton.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface AudioButtonProps {
  /** Audio file URL (relative to public/) */
  src: string;
  /** Whether to show the download button */
  showDownload?: boolean;
  /** Additional Tailwind classes */
  className?: string;
}

/**
 * 偵測瀏覽器支援的音檔格式
 */
const detectAudioFormat = (): 'mp3' | 'wav' => {
  if (typeof window === 'undefined') return 'mp3';

  const audio = document.createElement('audio');

  // 檢查 MP3 支援 (幾乎所有現代瀏覽器都支援)
  const canPlayMP3 = audio.canPlayType('audio/mpeg') !== '';

  // 檢查 WAV 支援
  const canPlayWAV = audio.canPlayType('audio/wav') !== '';

  // 行動裝置優先使用 MP3
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile || canPlayMP3) {
    return 'mp3';
  } else if (canPlayWAV) {
    return 'wav';
  }

  // 預設使用 MP3
  return 'mp3';
};

/**
 * 將音檔路徑轉換為指定格式
 */
const convertToFormat = (src: string, format: 'mp3' | 'wav'): string => {
  // 移除現有副檔名並加上新的
  const pathWithoutExt = src.replace(/\.(wav|mp3)$/i, '');
  return `${pathWithoutExt}.${format}`;
};

export default function AudioButton({
  src,
  showDownload = true,
  className = '',
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<'mp3' | 'wav'>('mp3');
  const [audioSrc, setAudioSrc] = useState<string>(src);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 初始化時偵測最佳格式
  useEffect(() => {
    const bestFormat = detectAudioFormat();
    setCurrentFormat(bestFormat);
    setAudioSrc(convertToFormat(src, bestFormat));

    console.log(`音檔格式偵測: 使用 ${bestFormat.toUpperCase()} 格式`);
  }, [src]);

  const handlePlay = async () => {
    if (!audioRef.current) return;
    try {
      setIsLoading(true);
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // 重新載入音檔以確保在行動裝置上正確播放
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.error('音檔播放錯誤:', err);

      // 嘗試切換格式
      if (currentFormat === 'mp3') {
        console.log('MP3 播放失敗，嘗試使用 WAV 格式...');
        setCurrentFormat('wav');
        setAudioSrc(convertToFormat(src, 'wav'));

        // 稍後重試
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(retryErr => {
              console.error('WAV 播放也失敗:', retryErr);
              showDetailedError(retryErr);
            });
          }
        }, 100);
      } else {
        showDetailedError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showDetailedError = (err: any) => {
    // 提供更詳細的錯誤訊息
    let errorMessage = '音檔播放失敗';

    if (err.name === 'NotAllowedError') {
      errorMessage = '瀏覽器已阻止自動播放。請先點擊播放按鈕。';
    } else if (err.name === 'NotSupportedError') {
      errorMessage = '您的瀏覽器不支援此音檔格式。\n已嘗試 MP3 和 WAV 格式，請嘗試更新瀏覽器或使用其他瀏覽器。';
    } else if (err.name === 'AbortError') {
      errorMessage = '音檔載入被中斷。請檢查網路連線。';
    } else {
      errorMessage = `音檔播放失敗 (${err.name || '未知錯誤'})。\n請確認網路連線正常或稍後再試。`;
    }

    alert(errorMessage);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('音檔載入錯誤:', e);
    console.error('音檔路徑:', audioSrc);
    console.error('當前格式:', currentFormat);

    // 如果是 MP3 載入失敗，自動嘗試 WAV
    if (currentFormat === 'mp3' && !isPlaying) {
      console.log('MP3 載入失敗，自動切換至 WAV...');
      setCurrentFormat('wav');
      setAudioSrc(convertToFormat(src, 'wav'));
    }
  };

  const handleLoadedData = () => {
    console.log(`音檔已載入 (${currentFormat.toUpperCase()}):`, audioSrc);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioSrc;
    link.download = audioSrc.split('/').pop() || `audio.${currentFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePlay}
        disabled={isLoading}
        title={isPlaying ? '暫停' : '播放'}
        className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-colors duration-200 shadow-md"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6 ml-0.5" />
        )}
      </button>

      {showDownload && (
        <button
          onClick={handleDownload}
          title="下載音檔"
          className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-md"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>
      )}

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={handleEnded}
        preload="auto"
        onError={handleError}
        onLoadedData={handleLoadedData}
      />
    </div>
  );
}
