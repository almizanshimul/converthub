import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";

// Can't localize the <title> here — not-found.tsx receives no props/params
// in the App Router, so there's no locale to look up. The visible body text
// is still localized client-side (see NotFoundContent) via the URL path.
export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return <NotFoundContent />;
}
