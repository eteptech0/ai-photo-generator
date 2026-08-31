import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CTA } from "@/components/cta";
import { Card, Section, SectionHeading, Stat } from "@/components/ui";
import { principles } from "@/config/content";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a small senior team that builds AI systems companies can actually run. Here is how we work and who does the work.`,
};

/** PLACEHOLDER team — replace names, roles, and bios before launch. */
const team = [
  {
    name: "Founder name",
    role: "Principal, delivery",
    bio: "Fifteen years shipping backend and ML systems. Previously led platform engineering at a company whose name goes here.",
    initials: "FN",
  },
  {
    name: "Second name",
    role: "Principal, applied AI",
    bio: "Research background, production instincts. Spends most of the day arguing that the eval suite matters more than the prompt.",
    initials: "SN",
  },
  {
    name: "Third name",
    role: "Principal, strategy",
    bio: "Runs the discovery work. Has told more clients not to build something than to build it, and is still hired again.",
    initials: "TN",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small team that would rather build than pitch."
        lead={`${site.name} exists because the gap between an AI demo and an AI system is wide, expensive, and consistently underestimated. We spend our days in that gap.`}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6 text-lead text-fg-muted">
            <p className="text-fg">
              We started 3queue after watching the same story repeat: a company
              runs an impressive pilot, celebrates, and then discovers that
              nobody has budgeted for evaluation, integration, monitoring, or
              the person who owns it at 3am.
            </p>
            <p>
              So we organised the firm around the three stages where that story
              breaks — discovering what is genuinely worth building, building it
              to a production standard, and operating it long enough for your
              team to take over. That is the whole business. There is no
              platform to license and no seat count to grow.
            </p>
            <p>
              We stay deliberately small and senior. The people you meet in
              scoping are the people who write the code, which is why we can
              commit to a fixed price without padding it against a junior
              team&apos;s learning curve.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 self-start rounded-2xl border border-line bg-ink-raised p-8">
            <Stat value="2024" label="Founded" />
            <Stat value="Senior" label="Every engineer on every project" />
            <Stat value="Remote" label="Europe & North America" />
            <Stat value="Fixed" label="Scope and price, always in writing" />
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading
          tone="light"
          eyebrow="Team"
          title="Who does the work."
          lead="Placeholder profiles — replace with real names, photos, and bios before launch."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {team.map((person) => (
            <Card key={person.name} tone="light">
              <div className="flex size-14 items-center justify-center rounded-full bg-ink font-mono text-sm text-accent">
                {person.initials}
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                {person.name}
              </h3>
              <p className="mt-1 font-mono text-xs tracking-wider text-fg-inverse-muted uppercase">
                {person.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fg-inverse-muted">
                {person.bio}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <SectionHeading
          eyebrow="Principles"
          title="How we decide things."
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

      <CTA />
    </>
  );
}
