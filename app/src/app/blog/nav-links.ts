// app/src/app/blog-evolve/r2/b/nav-links.ts
//
// Plain data, deliberately its own module rather than exported from `site-header.tsx`. That file
// carries "use client", and a Server Component importing a named export from a client module gets a
// client-reference placeholder for it instead of the real value — a `.map is not a function` at
// prerender, since `site-footer.tsx` (a Server Component) also needs this list.
export const NAV_LINKS = [
  { label: "Reports", href: "#report-index", current: true },
  { label: "Methodology", href: "#methodology" },
  { label: "Datasets", href: "#datasets" },
  { label: "About", href: "#about" },
];
