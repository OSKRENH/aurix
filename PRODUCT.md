# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Static HTML, CSS and vanilla JS (`index.html`, `app.js`), no framework. Built into `dist-site` by `scripts/build-cloudflare.mjs` and `scripts/build-maps.mjs` (sharp, jszip, pdf-lib) and served by a Cloudflare Worker with static assets (`wrangler.jsonc`, `worker.js`). Deploy: `npm run deploy`.

## Users
Inferred, not confirmed: people outside the design team who must use the AURIX brand correctly day to day — marketers, presentation and print contractors, sales, partners and agencies. They arrive with a task ("get the logo", "which colour", "which font", "show me the project cover") and leave with a file or a value copied.

## Product Purpose
A web brand guide for AURIX (a residential real-estate developer, aurix-development.ru). It states the identity rules (logo, palette, typography) and hands out the working materials: logo archives, fonts, city maps, links to project renders. Success is a correct asset in hand within seconds and no off-brand improvisation afterwards.

## Positioning
The guide is the single source of truth for the brand's assets and its rules, in Russian, with the assets downloadable from the same page that explains them.

## Operating Context
- Content language is Russian; uppercase Guild A Display for headings is part of the voice.
- Assets are produced by the build: logo ZIPs (SVG, PNG, PDF) per version and colour, font ZIP, map files per city in light and dark.
- Project renders are too heavy for the site (originals up to 130 MB) and live in a shared Yandex Disk folder; the site shows optimised covers and links to the folders.
- Deploys are manual (`npm run deploy`); the live site is on workers.dev.
- A sibling guide for another company (РСК, rsk.ivankamaldinov.workers.dev) is built by the same author, and interaction patterns such as the descriptor switch are deliberately shared between them.

## Capabilities and Constraints
- Sections in order: logo, colours, typography, projects, maps, files (materials). Numbering is 01–06 and the files section stays last.
- Logo: two versions of colour only (deep purple, white); the lockup has a switchable descriptor; the symbol can be used on its own.
- Copy-to-clipboard on colour values; per-card downloads.
- Performance matters: the page was reported janky once, so scroll effects stay limited to opacity and transform and stay off the main thread.
- Reduced motion and no-JS must leave all content visible.
- Open (undecided): status labels on projects ("В продаже", "Скоро") are copied from the company site and will go stale; Moscow as the city for two projects without a company-site entry was an inference.

## Brand Commitments
- Only two typefaces: Guild A Display (accent) and TT Hoves Pro (text), Regular only; enforced by CI.
- Palette: #1F0048 deep purple, #A7A4DF lilac, #E9E9F5 mist, plus white. Text is deep purple or white depending on the ground.
- Tagline "Discover Stars"; the symbol is an angular Λ with a swoosh.
- Logo packs are limited to purple and white.

## Evidence on Hand
- Logo, wordmark and symbol SVGs in `assets/logos`.
- Project covers in `assets/projects` (Омега, Мариинка Делюкс, Малая Полянка 3, Большая Ордынка 25, Земледельческий 15), cut from renders in the shared Yandex Disk.
- Short project descriptions exist only for Омега and Мариинка Делюкс (taken verbatim from the company site). The others have none and must not be invented.
- No testimonials, customers or sales figures; do not fabricate any.

## Product Principles
1. The asset first: every card ends in a working download or copy action.
2. Rules and tools live together: the guide shows how the brand is used on the same screen as the file.
3. Restraint over ornament: one authored motion at a time, nothing that costs scroll smoothness.
4. Never invent brand facts: project data, statuses and descriptions come from the company or stay blank.
5. Degrade safely: without JS or with reduced motion everything is visible and downloadable.

## Accessibility & Inclusion
No product-specific standard was stated. Working baseline: contrast at least 4.5:1 for body text, a visible keyboard focus ring, `prefers-reduced-motion` honoured, readable Russian typography on phones.
