import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

async function getCountry(slug: string) {
  return prisma.country.findUnique({
    where: { slug },
    include: { regions: { orderBy: { name: "asc" } } },
  });
}

export async function generateStaticParams() {
  const rows = await prisma.country.findMany({ where: { regions: { some: {} } }, select: { slug: true } });
  return rows.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: slug } = await params;
  const country = await getCountry(slug);
  if (!country) return {};
  return { title: `${country.name} Land Unit Calculator`, description: `Convert local land units by state/region in ${country.name}.` };
}

export default async function LandCountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale: rawLocale, country: slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const country = await getCountry(slug);
  if (!country) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.nav.land, href: `/${locale}/land` },
          { label: country.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{country.name} Land Unit Calculator</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Land-unit definitions vary by region in {country.name}. Select a state or region below to get the correct conversion.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {country.regions.map((region) => (
          <Link key={region.id} href={`/${locale}/land/${country.slug}/${region.slug}`}>
            <Card className="p-4 transition-colors hover:border-primary">
              <p className="text-sm font-medium">{region.name}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
