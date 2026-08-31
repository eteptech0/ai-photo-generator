/**
 * Single source of truth for site-wide facts.
 * Everything here is placeholder-safe: swap the values, not the components.
 */

export const site = {
  name: "3queue",
  legalName: "3queue Ltd.",
  tagline: "AI implementation, shipped.",
  description:
    "3queue is an AI implementation consultancy. We take companies from " +
    "“we should be using AI” to systems running in production — scoped, built, " +
    "measured, and handed over.",
  url: "https://3queue.com",
  email: "hello@3queue.com",
  phone: "",
  location: "Remote-first · Europe & North America",
  social: {
    linkedin: "https://www.linkedin.com/company/3queue",
    github: "",
    x: "",
  },
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/approach", label: "Approach" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

/**
 * The brand spine: three queues, three stages of getting AI into production.
 * Used on the homepage, the approach page, and the footer.
 */
export const queues = [
  {
    id: "q1",
    number: "01",
    name: "Discover",
    duration: "2–3 weeks",
    promise: "Find the work that pays for itself.",
    body:
      "We audit where your time and money actually go, then rank candidate use " +
      "cases by value, feasibility, and risk. You leave with a costed roadmap and " +
      "an honest list of what AI should not touch.",
    deliverables: [
      "Opportunity map scored on value vs. effort",
      "Data and systems readiness assessment",
      "Costed build plan with success metrics",
      "A “do not build this” list, with reasons",
    ],
  },
  {
    id: "q2",
    number: "02",
    name: "Build",
    duration: "6–12 weeks",
    promise: "Get one thing into production, properly.",
    body:
      "We build the highest-value use case end to end — retrieval, evaluation, " +
      "guardrails, monitoring, the unglamorous parts included. Real users, real " +
      "data, real numbers, inside a fixed scope.",
    deliverables: [
      "Production system in your cloud and your repo",
      "Evaluation suite that gates every deploy",
      "Guardrails, fallbacks, and cost controls",
      "Load, latency, and spend benchmarks",
    ],
  },
  {
    id: "q3",
    number: "03",
    name: "Operate",
    duration: "Ongoing or fixed handover",
    promise: "Make it someone else's routine — ideally yours.",
    body:
      "Models drift, prices change, providers deprecate. We set up the ownership, " +
      "runbooks, and review cadence so the system keeps working after we leave, " +
      "and train your team to run it.",
    deliverables: [
      "Runbooks, on-call notes, and escalation paths",
      "Regression evals wired into CI",
      "Quarterly model and cost review",
      "Team enablement and handover sessions",
    ],
  },
] as const;

export type Queue = (typeof queues)[number];
