'use client';

import { animated, useSpring } from '@react-spring/web';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useCallback } from 'react';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Link } from '@/i18n/routing';

import type { CategoryId } from '@/constants/tools';
import type { MouseEvent } from 'react';

interface SiteNavProps {
  categories: readonly CategoryId[];
}

export function SiteNav({ categories }: SiteNavProps) {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const [, api] = useSpring(() => ({ y: 0, config: { tension: 220, friction: 28 } }));

  const isDark = resolvedTheme === 'dark';

  const handleScrollTo = (catId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // Check if we're on a tool detail page (e.g., /zh/tools/xxx)
    const isToolPage = window.location.pathname.includes('/tools/');

    if (isToolPage) {
      // Navigate to home page with hash
      window.location.href = `/${window.location.pathname.split('/')[1]}#${catId}`;
      return;
    }

    // On home page, scroll to category
    const target = document.getElementById(catId);
    if (!target) return;
    const headerOffset = 80;
    const destination = window.scrollY + target.getBoundingClientRect().top - headerOffset;

    api.start({
      from: { y: window.scrollY },
      to: { y: destination },
      onChange: (result) => {
        window.scrollTo(0, result.value.y);
      },
    });
  };

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  return (
    <animated.header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={'/'}>
          <div className="flex cursor-pointer items-center gap-2 font-bold text-xl tracking-tight">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/10">
              <Image src="/logo.png" alt={t('site.name')} fill sizes="32px" className="object-contain" priority />
            </div>
            <span className="hidden sm:inline">{t('site.name')}</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 p-1 bg-secondary/50 rounded-full border border-border/50">
          {categories.map((catId) => (
            <Link
              key={catId}
              href={`#${catId}`}
              onClick={handleScrollTo(catId)}
              className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-full transition-all"
            >
              {t(`categories.${catId}.name`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
            aria-label={t('nav.toggleTheme')}
          >
            <Sun className={`w-5 h-5 transition-all ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon
              className={`absolute w-5 h-5 top-2 left-2 transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
            />
          </button>
        </div>
      </div>
    </animated.header>
  );
}
