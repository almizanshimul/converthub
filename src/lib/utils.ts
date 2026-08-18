import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Truncates at a word boundary with an ellipsis instead of a hard character
// cut — a plain .slice(0, n) regularly chops mid-word, which is exactly what
// was happening to every meta description built from DB content.
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced}…`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // \p{M} keeps combining marks (Bengali/Hindi/Urdu/Arabic vowel signs etc.)
    // attached to their base letter — without it, e.g. Bengali "বাংলা" loses
    // every matra and comes out as disconnected consonants ("ব-ল-...").
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
