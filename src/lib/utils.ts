import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
