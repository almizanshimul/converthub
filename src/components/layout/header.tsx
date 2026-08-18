import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SearchBox } from "@/components/layout/search-box";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CalculatorMegaMenu } from "@/components/layout/calculator-mega-menu";
import { LandMegaMenu } from "@/components/layout/land-mega-menu";
import { prisma } from "@/lib/prisma";
import { localize, translationInclude } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import type { dictionary } from "@/lib/i18n/dictionary";

interface SiteHeaderProps {
  locale: Locale;
  dict: (typeof dictionary)[Locale];
}

export async function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const calculatorRows = await prisma.calculator.findMany({
    where: { status: "PUBLISHED", isIndexable: true },
    orderBy: { name: "asc" },
    include: { translations: translationInclude(locale) },
  });
  const calculators = calculatorRows.map((row) => {
    const t = localize(row, row.translations);
    return { slug: row.slug, name: t.name, description: t.description, category: row.category };
  });

  const landCountryRows = await prisma.country.findMany({
    where: { status: "PUBLISHED", regions: { some: { status: "PUBLISHED", landConversions: { some: { status: "PUBLISHED" } } } } },
    orderBy: { name: "asc" },
    include: {
      translations: translationInclude(locale),
      regions: {
        where: { status: "PUBLISHED", landConversions: { some: { status: "PUBLISHED" } } },
        orderBy: { name: "asc" },
        include: { translations: translationInclude(locale) },
      },
    },
  });
  const landGroups = landCountryRows.map((row) => {
    const ct = localize(row, row.translations);
    return {
      country: { slug: row.slug, name: ct.name },
      regions: row.regions.map((region) => {
        const rt = localize(region, region.translations);
        return { slug: region.slug, name: rt.name };
      }),
    };
  });

  const navItems = [
    { href: `/${locale}/converter`, label: dict.nav.converters },
    { href: `/${locale}/currency`, label: dict.currency.navLabel },
    { href: `/${locale}/land`, label: dict.nav.land },
    { href: `/${locale}/calculator`, label: dict.nav.calculators },
    { href: `/${locale}/country`, label: dict.nav.countries },
    { href: `/${locale}/blog`, label: dict.blog.navLabel },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-1.5 text-lg font-bold tracking-tight">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Convert<span className="text-primary">Hub</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-6 md:flex">
          <Link href={`/${locale}/converter`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            {dict.nav.converters}
          </Link>
          <Link href={`/${locale}/currency`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            {dict.currency.navLabel}
          </Link>
          <LandMegaMenu locale={locale} label={dict.nav.land} viewAllLabel={dict.nav.viewAllLand} groups={landGroups} />
          <CalculatorMegaMenu
            locale={locale}
            label={dict.nav.calculators}
            viewAllLabel={dict.nav.viewAllCalculators}
            calculators={calculators}
          />
          <Link href={`/${locale}/country`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            {dict.nav.countries}
          </Link>
          <Link href={`/${locale}/blog`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            {dict.blog.navLabel}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <SearchBox locale={locale} placeholder={dict.search.placeholder} noResultsLabel={dict.search.noResults} />
          <div className="hidden md:block">
            <LanguageSwitcher locale={locale} />
          </div>
          <MobileMenu>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher locale={locale} />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
