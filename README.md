# 3queue — AI implementation consulting

Marketing site for **3queue**, an AI implementation consultancy. Built with
Next.js (App Router), TypeScript, and Tailwind CSS v4. Every page is statically
prerendered; the contact form is the only dynamic surface.

## The brand spine

The name is the method. Every engagement sits in one of three queues:

| # | Queue | Promise |
|---|-------|---------|
| 01 | **Discover** | Find the work that pays for itself. |
| 02 | **Build** | Get one thing into production, properly. |
| 03 | **Operate** | Make it someone else's routine — ideally yours. |

That structure drives the homepage, the approach page, the footer, and the logo
(three bars, growing left to right).

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Layout

```
src/
  app/
    page.tsx            Homepage
    services/           Service catalogue + engagement models
    approach/           The three queues, cadence, mutual expectations
    work/               Case studies  ← placeholder content, see below
    about/              Story, team, principles  ← placeholder team
    contact/            Enquiry form + server action
    sitemap.ts robots.ts not-found.tsx
  components/           Header, footer, hero, CTA, FAQ, form, UI primitives
  config/
    site.ts             Name, contact details, nav, the three queues
    content.ts          Services, engagements, principles, case studies, FAQs
  lib/enquiry.ts        Form validation + email delivery
```

Copy lives in `src/config/*`, not inside components — edit the data files to
change what the site says, and only touch components to change how it looks.

## Design system

Tokens are defined once in `src/app/globals.css` under Tailwind's `@theme`:
a near-black canvas (`ink`), a warm off-white band (`paper`) for alternating
sections, and a single signal accent (`accent`, `#ff5c35`). Sections alternate
`dark` / `raised` / `light` via the `tone` prop on `<Section>`.

**Button colours belong to variants, never to `className`.** Tailwind resolves
conflicting utilities by stylesheet order rather than attribute order, so
overriding a variant's colour from the outside can silently lose. Add a variant
in `src/components/ui.tsx` instead.

## Contact form

The form posts to a server action (`src/app/contact/actions.ts`) which
validates, then delivers through `src/lib/enquiry.ts`. It works with no
configuration — with no mail provider set, enquiries are logged server-side so
the flow stays exercisable in development and preview deploys.

To deliver real email, set the variables in `.env.example`:

```
RESEND_API_KEY=...
CONTACT_FROM_EMAIL=website@3queue.com   # must be a verified sender
CONTACT_TO_EMAIL=hello@3queue.com
```

The form degrades gracefully without JavaScript (server actions handle the
native submit), includes a honeypot field, and wires `aria-invalid` /
`aria-describedby` for each field error.

## Before going live

- [ ] Replace the case studies in `src/config/content.ts` — they are
      **illustrative composites, not real clients**. The `/work` page carries a
      visible placeholder banner until you do; remove it with the fake data.
- [ ] Replace the team profiles in `src/app/about/page.tsx` with real names,
      roles, bios, and photos.
- [ ] Confirm the pricing in `engagements` and the durations in `services`.
- [ ] Point `site.url`, `site.email`, and `site.social` at the real domain and
      accounts (`src/config/site.ts`).
- [ ] Add an Open Graph image (`src/app/opengraph-image.png`) and a favicon.
- [ ] Configure the mail provider variables above.
