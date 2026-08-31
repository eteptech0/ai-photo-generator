import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CTA } from "@/components/cta";
import {
  ArrowRight,
  ButtonLink,
  Card,
  CheckItem,
  Section,
  SectionHeading,
} from "@/components/ui";
import { engagements, services } from "@/config/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI opportunity audits, production builds, agentic workflows, evaluation harnesses, platform and cost engineering, and team enablement.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Six ways we get hired."
        lead="Each engagement has a fixed scope, a named deliverable, and a date. If what you need is not on this list, the intro call is still free."
      />

      <Section>
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {services.map((service, i) => (
            <article
              key={service.slug}
              id={service.slug}
              className="grid scroll-mt-24 gap-8 py-12 lg:grid-cols-[minmax(0,7rem)_1fr_minmax(0,22rem)] lg:gap-12"
            >
              <span className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {service.name}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                  {service.summary}
                </p>
                <p className="mt-6 text-sm text-fg-muted">
                  <span className="font-mono text-xs tracking-wider text-fg uppercase">
                    Best for
                  </span>
                  <br />
                  {service.for}
                </p>
                <p className="mt-4 font-mono text-xs tracking-wider text-fg-muted uppercase">
                  Typical duration · {service.timeline}
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-ink-raised p-6">
                <h3 className="eyebrow text-fg-muted">What you get</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {service.includes.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="light" id="engagements">
        <SectionHeading
          tone="light"
          eyebrow="Engagement models"
          title="Three ways to start."
          lead="Pricing is indicative and depends on scope, data, and integration surface. You get a fixed number in writing before any work begins — no hourly drift."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {engagements.map((tier) => (
            <Card
              key={tier.name}
              tone="light"
              className={`flex flex-col ${
                tier.featured ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {tier.name}
                </h3>
                {tier.featured ? (
                  <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.625rem] tracking-wider text-accent-ink uppercase">
                    Most common
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {tier.price}
              </p>
              <p className="mt-1 font-mono text-xs tracking-wider text-fg-inverse-muted uppercase">
                {tier.duration}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-fg-inverse-muted">
                {tier.summary}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {tier.points.map((point) => (
                  <CheckItem key={point} tone="light">
                    {point}
                  </CheckItem>
                ))}
              </ul>

              <ButtonLink
                href="/contact"
                variant={tier.featured ? "primary" : "secondaryLight"}
                className="mt-8"
              >
                {tier.cta}
                <ArrowRight />
              </ButtonLink>
            </Card>
          ))}
        </div>
      </Section>

      <CTA
        title="Not sure which one you need?"
        body="Most people are not. Describe the problem on a call and we will tell you which engagement fits — or that none of them do."
      />
    </>
  );
}
