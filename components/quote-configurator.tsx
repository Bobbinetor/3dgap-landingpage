"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Flow = "generate" | "stl";
type Source = "photo" | "text";
type JobStatus = "idle" | "processing" | "ready" | "sent";

const processSteps = ["Percorso", "Input", "Stampa", "Analisi", "Preventivo"];

const materials = [
  { id: "pla", label: "PLA", multiplier: 1, density: 1.24, note: "Indoor, gadget, prototipi estetici" },
  { id: "petg", label: "PETG", multiplier: 1.22, density: 1.27, note: "Pezzi funzionali e uso quotidiano" },
  { id: "asa", label: "ASA", multiplier: 1.46, density: 1.07, note: "Esterno, sole, migliore stabilita" },
  { id: "resina", label: "Resina", multiplier: 1.74, density: 1.12, note: "Dettaglio alto e pezzi piccoli" },
];

const finishOptions = [
  { id: "smooth", label: "Pulizia bordi", price: 8 },
  { id: "detail", label: "Dettaglio alto", price: 12 },
  { id: "base", label: "Base rinforzata", price: 10 },
];

const phases = {
  photo: ["Lettura foto", "Meshy image-to-3D", "Pulizia mesh", "Stima stampa"],
  text: ["Analisi testo", "Meshy text-to-3D", "Rifinitura bozza", "Stima stampa"],
  stl: ["Import STL", "Controllo mesh", "Slicing mock", "Stima stampa"],
};

function currency(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function classNames(...items: Array<string | false | undefined>) {
  return items.filter(Boolean).join(" ");
}

function FieldRange({
  id,
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between gap-4 text-base font-semibold text-[var(--fg)]">
        <span>{label}</span>
        <span className="rounded-full bg-[var(--bg-soft)] px-3 py-1 text-sm text-[var(--fg-muted)]">
          {value} {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="mt-3 h-2 w-full cursor-pointer accent-[var(--cta)]"
      />
    </div>
  );
}

export default function QuoteConfigurator() {
  const [screen, setScreen] = useState(0);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [source, setSource] = useState<Source>("photo");
  const [photoName, setPhotoName] = useState("");
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("Supporto da scrivania per cuffie, con logo in rilievo e base stabile.");
  const [width, setWidth] = useState(12);
  const [depth, setDepth] = useState(8);
  const [height, setHeight] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [materialId, setMaterialId] = useState("pla");
  const [finishes, setFinishes] = useState<string[]>(["smooth"]);
  const [status, setStatus] = useState<JobStatus>("idle");
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  const activeMaterial = materials.find((material) => material.id === materialId) ?? materials[0];
  const activePhases = flow === "stl" ? phases.stl : phases[source];
  const ready = status === "ready" || status === "sent";

  const estimate = useMemo(() => {
    const boxVolume = width * depth * height;
    const fillFactor = flow === "stl" ? 0.31 : 0.27;
    const printedVolume = boxVolume * fillFactor;
    const grams = Math.max(18, Math.round(printedVolume * activeMaterial.density * 0.72));
    const printHours = Math.max(1.2, printedVolume / 54 + finishes.length * 0.18);
    const setup = flow === "stl" ? 18 : source === "photo" ? 36 : 30;
    const material = grams * 0.11 * activeMaterial.multiplier;
    const machine = printHours * 7.8;
    const finish = finishes.reduce((sum, id) => sum + (finishOptions.find((item) => item.id === id)?.price ?? 0), 0);
    const subtotal = (setup + material + machine + finish) * (1 + (quantity - 1) * 0.72);
    const delivery = subtotal > 95 ? 0 : 9;

    return {
      total: Math.round(subtotal + delivery),
      setup,
      material,
      machine,
      finish,
      delivery,
      grams,
      printHours,
      volume: Math.round(printedVolume),
    };
  }, [activeMaterial.density, activeMaterial.multiplier, depth, finishes, flow, height, quantity, source, width]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const resetAnalysis = () => {
    clearTimers();
    setStatus("idle");
    setPhase(0);
    setProgress(0);
  };

  useEffect(() => clearTimers, []);

  const chooseFlow = (nextFlow: Flow) => {
    setFlow(nextFlow);
    resetAnalysis();
    setScreen(1);
  };

  const goBack = () => {
    if (status === "processing") return;
    if (screen === 1) {
      setFlow(null);
      setScreen(0);
      return;
    }
    setScreen((value) => Math.max(0, value - 1));
  };

  const startProcess = () => {
    resetAnalysis();
    setScreen(3);
    setStatus("processing");

    activePhases.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setPhase(index), index * 760));
      timers.current.push(window.setTimeout(() => setProgress(Math.min(94, (index + 1) * 24)), index * 760 + 220));
    });

    timers.current.push(window.setTimeout(() => {
      setProgress(100);
      setStatus("ready");
      setScreen(4);
    }, activePhases.length * 760 + 260));
  };

  const toggleFinish = (id: string) => {
    setFinishes((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
    if (status === "sent") setStatus("ready");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <AnimatePresence mode="wait">
        {screen === 0 ? (
          <motion.section
            key="paths"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.24 }}
            className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--bg-elev)] p-4 shadow-sm md:p-6"
          >
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--fg-faint)]">Preventivo</div>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-[var(--fg)] md:text-5xl">
                Scegli da dove partire.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => chooseFlow("generate")}
                className="group min-h-72 cursor-pointer rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--bg-soft)] p-7 text-left transition-colors duration-200 hover:border-[var(--cta)] hover:bg-[color-mix(in_srgb,var(--cta)_8%,var(--bg-elev))]"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--cta)]">Path 1</span>
                <span className="mt-5 block text-3xl font-semibold leading-tight text-[var(--fg)]">
                  Creo un modello da foto o testo
                </span>
                <span className="mt-4 block text-lg leading-relaxed text-[var(--fg-muted)]">
                  Parti senza file 3D. Il mock simula generazione Meshy, rifinitura e preventivo.
                </span>
                <span className="mt-8 inline-flex rounded-full bg-[var(--cta)] px-5 py-3 text-base font-semibold text-white transition-colors group-hover:bg-[var(--cta-strong)]">
                  Inizia da qui
                </span>
              </button>

              <button
                type="button"
                onClick={() => chooseFlow("stl")}
                className="group min-h-72 cursor-pointer rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--bg-soft)] p-7 text-left transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_8%,var(--bg-elev))]"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Path 2</span>
                <span className="mt-5 block text-3xl font-semibold leading-tight text-[var(--fg)]">
                  Ho gia un file STL pronto
                </span>
                <span className="mt-4 block text-lg leading-relaxed text-[var(--fg-muted)]">
                  Carichi il file, il mock controlla mesh e slicing, poi calcola il prezzo.
                </span>
                <span className="mt-8 inline-flex rounded-full bg-[var(--fg)] px-5 py-3 text-base font-semibold text-[var(--bg)] transition-colors group-hover:bg-[var(--accent)]">
                  Carica file
                </span>
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="process"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[var(--bg-elev)] shadow-sm"
          >
            <div className="border-b border-[var(--surface-border)] p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
                    Processo preventivo
                  </div>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight text-[var(--fg)] md:text-4xl">
                    {screen === 1 && (flow === "stl" ? "Carica il file." : "Scegli l'input.")}
                    {screen === 2 && "Configura la stampa."}
                    {screen === 3 && "Analisi in corso."}
                    {screen === 4 && "Preventivo pronto."}
                  </h2>
                </div>
                <div className="rounded-full bg-[var(--bg-soft)] px-4 py-2 text-sm font-semibold text-[var(--fg-muted)]">
                  {flow === "stl" ? "STL pronto" : "Foto/testo"}
                </div>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-5">
                {processSteps.map((label, index) => {
                  const currentIndex = screen === 4 ? 4 : screen;
                  const active = index === currentIndex;
                  const done = index < currentIndex || ready;
                  return (
                    <div key={label} className="flex items-center gap-2 sm:block">
                      <div className={classNames(
                        "grid h-8 w-8 place-items-center rounded-full text-sm font-semibold sm:mx-auto",
                        done || active ? "bg-[var(--cta)] text-white" : "bg-[var(--bg-soft)] text-[var(--fg-muted)]",
                      )}>
                        {index + 1}
                      </div>
                      <div className={classNames(
                        "text-sm font-semibold sm:mt-2 sm:text-center",
                        done || active ? "text-[var(--fg)]" : "text-[var(--fg-faint)]",
                      )}>
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 md:p-7">
              <AnimatePresence mode="wait">
                {screen === 1 && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.22 }}
                  >
                    {flow === "generate" ? (
                      <div className="grid gap-5">
                        <div className="grid gap-3 md:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setSource("photo")}
                            className={classNames(
                              "cursor-pointer rounded-2xl border p-5 text-left transition-colors duration-200",
                              source === "photo" ? "border-[var(--cta)] bg-[color-mix(in_srgb,var(--cta)_8%,transparent)]" : "border-[var(--surface-border)]",
                            )}
                          >
                            <span className="block text-2xl font-semibold text-[var(--fg)]">Carico una foto</span>
                            <span className="mt-2 block text-base text-[var(--fg-muted)]">Mock image-to-3D</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSource("text")}
                            className={classNames(
                              "cursor-pointer rounded-2xl border p-5 text-left transition-colors duration-200",
                              source === "text" ? "border-[var(--cta)] bg-[color-mix(in_srgb,var(--cta)_8%,transparent)]" : "border-[var(--surface-border)]",
                            )}
                          >
                            <span className="block text-2xl font-semibold text-[var(--fg)]">Descrivo l'oggetto</span>
                            <span className="mt-2 block text-base text-[var(--fg-muted)]">Mock text-to-3D</span>
                          </button>
                        </div>

                        {source === "photo" ? (
                          <label
                            htmlFor="photo-upload"
                            className="flex min-h-52 cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--bg-soft)] p-6 transition-colors duration-200 hover:border-[var(--cta)]"
                          >
                            <span className="text-2xl font-semibold text-[var(--fg)]">Aggiungi immagine</span>
                            <span className="mt-3 text-lg leading-relaxed text-[var(--fg-muted)]">
                              {photoName || "JPG, PNG o HEIC. Per ora il file resta nel mock."}
                            </span>
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(event) => setPhotoName(event.currentTarget.files?.[0]?.name ?? "")}
                            />
                          </label>
                        ) : (
                          <div>
                            <label htmlFor="description" className="text-base font-semibold text-[var(--fg)]">
                              Descrizione oggetto
                            </label>
                            <textarea
                              id="description"
                              value={description}
                              onChange={(event) => setDescription(event.currentTarget.value)}
                              rows={6}
                              className="mt-3 w-full resize-none rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-soft)] p-5 text-lg leading-relaxed text-[var(--fg)] outline-none focus:border-[var(--cta)]"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <label
                        htmlFor="model-upload"
                        className="flex min-h-72 cursor-pointer flex-col justify-center rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--bg-soft)] p-6 transition-colors duration-200 hover:border-[var(--cta)]"
                      >
                        <span className="text-2xl font-semibold text-[var(--fg)]">Carica STL</span>
                        <span className="mt-3 text-lg leading-relaxed text-[var(--fg-muted)]">
                          {modelName || "STL, OBJ, STEP o STP. Il mock simula controllo e slicing."}
                        </span>
                        <input
                          id="model-upload"
                          type="file"
                          accept=".stl,.obj,.step,.stp"
                          className="sr-only"
                          onChange={(event) => setModelName(event.currentTarget.files?.[0]?.name ?? "")}
                        />
                      </label>
                    )}
                  </motion.div>
                )}

                {screen === 2 && (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.22 }}
                    className="grid gap-7 lg:grid-cols-[1fr_0.85fr]"
                  >
                    <div className="grid gap-6">
                      <FieldRange id="width" label="Larghezza" value={width} min={4} max={42} unit="cm" onChange={setWidth} />
                      <FieldRange id="depth" label="Profondita" value={depth} min={4} max={42} unit="cm" onChange={setDepth} />
                      <FieldRange id="height" label="Altezza" value={height} min={3} max={48} unit="cm" onChange={setHeight} />
                      <div>
                        <label htmlFor="quantity" className="text-base font-semibold text-[var(--fg)]">Quantita</label>
                        <input
                          id="quantity"
                          type="number"
                          min={1}
                          max={250}
                          value={quantity}
                          onChange={(event) => setQuantity(Math.max(1, Number(event.currentTarget.value)))}
                          className="mt-3 w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-soft)] px-4 py-3 text-lg font-semibold text-[var(--fg)] outline-none focus:border-[var(--cta)]"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-soft)] p-5">
                      <div className="text-base font-semibold text-[var(--fg)]">Materiale</div>
                      <div className="mt-3 grid gap-2">
                        {materials.map((material) => (
                          <button
                            key={material.id}
                            type="button"
                            aria-pressed={materialId === material.id}
                            onClick={() => setMaterialId(material.id)}
                            className={classNames(
                              "cursor-pointer rounded-xl border p-3 text-left transition-colors duration-200",
                              materialId === material.id ? "border-[var(--accent)] bg-[var(--bg-elev)]" : "border-transparent hover:border-[var(--surface-border)]",
                            )}
                          >
                            <span className="block text-base font-semibold text-[var(--fg)]">{material.label}</span>
                            <span className="mt-1 block text-sm text-[var(--fg-muted)]">{material.note}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-5 text-base font-semibold text-[var(--fg)]">Rifinitura</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {finishOptions.map((option) => {
                          const selected = finishes.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => toggleFinish(option.id)}
                              className={classNames(
                                "cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition-colors duration-200",
                                selected ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--surface-border)] text-[var(--fg-muted)] hover:border-[var(--accent)]",
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {screen === 3 && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.22 }}
                    className="mx-auto max-w-2xl text-center"
                  >
                    <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[color-mix(in_srgb,var(--cta)_12%,transparent)]">
                      <div className="h-14 w-14 rounded-full border-4 border-[var(--cta)] border-t-transparent animate-spin" />
                    </div>
                    <h3 className="mt-7 text-3xl font-semibold text-[var(--fg)]">{activePhases[phase]}</h3>
                    <div className="mt-6 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                      <motion.div
                        className="h-3 rounded-full bg-[var(--cta)]"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.22 }}
                      />
                    </div>
                    <p className="mt-4 text-lg text-[var(--fg-muted)]">
                      {progress}% completato
                    </p>
                  </motion.div>
                )}

                {screen === 4 && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.22 }}
                    className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
                  >
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[linear-gradient(145deg,var(--bg-soft),var(--bg-elev))] p-6">
                      <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--fg-faint)]">Preventivo stimato</div>
                      <div className="mt-3 text-6xl font-semibold text-[var(--fg)]">{currency(estimate.total)}</div>
                      <p className="mt-4 text-lg leading-relaxed text-[var(--fg-muted)]">
                        Prezzo mock basato su volume, materiale, tempo macchina, rifinitura e quantita.
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-[var(--bg-elev)] p-4">
                          <div className="text-sm text-[var(--fg-muted)]">Volume</div>
                          <div className="mt-1 text-xl font-semibold">{estimate.volume} cm3</div>
                        </div>
                        <div className="rounded-xl bg-[var(--bg-elev)] p-4">
                          <div className="text-sm text-[var(--fg-muted)]">Peso</div>
                          <div className="mt-1 text-xl font-semibold">{estimate.grams} g</div>
                        </div>
                        <div className="rounded-xl bg-[var(--bg-elev)] p-4">
                          <div className="text-sm text-[var(--fg-muted)]">Stampa</div>
                          <div className="mt-1 text-xl font-semibold">{estimate.printHours.toFixed(1)} h</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-soft)] p-5">
                      <div className="text-base font-semibold text-[var(--fg)]">Dettaglio prezzo</div>
                      <div className="mt-4 divide-y divide-[var(--surface-border)] rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elev)]">
                        {[
                          ["Setup", estimate.setup],
                          ["Materiale", estimate.material],
                          ["Tempo macchina", estimate.machine],
                          ["Rifinitura", estimate.finish],
                          ["Consegna", estimate.delivery],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                            <span className="text-[var(--fg-muted)]">{label}</span>
                            <span className="font-semibold text-[var(--fg)]">{currency(Number(value))}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStatus("sent")}
                        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--cta)] px-6 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--cta-strong)]"
                      >
                        {status === "sent" ? "Richiesta inviata" : "Conferma richiesta"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--surface-border)] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
              <button
                type="button"
                onClick={goBack}
                disabled={status === "processing"}
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--surface-border)] px-6 py-3 text-base font-semibold text-[var(--fg)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Indietro
              </button>
              {screen < 2 && (
                <button
                  type="button"
                  onClick={() => setScreen((value) => value + 1)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--cta)] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--cta-strong)]"
                >
                  Continua
                </button>
              )}
              {screen === 2 && (
                <button
                  type="button"
                  onClick={startProcess}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--cta)] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--cta-strong)]"
                >
                  Avvia processo
                </button>
              )}
              {screen === 4 && (
                <button
                  type="button"
                  onClick={startProcess}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--fg)] px-7 py-3.5 text-base font-semibold text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--cta)]"
                >
                  Ricalcola
                </button>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
