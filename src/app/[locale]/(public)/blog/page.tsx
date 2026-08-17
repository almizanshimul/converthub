import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getPublishedPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const dict = getDictionary(rawLocale as Locale);
  return { title: dict.blog.pageTitle, description: dict.blog.pageSubtitle };
}

export default async function BlogListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { page: pageParam } = await searchParams;
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPublishedPosts(locale, { page }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: dict.home, href: `/${locale}` }, { label: dict.blog.navLabel }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.blog.pageTitle}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{dict.blog.pageSubtitle}</p>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/blog/category/${c.slug}`}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary hover:text-foreground"
            >
              {c.name} ({c._count.posts})
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{dict.blog.emptyState}</p>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
              <Card className="p-5 transition-colors hover:border-primary">
                {post.category && <p className="text-xs font-medium text-primary">{post.category.name}</p>}
                <p className="mt-1 text-lg font-semibold">{post.title}</p>
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
            <Link href={`/${locale}/blog?page=${page - 1}`} className="text-sm font-medium text-primary hover:underline">
              {dict.blog.previousPage}
            </Link>
          ) : (
            <span />
          )}
          {page < totalPages ? (
            <Link href={`/${locale}/blog?page=${page + 1}`} className="text-sm font-medium text-primary hover:underline">
              {dict.blog.nextPage}
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
