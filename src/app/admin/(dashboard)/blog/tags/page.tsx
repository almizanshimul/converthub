import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createTag, deleteTag } from "../actions";
import { DeleteButton } from "../delete-button";

export default async function BlogTagsPage() {
  const tags = await prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog tags</h1>
        <Link href="/admin/blog">
          <Button variant="secondary">Back to posts</Button>
        </Link>
      </div>

      <form action={createTag} className="mt-6 flex items-end gap-2">
        <div>
          <label className="text-sm font-medium">New tag</label>
          <Input name="name" required className="mt-1" />
        </div>
        <Button type="submit">Add</Button>
      </form>

      <div className="mt-6 space-y-2">
        {tags.length === 0 && <p className="text-sm text-muted-foreground">No tags yet.</p>}
        {tags.map((t) => (
          <Card key={t.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t._count.posts} post{t._count.posts === 1 ? "" : "s"}
              </p>
            </div>
            <DeleteButton action={deleteTag.bind(null, t.id)} confirmMessage={`Delete tag "${t.name}"?`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
