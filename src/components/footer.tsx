import Link from "next/link";
import { nav, queues, site } from "@/config/site";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-sunken">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
              {site.tagline} We scope, build, and hand over AI systems that hold
              up in production.
            </p>
          </div>

          <FooterColumn title="Company">
            {nav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="The three queues">
            {queues.map((q) => (
              <FooterLink key={q.id} href={`/approach#${q.id}`}>
                {q.number} · {q.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Get in touch">
            <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
            {site.social.linkedin ? (
              <FooterLink href={site.social.linkedin}>LinkedIn</FooterLink>
            ) : null}
            <li className="text-sm text-fg-muted">{site.location}</li>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="font-mono text-xs tracking-wider uppercase">
            Discover · Build · Operate
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="eyebrow text-fg-muted">{title}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const className = "text-sm text-fg-muted transition-colors hover:text-fg";

  return (
    <li>
      {isExternal ? (
        <a href={href} className={className}>
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    </li>
  );
}
