import type Lenis from "lenis";

let lenis: Lenis | null = null;

/** Offset for fixed navbar (px). */
const NAV_OFFSET = -88;

export function registerLenis(instance: Lenis) {
  lenis = instance;
}

export function unregisterLenis() {
  lenis = null;
}

export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.history.replaceState(null, "", `#${sectionId}`);
}
