import Link from "next/link";
import { queues } from "@/config/site";
import { ArrowRight, SectionHeading, Section } from "@/components/ui";

export function QueueStrip() {
  return (
    <Section tone="raised" id="queues">
      <SectionHeading
        eyebrow="The name is the method"
        title="Three queues, in order."
        lead="Everything we do sits in one of three stages. Clients enter at whichever one matches where they actually are — and most are further back than they think."
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {queues.map((q) => (
          <li key={q.id} className="flex flex-col gap-4 bg-ink p-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-sm text-accent">{q.number}</span>
              <span className="font-mono text-xs tracking-wider text-fg-muted uppercase">
                {q.duration}
              </span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">{q.name}</h3>
            <p className="text-sm font-medium text-fg">{q.promise}</p>
            <p className="text-sm leading-relaxed text-fg-muted">{q.body}</p>
            <Link
              href={`/approach#${q.id}`}
              className="mt-auto inline-flex items-center gap-2 pt-4 text-sm text-accent transition-colors hover:text-accent-hover"
            >
              What you get
              <ArrowRight />
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}
