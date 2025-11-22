/* eslint-disable @typescript-eslint/no-explicit-any */
import { Github } from 'lucide-react';
import Image from 'next/image';

import { siteConfig } from '@/config/site';

type Translate = (key: string, values?: Record<string, unknown>) => string;

interface SiteFooterProps {
  t: Translate | any;
}

export function SiteFooter({ t }: SiteFooterProps) {
  return (
    <footer className="border-t border-border mt-20 py-12 bg-muted/30 relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-semibold text-foreground">{t('site.name')}</div>
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-4">
            {siteConfig.links.github && (
              <>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  {t('footer.github')}
                </a>
                <span>|</span>
              </>
            )}
            <span>{t('footer.poweredBy', { author: siteConfig.author.name || 'luckySnail' })}</span>
          </div>
        </div>
      </div>

      {siteConfig.icp ? (
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute text-blue-600 w-full bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center text-xs sm:text-sm hover:underline"
        >
          <Image alt="备案" loading="lazy" width={18} height={18} className="mr-1" src="/police.png" />
          {siteConfig.icp}
        </a>
      ) : null}
    </footer>
  );
}
