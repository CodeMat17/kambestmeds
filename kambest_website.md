# Kambest Tradomedical Center — Website Build Spec

> Mobile-first, stunning, compelling, enigmatic sales website. This document is the single source of truth for content, structure, components, and technical requirements. Build against this file — do not invent copy or structure not covered here without checking back.

---

## 1. Overview & Brand Voice

**Brand**: Kambest Tradomedical Center (KAMBEST Health Solutions)
**Primary tagline**: **"Rooted in Nature. Proven in Results."**
*(Replaces the older slogan "We Treat, God Heals" everywhere it previously appeared — e.g. on the "Kambest Tradomedical Centre" product card. If the client wants the old slogan retained as a secondary heritage line somewhere on the About Us page, that's a stakeholder call, not a default.)*

**Tone**: warm, trustworthy, rooted in Nigerian herbal tradition but presented with modern credibility. Mobile-first. Enigmatic through visual motifs (herbal/trado artifacts — leaves, mortar & pestle, root illustrations) rather than vague copy — the writing itself should be clear and confident, not mystical or evasive.

**Typography**: **Google "Nunito" only** — loaded via `next/font/google`, self-hosted (no external font requests → zero layout shift, better Lighthouse score). Replaces the current default Geist fonts in `app/layout.tsx`. Use weight variants 400 (body), 600 (subheads), 700–800 (headings/CTAs) for hierarchy. No second typeface.

**Color theme**: Bright and charming, not muted/earthy.
- **Primary**: fresh herbal green (vibrant, not olive-drab)
- **Accent**: warm sunny gold/amber
- **Light mode background**: soft cream / off-white
- **Dark mode background**: rich deep green / near-black, same green + gold accents popping against it
- Implement as new OKLCH tokens layered into the existing shadcn `@theme inline` block in `app/globals.css`, replacing the current neutral palette. Keep full light/dark parity and verify WCAG AA contrast for every accent-on-background pairing (required for the Lighthouse Accessibility target below).

---

## 2. Global Elements

### Navbar
- **Sticky** on scroll.
- Logo (`/logo.webp`) + brand name.
- Links: Home, About Us, Products, Contact Us.
- Dark/light theme toggle (sun/moon icon, animated swap via `framer-motion`), powered by `next-themes` (already installed — needs a `ThemeProvider` wired into `app/layout.tsx`, which is currently still default create-next-app boilerplate).
- Mobile menu: `Sheet` component, **forced full width on mobile** (`className="w-full sm:max-w-sm"` — the `w-full` override must be applied to this specific Sheet instance, not globally, since desktop/other sheets in Order/Enquiry flows should stay normal width).

### Footer
- Brand blurb (2–3 lines, reuses the tagline).
- Quick links (Home, About Us, Products, Contact Us).
- Both addresses (Port Harcourt + Lekki/Ajah, Lagos — full text in §6).
- Phone numbers, WhatsApp CTA button.
- Email (placeholder — see §6 note).
- Facebook icon linking to the brand's Facebook presence (see §6 note on the provided link).
- Legal row: "Privacy" and "Terms" placeholder links (can be stub pages initially — expected on any site collecting names via forms).
- Copyright line with current year.

### Feedback & interaction patterns
- **Sonner** toasts for form actions (e.g. "Redirecting to WhatsApp…", validation errors).
- **Alert Dialog** for any confirm-before-proceeding moment (e.g. optionally confirming an order before the WhatsApp redirect fires).
- **Framer Motion** (already installed) for hero entrance, scroll-reveal sections, card/sheet micro-interactions, and the theme-toggle icon swap. Centralize reusable variants (fade-up, stagger-children, scale-in) in `lib/motion.ts`. Respect `prefers-reduced-motion`. Keep motion on small leaf client components, not whole pages, to protect the Performance score.

### shadcn components already installed
`alert-dialog`, `button`, `card`, `input`, `sheet`, `sonner`, `textarea`

### shadcn components still needed (run `npx shadcn add <name>`)
`navigation-menu` or `dropdown-menu` (nav/mobile menu support), `label` (form accessibility), `separator`, `badge` (e.g. "New" tag on latest products), `avatar` (testimonials), `skeleton` (image loading states), `select` (optional, quantity stepper alternative)

### New non-shadcn dependencies to add
`react-hook-form` + `zod` (form validation for Order/Enquiry sheets — validate before building the WhatsApp link, surface inline errors instead of relying only on toasts)

---

## 3. Homepage (`/`)

### Hero section
- **Background**: `/about1.webp`, full-bleed, with a dark gradient overlay for text legibility.
- **Trado artifacts**: subtle herbal/mystical line-art SVG accents (leaves, root, mortar & pestle) layered around the headline — decorative, not distracting, low-opacity.
- **Headline copy** (verbatim per brand brief, tagline swapped in):
  > KAMBEST Tradomedical Services — Natural Healing, Real Results.
  > Trusted Herbal Solutions. Empowering your body to heal naturally with safe herbs.
  > *Rooted in Nature. Proven in Results.*
- **CTAs**: `See Products` → `/products` (primary button), `Learn More` → `/about-us` (secondary/outline button).
- Scroll-cue indicator at the bottom of the hero.
- Entrance animation via `framer-motion` (fade-up + stagger on headline/CTAs).

### "Why Choose Tradomedicals" section
4 feature cards, icon + heading + 1–2 line copy:
1. **100% Natural** — "Every remedy is crafted from pure, ethically-sourced herbs — no synthetic fillers, no shortcuts."
2. **Trusted by Thousands** — "Years of consistent results have made KAMBEST a trusted name in herbal healing across Nigeria."
3. **Fast, Visible Relief** — "Our formulations are designed to work with your body — many clients feel a difference within days."
4. **Nigerian-Rooted Expertise** — "Generations of tradomedical knowledge, refined and delivered with modern care."

### "Our Latest Products" section
3 representative products pulled from the full dataset (§5), each a card with image + name + price teaser:
1. **Fibroid Cure** — ₦5,000
2. **Hepatitis & Liver Detox** — ₦5,000
3. **Sperm Booster** — ₦5,000

Button below the row: **See All Products** → `/products`.

### "What Our Clients Say" section
3 testimonial cards (name + short quote, avatar placeholder), grid or carousel:
1. *"After months of struggling, the Fibroid Cure gave me real relief within weeks. I finally feel like myself again."* — **Chiamaka, Port Harcourt**
2. *"KAMBEST's liver detox helped me recover faster than my doctor expected. Forever grateful."* — **Emeka, Lagos**
3. *"Genuine herbs, genuine care. The team even followed up to check on my progress."* — **Ngozi, Lekki**

### Final CTA banner
Short closing line + WhatsApp CTA button, directly above the footer.

---

## 4. About Us (`/about-us`)

- **Visual**: `/about1.webp` reused in a hero/split-image layout, paired with the same trado artifact motifs used on the homepage for visual continuity.
- **Copy** (expanded, compelling rewrite of the brand brief):

> **Natural Healing. Real Results.**
> KAMBEST Tradomedical Services exists on one belief: the body already knows how to heal — it just needs the right support. Every remedy we offer is a trusted herbal solution, formulated to empower your body to heal naturally, using safe, carefully sourced herbs. No shortcuts, no synthetic compromises — just results our clients can feel.

> **The Man Behind KAMBEST**
> Orji Nkemdilim Moses — popularly known as **KAMBEST** — is a respected entrepreneur and the founder of KAMBEST Health Solutions, a trusted health and wellness brand now serving customers across Nigeria. What started as a deep personal passion for helping people has grown into a brand thousands rely on for natural, effective care.

> **A Mission Beyond Medicine**
> KAMBEST's drive has never been just about business — it's about impact. Known for his commitment to excellence and his belief in the power of community, he built KAMBEST Health Solutions to be more than a product line: a trusted companion in every client's wellness journey, from Port Harcourt to Lagos and beyond.

> **Business Excellence, Community First**
> Today, KAMBEST Health Solutions stands as a name built on consistency, integrity, and genuine care. Guided by a founder committed to business excellence, community development, and positive impact, the brand continues to grow — one healed client, one trusted relationship, at a time.

- Optional supporting elements: mission/vision/values mini-grid (Integrity, Excellence, Community, Natural Care), pull-quote callout from the founder.

---

## 5. Products (`/products`)

### Layout
Responsive grid: 1 column (mobile) → 2 (tablet) → 3–4 (desktop). Each card: product image (or video for the one `.mp4` entry), name, price, and a 3-button footer.

### Data source
Store the full dataset below as a typed array in `lib/products.ts` (`Product[]`), imported into the products page — not hardcoded inline.

```json
[
  { "image": "1000421943.jpg", "name": "Fibroid Cure", "cures": "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy painful period, Lower back pain, Pains during intercourse, Fertility problem", "amount": "5000" },
  { "image": "1000423355.jpg", "name": "Kambest Tradomedical Centre", "cures": "General herbal treatments as indicated by the logo and slogan 'Rooted in Nature. Proven in Results.'", "amount": "5000" },
  { "image": "1000423439.jpg", "name": "Herbal Capsules", "cures": "Specific cures not listed on this image", "amount": "5000" },
  { "image": "1000423441.jpg", "name": "Kambest Trado Medical Services", "cures": "Herbal Remedies, Herbal Supplements, Cosmetics and Personal Care", "amount": "5000" },
  { "image": "1000423443.jpg", "name": "Kambest Trado Medical Services Logo", "cures": "Specific cures not listed on this image", "amount": "5000" },
  { "image": "1000423669.jpg", "name": "Hepatitis & Liver Detox", "cures": "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Treats The Endocrine System and Supports Immune System", "amount": "5000" },
  { "image": "1000423671.jpg", "name": "Fibroid Cure", "cures": "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy Painful Period, Lower Back Pain, Pains During Inter Cours & Fertility Problem", "amount": "5000" },
  { "image": "1000423672.jpg", "name": "Sperm Booster", "cures": "Low sperm count, Oligospermia, Azospermia, Low vitality, Watery sperms, Motility Rate, Fertility in men, Restore urge and feeling of sex satisfaction", "amount": "5000" },
  { "image": "1000423674.jpg", "name": "Hepatitis & Liver Detox", "cures": "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Supports Endocrine System, Strengthens & Supports Immune System", "amount": "5000" },
  { "image": "1000423675.jpg", "name": "BP & Cholesterol", "cures": "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", "amount": "5000" },
  { "image": "1000423690.jpg", "name": "BP & Cholesterol", "cures": "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", "amount": "5000" },
  { "image": "1000423691.jpg", "name": "Fibroid Cure", "cures": "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy painful period, Lower back pain, Pains during intercourse, Fertility problem", "amount": "5000" },
  { "image": "1000423692.jpg", "name": "Hepatitis & Liver Detox", "cures": "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Supports Endocrine System, Strengthens & Supports Immune System", "amount": "5000" },
  { "image": "1000423693.jpg", "name": "Sperm Booster", "cures": "Low sperm count, Oligospermia, Azospermia, Low vitality, Watery sperms, Motility Rate, Fertility in men, Restore urge and feeling of sex satisfaction", "amount": "5000" },
  { "image": "1000423694.jpg", "name": "BP & Cholesterol", "cures": "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", "amount": "5000" },
  { "image": "1000423695.jpg", "name": "Fibroid Cure", "cures": "Fibroid Intramural, Subserosal, Submucosa, Cervical, Heavy Painful Period, Lower Back Pain, Pains During Inter Cours & Fertility Problem", "amount": "5000" },
  { "image": "1000423696.jpg", "name": "Hepatitis & Liver Detox", "cures": "Hepatitis, Liver Diseases, Liver Cell Jaundice, Hemolytic Jaundice, Palliation, General Liver & Kidney Detoxification, Kidney Disease, Kidney Stones, Enhance Bile Secretion, Dissolves Liver Fat, Treats Gallbladder, Treats The Endocrine System and Supports Immune System", "amount": "5000" },
  { "image": "1000423698.jpg", "name": "BP & Cholesterol", "cures": "Hypertension, Diabetes, Bronchial Problems, Colds, Bruises, Boils, Ear-aches, Swelling Arthritis, Sprains, Relieves Colds, Asthma, Tay-tay Worms, Shortness of Breath", "amount": "5000" },
  { "image": "1000423701.mp4", "name": "Staphylococcus Wiper", "cures": "Staphylococcus aureus, candidiasis, white milk discharge, breast milk discharge, itching, infertility (both male and female), toilet infection", "amount": "5000" }
]
```

> ⚠️ **Asset gap**: none of these image files (or the `.mp4`) currently exist in `public/`. Only `about1.webp` and `logo.webp` are present. Implementation must use a placeholder/blur fallback (with `next/image` `blurDataURL`) until the client supplies the real photos/video, ideally pre-compressed to protect the Lighthouse Performance score.

### Card footer — 3 buttons, each opening a `Sheet`

1. **See more** → Sheet shows the full-size product image (or `<video muted playsInline>` with a poster frame for the Staphylococcus Wiper entry), the full `cures` text, and price.
2. **Order** → Sheet with a form (validated via `react-hook-form` + `zod`):
   - Product name (read-only display)
   - Quantity (`Input type="number"`, min 1)
   - Client name (`Input`)
   - On submit: build a `wa.me` link via a shared `lib/whatsapp.ts` helper (`buildWhatsAppLink(phone, message)`), message template: `"Hi, I'd like to order: {product}, Qty: {qty}, Name: {name}"`, open in a new tab, `sonner` toast confirms ("Redirecting to WhatsApp…").
3. **Enquiry** → Sheet with a form:
   - Product name (display)
   - Client name (`Input`)
   - Enquiry (`Textarea`)
   - Same WhatsApp deep-link pattern, message template: `"Hi, I have a question about: {product}. {enquiry} — From {name}"`.

**WhatsApp target number for all Order/Enquiry links: `08074442605`** → formatted as `2348074442605` for the `wa.me` URL.

---

## 6. Contact Us (`/contact-us`)

### Locations
1. **Port Harcourt** — 3A Aggrey Road, opposite UBA Bank, by Lagos Bus Stop, Port Harcourt, Rivers State, Nigeria.
2. **Lagos** — Shop B9, Road 2, Ikota Shopping Complex, VGC, Lekki/Ajah, behind First Bank, Lagos State, Nigeria.

Each as a card with a "Get Directions" link (Google Maps search URL built from the address text) — no embedded map iframe needed, keeps the page lightweight.

### Phone numbers
- 08033591663 (tap-to-call `tel:` link)
- 08035720060 (tap-to-call `tel:` link)

### WhatsApp
Prominent "Chat on WhatsApp" CTA button → `https://wa.me/2348074442605`.

### Email
`info@kambesttrado.com` — **placeholder**, clearly marked as TBD; swap for the real address once the client provides one. Tap-to-email `mailto:` link.

### Social media
Facebook icon/link → the provided story URL: `https://www.facebook.com/story.php?story_fbid=1297654538557189&id=100063774804092`. This points to a specific **story/post**, not the brand's main Page — flag to the client that swapping in the actual Facebook Page URL (e.g. `facebook.com/kambesttradomedical`) would be more durable, since story links can expire or change. No other social handles were provided.

Placement: Footer (site-wide) + this Contact Us page.

### Optional contact form
Name + message fields that compose a WhatsApp message (same pattern as Order/Enquiry) rather than requiring a backend — keeps the whole site frontend-only, no server/API needed.

---

## 7. Cross-Cutting Implementation Notes

- **Routes**: `app/page.tsx`, `app/about-us/page.tsx`, `app/products/page.tsx`, `app/contact-us/page.tsx`.
- **Theme provider**: wrap `app/layout.tsx` (currently unmodified create-next-app boilerplate) with `next-themes`'s `ThemeProvider`; build the toggle button as a small client component.
- **`lib/whatsapp.ts`**: shared `buildWhatsAppLink(phone: string, message: string): string` helper — single source for URL-encoding logic, used by Order sheet, Enquiry sheet, homepage/contact CTA buttons.
- **`lib/products.ts`**: typed product data (see §5).
- **`lib/motion.ts`**: shared `framer-motion` variants.
- **Accessibility**: alt text on every product image, visible focus states, Sheet closes on successful submit, `<Label>` on every form input, `prefers-reduced-motion` respected.
- **Naming convention**: this is Next.js 16+ — if route protection or redirects are ever introduced, the file is named **`proxy.ts`**, not `middleware.ts` (renamed in this version). Not needed for the current scope (no auth), but must be followed if added later.
- Before writing route code, check `node_modules/next/dist/docs/01-app/01-getting-started/18-upgrading.md` and the cache-components guides in `node_modules/next/dist/docs/02-guides/` for any additional breaking-change conventions specific to this Next.js version.

---

## 8. Additional Requirements (SEO, Performance, Polish)

### Sitemap & robots
- `app/sitemap.ts` — list all 4 routes (`/`, `/about-us`, `/products`, `/contact-us`) with `lastModified`, `changeFrequency`, `priority`.
- `app/robots.ts` — allow all crawlers, reference the sitemap.
- Use Next's built-in file conventions — no manual XML files.

### SEO keyword strategy
Seed naturally into headings, meta descriptions, and image alt text (no stuffing):
- **Site-wide/branded**: "KAMBEST tradomedical", "KAMBEST herbal products", "tradomedical center Nigeria"
- **Homepage/local**: "herbal medicine Port Harcourt", "trado medical Lekki Lagos", "natural healing Nigeria"
- **Products page**: "fibroid cure herbal", "sperm booster herbal Nigeria", "hepatitis liver detox herbal", "natural fertility treatment Nigeria", "buy herbal medicine online Nigeria"
- **About Us**: "KAMBEST Health Solutions", "Orji Nkemdilim Moses"
- **Contact Us**: "herbal clinic Port Harcourt", "herbal clinic Lekki Ajah"

### Per-page metadata
Every `page.tsx` exports a unique `metadata` object (title, description, Open Graph image using `/about1.webp` or `/logo.webp`). Root `app/layout.tsx` sets site-wide defaults (title template, description, viewport, theme-color).

### Structured data
`LocalBusiness` JSON-LD on the Contact Us page with two `address` entries (Port Harcourt + Lagos branches) for local search visibility.

### Images & media
- All product/hero images via `next/image` with correct `sizes` and `priority` on the hero image only (below-fold images lazy-load by default).
- Compress/resize real product photos before adding to `public/` once supplied.
- `<video>` for the Staphylococcus Wiper entry: `muted`, `playsInline`, poster frame — never autoplay with sound, never break grid layout.

### Forms
`react-hook-form` + `zod` validation on Order/Enquiry sheets — inline errors on invalid submit, not just a toast.

### Error/loading states
- `app/not-found.tsx` — on-brand 404 (herbal motif, link back home).
- `app/products/loading.tsx` or skeleton components — the product grid is the heaviest page.

### Legal & trust
Footer "Privacy" / "Terms" links (stub pages acceptable initially).

### Analytics
Leave a clearly marked `// TODO: analytics` comment for a future Vercel Analytics/GA snippet — not wired now.

### Lighthouse — target 100 across all four categories

**Performance**
- `next/image` everywhere, correct `sizes`, hero gets `priority`.
- `next/font/google` for Nunito — self-hosted, no external font requests, no layout shift.
- Keep pages as Server Components; mark only interactive leaves (`Sheet` forms, theme toggle, motion wrappers) `"use client"`.
- Keep `framer-motion` scoped to small leaf components, not whole pages.
- No render-blocking third-party scripts, no heavy embeds.
- Pre-compress product images/video before adding to `public/`.

**Accessibility**
- Semantic landmarks (`<nav>`, `<main>`, `<footer>`), one `<h1>` per page.
- Full keyboard reachability with visible focus rings (shadcn defaults cover most of this).
- WCAG AA contrast verified for the new green/gold OKLCH tokens in both themes.
- Descriptive alt text on every image; `<Label>` on every form input.

**Best Practices**
- HTTPS-only asset references, zero console errors, correct image aspect ratios (no CLS), no deprecated APIs.

**SEO**
- Unique `title`/`description` per page, `sitemap.ts` + `robots.ts` present, semantic heading hierarchy, real `<Link>` navigation (crawlable), mobile-friendly viewport (Next default), valid `LocalBusiness` JSON-LD.

**Final verification step**: after implementation, run `next build` followed by a Lighthouse/PageSpeed pass (or `npx unlighthouse`) to confirm the 100 target before shipping.

---

## Open items requiring client input before/near launch
1. Real product photos + the Staphylococcus Wiper video for `public/` (currently only `about1.webp` + `logo.webp` exist).
2. Real business email (placeholder `info@kambesttrado.com` in use).
3. Confirmed Facebook **Page** URL (currently only have a story/post link).
