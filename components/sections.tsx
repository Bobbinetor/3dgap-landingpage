"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Reveal, SectionHeading } from "./ui";
import MaterialSelector from "./material-selector";

const quoteItems = [
  {
    title: "Preventivo per privati",
    text: "Carichi un file STL, STEP o una descrizione del pezzo. Ti rispondiamo con materiale consigliato, tempi e prezzo finale prima della stampa.",
    example: "Esempio: supporto da scrivania 12 cm, PLA nero, 1 pezzo. Il prezzo viene calcolato nel preventivo.",
    bullets: ["1 pezzo o piccole serie", "scelta colore e materiale", "supporto se il file va sistemato"],
    cta: "Accedi al preventivo",
    href: "/preventivo",
  },
  {
    title: "Team sales per aziende",
    text: "Per gadget, eventi, espositori e lotti personalizzati ti aiutiamo a definire formato, finitura, quantità e packaging.",
    example: "Esempio: 100 gadget brandizzati per evento, 2 colori, campione prima della serie. Il team prepara una proposta dedicata.",
    bullets: ["esempio: 100 gadget brandizzati", "colori e dimensioni su misura", "campione prima della serie"],
    cta: "Contatta il team sales",
    href: "mailto:info@3dgap.it?subject=Richiesta%20gadget%20aziendali%203D%20GAP",
  },
];

const processSteps = [
  {
    n: "01",
    title: "Carichi il file o scrivi al team",
    text: "Invii STL, STEP, OBJ, un logo o anche solo una descrizione dell'oggetto che vuoi realizzare.",
  },
  {
    n: "02",
    title: "Ricevi un preventivo chiaro",
    text: "Ti indichiamo materiale, quantità, tempi, finitura e tutte le voci che compongono il prezzo.",
  },
  {
    n: "03",
    title: "Confermi e stampiamo",
    text: "Dopo la conferma prepariamo il file, stampiamo, controlliamo il pezzo e lo consegniamo o spediamo.",
  },
];

const pricingRows = [
  {
    label: "Materiale",
    value: "filamento o resina usata",
    detail: "La voce cambia in base a materiale, colore, peso e scarto tecnico.",
  },
  {
    label: "Tempo macchina",
    value: "ore di stampa",
    detail: "Il preventivo mostra quanto incide il tempo di produzione del pezzo.",
  },
  {
    label: "Preparazione file",
    value: "controllo, setup, supporti",
    detail: "Inclusa quando il file richiede orientamento, riparazione o supporti complessi.",
  },
  {
    label: "Finitura e consegna",
    value: "post-processing e spedizione",
    detail: "Le finiture extra e la spedizione sono separate, così sai cosa stai pagando.",
  },
];

const catalogItems = [
  {
    title: "Gadget con logo",
    text: "Portachiavi, token, stand piccoli e oggetti evento configurabili per quantità, colore e dimensione.",
    meta: "Ideale per fiere e regali aziendali",
    image: "/images/generated/product-keychain.jpg",
    alt: "Portachiavi blu stampati in 3D",
    options: ["quantità", "colore", "diametro"],
  },
  {
    title: "Supporti e organizer",
    text: "Stand da scrivania, supporti tech e accessori funzionali modificabili in larghezza, altezza e inclinazione.",
    meta: "Per ufficio, casa e setup tech",
    image: "/images/generated/product-phone-stand.jpg",
    alt: "Supporto smartphone nero stampato in 3D",
    options: ["dimensioni", "angolo", "materiale"],
  },
  {
    title: "Espositori da banco",
    text: "Supporti per menù, QR code, prodotti retail o materiale promozionale in formato personalizzato.",
    meta: "Per negozi, ristoranti e showroom",
    image: "/images/generated/product-display-stand.jpg",
    alt: "Espositore bianco da banco stampato in 3D",
    options: ["base", "altezza", "colore"],
  },
  {
    title: "Pezzi su file",
    text: "Stampe singole o piccole serie partendo dal tuo modello 3D, con controllo file prima della produzione.",
    meta: "Per privati, maker e studenti",
    image: "/images/generated/product-architecture.jpg",
    alt: "Modello architettonico grigio stampato in 3D",
    options: ["scala", "materiale", "pezzi"],
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function QuotePaths() {
  return (
    <section id="preventivo-rapido" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
      <SectionHeading
        eyebrow="Due modi per partire"
        title={<>Preventivo semplice per privati, supporto dedicato per aziende.</>}
        intro="Scegli il percorso più adatto: carica un file per una stampa singola o parla con il team per gadget, eventi e piccoli lotti personalizzati."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {quoteItems.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <article className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elev)] p-7 shadow-sm md:p-8">
              <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-[var(--surface-border)]" aria-hidden />
              </div>
              <h2 className="mt-6 text-3xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--fg-muted)]">{item.text}</p>
              <div className="mt-6 rounded-xl bg-[var(--bg-soft)] p-5 text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">
                <span className="font-semibold text-[var(--fg)]">Esempio pratico: </span>
                {item.example}
              </div>
              <ul className="mt-6 space-y-3 text-base text-[var(--fg-muted)] md:text-lg">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 text-[var(--accent)]"><CheckIcon /></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <a
                href={item.href}
                className={`mt-8 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition-colors duration-200 ${
                  i === 0
                    ? "bg-[var(--cta)] hover:bg-[var(--cta-strong)]"
                    : "bg-[var(--fg)] hover:bg-[var(--accent)]"
                }`}
              >
                {item.cta}
                <ArrowIcon />
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px" });

  return (
    <div ref={ref} className="relative mt-14">
      <svg
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-[7%] right-[7%] top-1 hidden h-28 w-[86%] md:block"
        aria-hidden
      >
        <path
          d="M 20 62 C 140 18 180 106 300 62 C 420 18 460 106 580 62"
          fill="none"
          stroke="var(--surface-border)"
          strokeWidth="3"
        />
        <motion.path
          d="M 20 62 C 140 18 180 106 300 62 C 420 18 460 106 580 62"
          fill="none"
          stroke="var(--cta)"
          strokeLinecap="round"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="absolute bottom-0 left-6 top-0 w-px bg-[var(--surface-border)] md:hidden" aria-hidden>
        <motion.span
          className="block h-full origin-top bg-[var(--cta)]"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {processSteps.map((step, i) => (
          <motion.article
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: 0.18 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-16 md:pl-0 md:pt-28"
          >
            <span className="absolute left-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--bg-elev)] text-base font-semibold text-[var(--cta)] shadow-sm md:left-1/2 md:-translate-x-1/2">
              {step.n}
            </span>
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">{step.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--fg-muted)]">{step.text}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export function Materials() {
  return (
    <section id="materiali" className="relative scroll-mt-24 border-y border-[var(--surface-border)] bg-[var(--bg-soft)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Materiali"
          title={<>Scegli in base all'uso, non solo al colore.</>}
          intro="Ogni materiale ha una resa diversa: alcuni sono belli da vedere, altri resistono meglio al sole, al calore o all'uso quotidiano."
        />
        <Reveal delay={0.1} className="mt-10">
          <MaterialSelector />
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="processo" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
      <SectionHeading
        eyebrow="Come funziona"
        title="Tre passaggi, senza burocrazia."
        intro="Anche se non hai mai ordinato una stampa 3D, il percorso resta lineare: invio, preventivo, conferma."
      />

      <ProcessTimeline />
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-y border-[var(--surface-border)] bg-[var(--bg-soft)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Prezzi trasparenti"
            title="Nel preventivo vedi le voci di spesa."
            intro="Ogni proposta separa le voci principali, così sai cosa incide sul prezzo prima di confermare l'ordine."
          />

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elev)] shadow-sm">
              {pricingRows.map((row) => (
                <div key={row.label} className="grid gap-2 border-b border-[var(--surface-border)] p-5 last:border-b-0 sm:grid-cols-[0.8fr_1fr] sm:gap-6">
                  <div>
                    <div className="font-semibold text-[var(--fg)]">{row.label}</div>
                    <div className="mt-1 text-base text-[var(--accent)]">{row.value}</div>
                  </div>
                  <p className="text-base leading-relaxed text-[var(--fg-muted)] md:text-lg">{row.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Catalog() {
  return (
    <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Catalogo e progetti"
          title="Oggetti già configurabili e lavori su misura."
          intro="Una base di prodotti pronti da personalizzare per dimensioni, quantità e colore, oltre ai lavori realizzati partendo dal file del cliente."
        />
        <Reveal delay={0.12}>
          <a
            href="mailto:info@3dgap.it?subject=Richiesta%20catalogo%203D%20GAP"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--surface-border)] px-5 py-3 text-base font-semibold text-[var(--fg)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Richiedi catalogo
            <ArrowIcon />
          </a>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalogItems.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elev)] shadow-sm">
              <div className="relative aspect-square border-b border-[var(--surface-border)] bg-[var(--bg-soft)]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{item.meta}</span>
                <h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-3 flex-1 text-base leading-relaxed text-[var(--fg-muted)]">{item.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.options.map((option) => (
                    <span key={option} className="rounded-full bg-[var(--bg-soft)] px-3 py-1.5 text-sm font-medium text-[var(--fg-muted)]">
                      {option}
                    </span>
                  ))}
                </div>
                <a
                  href="mailto:info@3dgap.it?subject=Richiesta%20prodotto%20catalogo%203D%20GAP"
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[var(--accent)] transition-colors duration-200 hover:text-[var(--fg)]"
                >
                  Configura richiesta
                  <ArrowIcon />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="preventivo" className="relative scroll-mt-24 border-t border-[var(--surface-border)] bg-[var(--bg-soft)] px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
        <SectionHeading
          eyebrow="Preventivo"
          title="Apri il configuratore e simula il tuo ordine."
          intro="La simulazione vive in una pagina dedicata: scegli se partire da foto, testo o file STL, attendi l'analisi mock e modifica dimensioni, materiale e quantita."
        />
        <Reveal delay={0.16}>
          <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--bg-elev)] p-6 shadow-sm md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">Configuratore mock</div>
            <div className="mt-4 text-3xl font-semibold leading-tight text-[var(--fg)]">Due flussi, un preventivo modificabile.</div>
            <p className="mt-4 text-lg leading-relaxed text-[var(--fg-muted)]">
              In questa fase e' una simulazione seria. In produzione sara collegata a upload file, Meshy e salvataggio richiesta.
            </p>
            <a
              href="/preventivo"
              className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--cta)] px-7 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-[var(--cta-strong)]"
            >
              Accedi al preventivo
              <ArrowIcon />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--surface-border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xl font-semibold">
            3D<span className="text-accent-gradient">GAP</span>
          </div>
          <p className="mt-2 max-w-sm text-base text-[var(--fg-muted)]">
            Stampa 3D su misura per privati, aziende e piccoli lotti personalizzati.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-base text-[var(--fg-muted)]">
          {[
            ["Materiali", "#materiali"],
            ["Come funziona", "#processo"],
            ["Prezzi", "#pricing"],
            ["Catalogo", "#catalogo"],
            ["Preventivo", "/preventivo"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-[var(--fg)]">
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-[var(--surface-border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-sm text-[var(--fg-faint)] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} 3D GAP — Direzione Generazione S.r.l.</span>
          <span>Dal file al pezzo finito, senza complicazioni.</span>
        </div>
      </div>
    </footer>
  );
}
