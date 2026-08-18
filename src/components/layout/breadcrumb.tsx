import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, locale }: { items: BreadcrumbItem[]; locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <nav aria-label={dict.a11y.breadcrumb} className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
