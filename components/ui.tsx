"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

const easeFluid = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeFluid },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/** Scroll-triggered reveal wrapper. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeFluid, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small uppercase eyebrow label with a gold tick. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--fg-muted)] md:text-sm">
      <span className="h-px w-6 bg-[var(--accent)]" aria-hidden />
      {children}
    </span>
  );
}

/** Section heading + optional intro paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl"
      }
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export { motion, easeFluid };
