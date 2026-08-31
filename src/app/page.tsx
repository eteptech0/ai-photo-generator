import Link from "next/link";
import { Hero } from "@/components/hero";
import { QueueStrip } from "@/components/queue-strip";
import { CTA } from "@/components/cta";
import { FAQ } from "@/components/faq";
import {
  ArrowRight,
  Card,
  Section,
  SectionHeading,
  Stat,
} from "@/components/ui";
import { caseStudies, principles, services } from "@/config/content";

const failureModes = [
  {
    title: "The pilot that never graduated",
    body: "It impressed the exec team in March. It is still on a laptop in October because nobody scoped the integration, the evals, or who owns it.",
  },
  {
    title: "The bill nobody forecast",
    body: "Token spend scaled with usage in a way the business case did not. Now finance wants it switched off before it has proved anything.",
  },
  {
    title: "The output nobody trusts",
    body: "It is right most of the time, and there is no way to tell which times. So staff check every answer by hand, and the saving evaporates.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Proof bar — replace with real client logos once cleared. */}
      <section className="border-b border-line bg-ink-sunken py-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4 lg:px-8">
          <Stat value="14 yrs" label="Median engineer experience" />
          <Stat value="100%" label="Code and infrastructure owned by you" />
          <Stat value="6 wks" label="Typical time to first production release" />
          <Stat value="Fixed" label="Scope and price, agreed before we start" />
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Why this keeps happening"
          title="The hard part was never the model."
          lead="Getting a convincing output is a weekend. Getting a system your business can depend on is the other 90% — and it is where most AI programmes quietly stall."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {failureModes.map((item) => (
            <Card key={item.title}>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <QueueStrip />

      <Section tone="light">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="light"
            eyebrow="Services"
            title="What we are hired to do."
            lead="Six engagements, each with a defined scope and a deliverable you can point at. Mix them or take one."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-inverse transition-colors hover:text-accent"
          >
            All services in detail
            <ArrowRight />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.slug} tone="light" className="flex flex-col">
              <h3 className="text-lg font-semibold tracking-tight">
                {service.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-inverse-muted">
                {service.summary}
              </p>
              <p className="mt-6 font-mono text-xs tracking-wider text-fg-inverse-muted uppercase">
                {service.timeline}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Selected work"
          title="Systems in production, with numbers attached."
          lead="Three engagements, the problem each started from, and what changed after."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Card key={study.slug} className="flex flex-col">
              <p className="font-mono text-xs tracking-wider text-fg-muted uppercase">
                {study.client}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-balance">
                {study.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">
                {study.challenge}
              </p>
              <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
                {study.results.map((r) => (
                  <div key={r.label}>
                    <dt className="sr-only">{r.label}</dt>
                    <dd className="font-mono text-xl text-accent">{r.value}</dd>
                    <dd className="mt-1 text-xs text-fg-muted">{r.label}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-hover"
          >
            Read the full case studies
            <ArrowRight />
          </Link>
        </div>
      </Section>

      <Section tone="raised">
        <SectionHeading
          eyebrow="How we operate"
          title="Opinions we will not be talked out of."
          lead="You are going to hear these on the first call, so they may as well be on the website."
        />
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <div key={p.title} className="flex flex-col gap-3">
              <span className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <FAQ />
      <CTA />
    </>
  );
}
