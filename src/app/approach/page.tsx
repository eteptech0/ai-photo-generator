import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CTA } from "@/components/cta";
import { FAQ } from "@/components/faq";
import { CheckItem, Section, SectionHeading } from "@/components/ui";
import { queues } from "@/config/site";
import { principles } from "@/config/content";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "The 3queue method: Discover, Build, Operate. How an engagement runs week by week, what we commit to, and what we expect from you.",
};

const cadence = [
  {
    when: "Week 0",
    what: "Scoping call and written proposal",
    detail:
      "Fixed scope, fixed price, named deliverables, and the metric we will be judged on. If we cannot write that down, we do not take the work.",
  },
  {
    when: "Weekly",
    what: "Working demo, not a status deck",
    detail:
      "Every Thursday you see the actual system against actual data. Progress is measured in what runs, not in slides about what will.",
  },
  {
    when: "Continuously",
    what: "Your repo, your cloud, your CI",
    detail:
      "Commits land in your repositories from day one. There is never a moment where the work lives somewhere you cannot reach it.",
  },
  {
    when: "Before go-live",
    what: "Evals, guardrails, and a cost ceiling",
    detail:
      "Nothing ships without a regression suite that gates deploys, a documented failure mode for each step, and a spend limit that cannot be silently exceeded.",
  },
  {
    when: "Handover",
    what: "Runbooks and a trained team",
    detail:
      "We are not finished when the system works. We are finished when your team has run it, broken it, and fixed it without calling us.",
  },
];

const expectations = [
  "One decision-maker who can unblock access and say yes",
  "Access to the systems and data in the first week, not the fourth",
  "A named engineer on your side who joins the weekly demo",
  "Willingness to hear that a favourite idea does not survive the numbers",
];

export default function ApproachPage() {
  return (
    <>
      <PageHeader
        eyebrow="Approach"
        title="Three queues. In order. No skipping."
        lead="The name is not a metaphor we reverse-engineered. It is how the work is organised — and the reason we can quote a fixed price."
      />

      <Section>
        <div className="flex flex-col gap-16">
          {queues.map((q) => (
            <article
              key={q.id}
              id={q.id}
              className="grid scroll-mt-24 gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16"
            >
              <div>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-5xl font-medium text-accent">
                    {q.number}
                  </span>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {q.name}
                  </h2>
                </div>
                <p className="mt-4 font-mono text-xs tracking-wider text-fg-muted uppercase">
                  {q.duration}
                </p>
              </div>

              <div>
                <p className="text-lead font-medium text-balance">{q.promise}</p>
                <p className="mt-5 max-w-2xl leading-relaxed text-fg-muted">
                  {q.body}
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {q.deliverables.map((d) => (
                    <CheckItem key={d}>{d}</CheckItem>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <SectionHeading
          eyebrow="Cadence"
          title="What a month with us looks like."
          lead="Consulting goes wrong in the gaps between meetings. This is the rhythm that closes them."
        />
        <ol className="mt-14 flex flex-col divide-y divide-line border-y border-line">
          {cadence.map((step) => (
            <li
              key={step.what}
              className="grid gap-4 py-7 md:grid-cols-[minmax(0,10rem)_minmax(0,18rem)_1fr] md:gap-8"
            >
              <span className="font-mono text-xs tracking-wider text-accent uppercase">
                {step.when}
              </span>
              <span className="font-medium">{step.what}</span>
              <span className="text-sm leading-relaxed text-fg-muted">
                {step.detail}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="light">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="What we commit to"
              title="Our side of the deal."
            />
            <div className="mt-10 flex flex-col gap-8">
              {principles.slice(0, 4).map((p) => (
                <div key={p.title}>
                  <h3 className="font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-inverse-muted">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              tone="light"
              eyebrow="What we need from you"
              title="Your side of it."
              lead="Engagements stall for access and decisions, almost never for technical reasons."
            />
            <ul className="mt-10 flex flex-col gap-4">
              {expectations.map((item) => (
                <CheckItem key={item} tone="light">
                  {item}
                </CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <FAQ />
      <CTA />
    </>
  );
}
