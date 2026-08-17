export function JsonLd({ data }: { data: object }) {
  // Escape "<" so an embedded value can never close the script tag early (e.g. "</script>").
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
