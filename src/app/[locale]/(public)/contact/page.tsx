import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.contact.title,
    description: dict.pages.contact.body.slice(0, 155),
    alternates: localeAlternates(locale, "/contact"),
  };
}

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@convertHub.example";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.footer.contact }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.pages.contact.title}</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{dict.pages.contact.body}</p>

      <Card className="mt-6 flex max-w-md items-center gap-4 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </span>
        <span>
          <p className="text-xs text-muted-foreground">{dict.pages.contact.emailLabel}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
        </span>
      </Card>
    </div>
  );
}
