import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// 注册 Service Worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      // 提示用户刷新页面，但不立即刷新，避免无限循环
      alert('新版本可用，请刷新页面以获取最新内容。');
      registration.waiting.addEventListener('statechange', (event) => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
      // 触发 Service Worker 跳过等待
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  },
  onSuccess: () => {
    console.log('Service Worker 注册成功');
  }
});
