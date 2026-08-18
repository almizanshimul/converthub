import { prisma } from "@/lib/prisma";
import { RELATED_CONTENT_TYPES } from "@/lib/related-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { addRelatedContent, removeRelatedContent } from "./actions";
import { DeleteButton } from "./delete-button";

async function resolveTitle(type: string, id: string): Promise<string | null> {
  switch (type) {
    case "converter":
      return (await prisma.converter.findUnique({ where: { id } }))?.name ?? null;
    case "calculator":
      return (await prisma.calculator.findUnique({ where: { id } }))?.name ?? null;
    case "blog_post":
      return (await prisma.blogPost.findUnique({ where: { id } }))?.title ?? null;
    case "country":
      return (await prisma.country.findUnique({ where: { id } }))?.name ?? null;
    default:
      return null;
  }
}

export async function RelatedContentSection({ postId }: { postId: string }) {
  const rows = await prisma.relatedContent.findMany({
    where: { sourceType: "blog_post", sourceId: postId },
    orderBy: { order: "asc" },
  });
  const resolved = await Promise.all(
    rows.map(async (row) => ({ ...row, title: await resolveTitle(row.targetType, row.targetId) })),
  );

  return (
    <section className="rounded-lg border border-border p-4">
      <h2 className="text-sm font-medium">Related content</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Manually link this post to other content. Shown in its &quot;Related&quot; section on the public page.
      </p>

      <ul className="mt-3 space-y-2">
        {resolved.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-2 text-sm">
            <span>
              <span className="text-muted-foreground">{row.targetType}:</span> {row.title ?? row.targetId}
            </span>
            <DeleteButton action={removeRelatedContent.bind(null, row.id, postId)} confirmMessage="Remove this related item?" />
          </li>
        ))}
        {resolved.length === 0 && <li className="text-sm text-muted-foreground">Nothing linked yet.</li>}
      </ul>

      <form action={addRelatedContent.bind(null, postId)} className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <label className="text-xs font-medium">Type</label>
          <Select name="targetType" className="mt-1">
            {RELATED_CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium">Slug</label>
          <Input name="targetSlug" placeholder="e.g. meter-to-foot" className="mt-1" />
        </div>
        <Button type="submit" variant="secondary">
          Add
        </Button>
      </form>
    </section>
  );
}
