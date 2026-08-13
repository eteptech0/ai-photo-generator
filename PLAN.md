# AI Photo Generator — Product & Technical Plan

An AI face-swap photo generation service. Users upload a few real photos/headshots
of themselves, pick a purpose, and receive a batch of brand-new, realistic photos
with their face transposed onto professionally-designed scenes.

**Three purposes:**

1. **Professional** — LinkedIn / corporate headshots, speaker photos, team pages
2. **Instagram profile** — lifestyle, aesthetic, candid-social looks
3. **Dating apps** — candid, documentary-style photos optimized for Bumble/Hinge/Tinder,
   plus photo auto-recommendation and Hinge caption generation

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
   → (Dating only) Auto-recommend best photos per app + generate Hinge captions
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

### Dating-app extras

- **Auto-recommendation:** a vision-model pass scores each generated (and enhanced)
  photo against per-app rubrics — Bumble (bright, smiling, outdoorsy, first-photo
  clarity) vs. Hinge (candid, activity-based, conversation-starter potential) — and
  returns a ranked "use these 6 for Bumble / these 6 for Hinge" set with reasons.
- **Hinge captions:** an LLM generates suggested Hinge prompt answers and photo
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
| Hinge caption pack (10 captions) | 1 token |

Tokens are the single currency, so "you can pay with the tokens you get for each
photo to pay to modify the photos" falls out naturally: unused generation tokens
can be spent on modifications/enhancements instead.

### Plans (tiers sized like photography sessions)

Tiers are priced to match what an equivalent photography session actually costs
(mini sessions run ~$100–150; standard portrait sessions ~$200–350; premium/
branding sessions ~$400–600; full-day shoots $750+). We deliver comparable volume
without the studio, so we price in the same band:

| Tier | Analogy | Tokens/mo | ≈ Photos | Price (draft) |
|---|---|---|---|---|
| **Trial** | Taster | 4 tokens, once | 2 photos + 1 enhancement | **One-time payment, 7-week trial** — $9 |
| **Starter** | Standard session | 60/mo | ~40 | $99/mo |
| **Pro** | Premium session | 150/mo | ~100 | $199/mo |
| **Studio** | Full-day shoot | 400/mo | ~250+ | $399/mo |

- Trial: **one-time Stripe payment** ($9), grants a small taster bundle — enough
  for 2 generated photos plus 1 enhancement — valid 7 weeks, then the user must
  pick a monthly tier to continue. Cheap enough to be an impulse buy; the 2 photos
  are the sales pitch for the full tiers.
- Monthly tiers: Stripe **subscriptions**; tokens refresh each billing cycle
  (decide: rollover cap, e.g., roll over up to 1 month's worth).
- **Top-up packs**: one-time token purchases for users who run out mid-cycle.

(Prices/quantities are placeholders — we validate against actual model cost per
image before launch; see §7 open questions.)

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
        • OpenAI GPT-4o/vision — photo scoring for Bumble/Hinge recommendations
        • LLM — Hinge caption generation
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
User        (id, email, name, gender_presentation, created_at)
Subscription(id, user_id, stripe_customer_id, stripe_sub_id, tier, status,
             trial_expires_at)
TokenLedger (id, user_id, delta, reason, ref_id, created_at)   -- append-only
UploadSet   (id, user_id, purpose, status)                     -- a "model" of the user's face
Upload      (id, upload_set_id, s3_key, moderation_status)
Job         (id, user_id, upload_set_id, purpose, status, tokens_charged)
Photo       (id, job_id, s3_key, prompt_template_id, params_json, status,
             liked_at, enhanced_photo_id, scores_json)         -- scores for app recs
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
POST /api/recommendations      — rank photos for bumble|hinge
POST /api/captions             — generate Hinge captions for selected photos
POST /api/stripe/checkout      — create Checkout session (trial | tier | top-up)
POST /api/stripe/webhook       — ledger credits, subscription state
GET  /api/me/balance           — derived token balance
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
5. **Provenance.** Embed C2PA/metadata tagging photos as AI-generated (also
   increasingly required by platform policies).
6. **ToS compliance.** gpt-image-1's usage policies around photorealistic people
   must be reviewed and our consent flow aligned to them; this also shapes the
   fallback-provider decision in §7.
7. Clear ToS/Privacy: images private by default, deletion on request, no training
   on user photos, retention window (e.g., auto-delete uploads after 90 days).

---

## 6. Build Phases

**Phase 1 — Core loop (MVP, ~weeks 1–3)**
Auth, Stripe trial one-time payment, upload + consent + moderation, single
purpose (dating), 12 templates, async generation pipeline, gallery, like →
enhance, token ledger, download. *Ship to first testers.*

**Phase 2 — Monetization complete (~weeks 4–5)**
Monthly tiers + Customer Portal, top-up packs, all three purposes with full
template libraries, modify/regenerate flow, progress emails.

**Phase 3 — Dating differentiators (~weeks 6–7)**
Bumble/Hinge photo auto-recommendation with per-app rubrics, Hinge caption
generator with tone picker, "export pack" (correctly sized/cropped images per
app's specs).

**Phase 4 — Growth (post-launch)**
Referral tokens, seasonal template packs, quality A/B testing on templates,
possible female/male/non-binary wardrobe expansion per template, team/creator
plans.

---

## 7. Open Questions (need decisions before/at kickoff)

1. **Model economics.** gpt-image-1 costs roughly $0.02–$0.19 per image depending
   on quality/size — at "high", 100 photos ≈ $19 raw cost, so tier pricing must be
   validated against real per-image cost + retries. May use "medium" quality for
   Stage 1 drafts and "high" only for enhancement.
2. **Face fidelity ceiling.** Prompt-based face-swap via gpt-image-1 is good but
   not pixel-perfect on identity. If fidelity disappoints in testing, evaluate a
   hybrid: gpt-image-1 for scene generation + a dedicated face-restoration/ID pass,
   or alternative providers (e.g., Flux with identity adapters via a hosted API) —
   keeping the same two-stage UX.
3. **Trial mechanics.** Is the 7-week trial a fixed token bundle (recommended,
   predictable cost) or metered weekly drip?
4. **Rollover policy** for monthly tokens.
5. **Gendered templates.** The example prompt is male-presenting; templates need
   `{subject}` parameterization and wardrobe variants from day one, chosen via
   onboarding.
6. **Name/domain/branding.**

---

## 8. Success Metrics

- Trial → paid conversion rate (target ≥ 25%)
- Photos liked / photos generated (quality proxy, target ≥ 30%)
- Enhancement attach rate on liked photos
- Cost per delivered photo vs. token price (gross margin ≥ 70%)
- Dating users using recommendations + captions (feature adoption)
