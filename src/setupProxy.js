// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8070',
            changeOrigin: true,
            // AI가 상세 프롬프트와 도구 사용 여부를 판단하면 30초 이상 걸릴 수 있습니다.
            // 기본 프록시 제한 시간보다 넉넉하게 설정해 Spring 응답을 끝까지 기다립니다.
            timeout: 120000,
            proxyTimeout: 120000,
        })
    );
};
