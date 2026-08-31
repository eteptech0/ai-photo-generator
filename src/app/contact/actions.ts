"use server";

import {
  deliverEnquiry,
  validate,
  type EnquiryFields,
  type EnquiryState,
} from "@/lib/enquiry";

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot: real people leave this hidden field empty.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const fields: EnquiryFields = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values: fields,
    };
  }

  try {
    await deliverEnquiry({
      name: fields.name.trim(),
      email: fields.email.trim(),
      company: fields.company.trim(),
      budget: fields.budget,
      message: fields.message.trim(),
    });
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return {
      status: "error",
      message:
        "Something went wrong sending that. Please email us directly and we will pick it up.",
      values: fields,
    };
  }

  return { status: "success" };
}
