import { prisma } from "@/lib/prisma";
import { PostForm } from "../post-form";
import { createPost } from "../actions";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">New post</h1>
      <PostForm action={createPost} categories={categories} tags={tags} submitLabel="Create post" />
    </div>
  );
}
