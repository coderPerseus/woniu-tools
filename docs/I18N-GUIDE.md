# 国际化 (i18n) 使用指南

## 📚 概述

本项目使用 [next-intl](https://next-intl.dev/) 实现国际化，支持中文（zh）和英文（en）两种语言。

## 🌐 支持的语言

- **中文 (zh)** - 默认语言（用户浏览器语言为中文时）
- **英文 (en)** - 默认语言（用户浏览器语言非中文时）

## 🏗️ 项目结构

```
src/
├── i18n/
│   ├── routing.ts          # 路由配置
│   └── request.ts          # 请求配置
├── middleware.ts           # 语言检测中间件
├── app/
│   ├── layout.tsx          # 根布局
│   └── [locale]/           # 语言路由段
│       ├── layout.tsx      # 本地化布局
│       └── page.tsx        # 本地化页面
├── components/
│   └── language-switcher.tsx  # 语言切换组件
messages/
├── zh.json                 # 中文翻译
└── en.json                 # 英文翻译
```

## 🔧 核心配置

### 1. 路由配置 (`src/i18n/routing.ts`)

```typescript
export const routing = defineRouting({
  locales: ['en', 'zh'],      // 支持的语言
  defaultLocale: 'en',         // 默认语言
  localeDetection: true,       // 启用浏览器语言检测
});
```

### 2. 中间件 (`src/middleware.ts`)

自动检测用户浏览器语言并重定向到相应的语言版本：

- 浏览器语言为中文 → 重定向到 `/zh`
- 浏览器语言非中文 → 重定向到 `/en`
- 用户可以手动切换语言

## 📝 翻译文件结构

### `messages/zh.json`（中文）
```json
{
  "site": {
    "name": "蜗牛工具箱",
    "title": "蜗牛工具箱 - 免费在线工具集合"
  },
  "nav": {
    "toggleTheme": "切换主题",
    "toggleLanguage": "切换语言"
  },
  "tools": {
    "image-compress": {
      "name": "图片压缩",
      "desc": "无损压缩 PNG/JPG 图片，支持批量处理。"
    }
  },
  "footer": {
    "copyright": "© {year} 保留所有权利。",
    "poweredBy": "由 {author} 制作"
  }
}
```

### `messages/en.json`（英文）
```json
{
  "site": {
    "name": "Woniu Toolbox",
    "title": "Woniu Toolbox - Free Online Tools Collection"
  },
  "nav": {
    "toggleTheme": "Toggle Theme",
    "toggleLanguage": "Toggle Language"
  },
  "tools": {
    "image-compress": {
      "name": "Image Compression",
      "desc": "Lossless compression for PNG/JPG images, supports batch processing."
    }
  },
  "footer": {
    "copyright": "© {year} All rights reserved.",
    "poweredBy": "By {author}"
  }
}
```

## 🎨 在组件中使用翻译

### 服务器组件（推荐）

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();

  return (
    <div>
      <h1>{t('site.name')}</h1>
      <p>{t('site.description')}</p>

      {/* 带参数的翻译 */}
      <footer>{t('footer.copyright', { year: 2025 })}</footer>
    </div>
  );
}
```

### 客户端组件

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();

  return (
    <button>{t('nav.toggleTheme')}</button>
  );
}
```

## 🔗 国际化路由

### 使用 i18n Link 组件

```typescript
import { Link } from '@/i18n/routing';

function Navigation() {
  return (
    <nav>
      <Link href="/">首页</Link>
      <Link href="/about">关于</Link>
      {/* 自动添加语言前缀 /zh 或 /en */}
    </nav>
  );
}
```

### 使用 i18n Router

```typescript
'use client';

import { useRouter } from '@/i18n/routing';

function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/some-page'); // 自动包含语言前缀
  };

  return <button onClick={handleClick}>Navigate</button>;
}
```

## 🌍 语言切换组件

已内置语言切换组件 `LanguageSwitcher`：

```typescript
import { LanguageSwitcher } from '@/components/language-switcher';

<LanguageSwitcher />
```

特性：
- 显示当前语言图标
- 点击切换中英文
- 保持当前页面路径
- 平滑过渡动画

## ✏️ 添加新翻译

### 1. 在翻译文件中添加 key

**`messages/zh.json`:**
```json
{
  "newFeature": {
    "title": "新功能",
    "description": "这是一个新功能"
  }
}
```

**`messages/en.json`:**
```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 2. 在组件中使用

```typescript
const t = await getTranslations();

<div>
  <h2>{t('newFeature.title')}</h2>
  <p>{t('newFeature.description')}</p>
</div>
```

## 🔄 带参数的翻译

### 定义翻译
```json
{
  "greeting": "你好，{name}！",
  "itemCount": "共有 {count} 个项目"
}
```

### 使用翻译
```typescript
t('greeting', { name: '张三' })
// 输出：你好，张三！

t('itemCount', { count: 10 })
// 输出：共有 10 个项目
```

## 📱 URL 结构

- **根路径** `/` → 重定向到 `/zh` 或 `/en`（根据浏览器语言）
- **中文** `/zh` → 中文版本
- **英文** `/en` → 英文版本
- **子页面** `/zh/about`、`/en/about` → 语言化子页面

## 🎯 最佳实践

### 1. 保持翻译文件结构一致

确保 `zh.json` 和 `en.json` 的结构完全相同：

✅ 正确：
```json
// zh.json
{ "nav": { "home": "首页" } }

// en.json
{ "nav": { "home": "Home" } }
```

❌ 错误：
```json
// zh.json
{ "nav": { "home": "首页" } }

// en.json
{ "navigation": { "home": "Home" } }  // 结构不一致
```

### 2. 使用语义化的 key 名称

✅ 正确：
```json
{
  "tools": {
    "image-compress": {
      "name": "图片压缩"
    }
  }
}
```

❌ 错误：
```json
{
  "tool1": "图片压缩"  // 不够语义化
}
```

### 3. 为长文本使用描述性 key

```json
{
  "errors": {
    "notFound": {
      "title": "页面未找到",
      "description": "抱歉，您访问的页面不存在。",
      "action": "返回首页"
    }
  }
}
```

### 4. 使用 TypeScript 类型安全

在组件中使用翻译时会获得自动补全和类型检查。

## 🐛 常见问题

### Q: 为什么看不到翻译？

**A:** 检查以下几点：
1. 翻译 key 在两个语言文件中都存在
2. key 路径正确（使用点号分隔）
3. 重启开发服务器

### Q: 如何添加更多语言？

**A:**
1. 在 `src/i18n/routing.ts` 中添加语言代码
2. 创建新的翻译文件（如 `messages/ja.json`）
3. 更新类型定义

### Q: 切换语言后页面没有变化？

**A:** 确保：
1. 使用了 `Link` 和 `useRouter` from `@/i18n/routing`
2. 清除浏览器缓存
3. 检查中间件配置

### Q: 构建时出现翻译错误？

**A:**
1. 确保所有翻译文件 JSON 格式正确
2. 两个语言文件的 key 结构一致
3. 运行 `pnpm build` 查看详细错误信息

## 🚀 开发工作流

### 添加新功能时的 i18n 步骤：

1. **在两个翻译文件中添加 key**
   ```bash
   # 编辑 messages/zh.json 和 messages/en.json
   ```

2. **在组件中使用翻译**
   ```typescript
   const t = await getTranslations();
   <h1>{t('newFeature.title')}</h1>
   ```

3. **测试两种语言**
   ```bash
   # 访问 /zh 和 /en 检查翻译
   ```

4. **提交前检查**
   ```bash
   pnpm build  # 确保构建成功
   ```

## 📚 参考资源

- [next-intl 官方文档](https://next-intl.dev/)
- [Next.js 国际化指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [i18n 最佳实践](https://next-intl.dev/docs/workflows/messages)

---

**提示**：所有页面内容都应该通过翻译文件管理，避免在代码中硬编码文本。这样可以确保网站完全国际化。
