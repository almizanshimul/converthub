import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/icons";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const categories = await prisma.converterCategory.findMany({
    orderBy: { order: "asc" },
    take: 6,
    include: { translations: translationInclude(locale) },
  });

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href={`/${locale}`} className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Convert<span className="text-primary">Hub</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">{dict.footer.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{dict.footer.converters}</h3>
          <ul className="mt-3 space-y-2">
            {categories.map((cat) => {
              const t = localize(cat, cat.translations);
              const Icon = getCategoryIcon(cat.slug);
              return (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}/converter/${cat.slug}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {t.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{dict.footer.explore}</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${locale}/converter`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.nav.converters}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/currency`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.currency.navLabel}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/land`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.nav.land}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/calculator`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.nav.calculators}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/country`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.nav.countries}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{dict.footer.company}</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${locale}/about`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.footer.about}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.footer.contact}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-foreground">
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs text-muted-foreground">{dict.footer.disclaimer}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ConvertHub. {dict.footer.rights}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {dict.footer.createdBy.split("{site}")[0]}
            <a
              href="https://almizanweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              almizanweb.com
            </a>
            {dict.footer.createdBy.split("{site}")[1]}
          </p>
        </div>
      </div>
    </footer>
  );
}
