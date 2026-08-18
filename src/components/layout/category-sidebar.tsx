import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/icons";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getDictionary } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export async function CategorySidebar({ locale, activeCategorySlug }: { locale: Locale; activeCategorySlug?: string }) {
  const dict = getDictionary(locale);
  const categories = await prisma.converterCategory.findMany({
    orderBy: { order: "asc" },
    include: { translations: translationInclude(locale) },
  });

  return (
    <aside className="w-full shrink-0 md:w-56">
      <p className="mb-3 px-1 text-sm font-semibold text-muted-foreground">{dict.section.categories}</p>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1">
        {categories.map((cat) => {
          const t = localize(cat, cat.translations);
          const Icon = getCategoryIcon(cat.slug);
          const active = cat.slug === activeCategorySlug;
          return (
            <Link
              key={cat.id}
              href={`/${locale}/converter/${cat.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border bg-card hover:border-primary hover:bg-primary/10",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
