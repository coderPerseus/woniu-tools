# 国际化快速开始

## ✅ 已完成的功能

### 1. 自动语言检测
- ✅ 浏览器语言为中文 → 自动跳转到 `/zh`
- ✅ 浏览器语言非中文 → 自动跳转到 `/en`

### 2. 语言切换组件
- ✅ 显示在页面右上角（主题切换按钮左侧）
- ✅ 点击切换中英文
- ✅ 自动保持当前页面路径

### 3. 完整翻译
- ✅ 站点名称
- ✅ 导航栏
- ✅ Hero 区域
- ✅ 所有工具分类
- ✅ 所有工具名称和描述
- ✅ Footer

## 🚀 测试方法

### 方法 1：本地开发
```bash
pnpm dev

# 访问以下 URL：
# http://localhost:3000     → 自动重定向
# http://localhost:3000/zh  → 中文版本
# http://localhost:3000/en  → 英文版本
```

### 方法 2：生产构建
```bash
pnpm build
pnpm start

# 访问相同的 URL 测试
```

## 🌐 URL 结构

| URL | 语言 | 说明 |
|-----|------|------|
| `/` | 自动检测 | 根据浏览器语言重定向 |
| `/zh` | 中文 | 中文版本 |
| `/zh#image-tools` | 中文 | 中文版本（图片工具锚点） |
| `/en` | 英文 | 英文版本 |
| `/en#dev-tools` | 英文 | 英文版本（开发工具锚点） |

## 📝 添加新翻译

### 步骤 1：在翻译文件中添加

**messages/zh.json:**
```json
{
  "myNewFeature": {
    "title": "我的新功能",
    "description": "这是一个新功能的描述"
  }
}
```

**messages/en.json:**
```json
{
  "myNewFeature": {
    "title": "My New Feature",
    "description": "This is a description of the new feature"
  }
}
```

### 步骤 2：在组件中使用

**服务器组件:**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations();

  return (
    <div>
      <h1>{t('myNewFeature.title')}</h1>
      <p>{t('myNewFeature.description')}</p>
    </div>
  );
}
```

**客户端组件:**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('myNewFeature.title')}</h1>
    </div>
  );
}
```

## 🎨 语言切换器位置

语言切换器已添加在页面右上角：

```
[Logo]  [导航菜单]  [语言切换] [主题切换]
```

点击显示当前语言缩写：
- 中文状态 → 显示 "EN"（点击切换到英文）
- 英文状态 → 显示 "中"（点击切换到中文）

## 🔍 验证清单

在部署前检查：

- [ ] 访问 `/zh` 显示中文内容
- [ ] 访问 `/en` 显示英文内容
- [ ] 点击语言切换器可以切换语言
- [ ] 切换语言后 URL 正确更新
- [ ] 所有文本都已翻译（无硬编码文本）
- [ ] 两个语言版本的 SEO 元数据正确

## 🐛 常见问题

### Q: 为什么访问 `/` 没有重定向？
**A:** 检查 middleware 是否正确配置在 `src/middleware.ts`

### Q: 语言切换器没有显示？
**A:** 确认已导入 `LanguageSwitcher` 组件在 page.tsx

### Q: 翻译没有生效？
**A:** 检查：
1. 翻译 key 在 `messages/zh.json` 和 `messages/en.json` 中都存在
2. key 路径正确（使用点号分隔）
3. 使用了 `getTranslations()` 或 `useTranslations()`

### Q: 构建失败？
**A:**
1. 清除缓存：`rm -rf .next`
2. 重新安装：`pnpm install`
3. 检查 JSON 文件格式是否正确

## 📚 完整文档

详细使用指南请查看：
- **docs/I18N-GUIDE.md** - 完整的国际化使用指南
- **CLAUDE.md** - 项目整体文档

## 🎯 下一步

1. 测试所有页面的翻译
2. 添加更多语言（如需要）
3. 优化 SEO 元数据的多语言支持
4. 添加 sitemap 的多语言版本

---

**已完成！** 项目现在完全支持中英文双语，并且可以根据用户浏览器自动选择语言。
