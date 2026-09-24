import type { Metadata } from "next";
import QuoteConfigurator from "@/components/quote-configurator";

export const metadata: Metadata = {
  title: "Preventivo mock — 3D GAP",
  description:
    "Mockup serio del configuratore preventivo 3D GAP con flussi foto, testo e file STL.",
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-soft)] px-4 py-5 text-[var(--fg)] md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elev)] px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-xl font-semibold" aria-label="Torna alla home 3D GAP">
            3D<span className="text-accent-gradient">GAP</span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--bg-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--fg-muted)]">
              Ambiente mock
            </span>
            <a
              href="/"
              className="inline-flex cursor-pointer rounded-full border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-[var(--fg)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Torna alla landing
            </a>
          </div>
        </header>

        <section className="py-6 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fg-faint)]">
              Preventivo guidato
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.04] text-[var(--fg)] md:text-6xl">
              Parti da una scelta semplice.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl">
              Scegli uno dei due percorsi. Dopo il click il preventivo procede passo dopo passo.
            </p>
          </div>
        </section>

        <QuoteConfigurator />
      </div>
    </main>
  );
}
