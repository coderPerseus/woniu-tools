/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpRight } from 'lucide-react';

import { categoryIcons, iconMap, toolKeys, toolUrlMap } from '@/constants/tools';
import { Link } from '@/i18n/routing';

import type { CategoryId, ToolKey } from '@/constants/tools';

type Translate = (key: string, values?: Record<string, unknown>) => string;

const getIcon = (iconName: keyof typeof iconMap) => {
  const Icon = iconMap[iconName];
  return <Icon className="w-4 h-4" />;
};

interface ToolCardProps {
  desc: string;
  href: string;
  title: string;
  isExternal?: boolean;
}

function ToolCard({ title, desc, href, isExternal }: ToolCardProps) {
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className="group relative flex flex-col justify-between p-6 h-full bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </Link>
  );
}

interface CategoryItemProps {
  categoryId: CategoryId;
  t: Translate | any;
}

export function CategoryItem({ categoryId, t }: CategoryItemProps) {
  const toolList = (toolKeys[categoryId] ?? []) as readonly ToolKey[];

  return (
    <section id={categoryId} className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-8 border-l-4 border-primary pl-4">
        <span className="p-2 bg-primary/10 text-primary rounded-lg">{getIcon(categoryIcons[categoryId])}</span>
        <h2 className="text-2xl font-bold tracking-tight">{t(`categories.${categoryId}.name`)}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {toolList.map((toolKey) => {
          const href = toolUrlMap[toolKey] ?? `/tools/${toolKey}`;
          const isExternal = href.startsWith('http');
          return (
            <ToolCard
              key={toolKey}
              title={t(`tools.${toolKey}.name`)}
              desc={t(`tools.${toolKey}.desc`)}
              href={href}
              isExternal={isExternal}
            />
          );
        })}
      </div>
    </section>
  );
}
