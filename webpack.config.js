const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    // 其他 Webpack 配置...
    plugins: [
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true, // 确保客户端在安装或更新服务工作线程后立即接管
            skipWaiting: true,  // 强制客户端等待安装后的服务工作线程
        }),
    ],
};
