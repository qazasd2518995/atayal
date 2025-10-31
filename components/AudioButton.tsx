// components/AudioButton.tsx
'use client';

import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface AudioButtonProps {
  /** Audio file URL (relative to public/) */
  src: string;
  /** Whether to show the download button */
  showDownload?: boolean;
  /** Additional Tailwind classes */
  className?: string;
}

export default function AudioButton({
  src,
  showDownload = true,
  className = '',
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

      // 提供更詳細的錯誤訊息
      let errorMessage = '音檔播放失敗';

      if (err.name === 'NotAllowedError') {
        errorMessage = '瀏覽器已阻止自動播放。請先點擊播放按鈕。';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = '您的瀏覽器不支援此音檔格式。請嘗試使用其他瀏覽器。';
      } else if (err.name === 'AbortError') {
        errorMessage = '音檔載入被中斷。請檢查網路連線。';
      } else {
        errorMessage = `音檔播放失敗 (${err.name || '未知錯誤'})。請確認網路連線正常。`;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = src.split('/').pop() || 'audio.mp3';
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
        src={src}
        onEnded={handleEnded}
        preload="auto"
        onError={(e) => {
          console.error('音檔載入錯誤:', e);
          console.error('音檔路徑:', src);
        }}
        onLoadedData={() => {
          console.log('音檔已載入:', src);
        }}
      />
    </div>
  );
}
