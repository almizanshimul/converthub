"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  categoryId: string | null;
  tagIds: string[];
  status: string;
  publishedAt: Date | null;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
};

function toDatetimeLocal(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PostForm({
  action,
  categories,
  tags,
  post,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  post?: PostFormValues;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [slug, setSlug] = useState(post?.slug ?? "");

  return (
    <form action={action} className="mt-6 space-y-8">
      <section className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(e.target.value);
            }}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <Input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Excerpt</label>
          <Textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Content</label>
          <p className="mt-1 text-xs text-muted-foreground">Separate paragraphs with a blank line.</p>
          <Textarea name="content" required defaultValue={post?.content ?? ""} rows={16} className="mt-1 font-mono text-xs" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select name="categoryId" defaultValue={post?.categoryId ?? ""} className="mt-1">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select name="status" defaultValue={post?.status ?? "DRAFT"} className="mt-1">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Published at</label>
          <Input type="datetime-local" name="publishedAt" defaultValue={toDatetimeLocal(post?.publishedAt ?? null)} className="mt-1" />
          <p className="mt-1 text-xs text-muted-foreground">Leave blank to use the moment you set status to Published.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Featured image URL</label>
          <Input name="featuredImage" defaultValue={post?.featuredImage ?? ""} className="mt-1" />
        </div>
      </section>

      {tags.length > 0 && (
        <section>
          <label className="text-sm font-medium">Tags</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={post?.tagIds.includes(tag.id)} />
                {tag.name}
              </label>
            ))}
          </div>
        </section>
      )}

      <details className="rounded-lg border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium">SEO settings</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">SEO title</label>
            <Input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">SEO description</label>
            <Textarea name="seoDescription" defaultValue={post?.seoDescription ?? ""} rows={2} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Focus keyword</label>
            <Input name="focusKeyword" defaultValue={post?.focusKeyword ?? ""} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Canonical URL</label>
            <Input name="canonicalUrl" defaultValue={post?.canonicalUrl ?? ""} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">OG title</label>
            <Input name="ogTitle" defaultValue={post?.ogTitle ?? ""} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">OG description</label>
            <Textarea name="ogDescription" defaultValue={post?.ogDescription ?? ""} rows={2} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">OG image URL</label>
            <Input name="ogImage" defaultValue={post?.ogImage ?? ""} className="mt-1" />
          </div>
        </div>
      </details>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
