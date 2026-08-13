# AI Photo Generator — Product & Technical Plan

An AI face-swap photo generation service. Users upload a few real photos/headshots
of themselves, pick a purpose, and receive a batch of brand-new, realistic photos
with their face transposed onto professionally-designed scenes.

**Core technology stance — face-swap first, not text-to-image.** The primary
technique is *swapping the user's real face* onto a generated/stock body-and-scene,
not asking an image model to imagine a person from scratch. This matters for two
reasons the whole product depends on:

- **Far less uncanny valley.** We keep the user's actual facial pixels/geometry and
  composite them in, so eyes, teeth, and skin read as a real human instead of the
  smeared, "almost-right" look pure generative portraits produce.
- **Much more exact likeness.** The output is recognizably *them* — critical when
  the photo goes on a dating profile they'll meet people from, or a professional
  page. Scene generation handles the background/wardrobe; a dedicated face-swap +
  identity-preservation step owns the face. (See §3 for the pipeline and §8 for the
  provider/fidelity decision.)

**Three purposes:**

1. **Professional** — LinkedIn / corporate headshots, speaker photos, team pages
2. **Instagram profile** — lifestyle, aesthetic, candid-social looks
3. **Dating apps** — candid, documentary-style photos optimized for dating profiles,
   plus photo auto-recommendation and profile caption generation

---

## 1. Core User Flow

```
Sign up → Buy plan (Stripe) → Upload X selfies/headshots (no hard cap;
       minimum ~3 recommended for identity fidelity — more angles/lighting =
       better likeness; we auto-select the best references per generation)
   → Pick purpose (Professional / Instagram / Dating)
   → Pick styles & scenes (or "surprise me")
   → Generation job runs (batch of N photos)
   → Gallery: review results
   → ❤️ "Like" a photo → triggers Enhancement pass (costs extra tokens)
   → Download originals + enhanced versions
   → (Dating only) Auto-recommend best photos + generate profile captions
```

### The two-stage generation pipeline

**Stage 1 — Face-swap generation.** For each photo, we assemble a prompt from a
template library. Example template (dating, "coffee shop golden hour"):

> A candid, documentary-style photograph captured on an iPhone 15 Pro, 24mm lens.
> Apply a direct face-swap using the specific man's face from the input image
> (image_0.png) onto this new photo. His facial features and identity must be
> maintained with 100% fidelity without modification or smoothing.
>
> **Scene:** He is sitting at a coffee shop patio during the golden hour, looking
> slightly off-camera.
> **Details:** He wears smart-casual attire (e.g., structured navy jacket over a
> cream shirt).
> **Aesthetic:** The photo looks raw and unposed, featuring realistic smartphone
> lighting, subtle background bokeh, and no professional editing.

Templates are parameterized: `{subject}` (gender/pronouns from onboarding),
`{scene}`, `{wardrobe}`, `{lighting}`, `{camera}`, `{aesthetic}`. Each purpose has
its own scene library (see §4).

**Stage 2 — Enhancement pass (on "Like", costs extra tokens).** When a user likes
a photo, we run a second image-edit call with the enhancement prompt:

> On the provided portrait, perform a natural beauty and clarity enhancement:
> sharpen facial features, brighten the eyes, and even out skin tone while removing
> transient blemishes. Preserve all original micro-texture, pores, and natural
> facial geometry. Maintain the original identity strictly. Soften the lighting to
> add a professional, photorealistic finish without plastic over-smoothing or halo
> effects.

This two-stage design is deliberate: generation is cheap-ish and high-volume;
enhancement is opt-in and only spent on winners, which is also how we justify its
extra token cost to the user.

**Stage 3 — Output post-processing (automatic, free).** Before a photo is shown in
the gallery, every image runs through a finishing step:

- **Metadata rewrite → "shot on iPhone."** Model-generated files carry no camera
  EXIF (and providers may stamp their own tags). We strip that and write realistic
  smartphone EXIF instead — `Make: Apple`, `Model: iPhone 15 Pro`, a plausible lens
  (`24mm f/1.78`), exposure/ISO/shutter values consistent with the scene's lighting,
  and a believable capture timestamp. The result is that a downloaded photo looks
  like it came off a phone, not out of an AI tool — which is what makes it usable as
  a candid dating/social photo.
- Correct color profile, sharpening, and per-destination sizing/cropping (dating-app
  export specs come later in Phase 3).

> **Note on "make it look like an iPhone took it":** rewriting EXIF is standard and
> uncontroversial. The separate, paid **AI-detectability removal** (Stage 4 below,
> and §5) is a different, higher-risk feature with real policy implications — the two
> are kept distinct on purpose.

**Stage 4 — AI-detectability / fingerprint removal (opt-in, costs tokens).** A paid
per-photo option that attempts to remove machine-detectable AI provenance signals
(e.g., provider-embedded C2PA credentials and watermarks) so the image is less
likely to be flagged by automated AI-image detectors. **This carries genuine legal,
platform-policy, and provider-ToS risk — see §5 for the full treatment and the
open decision on whether we ship it at all.**

### Dating-app extras

- **Auto-recommendation:** a vision-model pass scores each generated (and enhanced)
  photo against dating-profile rubrics — a strong bright/smiling "first photo,"
  candid activity shots, conversation-starter potential, variety across the set —
  and returns a ranked "use these 6, in this order" selection with reasons.
- **Profile captions:** an LLM generates suggested profile prompt answers and photo
  captions matched to the selected photos (e.g., photo at a climbing gym → witty
  answer for "My most irrational fear…"). User picks a tone: witty / sincere /
  low-key.

---

## 2. Business Model & Stripe

### Token economy

Everything is denominated in **tokens** held in a per-user ledger:

| Action | Token cost (draft) |
|---|---|
| Generate 1 photo (Stage 1) | 1 token |
| Enhance a liked photo (Stage 2) | 2 tokens |
| Regenerate / modify a photo (new scene, wardrobe change, "fix hands") | 1–2 tokens |
| Dating photo auto-recommendation (per batch) | 1 token |
| Profile caption pack (10 captions) | 1 token |
| **Remove AI-detectability / fingerprint** (per photo — see §5) | 2 tokens |

Tokens are the single currency, so "you can pay with the tokens you get for each
photo to pay to modify the photos" falls out naturally: unused generation tokens
can be spent on modifications/enhancements instead.

### Buy-more-tokens (top-ups)

Any user on any tier — including mid-cycle when they run out — can **buy more
tokens** at any time via a one-time Stripe payment. These are add-on packs, separate
from the monthly refresh, and they never expire while the subscription is active:

| Pack | Tokens | Price (draft) | Effective $/photo |
|---|---|---|---|
| Small | 20 | $25 | $1.25 |
| Medium | 50 | $55 | $1.10 |
| Large | 120 | $120 | $1.00 |

Top-up packs are priced slightly above the per-token rate baked into subscriptions,
so subscribing is always the better deal (protects recurring revenue) while still
giving heavy users an instant "I need more now" button. The Buy Tokens action lives
in the dashboard header and appears inline whenever a job would exceed the current
balance ("You need 6 more tokens for this batch — top up?").

### Plans (tiers sized like photography sessions)

Tiers are priced to match what an equivalent photography session actually costs
(mini sessions run ~$100–150; standard portrait sessions ~$200–350; premium/
branding sessions ~$400–600; full-day shoots $750+). We deliver comparable volume
without the studio, so we price in the same band:

| Tier | Analogy | Tokens/mo | ≈ Photos | Price (draft) |
|---|---|---|---|---|
| **Trial** | Taster | 4 tokens, once | 2 photos + 1 enhancement | **One-time payment, 7-week trial** — $4.50 |
| **Starter** | Standard session | 60/mo | ~40 | $70/mo |
| **Pro** | Premium session | 150/mo | ~100 | $99/mo |
| **Studio** | Full-day shoot | 400/mo | ~250+ | $170/mo |

- Trial: **one-time Stripe payment** ($4.50), grants a small taster bundle — enough
  for 2 generated photos plus 1 enhancement — valid 7 weeks, then the user must
  pick a monthly tier to continue. Cheap enough to be an impulse buy; the 2 photos
  are the sales pitch for the full tiers.
- Monthly tiers: Stripe **subscriptions**; tokens refresh each billing cycle
  (decide: rollover cap, e.g., roll over up to 1 month's worth).
- **Top-up packs**: one-time token purchases for users who run out mid-cycle.

(Prices/quantities are placeholders — we validate against actual model cost per
image before launch; see §8 open questions.)

### Stripe implementation

- Stripe Checkout for trial (one-time `payment` mode) and subscriptions
  (`subscription` mode); Customer Portal for plan changes/cancellation.
- Webhooks: `checkout.session.completed`, `invoice.paid`,
  `customer.subscription.updated/deleted` → credit/adjust token ledger.
- Token ledger is **append-only** (credits and debits as rows, balance derived) so
  billing disputes and refunds are auditable.
- Never trust client-side balance; all debits happen server-side at job creation,
  with refund-on-failure (job errored → tokens returned automatically).

---

## 3. Architecture & Stack

```
Next.js 15 (App Router, TypeScript, Tailwind + shadcn/ui)  ← web app + API routes
  │
  ├── Auth: Auth.js (email magic link + Google OAuth)
  ├── DB: Postgres (Neon/Supabase) via Prisma
  ├── Storage: S3-compatible (Cloudflare R2) — uploads & generated images,
  │            served via signed URLs; images private by default
  ├── Queue/jobs: Inngest (or BullMQ+Redis) — generation is async, minutes-long
  ├── Payments: Stripe (Checkout + Billing + webhooks)
  └── AI providers:
        • OpenAI Images API (gpt-image-1) — Stage 1 generation (images.edit with
          the user's reference photos as input) and Stage 2 enhancement
        • OpenAI GPT-4o/vision — photo scoring for dating-profile recommendations
        • LLM — profile caption generation
        • OpenAI moderation — screen uploads & outputs
```

Hosting: Vercel (app) + managed Postgres + R2. Everything serverless-friendly;
the queue handles the long-running generation work so requests never time out.

### Why async jobs matter here

A "session" = 20–100 images. Each image-edit call takes ~30–90s. So a batch is a
**job** with per-image sub-tasks, a progress UI ("14 of 40 photos ready"), retry
logic per image, and an email/notification when the batch completes. Users close
the tab and come back.

### Data model (core tables)

```
User        (id, email, name, gender_presentation, role, created_at)  -- role: user|admin
Subscription(id, user_id, stripe_customer_id, stripe_sub_id, tier, status,
             trial_expires_at)
TokenLedger (id, user_id, delta, reason, ref_id, created_at)   -- append-only
UploadSet   (id, user_id, purpose, status)                     -- a "model" of the user's face
Upload      (id, upload_set_id, s3_key, moderation_status)
Job         (id, user_id, upload_set_id, purpose, status, tokens_charged,
             provider_cost_cents)                              -- cost tracking for admin
Photo       (id, job_id, s3_key, prompt_template_id, params_json, status,
             liked_at, enhanced_photo_id, scores_json,         -- scores for app recs
             detectability_removed_at)                         -- Stage 4 audit
Purchase    (id, user_id, stripe_payment_id, kind, amount_cents, tokens_granted,
             created_at)                                       -- trials + top-up packs
PromptTemplate(id, purpose, name, scene, wardrobe, lighting, camera, aesthetic,
             active)
CaptionPack (id, user_id, photo_ids[], app, captions_json)
```

### API surface (App Router routes)

```
POST /api/uploads              — presigned upload URLs + moderation kick-off
POST /api/jobs                 — create generation job (debits tokens)
GET  /api/jobs/:id             — job progress
POST /api/photos/:id/like      — like → enqueue enhancement (debits tokens)
POST /api/photos/:id/modify    — regenerate with tweaks (debits tokens)
POST /api/photos/:id/undetect  — Stage 4 detectability removal (debits tokens; gated)
POST /api/recommendations      — rank photos for dating profile
POST /api/captions             — generate profile captions for selected photos
POST /api/stripe/checkout      — create Checkout session (trial | tier | topup)
POST /api/stripe/webhook       — ledger credits, subscription state
GET  /api/me/balance           — derived token balance

# Admin (role=admin only, all read-only except template mgmt)
GET  /api/admin/metrics        — KPIs: MRR, active subs, tokens issued/spent, cost
GET  /api/admin/users          — user list w/ tier, balance, lifetime spend
GET  /api/admin/jobs           — job feed w/ status, tokens, provider cost, errors
GET  /api/admin/revenue        — Stripe revenue vs. AI provider cost (margin)
CRUD /api/admin/templates      — manage prompt template library (activate/retire)
```

---

## 4. Prompt Template Library (initial set)

Every template follows the proven structure from the example: **camera/format
line → face-swap fidelity instruction → Scene → Details (wardrobe) → Aesthetic.**

**Professional (8 launch scenes):** studio gray-seamless headshot; office window
light; conference-stage speaker; modern lobby; outdoor campus; blazer-on-brick;
coworking candid; black-and-white editorial.

**Instagram (8):** golden-hour rooftop; beach walk; city crosswalk street-style;
gym mirror-adjacent candid (no mirror); café flat-white overhead-adjacent; hiking
summit; night-out neon bokeh; car-seat golden hour.

**Dating (12):** coffee-shop patio golden hour (the flagship example); dog-park
candid with golden retriever; farmers-market browsing; climbing-gym chalk hands;
cooking-at-home kitchen; vineyard tasting; kayak/lake; bookstore aisle; concert
crowd (back-lit); ski-lift selfie-style; tailgate with friends (faces of others
obscured/turned); travel landmark (generic, not identifiable people).

Templates live in the DB (`PromptTemplate`) so we can A/B test, retire weak
performers, and add seasonal packs without deploys.

---

## 5. Safety, Consent & Policy (non-negotiable for face-swap)

This is the riskiest part of the product and needs to be designed in from day one:

1. **Own-face only.** Explicit attestation at upload: "I confirm these photos are
   of me and I consent to AI generation." Stored with timestamp + IP.
2. **Face-match verification.** On upload, run face detection + embedding
   comparison across the uploaded set; reject sets containing multiple identities
   or celebrity matches. (Also catches "I uploaded my ex" abuse.)
3. **Moderation both directions.** OpenAI moderation on uploads (reject nudity,
   minors — hard block with age-estimation check) and on generated outputs.
4. **No impersonation contexts.** Templates never include uniforms/badges,
   government settings, or other-person embraces where the other face is visible.
5. **ToS compliance.** gpt-image-1's usage policies around photorealistic people
   must be reviewed and our consent flow aligned to them; this also shapes the
   fallback-provider decision in §8.
6. Clear ToS/Privacy: images private by default, deletion on request, no training
   on user photos, retention window (e.g., auto-delete uploads after 90 days).

### Metadata & AI-provenance — the two things we do, and the risk on the second

These were requested as product features; they need to be understood as two very
different levels of risk.

**(a) EXIF rewrite → "shot on iPhone" (low risk, ship it).** Writing plausible
smartphone camera metadata onto the output is normal photo tooling — every editing
app rewrites EXIF, and there's no law or platform rule requiring a photo to carry
"no camera" metadata. This is fine to enable by default.

**(b) AI-detectability / fingerprint removal (high risk — decision required before
shipping).** Actively stripping provider-embedded provenance (C2PA credentials,
invisible watermarks like SynthID-style markers) specifically so the image evades
AI-detection is materially different, and the plan should not pretend otherwise:

- **Regulation.** The EU AI Act (Art. 50) and a growing list of US state laws
  require AI-generated media to be *disclosed/marked*, not de-marked. Selling a
  tool whose purpose is to remove that marking may put us on the wrong side of
  these rules in some markets.
- **Provider ToS.** OpenAI (and most image providers) attach C2PA metadata and
  prohibit removing it. Building a feature to strip it likely violates the API
  terms we depend on — which could get our account terminated, taking the whole
  product down.
- **Platform policy.** Dating apps and social platforms increasingly ban
  undisclosed AI photos; a user relying on this feature could get *their* account
  banned, which is a support/liability problem for us.
- **Framing.** Positioned as "make my own face look natural on my profile" it's
  defensible; positioned as "defeat AI detectors" it reads as evasion. The line
  matters legally and reputationally.

**Approach:** ship the paid detectability-removal behind an **explicit "use at your
own discretion" acknowledgment** — the user checks a box confirming they understand
the platform/legal risks and take responsibility for how they use the output. We
surface the disclaimer clearly, then let them decide; no legal-review gate. The
EXIF-rewrite (a) is on by default; (b) stays opt-in and per-photo (2 tokens).

7. **Provenance record (internal).** Regardless of what we strip from the *output*,
   we keep an internal, tamper-evident record that each image was AI-generated
   (who, when, which template, which references). This protects us in disputes and
   lets us comply with a lawful takedown/traceability request even if the public
   file is unmarked.

---

## 6. Admin Dashboard

A separate `/admin` area (gated by `role=admin`, its own layout) so we can actually
run the business and watch cost vs. revenue in real time:

- **Overview KPIs:** MRR, active subscriptions by tier, trial→paid conversion,
  new signups, churn, tokens issued vs. tokens spent this period.
- **Revenue vs. cost:** Stripe revenue charted against AI-provider spend
  (`Job.provider_cost_cents`) so gross margin is visible per day/week and per tier —
  this is the number that tells us if pricing is right.
- **Usage:** photos generated, enhancement attach rate, most-used templates,
  detectability-removal usage (flagged feature — watch it closely), captions/recs
  generated.
- **Users:** searchable list with tier, current token balance, lifetime spend, job
  history; drill into a user to see their ledger and jobs. Admin actions: grant/
  refund tokens (writes to `TokenLedger` with an `admin_adjustment` reason), suspend
  a user, resend a failed job.
- **Jobs feed:** live job status with per-image errors and retry counts, so we catch
  provider outages or a spiking failure rate before users complain.
- **Template management:** activate/retire/A-B templates without a deploy (CRUD over
  `PromptTemplate`).
- **Moderation queue:** flagged uploads/outputs for human review.

Built with the same Next.js app (admin route group), reading the same Postgres —
metrics come from SQL aggregations over the ledger, jobs, and Stripe data, with
heavier rollups cached. Access is role-gated at the middleware layer and every admin
mutation is audit-logged.

---

## 7. Build Phases

**Phase 1 — Core loop (MVP, ~weeks 1–3)**
Auth, Stripe trial one-time payment, upload + consent + moderation, single
purpose (dating), 12 templates, async generation pipeline, EXIF "iPhone" rewrite,
gallery, like → enhance, token ledger, download. *Ship to first testers.*
(AI-detectability removal ships behind a "use at your own discretion" acknowledgment
— see §5; which phase it lands in is an open question.)

**Phase 2 — Monetization complete (~weeks 4–5)**
Monthly tiers + Customer Portal, **buy-more-tokens top-up packs**, all three
purposes with full template libraries, modify/regenerate flow, progress emails,
and a **first cut of the admin dashboard** (KPIs + revenue-vs-cost + user list).

**Phase 3 — Dating differentiators (~weeks 6–7)**
Dating-profile photo auto-recommendation with ranking rubrics, profile caption
generator with tone picker, "export pack" (correctly sized/cropped images for
common dating-profile specs).

**Phase 4 — Growth (post-launch)**
Referral tokens, seasonal template packs, quality A/B testing on templates,
possible female/male/non-binary wardrobe expansion per template, team/creator
plans.

---

## 8. Open Questions (need decisions before/at kickoff)

1. **Model economics.** gpt-image-1 costs roughly $0.02–$0.19 per image depending
   on quality/size — at "high", 100 photos ≈ $19 raw cost, so tier pricing must be
   validated against real per-image cost + retries. May use "medium" quality for
   Stage 1 drafts and "high" only for enhancement.
2. **Face-swap engine choice.** To hit the "exact likeness, no uncanny valley"
   goal, decide the swap approach: (a) a dedicated face-swap model that composites
   the user's real face onto a generated body/scene (best identity fidelity), vs.
   (b) prompt-based swap via gpt-image-1 alone (simpler, but softer on identity).
   Leading candidate is a hybrid — gpt-image-1 (or Flux) generates the scene/body,
   a dedicated swap + identity-restoration step owns the face — which is exactly why
   the pipeline in §3 separates scene from face.
3. **Detectability-removal (Stage 4).** Shipping it as a paid, opt-in per-photo
   feature behind a "use at your own discretion" acknowledgment (§5). Open sub-
   question: which phase it lands in.
4. **Trial mechanics.** Is the 7-week trial a fixed token bundle (recommended,
   predictable cost) or metered weekly drip?
5. **Rollover policy** for monthly tokens.
6. **Gendered templates.** The example prompt is male-presenting; templates need
   `{subject}` parameterization and wardrobe variants from day one, chosen via
   onboarding.
7. **Name/domain/branding.**

---

## 9. Success Metrics

- Trial → paid conversion rate (target ≥ 25%)
- Photos liked / photos generated (quality proxy, target ≥ 30%)
- Enhancement attach rate on liked photos
- Cost per delivered photo vs. token price (gross margin ≥ 70%)
- Dating users using recommendations + captions (feature adoption)
