"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";

const LINKS = [
  { href: "#materiali", label: "Materiali" },
  { href: "#processo", label: "Come funziona" },
  { href: "#pricing", label: "Prezzi" },
  { href: "#catalogo", label: "Catalogo" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro"}
      className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[var(--surface-border)] text-[var(--fg)] transition-colors duration-200 hover:bg-[var(--accent)]/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 40, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="3D GAP — home">
      <span className="relative grid h-9 w-9 place-items-center">
        <svg viewBox="0 0 40 40" className="h-9 w-9">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent-soft)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <path d="M20 3 34 11v18L20 37 6 29V11z" fill="none" stroke="url(#lg)" strokeWidth="1.6" />
          <path d="M20 3v34M6 11l14 8 14-8M20 19v18" fill="none" stroke="url(#lg)" strokeWidth="1.1" opacity="0.55" />
        </svg>
      </span>
      <span className="text-lg font-semibold">
        3D<span className="text-accent-gradient">GAP</span>
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${
          scrolled ? "glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)]" : "border-transparent"
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-base text-[var(--fg-muted)] transition-colors duration-200 hover:text-[var(--fg)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/preventivo"
            className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-[var(--cta)] px-4 py-2.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--cta-strong)] sm:inline-flex"
          >
            Accedi al preventivo
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[var(--surface-border)] md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <motion.span animate={open ? { rotate: 45, y: 5 } : {}} className="block h-px w-5 bg-current" />
              <motion.span animate={open ? { opacity: 0 } : {}} className="block h-px w-5 bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -5 } : {}} className="block h-px w-5 bg-current" />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass absolute inset-x-4 top-[72px] z-50 rounded-2xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-lg text-[var(--fg-muted)] transition-colors hover:bg-[var(--accent)]/10 hover:text-[var(--fg)]"
                >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="mt-1 px-1">
                <a
                  href="/preventivo"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-[var(--cta)] px-4 py-3 text-center text-lg font-semibold text-white"
                >
                  Accedi al preventivo
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
