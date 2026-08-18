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
      <Breadcrumb locale={locale} items={[{ label: dict.home, href: `/${locale}` }, { label: dict.footer.privacy }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.pages.privacy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      {dict.pages.legalEnglishNotice && (
        <p className="mt-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          {dict.pages.legalEnglishNotice}
        </p>
      )}

      <div className="prose-legal mt-8 space-y-8 text-muted-foreground [&_a]:text-primary [&_a]:hover:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-4 [&_h3]:font-medium [&_h3]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:ps-5">
        <section>
          <h2>Overview</h2>
          <p>
            ConvertHub (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) provides free unit, currency, and
            land-measurement conversion tools. This policy explains what data we collect, how we use it, and the
            choices you have — including about cookies used by optional third-party services.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <h3>Information you provide</h3>
          <p>
            None required. No account, sign-up, or personal information is needed to use any converter, calculator,
            or reference table on this site.
          </p>
          <h3>Automatically collected information</h3>
          <p>
            We log first-party usage data — which converters and calculators are used, search queries entered on
            this site, and language switches — to a database we control directly, without cookies and without any
            third-party analytics provider. This data is used only in aggregate, to understand which tools are
            useful and where the site needs improvement; it is not tied to your identity.
          </p>
          <h3>Cookies and similar technologies</h3>
          <p>
            Beyond the cookie-free logging above, this site may use cookies for the purposes below, but only with
            your consent — which you can grant, decline, or change at any time via the cookie banner or the
            &quot;Cookie Settings&quot; link in the footer.
          </p>
          <ul>
            <li>
              <strong>Necessary</strong> — remembers your cookie preference itself. Always on; this alone doesn&apos;t
              track you.
            </li>
            <li>
              <strong>Analytics</strong> — helps us understand site-wide traffic patterns, via Google Analytics,
              Google Tag Manager, and/or Microsoft Clarity, where enabled.
            </li>
            <li>
              <strong>Advertising</strong> — used to show and measure ads, via Google AdSense, where enabled.
            </li>
          </ul>
          <p>
            None of the above third-party services are active unless we&apos;ve configured a real account for them —
            until then, your choice for these categories has no practical effect.
          </p>
        </section>

        <section>
          <h2>How We Use Information</h2>
          <ul>
            <li>To operate, maintain, and improve the converters, calculators, and reference tables on this site.</li>
            <li>To understand aggregate usage patterns — which tools are popular, which searches return no results, and so on.</li>
            <li>To detect and prevent abuse of the site.</li>
            <li>Where enabled and consented to, to measure and personalize advertising.</li>
          </ul>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>Where enabled, the following third-party services may process data collected via cookies, governed by their own privacy policies:</p>
          <ul>
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Analytics &amp; Google Tag Manager</a>
            </li>
            <li>
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google AdSense</a>
            </li>
            <li>
              <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Clarity</a>
            </li>
          </ul>
          <p>
            You can opt out of Google&apos;s use of cookies for personalized advertising via{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, and opt out of Google
            Analytics tracking generally via the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Your Choices and Rights</h2>
          <ul>
            <li><strong>Cookie preferences</strong> — change your consent choice at any time via &quot;Cookie Settings&quot; in the footer.</li>
            <li>
              <strong>Browser controls</strong> — most browsers let you block or delete cookies; doing so won&apos;t
              affect the core converter/calculator functionality of this site, since none of it requires cookies.
            </li>
            <li>
              <strong>Data subject rights</strong> — depending on where you live, you may have rights to access,
              correct, delete, or object to processing of your personal data. Contact us below to make a request.
            </li>
          </ul>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            First-party usage logs are retained only as long as useful for the aggregate analysis described above and
            are not tied to your identity. Cookie-based third-party data, where a category is enabled and consented
            to, is retained per that provider&apos;s own policy.
          </p>
        </section>

        <section>
          <h2>Children&apos;s Privacy</h2>
          <p>This site is not directed at children under 13, and we do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2>International Data Transfers</h2>
          <p>Where enabled, the third-party services listed above may process data in countries other than your own, including the United States.</p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>We may update this policy from time to time. Material changes will be reflected by updating the &quot;Last updated&quot; date above.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit our{" "}
            <a href={`/${locale}/contact`}>Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
