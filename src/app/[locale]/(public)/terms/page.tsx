import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localeAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/lib/i18n/config";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@convertHub.example";
const LAST_UPDATED = "August 18, 2026";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.pages.terms.title,
    robots: { index: false, follow: true },
    alternates: localeAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb locale={locale} items={[{ label: dict.home, href: `/${locale}` }, { label: dict.footer.terms }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.pages.terms.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      {dict.pages.legalEnglishNotice && (
        <p className="mt-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          {dict.pages.legalEnglishNotice}
        </p>
      )}

      <div className="mt-8 space-y-8 text-muted-foreground [&_a]:text-primary [&_a]:hover:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:ps-5">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using ConvertHub (&quot;the site,&quot; &quot;we,&quot; &quot;us&quot;), you agree to these Terms of
            Service. If you don&apos;t agree, please don&apos;t use the site.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            ConvertHub provides free unit converters, a currency converter, land-measurement calculators, and related
            reference content. The service is provided &quot;as is,&quot; free of charge, with no account required.
          </p>
        </section>

        <section>
          <h2>3. No Professional Advice — Accuracy Disclaimer</h2>
          <p>
            <strong>
              Conversion results, exchange rates, and land-unit figures on this site are provided for general
              reference only and are not a substitute for professional advice.
            </strong>{" "}
            Currency exchange rates may be delayed or approximate. Regional land units (e.g. Bigha, Katha, Kanal,
            Marla) vary by country and, within a country, by state or district — figures are sourced and cited where
            possible, but you should always independently verify exact figures with an official or professional
            source before relying on them for any legal, financial, land, or other transaction with real
            consequences.
          </p>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use automated means (scraping, bots) to extract data from the site at a volume that degrades service for other users.</li>
            <li>Attempt to gain unauthorized access to any part of the site, including the admin dashboard.</li>
            <li>Use the site for any unlawful purpose or in a way that infringes the rights of others.</li>
            <li>Misrepresent conversion results from this site as officially certified or professionally verified figures.</li>
          </ul>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <p>
            The site&apos;s design, layout, and original written content (excluding factual data such as conversion
            factors themselves, which aren&apos;t owned by anyone) belong to ConvertHub and its operator. You may
            link to and share pages on this site freely; you may not republish substantial portions of its written
            content elsewhere without permission.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Links and Advertising</h2>
          <p>
            This site may contain links to third-party sites and, where enabled, third-party advertising (see our{" "}
            <a href={`/${locale}/privacy`}>Privacy Policy</a> for details). We don&apos;t control and aren&apos;t
            responsible for the content, accuracy, or practices of any third-party site or advertiser.
          </p>
        </section>

        <section>
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The site is provided without warranties of any kind, express or implied, including but not limited to
            accuracy, reliability, availability, or fitness for a particular purpose. We work to keep conversion
            factors and reference data correct and up to date, but we don&apos;t guarantee they are error-free at any
            given moment.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, ConvertHub and its operator won&apos;t be liable for any indirect,
            incidental, or consequential loss arising from your use of, or reliance on, this site or its content —
            including decisions made using a conversion result that later turns out to be inaccurate or outdated.
          </p>
        </section>

        <section>
          <h2>9. Indemnification</h2>
          <p>You agree to indemnify and hold ConvertHub and its operator harmless from any claim arising from your misuse of the site or violation of these Terms.</p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>
            These Terms are governed by applicable law, without regard to conflict-of-law principles. Any dispute
            will first be pursued through good-faith direct negotiation before any other venue.
          </p>
        </section>

        <section>
          <h2>11. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. Material changes will be reflected by updating the &quot;Last updated&quot; date above. Continued use of the site after a change means you accept the updated Terms.</p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            Questions about these Terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit our{" "}
            <a href={`/${locale}/contact`}>Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
