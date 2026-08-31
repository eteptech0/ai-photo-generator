import { faqs } from "@/config/content";
import { Section, SectionHeading } from "@/components/ui";

export function FAQ() {
  return (
    <Section id="faq">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
        <SectionHeading
          eyebrow="Questions"
          title="The ones we get asked first."
        />

        <div className="divide-y divide-line border-t border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium text-fg marker:content-none">
                {item.q}
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="size-4">
                    <path
                      d="M8 3v10M3 8h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
