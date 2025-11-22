import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Geist } from 'next/font/google';
import { notFound } from 'next/navigation';

import '../globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { schemaOrgConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return {
    metadataBase: new URL('https://tools.luckysnail.cn'),
    title: {
      default: String(messages.site?.title || 'Woniu Toolbox'),
      template: `%s | ${String(messages.site?.name || 'Woniu Toolbox')}`,
    },
    description: String(messages.site?.description || ''),
    alternates: {
      canonical: '/',
      languages: {
        en: '/en',
        zh: '/zh',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrgConfig),
          }}
        />
      </head>
      <body className={`${geistSans.variable}`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
