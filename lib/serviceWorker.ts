// lib/serviceWorker.ts
/**
 * Service Worker 註冊工具
 * 用於音檔離線快取功能
 */

export const registerServiceWorker = async (): Promise<void> => {
  // 只在瀏覽器環境且支援 Service Worker 時執行
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker 不支援此環境');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Service Worker 註冊成功:', registration.scope);

    // 檢查更新
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('發現新的 Service Worker');

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('新的 Service Worker 已安裝，等待啟用');
          // 可以在這裡提示使用者重新載入頁面
        }
      });
    });

    // 檢查是否有等待中的 Service Worker
    if (registration.waiting) {
      console.log('有等待中的 Service Worker');
    }

    // 檢查是否有正在安裝的 Service Worker
    if (registration.installing) {
      console.log('Service Worker 正在安裝');
    }

    // 定期檢查更新（每小時）
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

  } catch (error) {
    console.error('Service Worker 註冊失敗:', error);
  }
};

/**
 * 取消註冊 Service Worker
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('Service Worker 已取消註冊');
  } catch (error) {
    console.error('取消註冊 Service Worker 失敗:', error);
  }
};

/**
 * 手動觸發音檔快取
 */
export const cacheAudioFiles = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if (!registration.active) {
      console.error('沒有啟用的 Service Worker');
      return false;
    }

    // 發送訊息給 Service Worker 觸發快取
    const messageChannel = new MessageChannel();

    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          console.log('音檔快取成功');
          resolve(true);
        } else {
          console.error('音檔快取失敗:', event.data.error);
          resolve(false);
        }
      };

      if (registration.active) {
        registration.active.postMessage(
          { type: 'CACHE_AUDIO' },
          [messageChannel.port2]
        );
      } else {
        resolve(false);
      }
    });
  } catch (error) {
    console.error('觸發音檔快取失敗:', error);
    return false;
  }
};

/**
 * 檢查 Service Worker 狀態
 */
export const checkServiceWorkerStatus = (): {
  supported: boolean;
  registered: boolean;
  controller: boolean;
} => {
  if (typeof window === 'undefined') {
    return { supported: false, registered: false, controller: false };
  }

  const supported = 'serviceWorker' in navigator;
  const controller = !!navigator.serviceWorker?.controller;

  return {
    supported,
    registered: supported && controller,
    controller,
  };
};
