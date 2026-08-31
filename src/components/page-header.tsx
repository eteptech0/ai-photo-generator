import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
      />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-title font-semibold text-balance">{title}</h1>
          {lead ? (
            <p className="mt-6 text-lead text-fg-muted text-pretty">{lead}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
