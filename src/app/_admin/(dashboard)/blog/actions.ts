"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { findContentIdBySlug } from "@/lib/related-content";
import type { ContentStatus } from "@/generated/prisma/enums";

async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session;
}

async function requireAuthorId(userId: string): Promise<string> {
  const existing = await prisma.author.findUnique({ where: { userId } });
  if (existing) return existing.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const created = await prisma.author.create({ data: { userId, name: user?.name ?? "Admin" } });
  return created.id;
}

function readPostInput(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const status = (String(formData.get("status") ?? "DRAFT")) as ContentStatus;
  const publishedAtInput = String(formData.get("publishedAt") ?? "").trim();

  if (!title) throw new Error("Title is required");
  const content = String(formData.get("content") ?? "").trim();
  if (!content) throw new Error("Content is required");

  return {
    title,
    slug: slugify(slugInput || title),
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    content,
    categoryId: String(formData.get("categoryId") ?? "").trim() || null,
    tagIds: formData.getAll("tagIds").map(String),
    status,
    publishedAt: publishedAtInput ? new Date(publishedAtInput) : status === "PUBLISHED" ? new Date() : null,
    featuredImage: String(formData.get("featuredImage") ?? "").trim() || null,
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || null,
    focusKeyword: String(formData.get("focusKeyword") ?? "").trim() || null,
    canonicalUrl: String(formData.get("canonicalUrl") ?? "").trim() || null,
    ogTitle: String(formData.get("ogTitle") ?? "").trim() || null,
    ogDescription: String(formData.get("ogDescription") ?? "").trim() || null,
    ogImage: String(formData.get("ogImage") ?? "").trim() || null,
  };
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/[locale]/(public)/blog", "page");
  if (slug) revalidatePath("/[locale]/(public)/blog/[slug]", "page");
}

export async function createPost(formData: FormData) {
  const session = await requireSession();
  const authorId = await requireAuthorId(session.user.id);
  const input = readPostInput(formData);

  const post = await prisma.blogPost.create({
    data: {
      slug: input.slug,
      authorId,
      categoryId: input.categoryId,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      featuredImage: input.featuredImage,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      focusKeyword: input.focusKeyword,
      canonicalUrl: input.canonicalUrl,
      ogTitle: input.ogTitle,
      ogDescription: input.ogDescription,
      ogImage: input.ogImage,
      status: input.status,
      publishedAt: input.publishedAt,
      createdById: session.user.id,
      tags: { create: input.tagIds.map((blogTagId) => ({ blogTagId })) },
    },
  });

  revalidateBlogPaths(post.slug);
  redirect(`/admin/blog/${post.id}/edit`);
}

export async function updatePost(id: string, formData: FormData) {
  await requireSession();
  const input = readPostInput(formData);

  await prisma.blogPostTag.deleteMany({ where: { blogPostId: id } });
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: input.slug,
      categoryId: input.categoryId,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      featuredImage: input.featuredImage,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      focusKeyword: input.focusKeyword,
      canonicalUrl: input.canonicalUrl,
      ogTitle: input.ogTitle,
      ogDescription: input.ogDescription,
      ogImage: input.ogImage,
      status: input.status,
      publishedAt: input.publishedAt,
      tags: { create: input.tagIds.map((blogTagId) => ({ blogTagId })) },
    },
  });

  revalidateBlogPaths(post.slug);
}

export async function deletePost(id: string) {
  await requireSession();
  await prisma.blogPost.delete({ where: { id } });
  revalidateBlogPaths();
  redirect("/admin/blog");
}

export async function createCategory(formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const slug = slugify(name);
  await prisma.blogCategory.upsert({ where: { slug }, update: { name }, create: { slug, name } });
  revalidatePath("/admin/blog/categories");
}

export async function deleteCategory(id: string) {
  await requireSession();
  const postCount = await prisma.blogPost.count({ where: { categoryId: id } });
  if (postCount > 0) throw new Error(`Can't delete: ${postCount} post(s) still use this category. Reassign them first.`);
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath("/admin/blog/categories");
}

export async function createTag(formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const slug = slugify(name);
  await prisma.blogTag.upsert({ where: { slug }, update: { name }, create: { slug, name } });
  revalidatePath("/admin/blog/tags");
}

export async function deleteTag(id: string) {
  await requireSession();
  await prisma.blogTag.delete({ where: { id } });
  revalidatePath("/admin/blog/tags");
}

export async function addRelatedContent(sourceId: string, formData: FormData) {
  await requireSession();
  const targetType = String(formData.get("targetType") ?? "").trim();
  const targetSlug = String(formData.get("targetSlug") ?? "").trim();
  if (!targetType || !targetSlug) return;

  const target = await findContentIdBySlug(targetType, targetSlug);
  if (!target) throw new Error(`No ${targetType} found with slug "${targetSlug}"`);

  const order = await prisma.relatedContent.count({ where: { sourceType: "blog_post", sourceId } });
  await prisma.relatedContent.create({
    data: { sourceType: "blog_post", sourceId, targetType, targetId: target.id, order, isManual: true },
  });
  revalidatePath(`/admin/blog/${sourceId}/edit`);
}

export async function removeRelatedContent(relatedContentId: string, sourceId: string) {
  await requireSession();
  await prisma.relatedContent.delete({ where: { id: relatedContentId } });
  revalidatePath(`/admin/blog/${sourceId}/edit`);
}
