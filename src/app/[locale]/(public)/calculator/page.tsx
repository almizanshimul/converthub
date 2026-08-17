import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getCalculatorIcon } from "@/lib/icons";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Calculators",
  description: "Number-to-words and other everyday calculators, including Bengali and Hindi number-to-words conversion.",
};

export default async function CalculatorLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const calculators = await prisma.calculator.findMany({
    where: { status: "PUBLISHED", isIndexable: true },
    orderBy: { name: "asc" },
    include: { translations: translationInclude(locale) },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.nav.calculators }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.nav.calculators}</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {calculators.map((calc) => {
          const t = localize(calc, calc.translations);
          const Icon = getCalculatorIcon(calc.category);
          return (
            <Link key={calc.id} href={`/${locale}/calculator/${calc.slug}`}>
              <Card className="flex items-start gap-4 p-5 transition-colors hover:border-primary">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <p className="font-medium">{t.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
