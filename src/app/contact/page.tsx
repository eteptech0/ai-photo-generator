import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/ui";
import { queues, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a 30-minute intro call with 3queue. Tell us what you are trying to automate and we will tell you whether it is worth building.",
};

const callAgenda = [
  "What the process looks like today, and where the time goes",
  "Whether AI is the right tool — sometimes the answer is no",
  "Roughly what a first build would cost and how long it takes",
  "What we would do first, whether or not you hire us",
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Start with a conversation, not a proposal."
        lead="Thirty minutes, no deck, no discovery questionnaire. Bring the problem and we will tell you what we actually think."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-20">
          <div>
            <h2 className="sr-only">Enquiry form</h2>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-10">
            <div>
              <h2 className="eyebrow text-fg-muted">On the call</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {callAgenda.map((item) => (
                  <li
                    key={item}
                    className="border-l border-accent/40 pl-4 text-sm leading-relaxed text-fg-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="eyebrow text-fg-muted">Prefer email</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 block text-sm text-accent transition-colors hover:text-accent-hover"
              >
                {site.email}
              </a>
              <p className="mt-2 text-sm text-fg-muted">{site.location}</p>
            </div>

            <div>
              <h2 className="eyebrow text-fg-muted">Where you might start</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {queues.map((q) => (
                  <li key={q.id} className="text-sm">
                    <span className="font-mono text-xs text-accent">
                      {q.number}
                    </span>{" "}
                    <span className="font-medium">{q.name}</span>
                    <p className="mt-1 text-sm text-fg-muted">{q.promise}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <section className="border-t border-line bg-ink-sunken">
        <Container className="py-14">
          <p className="max-w-3xl text-sm leading-relaxed text-fg-muted">
            We are selective about what we take on and will say so quickly if an
            engagement is not a fit — including when the honest answer is that
            you do not need a consultancy for this.
          </p>
        </Container>
      </section>
    </>
  );
}
