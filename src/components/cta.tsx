import { ArrowRight, ButtonLink, Container } from "@/components/ui";
import { site } from "@/config/site";

export function CTA({
  title = "Tell us what you are trying to automate.",
  body = "One call, 30 minutes. We will tell you whether it is worth building, roughly what it costs, and what we would do first — whether or not you hire us.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="border-t border-line bg-accent text-accent-ink">
      <Container className="py-20 sm:py-24">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-title font-semibold text-balance">{title}</h2>
            <p className="mt-5 text-lead text-accent-ink/75 text-pretty">
              {body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink href="/contact" variant="onAccent">
              Book an intro call
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="onAccentOutline">
              {site.email}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
