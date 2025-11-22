'use client';

import Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { categoryIds, toolKeys, toolUrlMap } from '@/constants/tools';
import { Link } from '@/i18n/routing';

import type { CategoryId, ToolKey } from '@/constants/tools';

interface ToolOption {
  id: ToolKey;
  label: string;
  desc: string;
  href: string;
  external: boolean;
  category: CategoryId;
}

export function ToolSearch() {
  const t = useTranslations();
  const [query, setQuery] = useState('');

  const tools = useMemo<ToolOption[]>(() => {
    return categoryIds.flatMap((cat) =>
      toolKeys[cat].map((id) => {
        const href = toolUrlMap[id] ?? `/tools/${id}`;
        return {
          id,
          category: cat,
          label: t(`tools.${id}.name`),
          desc: t(`tools.${id}.desc`),
          href,
          external: href.startsWith('http'),
        };
      })
    );
  }, [t]);

  const fuse = useMemo(
    () =>
      new Fuse(tools, {
        keys: ['label', 'desc', 'id'],
        threshold: 0.35,
      }),
    [tools]
  );

  const results = query
    ? fuse
        .search(query)
        .slice(0, 8)
        .map((r) => r.item)
    : tools.slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full rounded-xl border border-border bg-card/80 px-10 py-3 text-sm text-foreground shadow-sm outline-none ring-0 transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {query.length > 0 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border bg-card p-2 shadow-lg">
            <div className="flex flex-col gap-1">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  target={tool.external ? '_blank' : undefined}
                  rel={tool.external ? 'noreferrer' : undefined}
                  className="rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                >
                  {tool.label}
                </Link>
              ))}
              {results.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">{t('hero.noResults')}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
