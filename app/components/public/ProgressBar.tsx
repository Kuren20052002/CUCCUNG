"use client";

import { motion, useScroll } from 'framer-motion';

export function ProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 bg-pink-500 origin-left z-[60]"
    />
  );
}

export default ProgressBar;
