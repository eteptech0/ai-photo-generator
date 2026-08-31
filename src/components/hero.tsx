import { ArrowRight, ButtonLink, Container } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-accent/12 blur-[120px]"
      />

      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="max-w-4xl">
          <p className="eyebrow flex items-center gap-3 text-fg-muted">
            <span className="inline-flex size-1.5 rounded-full bg-accent" />
            AI implementation consulting
          </p>

          <h1 className="mt-7 text-display font-semibold text-balance">
            Most AI projects die
            <br />
            between the demo
            <br />
            and <span className="text-accent">production.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lead text-fg-muted text-pretty">
            3queue takes companies the rest of the way. We find the use cases
            that pay for themselves, build them into your systems with the
            evaluation and guardrails they need, and hand over something your
            team can run without us.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/contact">
              Book an intro call
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/approach" variant="secondary">
              See how we work
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-fg-muted">
            30 minutes, no deck. You leave with a straight answer on whether
            there is anything worth building.
          </p>
        </div>
      </Container>
    </section>
  );
}
