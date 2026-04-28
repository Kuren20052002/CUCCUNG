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
    function loadGA() {
      if (loaded.current) return;
      loaded.current = true;

      // Remove listeners once loaded
      events.forEach((e) => window.removeEventListener(e, loadGA));

      // Inject gtag script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        gtag("js", new Date());
        gtag("config", gaId);
      };
    }

    const events = ["scroll", "click", "touchstart", "keydown"] as const;
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
