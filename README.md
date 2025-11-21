# next.js 16 + ts starter


> 蜗牛的工具站点

## 特性

- next.js 16
- react 19
- ts
- eslint
- prettier
- husky
-  commitlint
-  renovate
-  lint-staged
-  pr workflow
-  T3 Env


```bash
 在这个项目中，CSP 配置在 next.config.ts:12-18：

  const ContentSecurityPolicy = `
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'self';
    manifest-src 'self';
    report-to default;
  `;

  当前配置的含义：

  - object-src 'none' - 禁止加载 <object>, <embed>, <applet> 等插件
  - base-uri 'self' - <base> 标签只能使用当前域名
  - frame-ancestors 'self' -
  只允许同域名的页面嵌入此页面（防止点击劫持）
  - manifest-src 'self' - Web App Manifest 只能从同域名加载
  - report-to default - 违规时发送报告

  "minimal policy" 的意思：

  注释中明确说明（next.config.ts:9-10），以下常用的 CSP
  指令故意没有添加，因为它们需要根据具体项目定制：

  - frame-src - iframe 来源
  - connect-src - API 请求、WebSocket 等
  - script-src - JavaScript 来源
  - style-src - CSS 来源
  - img-src - 图片来源
  - font-src - 字体来源
  - media-src - 视频/音频来源
  - worker-src - Service Worker 来源

  所以这是一个最小化的安全基线，你需要根据项目实际使用的资源（CDN、
  第三方脚本、图片服务等）来扩展这个策略。
```
