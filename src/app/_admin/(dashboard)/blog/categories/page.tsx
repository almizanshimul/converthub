import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createCategory, deleteCategory } from "../actions";
import { DeleteButton } from "../delete-button";

export default async function BlogCategoriesPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog categories</h1>
        <Link href="/admin/blog">
          <Button variant="secondary">Back to posts</Button>
        </Link>
      </div>

      <form action={createCategory} className="mt-6 flex items-end gap-2">
        <div>
          <label className="text-sm font-medium">New category</label>
          <Input name="name" required className="mt-1" />
        </div>
        <Button type="submit">Add</Button>
      </form>

      <div className="mt-6 space-y-2">
        {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                {c._count.posts} post{c._count.posts === 1 ? "" : "s"}
              </p>
            </div>
            <DeleteButton action={deleteCategory.bind(null, c.id)} confirmMessage={`Delete category "${c.name}"?`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
