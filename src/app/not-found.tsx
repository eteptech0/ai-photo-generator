import { ArrowRight, ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-5 max-w-2xl text-title font-semibold text-balance">
        That page is not in any of our queues.
      </h1>
      <p className="mt-5 max-w-xl text-lead text-fg-muted">
        The link may be out of date. The services, the approach, and the work are
        all still where you left them.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">
          Back to the homepage
          <ArrowRight />
        </ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Get in touch
        </ButtonLink>
      </div>
    </Container>
  );
}
