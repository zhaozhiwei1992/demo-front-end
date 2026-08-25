/**
 * 智能填单通用协议 demo 静态服务器（原生 node，无依赖）
 *
 * 开两个端口，制造真实"跨域" iframe 场景：
 *   - 8080 端口：宿主页 host.html / 入口 demo.html
 *   - 8081 端口：AI 助手 assistant.html（被宿主以跨域 iframe 嵌入）
 *
 * 用法（可分别启动，先起 AI 助手，再起宿主页）：
 *   cd simple-html/ai-form-demo
 *   node server.js           # 默认同时开 8080(宿主) + 8081(AI 助手)，制造真实跨域
 *   node server.js 8081      # 只开 AI 助手端口（可先启动）
 *   node server.js 8080      # 只开宿主端口（后启动）
 *   浏览器访问 http://127.0.0.1:8080/demo.html
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function serve(port) {
  http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/demo.html';
    // 防止路径穿越
    const file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end('not found: ' + urlPath); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  }).listen(port, '127.0.0.1', () => console.log(`[${port}] http://127.0.0.1:${port}/demo.html`));
}

const argPort = parseInt(process.argv[2], 10);
if (!isNaN(argPort)) {
  serve(argPort); // 单端口启动
} else {
  serve(8080); // 宿主 / 入口
  serve(8081); // AI 助手（跨域）
}
