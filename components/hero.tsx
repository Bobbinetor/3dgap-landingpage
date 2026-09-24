"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
import { useRef } from "react";

const easeFluid = [0.22, 1, 0.36, 1] as const;
const headline = "Stampa in 3D il tuo oggetto, come lo immagini.";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function TypewriterHeadline({ text }: { text: string }) {
  let charIndex = 0;

  return (
    <span aria-label={text} className="block">
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex, words) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const index = charIndex++;
              return (
                <span
                  key={`${char}-${index}`}
                  className="typewriter-char inline-block"
                  style={{ animationDelay: `${320 + index * 34}ms` }}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span
                className="typewriter-char inline-block w-[0.34em]"
                style={{ animationDelay: `${320 + charIndex++ * 34}ms` }}
              >
                &nbsp;
              </span>
            )}
          </span>
        ))}
        <span className="typewriter-caret ml-1 inline-block h-[0.86em] w-[0.08em] translate-y-[0.1em] bg-[var(--cta)]" />
      </span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[94svh] items-center overflow-hidden px-5 pb-14 pt-28 md:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-20 hidden h-[38rem] w-[38rem] opacity-70 blur-[120px] sm:block"
        style={{ background: "radial-gradient(circle, var(--hero-glow), transparent 62%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(#000, transparent 92%)",
          WebkitMaskImage: "linear-gradient(#000, transparent 92%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl min-w-0 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          style={{ opacity: fade }}
          className="flex w-full min-w-0 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeFluid, delay: 0.15 }}
            className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--fg-muted)] backdrop-blur-md md:text-base"
          >
            Preventivo semplice · Stampa 3D su misura
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeFluid, delay: 0.25 }}
            className="mt-6 max-w-3xl font-mono text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl"
          >
            <TypewriterHeadline text={headline} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeFluid, delay: 0.38 }}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl"
          >
            Carica un file, scegli materiale e quantità, ricevi un preventivo chiaro. Per gadget aziendali, eventi e piccoli lotti puoi parlare con il team prima di stampare.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: easeFluid, delay: 0.5 }}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <a
              href="/preventivo"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--cta)] px-7 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[var(--cta-strong)]"
            >
              Accedi al preventivo
              <ArrowIcon />
            </a>
            <a
              href="mailto:info@3dgap.it?subject=Richiesta%20team%20sales%203D%20GAP"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-7 py-4 text-lg font-semibold text-[var(--fg)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Parla con il team sales
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-8 hidden max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base text-[var(--fg-muted)] sm:flex lg:justify-start"
          >
            {["File STL/STEP", "Materiale consigliato", "Privati e aziende"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.figure
          style={{ y: imageY }}
          className="relative mx-auto -mt-2 min-h-[340px] w-full max-w-[38rem] sm:mt-0 sm:min-h-[520px] lg:min-h-[680px]"
        >
          <div className="absolute inset-x-2 bottom-0 h-[76%] rounded-[2rem] bg-[linear-gradient(180deg,#e0f2fe,#ffffff)] shadow-[0_28px_80px_-48px_rgba(3,105,161,0.55)]" />
          <div className="absolute inset-x-10 bottom-0 h-[58%] rounded-t-[999px] bg-[var(--accent)]/10 blur-3xl" />
          <Image
             src={`${basePath}/images/generated/hero-person.png`}
            alt="Persona che mostra un vaso stampato in 3D"
            width={1024}
            height={1536}
            priority
            className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto object-contain object-bottom"
            sizes="(min-width: 1024px) 42vw, 92vw"
          />
        </motion.figure>
      </div>
    </section>
  );
}
