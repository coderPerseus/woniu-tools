import { type Metadata } from 'next';

/**
 * Site Configuration
 */
export const siteConfig = {
  // Basic Information
  name: 'Woniu Toolbox',
  title: 'Woniu Toolbox - Free Online Tools Collection',
  description:
    'Woniu Toolbox provides image processing, AI tools, developer tools, entertainment tools and other free online tools, including image compression, format conversion, JSON formatting, Base64 encoding/decoding, regex testing and other practical tools to improve your work efficiency.',
  keywords: [
    'online tools',
    'free tools',
    'image tools',
    'AI tools',
    'developer tools',
    'JSON formatter',
    'Base64 encode decode',
    'image compression',
    'format conversion',
    'regex tester',
    'woniu toolbox',
  ] as string[],

  // Website Information
  url: 'https://tools.luckysnail.cn',
  domain: 'tools.luckysnail.cn',

  // Author Information
  author: {
    name: 'luckySnail', // To be filled by user
    url: 'https://luckysnail.cn/', // To be filled by user
    email: 'snailrun160@gmail.com', // To be filled by user
  },

  // Social Media Links
  links: {
    github: 'https://github.com/coderPerseus', // To be filled by user
    twitter: 'https://x.com/haozhan05554957', // To be filled by user
    wechat: 'RELEASE500', // To be filled by user
  },

  // Open Graph Image (Recommended: 1200x630)
  ogImage: {
    url: '/og-image.png', // To be filled by user
    width: 1200,
    height: 630,
    alt: 'Woniu Toolbox - Free Online Tools Collection',
  },

  // Favicon
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },

  // ICP Registration
  icp: '浙 ICP 备 2021039023 号 -3',

  // Google Analytics ID
  googleAnalytics: '', // To be filled by user

  // Baidu Analytics ID
  baiduAnalytics: '', // To be filled by user
} as const;

/**
 * Tool Categories Configuration
 */
export const categoriesConfig = [
  {
    id: 'image-tools',
    name: '图片小工具',
    description: '图片压缩、格式转换、背景移除等图片处理工具',
    icon: 'ImageIcon',
  },
  {
    id: 'ai-tools',
    name: 'AI 工具',
    description: 'AI 提示词生成、文章润色等 AI 辅助工具',
    icon: 'Brain',
  },
  {
    id: 'dev-tools',
    name: '编程工具',
    description: 'JSON 格式化、Base64 编解码、正则测试等开发工具',
    icon: 'Code2',
  },
  {
    id: 'fun-tools',
    name: '娱乐工具',
    description: '决策转盘、电子木鱼等趣味小工具',
    icon: 'Gamepad2',
  },
  {
    id: 'other-tools',
    name: '其他工具',
    description: '汇率换算等实用工具',
    icon: 'Box',
  },
] as const;

/**
 * Homepage Content Configuration
 */
export const homepageConfig = {
  hero: {
    title: '一站式开发与效率工具箱',
    subtitle: '精选优质的开发者工具、AI 助手与创意小组件，提升你的工作效率。',
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
    poweredBy: `By ${siteConfig.author.name || 'luckySnail'}`,
  },
} as const;

/**
 * Default Metadata Configuration
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.author.name
    ? [
        {
          name: siteConfig.author.name,
          url: siteConfig.author.url,
        },
      ]
    : undefined,
  creator: siteConfig.author.name || siteConfig.name,
  publisher: siteConfig.name,

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: siteConfig.ogImage.alt,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage.url],
    creator: siteConfig.links.twitter,
  },

  // Icons
  icons: {
    icon: siteConfig.icons.icon,
    apple: siteConfig.icons.apple,
  },

  // Manifest
  manifest: '/manifest.json',

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (To be filled by user)
  verification: {
    google: '', // Google Search Console verification
    yandex: '', // Yandex verification
  },

  // Canonical URL
  alternates: {
    canonical: siteConfig.url,
  },
};

/**
 * Schema.org Structured Data Configuration
 */
export const schemaOrgConfig = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  inLanguage: 'zh-CN',
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.png`, // To be filled by user
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
} as const;
