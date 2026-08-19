import type { MetadataRoute } from "next";

// Required for output: "export" — this file has no dynamic input, so it's
// always static anyway, but Next needs it declared explicitly.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ConvertHub — Unit Converters, Calculators & Land Info",
    short_name: "ConvertHub",
    description:
      "Free online unit converters, calculators, currency conversion, and region-specific land measurement tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
