/**
 * Marketing content. Kept out of the components so copy can be edited
 * without touching layout. Case studies are illustrative placeholders —
 * replace them with real, cleared client work before launch.
 */

export const services = [
  {
    slug: "ai-opportunity-audit",
    name: "AI Opportunity Audit",
    summary:
      "A structured read of your operations that separates the AI use cases worth funding from the ones that only sound good in a board deck.",
    for: "Leadership teams who keep getting pitched AI and want a defensible answer.",
    includes: [
      "Process and cost mapping across the candidate functions",
      "Use-case scoring on value, feasibility, data readiness, and risk",
      "Build-vs-buy analysis with real vendor pricing",
      "A costed 6-month roadmap with named success metrics",
    ],
    timeline: "2–3 weeks",
  },
  {
    slug: "production-builds",
    name: "Production Builds",
    summary:
      "We build the system, not the demo. Retrieval, evaluation, guardrails, observability, and cost control — deployed in your infrastructure.",
    for: "Teams with a validated use case and no bandwidth to build it properly.",
    includes: [
      "End-to-end delivery in your cloud, your repo, your CI",
      "Offline and online evaluation suites that gate deploys",
      "Guardrails, PII handling, fallbacks, and rate/spend limits",
      "Latency, quality, and unit-cost benchmarks before go-live",
    ],
    timeline: "6–12 weeks",
  },
  {
    slug: "agentic-workflow-engineering",
    name: "Agentic Workflow Engineering",
    summary:
      "Multi-step agents that touch real systems — tools, approvals, retries, audit trails — designed so a failure is contained rather than expensive.",
    for: "Operations-heavy businesses automating work that spans several systems.",
    includes: [
      "Tool and permission design with human-in-the-loop checkpoints",
      "Deterministic fallbacks for every non-deterministic step",
      "Full trace logging and replay for audit and debugging",
      "Rollout plan that starts shadow-mode and earns autonomy",
    ],
    timeline: "8–14 weeks",
  },
  {
    slug: "evaluation-and-assurance",
    name: "Evaluation & Assurance",
    summary:
      "You cannot improve what you cannot measure. We build the eval harness that tells you whether a change made the system better or just different.",
    for: "Teams already shipping AI features on vibes and screenshots.",
    includes: [
      "Golden datasets built from your real traffic",
      "Automated scoring plus a calibrated human review loop",
      "Regression gates wired into your existing pipeline",
      "Model and prompt change management process",
    ],
    timeline: "3–5 weeks",
  },
  {
    slug: "platform-and-cost-engineering",
    name: "Platform & Cost Engineering",
    summary:
      "Shared infrastructure so your fifth AI feature takes days, not another quarter — with a spend curve that does not surprise the CFO.",
    for: "Companies past their first AI project and starting to feel the sprawl.",
    includes: [
      "Gateway, routing, caching, and provider-failover layer",
      "Per-feature cost attribution and budget alerting",
      "Prompt and model registry with versioning",
      "Reference patterns your teams can reuse",
    ],
    timeline: "4–8 weeks",
  },
  {
    slug: "team-enablement",
    name: "Team Enablement",
    summary:
      "We would rather make you independent than indispensable to you. Hands-on training on your codebase, with your data, on the system we built together.",
    for: "Engineering and product teams inheriting an AI system.",
    includes: [
      "Workshops for engineers, product, and leadership tracks",
      "Runbooks, architecture decision records, and on-call notes",
      "Pairing sessions on live tickets",
      "A 90-day support window after handover",
    ],
    timeline: "Ongoing or fixed handover",
  },
] as const;

export const engagements = [
  {
    name: "Audit",
    price: "From $18k",
    duration: "2–3 weeks",
    summary: "Decide what to build, with numbers behind it.",
    points: [
      "Opportunity map and scoring",
      "Costed roadmap",
      "Readiness assessment",
      "Leadership readout",
    ],
    cta: "Start with an audit",
    featured: false,
  },
  {
    name: "Build",
    price: "From $60k",
    duration: "6–12 weeks",
    summary: "One high-value use case, taken to production properly.",
    points: [
      "Fixed scope, fixed price",
      "Weekly demos against real data",
      "Evals, guardrails, monitoring included",
      "Code and infrastructure are yours",
    ],
    cta: "Scope a build",
    featured: true,
  },
  {
    name: "Partner",
    price: "From $12k / month",
    duration: "Rolling, 3-month minimum",
    summary: "An embedded AI team for companies shipping continuously.",
    points: [
      "Dedicated senior engineers",
      "Roadmap and delivery ownership",
      "Quarterly model and cost review",
      "Cancel with 30 days' notice",
    ],
    cta: "Talk about a partnership",
    featured: false,
  },
] as const;

export const principles = [
  {
    title: "Production or it did not happen",
    body:
      "A demo proves a model can do something once. We only count work that survives real users, real data, and a Monday morning.",
  },
  {
    title: "Measure before you believe",
    body:
      "Every engagement ships with an evaluation suite. If we cannot show the number moved, we will say so rather than dress it up.",
  },
  {
    title: "The boring parts are the job",
    body:
      "Retrieval quality, data hygiene, fallbacks, cost ceilings, and access control decide whether an AI system is an asset or a liability.",
  },
  {
    title: "We tell you when not to",
    body:
      "A good share of AI proposals should be a database query, a form change, or nothing at all. Hearing that from us is cheaper than learning it later.",
  },
  {
    title: "Your code, your keys, your call",
    body:
      "We build in your repositories and your cloud accounts. No proprietary black box, no lock-in, no hostage situation at renewal.",
  },
  {
    title: "Senior people only",
    body:
      "The people who scope your work are the people who build it. We do not staff a pitch with principals and deliver with juniors.",
  },
] as const;

/**
 * PLACEHOLDER case studies — illustrative composites, not real clients.
 * Replace with cleared client work (or delete the page) before going live.
 */
export const caseStudies = [
  {
    slug: "support-triage",
    client: "B2B SaaS · 400 employees",
    title: "Support triage that cut first-response time by 71%",
    challenge:
      "Twelve thousand monthly tickets landed in one queue and were sorted by hand. Urgent enterprise issues waited behind password resets.",
    approach:
      "Classification and routing over the existing helpdesk, with retrieval against the internal knowledge base for suggested replies. Agents keep the final say; the model never sends unreviewed.",
    results: [
      { value: "71%", label: "faster first response" },
      { value: "3.4x", label: "more tickets resolved at tier 1" },
      { value: "$0.011", label: "cost per triaged ticket" },
    ],
    stack: ["Retrieval", "Classification", "Human-in-the-loop", "Eval harness"],
  },
  {
    slug: "document-extraction",
    client: "Commercial insurance broker",
    title: "Six-hour document reviews, done in eleven minutes",
    challenge:
      "Analysts read 60-page policy documents by hand to extract 40 fields, then re-keyed them into a legacy system. Errors surfaced at renewal.",
    approach:
      "A structured extraction pipeline with per-field confidence scores. Anything below threshold routes to a human review queue, so the analysts spend their time only on the hard pages.",
    results: [
      { value: "11 min", label: "average review time" },
      { value: "99.2%", label: "field accuracy on audit sample" },
      { value: "8 mo", label: "payback period" },
    ],
    stack: ["Structured extraction", "Confidence routing", "Audit trail"],
  },
  {
    slug: "sales-research",
    client: "Enterprise sales org · 90 reps",
    title: "Account research that reps actually open",
    challenge:
      "Reps spent roughly a day a week researching accounts, and two previous AI pilots had been abandoned because the output was generic.",
    approach:
      "Briefs assembled from CRM history, product usage, and public filings, generated on the rep's own accounts and delivered into the tools they already use. Adoption was the success metric from day one.",
    results: [
      { value: "82%", label: "weekly active use after 90 days" },
      { value: "6 hrs", label: "returned per rep per week" },
      { value: "+14%", label: "meetings booked per rep" },
    ],
    stack: ["CRM integration", "Retrieval", "Adoption instrumentation"],
  },
] as const;

export const faqs = [
  {
    q: "Do we need a data team before we start?",
    a: "No. Most of our clients start with data spread across a CRM, a warehouse, and a lot of documents. Part of the audit is telling you honestly which use cases your current data can support and which need groundwork first.",
  },
  {
    q: "Which models and vendors do you use?",
    a: "Whichever fits the problem, your compliance posture, and your budget. We build behind an abstraction so switching providers is a configuration change, and we re-benchmark as part of every quarterly review.",
  },
  {
    q: "Who owns the code?",
    a: "You do, entirely. We work in your repositories and your cloud accounts from day one. There is no 3queue runtime you have to keep paying for.",
  },
  {
    q: "What if the audit says we should not build anything?",
    a: "Then that is the deliverable, with the reasoning and the numbers behind it. It is a fraction of the cost of a failed build, and it has happened before.",
  },
  {
    q: "How do you handle sensitive or regulated data?",
    a: "We start from your constraints — residency, retention, PII handling, audit requirements — and design to them. Where the rules rule out an approach, we say so at scoping rather than at security review.",
  },
  {
    q: "How quickly can you start?",
    a: "Audits usually start within two to three weeks. Builds depend on the queue; the intro call gives you a real date rather than a hopeful one.",
  },
] as const;
