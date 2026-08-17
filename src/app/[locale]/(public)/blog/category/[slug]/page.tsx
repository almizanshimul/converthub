import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getPublishedPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export async function generateStaticParams() {
  const categories = await prisma.blogCategory.findMany({ select: { slug: true } });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) return {};
  return { title: dict.blog.categoryPageTitle.replace("{category}", category.name) };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const { page: pageParam } = await searchParams;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const page = Math.max(1, Number(pageParam) || 1);

  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const { posts, totalPages } = await getPublishedPosts(locale, { page, categorySlug: slug });
  const title = dict.blog.categoryPageTitle.replace("{category}", category.name);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: dict.home, href: `/${locale}` },
          { label: dict.blog.navLabel, href: `/${locale}/blog` },
          { label: category.name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{dict.blog.emptyState}</p>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
              <Card className="p-5 transition-colors hover:border-primary">
                <p className="text-lg font-semibold">{post.title}</p>
                {post.excerpt && <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>}
                <p className="mt-2 text-xs text-muted-foreground">
                  {dict.blog.byAuthor.replace("{author}", post.authorName)} ·{" "}
                  {dict.blog.publishedOn.replace("{date}", post.publishedAt.toLocaleDateString(locale))}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          {page > 1 ? (
            <Link href={`/${locale}/blog/category/${slug}?page=${page - 1}`} className="text-sm font-medium text-primary hover:underline">
              {dict.blog.previousPage}
            </Link>
          ) : (
            <span />
          )}
          {page < totalPages ? (
            <Link href={`/${locale}/blog/category/${slug}?page=${page + 1}`} className="text-sm font-medium text-primary hover:underline">
              {dict.blog.nextPage}
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}

      <div className="mt-8">
        <Link href={`/${locale}/blog`} className="text-sm font-medium text-primary hover:underline">
          ← {dict.blog.backToBlog}
        </Link>
      </div>
    </div>
  );
}
