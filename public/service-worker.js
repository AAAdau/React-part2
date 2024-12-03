const CACHE_VERSION = 'v2'; // 更新版本号
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    // '/script.js',
    '/icon.png',
    '/fallback.html'
];

// 安装事件：缓存静态资源
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[Service Worker] Caching static assets...');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting()) // 强制进入激活阶段
    );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
                        console.log(`[Service Worker] Deleting old cache: ${key}`);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 接管当前页面
    );
});

// 获取事件：缓存优先，网络回退
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/fallback.html');
                }
            })
        );
    }
});

// 推送通知事件
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Notification Received:', event.data.text());
    const options = {
        body: event.data.text(),
        icon: '/icon.png',
        badge: '/badge.png',
    };
    event.waitUntil(
        self.registration.showNotification('Notification', options)
    );
});

// 后台同步事件
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-post') {
        console.log('[Service Worker] Syncing post...');
        event.waitUntil(
            fetch('/sync-endpoint', { method: 'POST' })
                .then((response) => response.json())
                .then((data) => console.log('Sync successful:', data))
                .catch((error) => console.error('Sync failed:', error))
        );
    }
});

// 通知用户新版本可用
self.addEventListener('controllerchange', () => {
    console.log('[Service Worker] Controller changed, new version activated!');
    // 可在这里实现 UI 提示，比如弹窗通知用户刷新页面
});
