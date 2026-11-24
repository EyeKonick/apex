/**
 * Site motion: inertia scrolling, smooth in-page links, scroll reveals, hero parallax
 * and magnetic buttons. CSS owns the actual animations (tokens and keyframes in
 * src/styles/global.css); this script only adds classes and positions.
 *
 * Everything is skipped when the visitor prefers reduced motion, and the fail-safe in
 * BaseLayout shows all content if this script never runs.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Lerp factor per frame for pointer-following motion (no overshoot). */
const SPRING = 0.16;

document.documentElement.classList.add('motion-ready');

/* ------------------------------------------------------------ smooth scrolling */
export const lenis: Lenis | null = reduceMotion ? null : new Lenis({ autoRaf: true, lerp: 0.1 });

export function scrollToTarget(target: number | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { duration: 1.2 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

/** Same-page anchor links (e.g. "Get a Free Quote") glide with Lenis and move focus. */
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!el) return;
  event.preventDefault();
  scrollToTarget(el);
  history.replaceState(null, '', url.hash);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
});

/* ------------------------------------------------------------ one shared scroll loop */
type ScrollCb = (y: number) => void;
const subscribers = new Set<ScrollCb>();
let ticking = false;
const schedule = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = window.scrollY;
    subscribers.forEach((cb) => cb(y));
  });
};
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });

/** Subscribe to the shared rAF-batched scroll loop; runs once immediately. */
export function onScroll(cb: ScrollCb) {
  subscribers.add(cb);
  cb(window.scrollY);
}

/* ------------------------------------------------------------ scroll reveals */
// [data-reveal] gets .is-in the first time it enters the viewport; CSS keyframes do the rest.
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  reveals.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------ hero parallax */
// The collage drifts at 12% of scroll speed on desktop, and stops once the hero is gone.
const hero = document.querySelector<HTMLElement>('[data-hero]');
const collage = hero?.querySelector<HTMLElement>('[data-parallax]');
if (!reduceMotion && hero && collage) {
  const desktop = window.matchMedia('(min-width: 901px)');
  onScroll((y) => {
    if (!desktop.matches) {
      collage.style.translate = '';
      return;
    }
    if (y > hero.offsetHeight) return;
    collage.style.translate = `0 ${(y * 0.12).toFixed(1)}px`;
  });
}

/* ------------------------------------------------------------ magnetic buttons */
// [data-magnetic] leans gently toward the pointer; the rAF loop runs only while moving.
if (!reduceMotion && finePointer) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * SPRING;
      y += (ty - y) * SPRING;
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : 0;
      if (!raf && tx === 0 && ty === 0) el.style.translate = '';
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * 0.2;
      ty = (e.clientY - (r.top + r.height / 2)) * 0.3;
      kick();
    });
    el.addEventListener('pointerleave', () => {
      tx = 0;
      ty = 0;
      kick();
    });
  });
}
