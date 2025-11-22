'use client';

import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'zh' ? 'en' : 'zh';

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50 flex items-center gap-1.5"
      aria-label="Toggle Language"
    >
      <Languages className="w-5 h-5" />
      <span className="text-sm font-medium">{locale === 'zh' ? 'EN' : '中'}</span>
    </button>
  );
}
