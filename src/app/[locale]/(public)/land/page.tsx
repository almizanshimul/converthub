import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const dict = getDictionary(rawLocale as Locale);
  return { title: dict.land.pageTitle, description: dict.land.pageSubtitle };
}

export default async function LandLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const countries = await prisma.country.findMany({
    where: { status: "PUBLISHED", regions: { some: {} } },
    orderBy: { name: "asc" },
    include: { translations: translationInclude(locale), _count: { select: { regions: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.nav.land }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.land.pageTitle}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.land.pageSubtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {countries.map((country) => {
          const t = localize(country, country.translations);
          return (
            <Link key={country.id} href={`/${locale}/land/${country.slug}`}>
              <Card className="p-5 transition-colors hover:border-primary">
                <p className="font-medium">{t.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dict.country.regionsCount.replace("{count}", String(country._count.regions))}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
