import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deletePost } from "./actions";
import { DeleteButton } from "./delete-button";

export default async function AdminBlogListPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blog/tags">
            <Button variant="secondary">Tags</Button>
          </Link>
          <Link href="/admin/blog/categories">
            <Button variant="secondary">Categories</Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button>New post</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
        {posts.map((post) => (
          <Card key={post.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{post.title}</p>
                <span
                  className={
                    post.status === "PUBLISHED"
                      ? "shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      : "shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {post.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {post.author.name}
                {post.category ? ` · ${post.category.name}` : ""}
                {post.publishedAt ? ` · ${post.publishedAt.toLocaleDateString()}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/admin/blog/${post.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <DeleteButton action={deletePost.bind(null, post.id)} confirmMessage={`Delete "${post.title}"? This cannot be undone.`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
