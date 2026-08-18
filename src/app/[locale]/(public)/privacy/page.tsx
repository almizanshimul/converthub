import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.privacy.title,
    robots: { index: false, follow: true },
    alternates: localeAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.footer.privacy }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.pages.privacy.title}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        {dict.pages.privacy.body.map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
