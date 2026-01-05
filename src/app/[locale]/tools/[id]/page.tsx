import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { JSX } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { SiteNav } from '@/components/site-nav';
import { ChromeIconGenerator } from '@/components/tools/chrome-icon-generator';
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
      </main>

      <SiteFooter t={t} />
    </div>
  );
}
