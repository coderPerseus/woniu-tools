import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { JSX } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';
import { ChromeIconGenerator } from '@/components/tools/chrome-icon-generator';
import { ImageWatermark } from '@/components/tools/image-watermark';
import { KeyboardLogger } from '@/components/tools/keyboard-logger';
import { categoryIds } from '@/constants/tools';
import { Link } from '@/i18n/routing';

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

interface ToolEntry {
  titleKey: string;
  descriptionKey?: string;
  Component: () => JSX.Element;
}

const toolRegistry: Record<string, ToolEntry> = {
  'chrome-icon-generator': {
    titleKey: 'tools.chrome-icon-generator.name',
    descriptionKey: 'tools.chrome-icon-generator.desc',
    Component: ChromeIconGenerator,
  },
  'image-watermark': {
    titleKey: 'tools.image-watermark.name',
    descriptionKey: 'tools.image-watermark.desc',
    Component: ImageWatermark,
  },
  'keyboard-logger': {
    titleKey: 'tools.keyboard-logger.name',
    descriptionKey: 'tools.keyboard-logger.desc',
    Component: KeyboardLogger,
  },
};

interface MetadataProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const tool = toolRegistry[id];

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const title = t(tool.titleKey);
  const description = tool.descriptionKey ? t(tool.descriptionKey) : t('site.description');
  const url = `https://tools.luckysnail.cn/${locale}/tools/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/tools/${id}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: t('site.name'),
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const tool = toolRegistry[id];

  if (!tool) {
    notFound();
  }

  type SeoFaqItem = { q: string; a: string };
  const isSeoFaqItem = (value: unknown): value is SeoFaqItem => {
    if (!value || typeof value !== 'object') return false;
    const item = value as { q?: unknown; a?: unknown };
    return typeof item.q === 'string' && typeof item.a === 'string';
  };

  const rawFeatures = id === 'image-watermark' ? t.raw('tools.image-watermark.seo.features') : [];
  const rawFaq = id === 'image-watermark' ? t.raw('tools.image-watermark.seo.faq') : [];
  const seoFeatures = Array.isArray(rawFeatures) ? rawFeatures.filter((item): item is string => typeof item === 'string') : [];
  const seoFaq = Array.isArray(rawFaq) ? rawFaq.filter(isSeoFaqItem) : [];

  const { Component, titleKey, descriptionKey } = tool;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav categories={categoryIds} />

      <main className="container mx-auto flex-1 px-4 py-12 space-y-10">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('nav.home')}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t(titleKey)}</h1>
          {descriptionKey ? <p className="max-w-3xl text-base text-muted-foreground">{t(descriptionKey)}</p> : null}
        </div>

        <Component />

        {id === 'image-watermark' ? (
          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">{t('tools.image-watermark.seo.title')}</h2>
              <p className="max-w-3xl text-base text-muted-foreground">{t('tools.image-watermark.seo.summary')}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('tools.image-watermark.seo.featuresTitle')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {seoFeatures.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('tools.image-watermark.seo.faqTitle')}</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  {seoFaq.map((item) => (
                    <div key={item.q} className="space-y-1">
                      <p className="font-medium text-foreground">{item.q}</p>
                      <p>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter t={t} />
    </div>
  );
}
