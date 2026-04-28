"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-load Sonner's Toaster — it's only needed when a toast fires,
 * not on initial render. This removes ~12KB from the critical JS bundle.
 */
const Toaster = dynamic(
  () => import("sonner").then((mod) => ({ default: mod.Toaster })),
  { ssr: false }
);

export function LazyToaster() {
  return <Toaster position="top-right" duration={3500} richColors closeButton />;
}
