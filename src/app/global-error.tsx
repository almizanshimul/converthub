"use client";

import Link from "next/link";

// Deliberately minimal and dependency-light: this replaces the entire root
// layout (own <html>/<body>, no access to [locale] or Tailwind theme tokens
// from globals.css) and is the last fallback if something breaks badly
// enough to take out the root layout itself — it shouldn't import anything
// app-specific (i18n, schema, etc.) that could plausibly fail on its own.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420, margin: "6rem auto", padding: "0 1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: "0.75rem", color: "#666" }}>
            An unexpected error occurred. You can try again, or head back to the homepage.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                borderRadius: 8,
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                background: "#4338ca",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link href="/" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#666", alignSelf: "center" }}>
              Go to homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
