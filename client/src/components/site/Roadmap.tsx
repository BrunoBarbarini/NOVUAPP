/* ALINHAVO — Ateliê Editorial: capítulo 05, roadmap de 24 meses + ondas B2B */
import { ChapterHeader, Reveal } from "./primitives";

const MILESTONES = [
  { p: "Meses 0–2", t: "Fundação", d: "Constituição, curadoria das 8–12 primeiras costureiras, site e operação-piloto no quadrilátero Pinheiros–Jardins." },
  { p: "Meses 2–3", t: "Beta fechado", d: "50–100 pedidos com early adopters; calibragem de preço, prazo e logística." },
  { p: "Meses 3–6", t: "Lançamento público", d: "RP e conteúdo orgânico; meta de 300–500 pedidos/mês." },
  { p: "Meses 9–12", t: "Mini-hub + 1º piloto B2B", d: "Hub de 60–100 m² com QC total; primeiro piloto com brechó online ou locadora." },
  { p: "Meses 12–18", t: "Plataforma & white-label", d: "Sistema próprio de pedidos, 2–3 contratos B2B assinados." },
  { p: "Meses 18–24", t: "Escala e captação", d: "2.500 pedidos/mês, breakeven operacional e o \"momento M&S\" brasileiro." },
];

const WAVES = [
  {
    n: "Onda 1",
    who: "Brechós online & locadoras",
    ex: "Enjoei · Repassa · Troc",
    why: "Já precisam de reparo e higienização de peças em volume; ciclo de venda curto.",
  },
  {
    n: "Onda 2",
    who: "Marcas premium nacionais",
    ex: "Reserva · Osklen · Farm · Amaro",
    why: "Reparo pós-venda white-label como extensão de garantia e narrativa ESG — o playbook GANNI.",
  },
  {
    n: "Onda 3",
    who: "Grandes varejistas",
    ex: "C&A · Renner · Riachuelo",
    why: "Recuperação de estoque danificado e logística reversa em escala — o \"momento M&S\".",
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20 lg:py-28">
      <div className="container">
        <ChapterHeader
          number="05"
          label="Execução"
          title={
            <>
              24 meses, alinhavados{" "}
              <em className="text-needle">ponto a ponto.</em>
            </>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-14">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.p} delay={(i % 3) * 70}>
              <div className="border-t-2 border-needle pt-4 h-full">
                <p className="font-mono-data text-sm text-thread font-semibold">{m.p}</p>
                <h3 className="font-display text-xl font-semibold text-foreground mt-1">{m.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-20 flex items-center gap-4">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground whitespace-nowrap">
              A estratégia B2B em três ondas
            </h3>
            <div className="baste-line flex-1 hidden sm:block" />
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {WAVES.map((w, i) => (
            <Reveal key={w.n} delay={i * 80}>
              <div className="bg-card border border-border rounded-[4px] p-6 h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-14px_rgba(40,50,30,0.35)]">
                <p className="label-tag text-thread">{w.n}</p>
                <h4 className="font-display text-lg font-semibold text-foreground mt-2">{w.who}</h4>
                <p className="font-mono-data text-xs text-needle mt-1">{w.ex}</p>
                <div className="baste-line my-4 opacity-50" />
                <p className="text-sm text-muted-foreground leading-relaxed">{w.why}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
