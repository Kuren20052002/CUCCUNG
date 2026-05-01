"use client";

import { useEffect, useRef } from "react";

/**
 * Lazy-loads Google Analytics after the first user interaction (scroll, click, touch)
 * or after 5s idle timeout — whichever comes first.
 *
 * This prevents GA's 152KB script from competing with LCP resources on mobile 4G,
 * saving ~300ms of main-thread work during initial page load.
 */
export function LazyGA({ gaId }: { gaId: string }) {
  const loaded = useRef(false);

  useEffect(() => {
    const events = ["scroll", "click", "touchstart", "keydown"] as const;

    function loadGA() {
      if (loaded.current) return;
      loaded.current = true;

      // Remove listeners once loaded
      events.forEach((e) => window.removeEventListener(e, loadGA));

      // Initialize dataLayer and gtag BEFORE loading the script.
      // gtag.js reads from dataLayer immediately on execution,
      // so it must already exist when the script loads.
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", gaId);

      // Now inject the gtag.js script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);
    }

    events.forEach((e) => window.addEventListener(e, loadGA, { once: true, passive: true }));

    // Fallback: load after 5s if no interaction
    const timer = setTimeout(loadGA, 5000);

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, loadGA));
    };
  }, [gaId]);

  return null;
}
