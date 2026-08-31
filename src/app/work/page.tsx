import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CTA } from "@/components/cta";
import { Section } from "@/components/ui";
import { caseStudies } from "@/config/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from AI implementation engagements: support triage, document extraction, and sales research — with the numbers that came out of them.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Three systems, still running."
        lead="Each of these started as a problem someone was solving by hand. What follows is the problem, what we built, and what changed."
      />

      <Section>
        {/*
          NOTE: these are illustrative composites, not named clients.
          Swap for cleared client work before launch and remove this banner.
        */}
        <p className="mb-14 rounded-xl border border-line bg-ink-raised px-5 py-4 text-sm text-fg-muted">
          <span className="font-medium text-fg">Placeholder content.</span>{" "}
          These case studies are illustrative composites used to build out the
          site. Replace them with cleared client work before going live.
        </p>

        <div className="flex flex-col divide-y divide-line border-y border-line">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              id={study.slug}
              className="scroll-mt-24 py-14"
            >
              <p className="font-mono text-xs tracking-wider text-accent uppercase">
                {study.client}
              </p>
              <h2 className="mt-5 max-w-3xl text-title font-semibold text-balance">
                {study.title}
              </h2>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr_minmax(0,16rem)] lg:gap-14">
                <div>
                  <h3 className="eyebrow text-fg-muted">The problem</h3>
                  <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                    {study.challenge}
                  </p>
                </div>
                <div>
                  <h3 className="eyebrow text-fg-muted">What we built</h3>
                  <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                    {study.approach}
                  </p>
                </div>
                <dl className="flex flex-col gap-6 rounded-2xl border border-line bg-ink-raised p-6">
                  {study.results.map((r) => (
                    <div key={r.label}>
                      <dt className="sr-only">{r.label}</dt>
                      <dd className="font-mono text-2xl text-accent">
                        {r.value}
                      </dd>
                      <dd className="mt-1 text-xs leading-snug text-fg-muted">
                        {r.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <ul className="mt-8 flex flex-wrap gap-2">
                {study.stack.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 font-mono text-xs tracking-wide text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <CTA
        title="Your problem probably rhymes with one of these."
        body="Most of what we build is a variation on triage, extraction, or research. Tell us which one yours looks like."
      />
    </>
  );
}
