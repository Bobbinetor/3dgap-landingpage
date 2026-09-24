# 3D GAP — Landing Page

Landing page per **3D GAP**, servizio di stampa 3D su misura per privati,
aziende, piccoli lotti e gadget evento. La pagina è costruita intorno a un
percorso semplice: caricare un file, ricevere un preventivo chiaro e confermare
la stampa.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — token tema, layout responsive, griglia tecnica leggera
- **Motion** (framer-motion v12) — reveal allo scroll, parallax hero, micro-interazioni
- **next/image** — hero umano, texture materiali e mockup prodotto ottimizzati

## Sezioni

Hero umano · Preventivo privati / team sales aziende · Materiali con texture,
pro/contro e usi consigliati · Processo in tre passaggi · Voci di prezzo
trasparenti · Catalogo/progetti · CTA preventivo · Footer.

## Sviluppo

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # build di produzione
pnpm start    # serve la build
```

> **Node 25:** gli script forzano `--no-experimental-webstorage`. Node 25 espone un
> global `localStorage` non inizializzato che fa crashare l'SSR (`localStorage.getItem
> is not a function`); il flag lo disabilita lato server. In browser il `localStorage`
> reale resta disponibile per il tema.

## Personalizzazione

| Cosa | Dove |
|------|------|
| Colori / tema | `app/globals.css` (`@theme` + token `:root` / `.dark`) |
| Materiali del selettore | `components/material-selector.tsx` (`MATERIALS`) |
| Immagini generate | `public/images/generated/` |
| Testi sezioni | `components/sections.tsx`, `components/hero.tsx` |
| Email contatto | `components/sections.tsx` (`mailto:info@3dgap.it`) |

## Accessibilità & performance

Contrasto AA, focus states, `prefers-reduced-motion` rispettato, scena 3D in
lazy-load (`next/dynamic`, fuori dal bundle iniziale), font di sistema senza
dipendenze remote.
