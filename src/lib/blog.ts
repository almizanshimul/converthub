import { prisma } from "@/lib/prisma";
import { localize, translationInclude } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

const PER_PAGE = 10;

export async function getPublishedPosts(locale: Locale, { page = 1, categorySlug }: { page?: number; categorySlug?: string } = {}) {
  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: new Date() },
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (Math.max(1, page) - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { author: true, category: true, translations: translationInclude(locale) },
    }),
    prisma.blogPost.count({ where }),
  ]);

  const posts = rows.map((row) => {
    const t = localize(row, row.translations);
    return {
      slug: row.slug,
      title: t.title,
      excerpt: t.excerpt,
      featuredImage: row.featuredImage,
      publishedAt: row.publishedAt!,
      authorName: row.author.name,
      category: row.category,
    };
  });

  return { posts, total, page: Math.max(1, page), perPage: PER_PAGE, totalPages: Math.max(1, Math.ceil(total / PER_PAGE)) };
}
