import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../../post-form";
import { updatePost, deletePost } from "../../actions";
import { RelatedContentSection } from "../../related-content-section";
import { DeleteButton } from "../../delete-button";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id }, include: { tags: true } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <DeleteButton action={deletePost.bind(null, post.id)} confirmMessage={`Delete "${post.title}"? This cannot be undone.`} />
      </div>

      <PostForm
        action={updatePost.bind(null, post.id)}
        categories={categories}
        tags={tags}
        submitLabel="Save changes"
        post={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: post.categoryId,
          tagIds: post.tags.map((t) => t.blogTagId),
          status: post.status,
          publishedAt: post.publishedAt,
          featuredImage: post.featuredImage,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          focusKeyword: post.focusKeyword,
          canonicalUrl: post.canonicalUrl,
          ogTitle: post.ogTitle,
          ogDescription: post.ogDescription,
          ogImage: post.ogImage,
        }}
      />

      <div className="mt-8">
        <RelatedContentSection postId={post.id} />
      </div>
    </div>
  );
}
