"use client";

/**
 * Lightweight CSS-only scroll progress bar.
 * Replaces framer-motion dependency (saves ~30KB from article page bundle).
 */
import { useEffect, useRef } from 'react';

export function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initialize

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-1 bg-pink-500 origin-left z-[60]"
      style={{ transform: 'scaleX(0)', willChange: 'transform' }}
    />
  );
}

export default ProgressBar;
