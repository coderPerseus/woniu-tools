import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CategoryItem } from '@/components/category-item';
import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';
import { ToolSearch } from '@/components/tool-search';
import { categoryIds } from '@/constants/tools';

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ToolsPage({ params }: PageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <SiteNav categories={categoryIds} />

      {/* 2. Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 pt-1 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-5 pb-8 mb-0">
          <h1 className="text-xl  md:text-2xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {t('hero.title')}
          </h1>
          <ToolSearch />
        </section>

        {/* Tools Categories */}
        <div className="space-y-20">
          {categoryIds.map((catId) => (
            <CategoryItem key={catId} categoryId={catId} t={t} />
          ))}
        </div>
      </main>

      <SiteFooter t={t} />
    </div>
  );
}
