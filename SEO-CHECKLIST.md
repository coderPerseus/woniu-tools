# SEO Assets Checklist

This file lists all the assets and information you need to provide to complete the SEO setup for Woniu Toolbox.

## 📝 Configuration Updates Needed

Edit `/src/config/site.ts` and fill in the following fields:

### Author Information
```typescript
author: {
  name: '', // Your name or company name
  url: '',  // Your website or profile URL
  email: '', // Contact email
}
```

### Social Media Links
```typescript
links: {
  github: '',  // GitHub profile URL
  twitter: '', // Twitter/X handle (e.g., '@username')
  wechat: '',  // WeChat QR code URL or ID
}
```

### ICP Registration
```typescript
icp: '', // Your ICP registration number (e.g., '京ICP备12345678号')
```

### Analytics
```typescript
googleAnalytics: '', // Google Analytics Measurement ID (e.g., 'G-XXXXXXXXXX')
baiduAnalytics: '',  // Baidu Analytics Site ID
```

### Search Engine Verification
Edit metadata in `/src/config/site.ts`:
```typescript
verification: {
  google: '', // Google Search Console verification code
  yandex: '', // Yandex Webmaster verification code
}
```

## 🖼️ Image Assets Needed

Create and place these images in the `/public` directory:

### Favicon
- **File**: `/public/favicon.ico`
- **Size**: 32x32 or 16x16
- **Format**: .ico
- **Purpose**: Browser tab icon

### Apple Touch Icon
- **File**: `/public/apple-touch-icon.png`
- **Size**: 180x180
- **Format**: PNG
- **Purpose**: iOS home screen icon

### Open Graph Image
- **File**: `/public/og-image.png`
- **Size**: 1200x630 (recommended)
- **Format**: PNG or JPG
- **Purpose**: Social media preview when sharing links
- **Tips**: Include your logo and tagline, keep text readable

### Logo
- **File**: `/public/logo.png`
- **Size**: 512x512 or larger (square)
- **Format**: PNG with transparent background
- **Purpose**: Schema.org structured data

### PWA Icons
For Progressive Web App support:

- **File**: `/public/icon-192.png`
  - **Size**: 192x192
  - **Format**: PNG

- **File**: `/public/icon-512.png`
  - **Size**: 512x512
  - **Format**: PNG

## 🔍 Optional Enhancements

### 1. Add Sitemap for Individual Tools
When you create individual tool pages, update `/src/app/sitemap.ts`:

```typescript
const tools = [
  { slug: 'image-compress', lastModified: '2025-01-15' },
  { slug: 'json-formatter', lastModified: '2025-01-15' },
  // Add more tools...
];

tools.forEach((tool) => {
  routes.push({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.lastModified),
    changeFrequency: 'monthly',
    priority: 0.7,
  });
});
```

### 2. Add FAQ Schema
For better search results, consider adding FAQ structured data to relevant pages.

### 3. Add Breadcrumbs Schema
For tool pages, implement breadcrumb navigation and schema.

### 4. Performance Monitoring
- Set up Google Search Console
- Enable Core Web Vitals monitoring
- Configure Lighthouse CI

## ✅ Verification Steps

After filling in all the information:

1. **Build the project**: `pnpm build`
2. **Check generated files**:
   - Visit `/sitemap.xml` to verify sitemap
   - Visit `/robots.txt` to verify robots directives
3. **Validate metadata**:
   - Use [Open Graph Debugger](https://www.opengraph.xyz/)
   - Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - Use [Rich Results Test](https://search.google.com/test/rich-results)
4. **Submit to search engines**:
   - Google Search Console: Submit sitemap
   - Bing Webmaster Tools: Submit sitemap
   - Baidu Webmaster: Submit sitemap

## 📊 SEO Best Practices Applied

✅ Semantic HTML structure
✅ Meta tags (title, description, keywords)
✅ Open Graph tags for social sharing
✅ Twitter Card tags
✅ Schema.org structured data (WebSite)
✅ Sitemap for search engines
✅ Robots.txt for crawler control
✅ Canonical URLs
✅ Mobile-friendly (responsive design)
✅ Fast loading (Next.js optimization)
✅ Proper heading hierarchy
✅ Alt text for images (to be added when images are added)
✅ PWA manifest for mobile installation

## 🚀 Next Steps

1. Fill in all configuration fields in `src/config/site.ts`
2. Create and add all required image assets to `/public`
3. Build the project and verify all SEO elements
4. Submit your sitemap to search engines
5. Monitor performance in Google Search Console
