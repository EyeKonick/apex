---
version: 1
slug: "home"
primary_target: "src/pages/index.astro"
related_targets: ["src/components/Header.astro", "src/components/Hero.astro", "src/components/Services.astro", "src/components/About.astro", "src/components/Contact.astro", "src/components/Footer.astro", "src/styles/global.css"]
---

# Surface: home page (Bold Poster)

Mode: Persuade. Single-page site, Astro static build.
Audience: homeowners and small businesses in San Pedro City / Calabarzon. Action: "Get a Free Quote" (scrolls to #contact). Secondary: call 0906 239 4726, email ApexIntegratedTS@gmail.com, Facebook (placeholder URL in src/data/site.json).
Constraints: logo file used untouched; navy / electric blue / white only; placeholder photos listed with credits in src/data/photos.json; no invented stats, awards, clients or testimonials.

## Direction contract

THESIS: One local team covers all seven trades. Refuses the stock-hero, three-icon-card template.
OWN-WORLD: Logo navy (#030c1e) ground, electric blue as the single signal, white as ink. Condensed poster type (Big Shoulders Display 900) over a duotone photo collage; Archivo (variable width) for body and labels.
FIRST VIEWPORT: Oversized WE BUILD / WE REFURBISH / WE MAINTAIN over a six-photo duotone collage of the trades; white "Get a Free Quote" plate on a blue tagline strip with phone and email. Chosen from the hero bake-off (Bold Poster), which has since been removed.
TONE (owner feedback 2026-11-25, "too bold"): poster type reduced across the page. Hero headline max 9.5rem at weight 800; section headings share one .display size (max 4.4rem). Body sections use greyscale photos, navy surfaces and blue only as accent.
BODY: Services as a 4-column photo grid with a wide lead tile (2 rows, no orphan; 2 cols under 1100px, 1 under 640px), photos greyscale until hover. About on a white sheet beside a greyscale photo. Contact: white call plate plus navy email/Facebook rows. Plain footer.
MOTION (owner request 2026-11-25, modelled on the Architecture-Web-Demo project): Lenis inertia scrolling; headline lines rise on load, then the quote bar; collage parallax at 12% on desktop; section headings slide up line by line, copy and tiles rise with an 80ms stagger, and images wipe up. Hovers: underline draw, left-to-right fill sweep, tile lift with the photo coming into colour, magnetic chat launcher. The chat panel scales open from its corner, with a typing indicator and staggered chips. Tokens --dur-*/--spring-* live in global.css. Everything is off under prefers-reduced-motion, with a .js/.motion-ready fail-safe.
