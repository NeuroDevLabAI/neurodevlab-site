"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Stagger delay in seconds (use index * 0.06 for grids). */
  delay?: number;
};

/**
 * Scroll-into-view reveal: opacity + a small translateY only (compositor-safe).
 * Animates once, never on scroll-back. Hard reduced-motion gate (WCAG 2.3.3).
 */
export function Reveal({ children, delay = 0, className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("reveal", className)}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{
        duration: reduce ? 0 : 0.48,
        ease: [0.23, 1, 0.32, 1],
        delay: reduce ? 0 : delay,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
