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
    title: dict.pages.about.title,
    description: dict.pages.about.body[0]?.slice(0, 155),
    alternates: localeAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.footer.about }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.pages.about.title}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        {dict.pages.about.body.map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">{dict.pages.about.authorTitle}</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">
        {dict.pages.about.authorBody.map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para.split("almizanweb.com").map((part, j, arr) => (
              <span key={j}>
                {part}
                {j < arr.length - 1 && (
                  <a href="https://almizanweb.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    almizanweb.com
                  </a>
                )}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
