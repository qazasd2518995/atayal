'use client';

import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface AudioButtonProps {
  src: string;
  showDownload?: boolean;
  className?: string;
}

export default function AudioButton({ src, showDownload = true, className = '' }: AudioButtonProps) {
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
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('音檔播放錯誤:', error);
      alert('音檔播放失敗，請檢查檔案是否存在。');
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
        className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-colors duration-200 shadow-md"
        title={isPlaying ? "暫停" : "播放"}
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
          className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-md"
          title="下載音檔"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>
      )}

      <audio
        ref={audioRef}
        src={src}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
} 