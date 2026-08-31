import { site } from "@/config/site";

export type EnquiryFields = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryFields, string>>;

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  values?: Partial<EnquiryFields>;
};

export const initialEnquiryState: EnquiryState = { status: "idle" };

export const budgetOptions = [
  "Not sure yet",
  "Under $25k",
  "$25k – $75k",
  "$75k – $200k",
  "$200k+",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(fields: EnquiryFields): FieldErrors {
  const errors: FieldErrors = {};

  if (fields.name.trim().length < 2) {
    errors.name = "Please tell us your name.";
  }
  if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "Please enter a valid work email address.";
  }
  if (fields.message.trim().length < 20) {
    errors.message =
      "A couple of sentences about the problem helps us come prepared.";
  }
  if (fields.message.length > 5000) {
    errors.message = "Please keep this under 5,000 characters.";
  }
  if (fields.company.length > 200) {
    errors.company = "That company name is too long.";
  }
  if (!(budgetOptions as readonly string[]).includes(fields.budget)) {
    errors.budget = "Please pick one of the options.";
  }

  return errors;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the enquiry via Resend when configured. With no provider configured
 * (local development, preview deploys) the enquiry is logged server-side so
 * the form is still exercisable end to end.
 */
export async function deliverEnquiry(fields: EnquiryFields): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("[enquiry] no mail provider configured; logging instead", {
      ...fields,
      receivedAt: new Date().toISOString(),
    });
    return;
  }

  const rows: Array<[string, string]> = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Company", fields.company || "—"],
    ["Budget", fields.budget],
  ];

  const html = [
    `<h2>New enquiry via ${site.name}</h2>`,
    "<table cellpadding='6'>",
    ...rows.map(
      ([label, value]) =>
        `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`,
    ),
    "</table>",
    `<p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p>`,
  ].join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: fields.email,
      subject: `New enquiry — ${fields.name}${
        fields.company ? ` (${fields.company})` : ""
      }`,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected the enquiry (${response.status}): ${detail}`);
  }
}
