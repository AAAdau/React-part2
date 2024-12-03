const CACHE_NAME = 'pwa-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
];

// Install event: Pre-cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
});

// Fetch event: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then((response) =>
                response || fetch(event.request).then((fetchResponse) => {
                    const clonedResponse = fetchResponse.clone();
                    caches.open(CACHE_NAME).then((cache) =>
                        cache.put(event.request, clonedResponse)
                    );
                    return fetchResponse;
                })
            )
        );
    }
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

// Push notification event
self.addEventListener('push', function (event) {
    let options = {
        body: event.data.text(),
        icon: '/icon.png',
        badge: '/badge.png',
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

// Background Sync for POST requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-post') {
        event.waitUntil(
            fetch('/sync-endpoint', { method: 'POST' }) // Adjust to your API endpoint
                .then((response) => response.json())
                .catch((error) => console.error('Sync failed:', error))
        );
    }
});

// Register service worker and handle push subscription
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);

        // 请求推送通知权限
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('通知权限已授予');
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY' // 替换为你的 VAPID 公钥
                }).then(subscription => {
                    console.log('Push subscription:', subscription);
                    // 你可以将这个订阅信息发送到你的服务器以便后续发送推送通知
                }).catch(err => console.error('Push subscription failed:', err));
            }
        });
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}
