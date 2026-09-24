"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

type Material = {
  id: string;
  name: string;
  tech: "FDM" | "Resina";
  image: string;
  claim: string;
  use: string;
  details: string[];
};

const MATERIALS: Material[] = [
  {
    id: "pla",
    name: "PLA",
    tech: "FDM",
    image: "/images/generated/texture-pla.jpg",
    claim: "Estetico e conveniente",
    use: "Gadget, prototipi estetici, pezzi da interno.",
    details: ["Molti colori", "Buona resa visiva", "Calore basso: 55-60 C"],
  },
  {
    id: "petg",
    name: "PETG",
    tech: "FDM",
    image: "/images/generated/texture-petg.jpg",
    claim: "Resistente nell'uso",
    use: "Supporti, contenitori e parti funzionali.",
    details: ["Piu tenace del PLA", "Buona umidita", "Calore: 75-85 C"],
  },
  {
    id: "asa",
    name: "ASA",
    tech: "FDM",
    image: "/images/generated/texture-asa.jpg",
    claim: "Pensato per esterno",
    use: "Insegne, staffe e parti esposte a sole.",
    details: ["Stabile ai raggi UV", "Finitura tecnica", "Calore: 90-100 C"],
  },
  {
    id: "resina",
    name: "Resina",
    tech: "Resina",
    image: "/images/generated/texture-resin.jpg",
    claim: "Dettaglio molto alto",
    use: "Miniature, modelli piccoli, superfici pulite.",
    details: ["Superfici lisce", "Volumi ridotti", "Post-processing incluso"],
  },
  {
    id: "carbonio",
    name: "Carbonio",
    tech: "FDM",
    image: "/images/generated/texture-carbon.jpg",
    claim: "Tecnico e rigido",
    use: "Componenti meccanici e parti strutturali.",
    details: ["Alta rigidita", "Finitura opaca", "Costo superiore"],
  },
];

function classNames(...items: Array<string | false>) {
  return items.filter(Boolean).join(" ");
}

export default function MaterialSelector() {
  const [active, setActive] = useState("pla");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--bg-elev)] p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:h-[25rem] md:flex-row">
          {MATERIALS.map((material) => {
            const selected = active === material.id;

            return (
              <motion.button
                key={material.id}
                type="button"
                aria-pressed={selected}
                onMouseEnter={() => setActive(material.id)}
                onFocus={() => setActive(material.id)}
                onClick={() => setActive(material.id)}
                animate={{ flex: selected ? 2.35 : 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className={classNames(
                  "group relative min-h-72 cursor-pointer overflow-hidden rounded-[1.45rem] border text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:min-h-0",
                  selected ? "border-[var(--accent)]" : "border-transparent hover:border-[var(--surface-border)]",
                )}
              >
                <Image
                  src={material.image}
                  alt={`Texture ${material.name}`}
                  fill
                  sizes="(min-width: 768px) 22vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.82))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.38),transparent_36%)] opacity-70 transition-opacity duration-200 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full min-h-72 flex-col justify-end p-5 text-white md:min-h-0 md:p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-md">
                      {material.tech}
                    </span>
                  </div>
                  <h3 className="mt-3 text-3xl font-semibold leading-none md:text-4xl">{material.name}</h3>
                  <p className="mt-2 text-base font-semibold text-white/86">{material.claim}</p>

                  <motion.div
                    initial={false}
                    animate={{
                      opacity: selected ? 1 : 0,
                      height: selected ? "auto" : 0,
                      marginTop: selected ? 18 : 0,
                    }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-md text-lg leading-relaxed text-white/88">{material.use}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                      {material.details.map((detail) => (
                        <span
                          key={detail}
                          className="rounded-xl bg-white/14 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
