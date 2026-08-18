// lucide-react deliberately excludes trademarked brand logos, so LinkedIn's
// glyph is a small inline SVG instead of a lucide import.
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

// Only real, verified accounts belong here — add more as they're confirmed,
// never guessed.
const SOCIAL_LINKS = [{ name: "LinkedIn", href: "https://www.linkedin.com/in/almizanshimul/", icon: LinkedInIcon }];

export function SocialLinks() {
  return (
    <div className="flex gap-3">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          title={link.name}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <link.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
