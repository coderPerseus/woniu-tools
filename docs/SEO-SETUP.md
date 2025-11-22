# SEO Setup Guide for Woniu Toolbox

## ✅ What's Already Configured

Your Next.js project now has a complete SEO foundation using Next.js 16's latest features:

### 1. Metadata Configuration
- **File**: `src/config/site.ts`
- Contains all SEO settings in one centralized location
- Follows Next.js 16 Metadata API best practices

### 2. Automatic File Generation
Next.js automatically generates these files at build time:

- **`/sitemap.xml`**: Search engine sitemap
- **`/robots.txt`**: Crawler directives
- **Meta tags**: Open Graph, Twitter Cards, etc.

### 3. Structured Data (Schema.org)
- WebSite schema embedded in every page
- Helps search engines understand your content
- Enables rich search results

### 4. PWA Support
- Progressive Web App manifest configured
- Mobile-friendly installation support

## 🚀 Quick Start

### Step 1: Fill in Your Information

Edit `src/config/site.ts` and replace empty strings with your actual data:

```typescript
export const siteConfig = {
  // Update these fields:
  author: {
    name: 'Your Name',           // ← Add your name
    url: 'https://yoursite.com', // ← Add your website
    email: 'you@example.com',    // ← Add your email
  },

  links: {
    github: 'https://github.com/yourusername', // ← Your GitHub
    twitter: '@yourusername',                  // ← Your Twitter
    wechat: 'your-wechat-id',                  // ← Your WeChat
  },

  icp: '京ICP备12345678号',        // ← Your ICP number
  googleAnalytics: 'G-XXXXXXXXXX', // ← Google Analytics ID
  baiduAnalytics: 'xxxxxxxxxxxx',  // ← Baidu Analytics ID

  // ... other fields
};
```

### Step 2: Add Required Images

Create and add these images to `/public`:

```
public/
├── favicon.ico          (32x32 or 16x16)
├── apple-touch-icon.png (180x180)
├── og-image.png        (1200x630) - For social media
├── logo.png            (512x512+) - For Schema.org
├── icon-192.png        (192x192)  - For PWA
└── icon-512.png        (512x512)  - For PWA
```

**Pro Tips for OG Image**:
- Use 1200x630 pixels (Facebook/LinkedIn recommended size)
- Include your logo and a tagline
- Keep text large and readable
- Use high contrast colors
- Test it at [opengraph.xyz](https://www.opengraph.xyz/)

### Step 3: Build and Verify

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

Then visit:
- `http://localhost:3000/sitemap.xml` - Should show your sitemap
- `http://localhost:3000/robots.txt` - Should show crawler rules

### Step 4: Test Your SEO

Use these free tools to validate:

1. **Open Graph Debugger**
   - URL: https://www.opengraph.xyz/
   - Paste: `https://tools.luckysnail.cn`
   - Check preview image and metadata

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Verify Twitter card displays correctly

3. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test structured data (Schema.org)

4. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Check performance and Core Web Vitals

## 🔍 Search Engine Submission

After deploying to production:

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property: `tools.luckysnail.cn`
3. Verify ownership (add verification code to `src/config/site.ts`)
4. Submit sitemap: `https://tools.luckysnail.cn/sitemap.xml`

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Submit sitemap

### Baidu Webmaster
1. Go to https://ziyuan.baidu.com/
2. Add your site
3. Submit sitemap

## 📊 Monitoring Setup

### Google Analytics 4
1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `googleAnalytics` in `src/config/site.ts`
4. Analytics will auto-track page views

### Baidu Analytics
1. Create account at https://tongji.baidu.com/
2. Get Site ID
3. Add to `baiduAnalytics` in `src/config/site.ts`

## 🎯 SEO Best Practices Checklist

- [x] Meta title and description on all pages
- [x] Open Graph tags for social sharing
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Schema.org structured data
- [x] Mobile-friendly responsive design
- [x] Fast loading (Next.js optimized)
- [x] HTTPS (use Vercel/Cloudflare for auto SSL)
- [ ] Add alt text to all images (when adding images)
- [ ] Add internal linking between tools
- [ ] Create unique titles for each tool page
- [ ] Add breadcrumb navigation
- [ ] Create FAQ sections for popular tools

## 🚨 Common Issues

### Issue: Metadata not showing in social media previews
**Solution**:
- Clear social media cache: https://developers.facebook.com/tools/debug/
- Verify OG image is accessible and correct size
- Check `metadataBase` is set correctly in config

### Issue: Sitemap not updating
**Solution**:
- Rebuild the project: `pnpm build`
- Clear Next.js cache: `rm -rf .next`
- Verify `sitemap.ts` exports correct data

### Issue: Search engines not indexing
**Solution**:
- Check robots.txt allows crawling
- Submit sitemap to Google Search Console
- Verify no `noindex` meta tags
- Check server response is 200 OK

## 📈 Next Steps

1. **Content Optimization**
   - Write unique descriptions for each tool
   - Use descriptive headings (H1, H2, H3)
   - Add keyword-rich alt text to images

2. **Performance**
   - Monitor Core Web Vitals
   - Optimize images (use Next.js Image component)
   - Enable caching headers

3. **Link Building**
   - Submit to tool directories
   - Create blog posts about tools
   - Encourage social sharing

4. **Local SEO** (if applicable)
   - Add local business schema
   - Create Google Business Profile
   - Get local citations

## 📚 Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

---

**Need Help?** Check `SEO-CHECKLIST.md` for a complete list of required assets.
