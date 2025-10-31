// components/ServiceWorkerProvider.tsx
'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/serviceWorker';

/**
 * Service Worker Provider
 * 在應用程式啟動時註冊 Service Worker 以啟用音檔離線快取
 */
export default function ServiceWorkerProvider() {
  useEffect(() => {
    // 在生產環境中註冊 Service Worker
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    } else {
      console.log('開發環境：跳過 Service Worker 註冊');
    }

    // 監聽 Service Worker 更新
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker 控制器已變更');
      });
    }
  }, []);

  // 這個組件不渲染任何內容
  return null;
}
