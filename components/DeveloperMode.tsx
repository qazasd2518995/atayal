'use client';

import { useState, useEffect, Fragment } from 'react';
import { CogIcon, EyeIcon, EyeSlashIcon, TrashIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { resetProgress, getUserProgress, isDeveloperMode } from '@/lib/progress';

// 在元件內部實現開發者模式的切換邏輯
function toggleDeveloperMode(): boolean {
  const isActive = isDeveloperMode();
  const newMode = !isActive;
  if (typeof window !== 'undefined') {
    localStorage.setItem('tayal-developer-mode', String(newMode));
  }
  return newMode;
}

export default function DeveloperMode() {
  const [isClient, setIsClient] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  
  // For password modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // On component mount, check if we are on client and get dev mode status
  useEffect(() => {
    setIsClient(true);
    setIsDevMode(isDeveloperMode());
  }, []);

  useEffect(() => {
    if (isPanelOpen) {
      setProgress(getUserProgress());
    }
  }, [isPanelOpen]);

  const handleResetProgress = () => {
    if (confirm('確定要重置所有學習進度嗎？此操作無法復原。')) {
      resetProgress();
      setProgress(getUserProgress());
      window.location.reload();
    }
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = () => {
    if (password === 'g5') {
      // 密碼正確，切換開發者模式
      const newMode = toggleDeveloperMode();
      setIsDevMode(newMode);
      closeModal();
    } else {
      setError('密碼錯誤，請重試');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };
  
  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
      {/* 開發者模式切換按鈕 */}
      <button
        onClick={openModal}
        className={`p-3 rounded-full shadow-lg transition-all duration-200 text-white ${
          isDevMode 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gray-700 hover:bg-gray-800'
        }`}
        title={`管理員模式: ${isDevMode ? '已啟用' : '已停用'}`}
      >
        {isDevMode ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
      </button>

      {/* 開發工具按鈕 (僅在開發者模式啟用時顯示) */}
      {isDevMode && (
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors duration-200"
          title="開啟/關閉管理面板"
        >
          <CogIcon className="w-5 h-5" />
        </button>
      )}

      {/* 開發工具面板 (僅在開發者模式啟用且面板開啟時顯示) */}
      {isDevMode && isPanelOpen && (
        <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">管理面板</h3>
            <button onClick={() => setIsPanelOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="space-y-4">
             <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
               <div className="flex items-center gap-2 text-green-700">
                 <CheckCircleIcon className="w-5 h-5" />
                 <span className="font-medium">管理員模式已啟用</span>
               </div>
               <p className="text-sm text-green-600 mt-1">所有課程和遊戲已解鎖。</p>
             </div>
            
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

             <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
               <h4 className="font-medium text-gray-800 mb-2">快速跳轉課程</h4>
               <div className="grid grid-cols-3 gap-2">
                 {[1, 2, 3].map(week => (
                   <div key={week} className="space-y-1">
                     <p className="text-xs font-medium text-gray-600">週{week}</p>
                     {[1, 2, 3, 4, 5].map(day => (
                       <button
                         key={`${week}-${day}`}
                         onClick={() => { window.location.href = `/week/${week}/${day}`; }}
                         className="w-full px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                       >
                         {day}
                       </button>
                     ))}
                   </div>
                 ))}
               </div>
             </div>

             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
               <h4 className="font-medium text-red-800 mb-2">危險操作</h4>
               <button onClick={handleResetProgress} className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors">
                 <TrashIcon className="w-4 h-4" />
                 重置所有進度
               </button>
             </div>
          </div>
        </div>
      )}

      {/* 密碼輸入彈窗 */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                    <LockClosedIcon className="w-5 h-5 text-gray-500" />
                    管理員模式
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">輸入密碼以啟用或停用管理員模式。</p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="請輸入密碼" />
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200" onClick={closeModal}>取消</button>
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" onClick={handlePasswordSubmit}>確認</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 