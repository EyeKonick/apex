# APEX Integrated Technical Services: website

One-page static site for APEX Integrated Technical Services (San Pedro City, Laguna), built with [Astro](https://astro.build). No UI framework. A small amount of client-side JavaScript (about 8 KB gzipped) runs smooth scrolling, scroll reveals and the chat assistant. All motion switches off under `prefers-reduced-motion`.

## Run locally

Requires Node.js 22.23.4 or newer (Astro 7).

```sh
npm install
npm run dev       # http://localhost:4321, reloads on save
npm run build     # static site in dist/
npm run preview   # serve the built dist/ locally
```

## Editing content

Text and links live in `src/data/`, so you shouldn't need to touch the components to change content.

| File | What it holds |
|---|---|
| `src/data/site.json` | Business name, tagline, hero headline lines, phone, email, Facebook URL, service area, SEO title and description, section headings and copy, and the site's live URL |
| `src/data/services.json` | The seven services: `title`, `shortTitle` (used in the hero strip), `description`, `icon` |
| `src/data/photos.json` | Every photo: `file`, `alt`, `placeholder` flag and credit |

**Before launch:**

1. **Facebook:** set `facebook.url` in `site.json` to the real page and set `"placeholder": false`. The link then also appears in the schema.org `sameAs`.
2. **Domain:** set `url` in `site.json` to the real domain and set `"urlIsPlaceholder": false`. Canonical, Open Graph and JSON-LD URLs are built from it, so Facebook previews need it to be correct.

## Motion

- **Smooth scrolling:** [Lenis](https://github.com/darkroomengineering/lenis) gives inertia scrolling, and in-page links such as "Get a Free Quote" glide to their section (`src/scripts/motion.ts`).
- **Scroll reveals:** add `data-reveal` to an element to fade it up when it enters the screen, `data-reveal="lines"` to a heading built from `.ln` lines to slide each line up, or `data-reveal="mask"` to an image frame to wipe the image in. `style="--i:2"` staggers an element after its siblings.
- **Hover:** `.u-line` draws an underline, `.sweep` fills a button from the left (colour via `--sweep`), and `data-magnetic` makes a button lean toward the pointer.
- **Hero:** the headline lines rise in, the quote bar follows, and the photo collage drifts slightly slower than the page on desktop.
- Timing and easing tokens (`--dur-*`, `--spring-*`) are at the top of `src/styles/global.css`.
- With reduced motion, Lenis is off and everything shows immediately. If the script fails to load, a fail-safe in `BaseLayout.astro` shows all content after 2.5 seconds.

## Chat assistant

The "Ask us" button opens a simple FAQ chat (`src/components/ChatBot.astro`). It runs entirely in the visitor's browser: no server, API key or running cost, and it sends no messages anywhere. It answers only from `src/data/`, so it never makes up prices or hours.

Edit its answers in `src/data/chatbot.json`:

- `intents`: each has `keywords` (English, Tagalog or Taglish words or phrases to look for), an `answer`, and a `weight` (higher wins when several match).
- In answers, `{phone}`, `{email}` and `{serviceList}` are filled in from `site.json` and `services.json`. `[[quote]]`, `[[tel]]`, `[[email]]` and `[[facebook]]` add action buttons.
- `serviceKeywords`: the words that point to each service (keyed by the service `id`). The service answer itself comes from `services.json`.
- Questions about price or quotes that name a service ("magkano ang aircon cleaning?") get the price or quote answer, prefixed with the service name.

Anything it can't match gets the `fallback` answer, with call, email and Facebook buttons.

## Photos

All photos are placeholders from Unsplash, stored locally in `src/assets/images/placeholders/` and credited in `photos.json`. Astro converts them to responsive WebP at build time. Hero photos and the logo load eagerly; everything below the hero lazy-loads.

To use real photos, either:

- replace a file in `src/assets/images/placeholders/` with one of the same name, or
- add the photo anywhere under `src/assets/images/` and point the `file` entry in `photos.json` at it (the path is relative to `src/assets/images/`). Then set `"placeholder": false` and remove `credit`.

Each service's photo is under `services` in `photos.json`, keyed by the service's `id` in `services.json`.

The hero collage takes the first six `hero` photos in order. The first and fourth span both rows, and the fourth is hidden on screens narrower than 980px.

The logo (`src/assets/images/logo.png`) is a transparent PNG for dark backgrounds, made at the owner's request from the light version on the brand sheet (`images/789679891_…png`, top left). The white background was removed, the navy and black parts were inverted to white and light grey, and the electric blue was kept. At the owner's request it is cropped to the A mark and the AP3X wordmark (no INTT TECCHH SERV or REFURBISHING SERVICES lines). Same artwork and spelling. Search engines get a copy flattened onto navy, and the favicon is on a navy square. If a designer supplies an original transparent PNG or SVG for dark backgrounds, replace this file.

## Project structure

```
public/            favicon.svg, robots.txt, og.jpg (served as-is)
src/
  assets/images/   logo.png, placeholders/ (optimised by astro:assets)
  components/      Header, Hero, Services, About, Contact, Footer, ChatBot
  data/            site.json, services.json, photos.json, chatbot.json
  layouts/         BaseLayout.astro (head, SEO, JSON-LD, icon sprite, global styles)
  lib/photos.ts    resolves photos.json entries to image files
  pages/           index.astro (composes the components)
  scripts/         motion.ts (smooth scroll, reveals, parallax, magnetic buttons)
  styles/          global.css (design tokens, resets, shared styles)
```

## Deploy

All three hosts work with the defaults: build command `npm run build`, output directory `dist`.

- **Netlify:** Add new site → Import from Git → pick the repo. Netlify detects Astro. Or drag the `dist/` folder onto app.netlify.com/drop.
- **Vercel:** New Project → import the repo. The Astro preset is detected automatically.
- **Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git. Framework preset: Astro. Build command `npm run build`, output `dist`.

After the first deploy, put the live URL into `site.json` → `url`, redeploy, then check the share preview with Facebook's Sharing Debugger (developers.facebook.com/tools/debug).
