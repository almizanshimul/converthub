import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Land Calculator",
  description: "Convert local land-measurement units like Bigha, Katha, Kanal, and Marla — by country and region.",
};

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
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Land Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Local land units like Bigha, Katha, Kanal, and Marla vary by region — select a country and state to get the correct
        conversion for that area.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {countries.map((country) => (
          <Link key={country.id} href={`/${locale}/land/${country.slug}`}>
            <Card className="p-5 transition-colors hover:border-primary">
              <p className="font-medium">{country.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{country._count.regions} states/regions</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
