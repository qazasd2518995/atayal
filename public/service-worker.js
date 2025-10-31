// Service Worker for audio file caching
const CACHE_NAME = 'tayal-audio-cache-v1';

// 音檔路徑列表
const AUDIO_FILES = [
  '/alphabet/\'.mp3',
  '/alphabet/a.mp3',
  '/alphabet/b.mp3',
  '/alphabet/c.mp3',
  '/alphabet/e.mp3',
  '/alphabet/g.mp3',
  '/alphabet/h.mp3',
  '/alphabet/i.mp3',
  '/alphabet/k.mp3',
  '/alphabet/l.mp3',
  '/alphabet/m.mp3',
  '/alphabet/n.mp3',
  '/alphabet/ng.mp3',
  '/alphabet/o.mp3',
  '/alphabet/p.mp3',
  '/alphabet/q.mp3',
  '/alphabet/r.mp3',
  '/alphabet/s.mp3',
  '/alphabet/t.mp3',
  '/alphabet/u.mp3',
  '/alphabet/w.mp3',
  '/alphabet/x.mp3',
  '/alphabet/y.mp3',
  '/alphabet/z.mp3',
  // WAV 備援
  '/alphabet/\'.wav',
  '/alphabet/a.wav',
  '/alphabet/b.wav',
  '/alphabet/c.wav',
  '/alphabet/e.wav',
  '/alphabet/g.wav',
  '/alphabet/h.wav',
  '/alphabet/i.wav',
  '/alphabet/k.wav',
  '/alphabet/l.wav',
  '/alphabet/m.wav',
  '/alphabet/n.wav',
  '/alphabet/ng.wav',
  '/alphabet/o.wav',
  '/alphabet/p.wav',
  '/alphabet/q.wav',
  '/alphabet/r.wav',
  '/alphabet/s.wav',
  '/alphabet/t.wav',
  '/alphabet/u.wav',
  '/alphabet/w.wav',
  '/alphabet/x.wav',
  '/alphabet/y.wav',
  '/alphabet/z.wav',
];

// 安裝 Service Worker 時預先快取音檔
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching audio files...');
        // 分批快取以避免超時
        return Promise.all(
          AUDIO_FILES.map(file =>
            cache.add(file).catch(err => {
              console.warn(`Failed to cache ${file}:`, err);
              return Promise.resolve(); // 繼續處理其他檔案
            })
          )
        );
      })
      .then(() => {
        console.log('Service Worker: Audio files cached successfully');
        return self.skipWaiting(); // 立即啟用新的 Service Worker
      })
      .catch((err) => {
        console.error('Service Worker: Cache failed:', err);
      })
  );
});

// 啟用 Service Worker 時清除舊快取
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim(); // 立即控制所有頁面
      })
  );
});

// 攔截請求，優先從快取返回音檔
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只處理音檔請求
  if (url.pathname.startsWith('/alphabet/') &&
      (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav'))) {

    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Serving from cache:', url.pathname);
            return cachedResponse;
          }

          // 如果快取中沒有，從網路獲取並快取
          console.log('Service Worker: Fetching from network:', url.pathname);
          return fetch(event.request)
            .then((response) => {
              // 檢查是否為有效回應
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // 複製回應以便快取
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                  console.log('Service Worker: Cached new file:', url.pathname);
                });

              return response;
            })
            .catch((err) => {
              console.error('Service Worker: Fetch failed:', url.pathname, err);
              // 可以在這裡返回一個預設的錯誤音檔
              throw err;
            });
        })
    );
  }
});

// 監聽訊息事件以便手動觸發快取更新
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_AUDIO') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(AUDIO_FILES);
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
        .catch((err) => {
          console.error('Manual cache failed:', err);
          event.ports[0].postMessage({ success: false, error: err.message });
        })
    );
  }
});
