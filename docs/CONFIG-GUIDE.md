# 配置文件使用指南

## 📁 配置文件位置

所有站点配置都集中在 `src/config/site.ts`，包括：

- 站点基本信息
- SEO 元数据
- 分类配置
- 工具数据
- 首页内容
- 社交媒体链接
- 作者信息

## 🎯 配置结构

### 1. 站点配置 (`siteConfig`)

```typescript
export const siteConfig = {
  name: 'Woniu Toolbox',           // 站点名称
  title: 'Woniu Toolbox - ...',    // SEO 标题
  description: '...',               // SEO 描述
  keywords: [...],                  // SEO 关键词
  url: 'https://tools.luckysnail.cn', // 站点 URL
  domain: 'tools.luckysnail.cn',   // 域名

  author: {
    name: 'luckySnail',
    url: 'https://luckysnail.cn/',
    email: 'snailrun160@gmail.com',
  },

  links: {
    github: 'https://github.com/coderPerseus',
    twitter: 'https://x.com/haozhan05554957',
    wechat: 'RELEASE500',
  },

  // ... 其他配置
}
```

### 2. 分类配置 (`categoriesConfig`)

定义工具的分类：

```typescript
export const categoriesConfig = [
  {
    id: 'image-tools',              // 分类 ID（URL 锚点）
    name: '图片小工具',             // 显示名称
    description: '图片压缩、...',   // 分类描述（用于 SEO）
    icon: 'ImageIcon',              // 图标名称
  },
  // ... 更多分类
]
```

**支持的图标：**
- `ImageIcon` - 图片工具
- `Brain` - AI 工具
- `Code2` - 编程工具
- `Gamepad2` - 娱乐工具
- `Box` - 其他工具

### 3. 工具数据 (`toolsData`)

定义每个分类下的具体工具：

```typescript
export const toolsData = {
  'image-tools': [
    {
      name: '图片压缩',                // 工具名称
      desc: '无损压缩 PNG/JPG 图片...', // 工具描述
      href: '#'                        // 工具链接（待实现）
    },
    // ... 更多工具
  ],
  // ... 更多分类
}
```

### 4. 首页内容 (`homepageConfig`)

首页的文案配置：

```typescript
export const homepageConfig = {
  hero: {
    title: '一站式开发与效率工具箱',
    subtitle: '精选优质的开发者工具...',
  },
  footer: {
    copyright: '© 2025 All rights reserved.',
    poweredBy: 'By luckySnail',
  },
}
```

## 🔧 如何修改配置

### 添加新工具

1. 编辑 `src/config/site.ts`
2. 找到 `toolsData` 对象
3. 在对应分类下添加新工具：

```typescript
export const toolsData = {
  'dev-tools': [
    // ... 现有工具
    {
      name: 'URL 编解码',
      desc: '快速进行 URL 编码和解码。',
      href: '/tools/url-encode' // 实际工具页面路径
    },
  ],
}
```

### 添加新分类

1. 在 `categoriesConfig` 中添加新分类：

```typescript
export const categoriesConfig = [
  // ... 现有分类
  {
    id: 'converter-tools',
    name: '格式转换',
    description: '各种格式转换工具',
    icon: 'Box', // 选择一个合适的图标
  },
]
```

2. 在 `toolsData` 中添加该分类的工具：

```typescript
export const toolsData = {
  // ... 现有分类
  'converter-tools': [
    { name: 'MD to PDF', desc: 'Markdown 转 PDF', href: '#' },
  ],
}
```

3. 如果需要新图标，更新 `page.tsx` 中的 `iconMap`：

```typescript
// src/app/page.tsx
const iconMap = {
  ImageIcon: ImageIcon,
  Brain: Brain,
  Code2: Code2,
  Gamepad2: Gamepad2,
  Box: Box,
  ArrowRightLeft: ArrowRightLeft, // 新图标
} as const;
```

### 修改站点信息

直接编辑 `siteConfig` 中的对应字段：

```typescript
export const siteConfig = {
  name: '蜗牛工具箱',  // 修改站点名称
  // ... 其他字段
}
```

修改会自动应用到：
- 页面标题
- 导航栏
- Footer
- SEO 元数据

## 📝 配置最佳实践

### 1. 工具链接规范

开发阶段使用 `#` 作为占位符：

```typescript
{ name: '工具名', desc: '描述', href: '#' }
```

实现后更新为实际路径：

```typescript
{ name: '工具名', desc: '描述', href: '/tools/tool-slug' }
```

### 2. 描述文案规范

- **工具描述**：简洁明了，1-2 句话
- **分类描述**：用于 SEO，包含相关关键词
- **首页标题**：突出核心价值

### 3. SEO 关键词

在 `siteConfig.keywords` 中添加相关关键词：

```typescript
keywords: [
  '在线工具',
  '免费工具',
  // 添加具体工具关键词
  '图片压缩',
  'JSON格式化',
  // ...
] as string[],
```

### 4. 图标选择

- **图片工具** → `ImageIcon`
- **AI 工具** → `Brain`
- **开发工具** → `Code2`
- **娱乐工具** → `Gamepad2`
- **其他** → `Box`

需要更多图标可从 [lucide.dev](https://lucide.dev/) 选择。

## 🔍 配置验证

修改配置后，运行以下命令验证：

```bash
# 类型检查
pnpm type-check

# 构建测试
pnpm build

# 本地预览
pnpm dev
```

## 📦 配置导出说明

`src/config/site.ts` 导出以下内容：

```typescript
// 基础配置
export const siteConfig        // 站点基本信息
export const categoriesConfig  // 工具分类
export const toolsData         // 工具数据
export const homepageConfig    // 首页内容

// SEO 配置
export const defaultMetadata   // Next.js Metadata
export const schemaOrgConfig   // Schema.org 结构化数据
```

## 🎨 页面使用示例

`src/app/page.tsx` 中使用配置的示例：

```tsx
import { categoriesConfig, homepageConfig, siteConfig, toolsData } from '@/config/site';

export default function Page() {
  return (
    <div>
      {/* 使用站点名称 */}
      <h1>{siteConfig.name}</h1>

      {/* 使用分类配置 */}
      {categoriesConfig.map((cat) => (
        <div key={cat.id}>
          <h2>{cat.name}</h2>
          {/* 使用工具数据 */}
          {toolsData[cat.id]?.map((tool) => (
            <a key={tool.name} href={tool.href}>
              {tool.name}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## 🚀 快速参考

| 修改内容 | 配置位置 |
|---------|---------|
| 站点名称 | `siteConfig.name` |
| SEO 信息 | `siteConfig.title/description/keywords` |
| 社交链接 | `siteConfig.links` |
| ICP 备案 | `siteConfig.icp` |
| 添加工具 | `toolsData` |
| 添加分类 | `categoriesConfig` |
| 首页文案 | `homepageConfig` |

---

**提示**：所有配置修改后都会立即生效，无需修改页面代码。保持配置和代码分离有助于维护和扩展。
