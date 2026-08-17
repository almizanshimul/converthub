import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { ShareButton } from "@/components/share/share-button";
import { JsonLd } from "@/components/seo/json-ld";
import { AdSlot } from "@/components/ads/ad-slot";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localize, translationInclude } from "@/lib/i18n/translate";
import { getRelatedContent } from "@/lib/related-content";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import type { Locale } from "@/lib/i18n/config";

async function getPost(slug: string, locale: Locale) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: { include: { blogTag: true } },
      translations: translationInclude(locale),
    },
  });
  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) return null;
  return post;
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = await getPost(slug, locale);
  if (!post) return {};
  const t = localize(post, post.translations);

  return {
    title: post.seoTitle ?? t.title,
    description: post.seoDescription ?? t.excerpt ?? undefined,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: post.ogTitle ?? post.seoTitle ?? t.title,
      description: post.ogDescription ?? post.seoDescription ?? t.excerpt ?? undefined,
      images: post.ogImage ?? post.featuredImage ?? undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const post = await getPost(slug, locale);
  if (!post) notFound();

  const t = localize(post, post.translations);
  const pageUrl = `/${locale}/blog/${post.slug}`;
  const related = await getRelatedContent(locale, "blog_post", post.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { label: dict.home, href: `/${locale}` },
          { label: dict.blog.navLabel, href: `/${locale}/blog` },
          { label: t.title },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: t.title,
          description: t.excerpt,
          url: pageUrl,
          image: post.featuredImage,
          authorName: post.author.name,
          publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })}
      />

      <Breadcrumb
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.blog.navLabel, href: `/${locale}/blog` },
          { label: t.title },
        ]}
      />

      {post.category && (
        <Link href={`/${locale}/blog/category/${post.category.slug}`} className="mt-4 inline-block text-xs font-medium text-primary">
          {post.category.name}
        </Link>
      )}

      <div className="mt-2 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <ShareButton title={t.title} url={pageUrl} text={t.excerpt ?? undefined} labels={dict.share} />
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {dict.blog.byAuthor.replace("{author}", post.author.name)} ·{" "}
        {dict.blog.publishedOn.replace("{date}", (post.publishedAt ?? post.createdAt).toLocaleDateString(locale))}
      </p>

      {post.featuredImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featuredImage} alt={t.title} className="mt-6 w-full rounded-lg border border-border object-cover" />
      )}

      <section className="mt-8">
        {t.content.split("\n\n").map((para, i) => (
          <p key={i} className="mt-4 leading-relaxed text-foreground first:mt-0">
            {para}
          </p>
        ))}
      </section>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{dict.blog.tagsLabel}:</span>
          {post.tags.map(({ blogTag }) => (
            <span key={blogTag.id} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {blogTag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <AdSlot slot={`blog-${post.slug}-after-content`} />
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">{dict.blog.relatedHeading}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link key={item.url} href={item.url}>
                <Card className="p-4 transition-colors hover:border-primary">
                  <p className="text-sm font-medium">{item.title}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href={`/${locale}/blog`} className="text-sm font-medium text-primary hover:underline">
          ← {dict.blog.backToBlog}
        </Link>
      </div>
    </div>
  );
}
