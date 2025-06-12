'use client';

import { useState, useEffect } from 'react';
import { CogIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/solid';
import { resetProgress, getUserProgress } from '@/lib/progress';

export function useDeveloperMode() {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const devMode = localStorage.getItem('tayal-developer-mode');
      setIsDeveloperMode(devMode === 'true');
    }
  }, []);

  const toggleDeveloperMode = () => {
    const newMode = !isDeveloperMode;
    setIsDeveloperMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tayal-developer-mode', newMode.toString());
    }
  };

  return { isDeveloperMode, toggleDeveloperMode };
}

export default function DeveloperMode() {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setProgress(getUserProgress());
    }
  }, [isOpen]);

  const handleResetProgress = () => {
    if (confirm('確定要重置所有學習進度嗎？此操作無法復原。')) {
      resetProgress();
      setProgress(getUserProgress());
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 開發者模式切換按鈕 */}
      <div className="mb-2">
        <button
          onClick={toggleDeveloperMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isDeveloperMode 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          title={`開發者模式: ${isDeveloperMode ? '開啟' : '關閉'}`}
        >
          {isDeveloperMode ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <EyeSlashIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 開發工具按鈕 */}
      {isDeveloperMode && (
        <div className="mb-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors duration-200"
            title="開發工具"
          >
            <CogIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 開發工具面板 */}
      {isDeveloperMode && isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">開發工具</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* 開發者模式狀態 */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <EyeIcon className="w-4 h-4" />
                <span className="font-medium">開發者模式已啟用</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                所有課程和遊戲已解鎖，無需完成前置課程
              </p>
            </div>

            {/* 當前進度信息 */}
            {progress && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">當前進度</h4>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>週數: {progress.currentWeek} / 天數: {progress.currentDay}</p>
                  <p>總經驗值: {progress.totalXP}</p>
                  <p>等級: {progress.level}</p>
                  <p>已完成課程: {Object.keys(progress.completedDays).length}</p>
                </div>
              </div>
            )}

            {/* 快速導航 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">快速導航</h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(week => (
                  <div key={week} className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">週{week}</p>
                    {[1, 2, 3, 4, 5].map(day => (
                      <button
                        key={`${week}-${day}`}
                        onClick={() => {
                          window.location.href = `/week/${week}/${day}`;
                        }}
                        className="w-full px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 危險操作 */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">危險操作</h4>
              <button
                onClick={handleResetProgress}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                重置所有進度
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 