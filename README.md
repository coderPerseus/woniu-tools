# Woniu Toolbox（蜗牛工具箱）

> 实用的在线工具集合网站，让工作更高效

## 🌟 特性

- **Next.js 16** - 使用最新的 React 框架
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS 4** - 现代化的样式方案
- **国际化支持** - 中英文双语切换
- **响应式设计** - 完美适配移动端和桌面端
- **深色模式** - 护眼的深色主题
- **shadcn/ui** - 美观的 UI 组件库

## 🛠️ 可用工具

### 📷 图片小工具
- **图片压缩** - 无损压缩 PNG/JPG 图片，支持批量处理
- **格式转换** - 快速将 WebP 转换为 JPG 或 PNG 格式
- **去底工具** - AI 自动识别主体并移除背景
- **Chrome 图标生成器** - 一键生成全尺寸 PNG、深色模式反色和 toolbar SVG

### 🤖 AI 工具
- **ChatGPT** - OpenAI 出品的对话与代码助手
- **Gemini** - Google 的对话与写代码助手
- **Claude** - Anthropic 的高推理能力助手，善于编码
- **通义千问 Qwen** - 阿里大模型助手，支持多语言与开发场景
- **DeepSeek** - DeepSeek 推出的代码与推理聊天助手
- **Kimi** - Moonshot AI 长文本助手，支持多轮上下文
- **MiniMax** - MiniMax ABAB/Chat 多模态智能助手

### 💻 编程工具
- **VS Code Web** - 在浏览器中直接运行 Visual Studio Code
- **Claude Code** - Claude 的代码模式，快速重构与补全
- **OpenAI Coding CLI** - OpenAI 的官方终端 Code Agent 命令行工具

### 🎮 娱乐工具
- **JS Date WTF** - 交互式演示 JavaScript Date 各种坑点

### 📦 其他工具
- **freeCodeCamp** - 免费编程课程与项目练习平台

## 🚀 快速开始

### 开发环境
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 代码质量检查
```bash
# 类型检查
pnpm type-check

# 代码规范检查
pnpm lint

# 自动修复格式问题
pnpm lint:fix

# 格式化代码
pnpm format

# 检查代码格式
pnpm format:check
```

## 📚 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI 组件**: shadcn/ui
- **图标**: Lucide React
- **动画**: React Spring
- **国际化**: next-intl
- **主题**: next-themes
- **包管理器**: pnpm

## 📁 项目结构

```
woniu-tools/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   ├── components/             # React 组件
│   │   ├── ui/                # shadcn/ui 组件
│   │   ├── site-nav.tsx       # 导航组件
│   │   └── ...                # 其他组件
│   ├── config/                # 配置文件
│   │   └── site.ts            # 网站配置
│   ├── i18n/                  # 国际化配置
│   ├── lib/                   # 工具函数
│   └── constants/             # 常量定义
├── public/                    # 静态资源
├── messages/                  # 国际化语言包
│   ├── zh.json               # 中文
│   └── en.json               # 英文
└── docs/                     # 文档
```

## 🔧 配置说明

### 主题配置
深色模式基于 CSS 变量和 Tailwind CSS 类切换，通过 `next-themes` 实现自动检测系统主题偏好。

### 国际化配置
- 路由结构: `/[locale]`
- 支持语言: 中文（zh）、英文（en）
- 语言检测: 基于浏览器 Accept-Language 头自动跳转

### SEO 配置
- 统一的 SEO 配置在 `src/config/site.ts`
- 自动生成 sitemap.xml 和 robots.txt
- 支持 Open Graph 和 Twitter Card

## 📝 安全配置

在本项目中，CSP（内容安全策略）配置在 `next.config.ts`，提供了最小化的安全基线：

```typescript
const ContentSecurityPolicy = `
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'self';
  manifest-src 'self';
  report-to default;
`;
```

**当前配置的含义**：
- `object-src 'none'` - 禁止加载 `<object>`、`<embed>`、`<applet>` 等插件
- `base-uri 'self'` - `<base>` 标签只能使用当前域名
- `frame-ancestors 'self'` - 只允许同域名的页面嵌入此页面（防止点击劫持）
- `manifest-src 'self'` - Web App Manifest 只能从同域名加载
- `report-to default` - 违规时发送报告

以下常用的 CSP 指令故意没有添加，需要根据项目实际需求定制：
- `frame-src` - iframe 来源
- `connect-src` - API 请求、WebSocket 等
- `script-src` - JavaScript 来源
- `style-src` - CSS 来源
- `img-src` - 图片来源
- `font-src` - 字体来源
- `media-src` - 视频/音频来源
- `worker-src` - Service Worker 来源

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范
项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 📜 许可证

MIT License

## 👤 作者

[luckySnail](https://luckysnail.cn/)

## 🔗 链接

- 网站: https://tools.luckysnail.cn
- 作者博客: https://luckysnail.cn/
- GitHub: https://github.com/coderPerseus
