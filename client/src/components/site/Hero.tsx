/* NOVU — Casa de Vó Editorial: hero emocional, avó e neta costurando juntas,
   manchete afetiva com itálico Fraunces, linha de alinhavo animada. */
import { useEffect, useRef, useState } from "react";
import { Reveal, SwingTag } from "./primitives";

function StitchPath() {
  const ref = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 350);
    return () => clearTimeout(t);
  }, []);
  return (
    <svg
      className="absolute left-0 right-0 bottom-10 w-full h-16 pointer-events-none hidden lg:block"
      viewBox="0 0 1200 60"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        ref={ref}
        d="M-10 40 C 200 10, 420 55, 640 30 S 1050 15, 1210 38"
        stroke="var(--needle)"
        strokeWidth="1.6"
        strokeDasharray="10 7"
        style={{
          strokeDashoffset: drawn ? 0 : 1700,
          transition: "stroke-dashoffset 2.4s cubic-bezier(0.23, 1, 0.32, 1)",
          opacity: 0.55,
        }}
        pathLength={1700}
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 paper-grain overflow-hidden">
      <div className="container relative grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        <div className="lg:col-span-7 relative z-10">
          <Reveal>
            <p className="label-tag text-needle mb-5 flex items-center gap-3">
              <span className="baste-line w-10 inline-block" />
              Reparo de roupas com carinho, de porta em porta
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-[4rem] leading-[1.06] font-semibold text-foreground tracking-tight">
              Tem roupa que guarda abraço.{" "}
              <em className="text-needle">Essas, a gente não descarta — a gente cuida.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              A <strong className="text-foreground font-semibold">NOVU</strong> busca,
              repara e devolve suas peças queridas pelas mãos de costureiras que
              vivem dignamente do seu ofício. O vestido da sua mãe pode ser o
              vestido da sua filha — e a jaqueta do seu pai, a do seu filho.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#reparar"
                className="inline-flex items-center gap-2 bg-needle text-primary-foreground font-semibold px-6 py-3.5 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:bg-needle-deep"
              >
                Quero reparar uma peça
              </a>
              <a
                href="#costureiras"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-[3px] baste-border text-needle hover:bg-accent transition-colors duration-150 active:scale-[0.97]"
              >
                Sou costureira, quero costurar com a NOVU
              </a>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-5 relative">
          <Reveal delay={200} className="relative">
            <div className="relative rounded-[4px] overflow-hidden shadow-[0_20px_50px_-20px_rgba(40,50,30,0.4)] rotate-[1.2deg]">
              <img
                src="/manus-storage/novu-hero_21285fa9.png"
                alt="Avó ensinando a neta a costurar em uma mesa de madeira, com caixa de costura vintage"
                className="w-full h-[340px] sm:h-[420px] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-6 sm:-left-10 z-10">
              <SwingTag value="De mãe para filha" label="e de pai para filho" accent />
            </div>
          </Reveal>
        </div>
      </div>
      <StitchPath />
    </section>
  );
}

