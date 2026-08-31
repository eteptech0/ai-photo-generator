"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/app/contact/actions";
import { budgetOptions, initialEnquiryState } from "@/lib/enquiry";
import { ArrowRight, Button } from "@/components/ui";
import { site } from "@/config/site";

const fieldClass =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-fg " +
  "placeholder:text-fg-muted/60 transition-colors focus:border-accent focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending…" : "Send enquiry"}
      {pending ? null : <ArrowRight />}
    </Button>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-xs text-accent">
      {error}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialEnquiryState);
  const uid = useId();

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-ink-raised p-8">
        <h2 className="text-xl font-semibold tracking-tight">
          Thanks — that reached us.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          We reply to every enquiry within one business day, usually with a
          couple of questions and a link to book a time. If it is urgent, email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-accent underline underline-offset-4"
          >
            {site.email}
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-fg"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="mb-2 block text-sm">
            Name <span className="text-accent">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            required
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={fieldClass}
            placeholder="Alex Moreau"
          />
          <FieldError id={`${uid}-name-error`} error={errors.name} />
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="mb-2 block text-sm">
            Work email <span className="text-accent">*</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={fieldClass}
            placeholder="alex@company.com"
          />
          <FieldError id={`${uid}-email-error`} error={errors.email} />
        </div>

        <div>
          <label htmlFor={`${uid}-company`} className="mb-2 block text-sm">
            Company
          </label>
          <input
            id={`${uid}-company`}
            name="company"
            autoComplete="organization"
            defaultValue={values.company}
            className={fieldClass}
            placeholder="Company name"
          />
          <FieldError id={`${uid}-company-error`} error={errors.company} />
        </div>

        <div>
          <label htmlFor={`${uid}-budget`} className="mb-2 block text-sm">
            Budget range
          </label>
          <select
            id={`${uid}-budget`}
            name="budget"
            defaultValue={values.budget ?? budgetOptions[0]}
            className={fieldClass}
          >
            {budgetOptions.map((option) => (
              <option key={option} value={option} className="bg-ink">
                {option}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-budget-error`} error={errors.budget} />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className="mb-2 block text-sm">
          What are you trying to solve? <span className="text-accent">*</span>
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={6}
          required
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          className={`${fieldClass} resize-y`}
          placeholder="The process today, roughly how much of it is manual, and what you have already tried."
        />
        <FieldError id={`${uid}-message-error`} error={errors.message} />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-xs text-fg-muted">
          We reply within one business day. No mailing list, no sequence.
        </p>
      </div>
    </form>
  );
}
