/* ALINHAVO — Ateliê Editorial: capítulo 04, números como fichas técnicas de ateliê */
import { ChapterHeader, CountUp, Reveal } from "./primitives";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const PRICES = [
  { s: "Pregar botão", p: "R$ 14,90", ref: "SOJO: £5" },
  { s: "Bainha de calça", p: "R$ 39,90", ref: "SOJO: £14–16" },
  { s: "Ajuste de cintura", p: "R$ 59,90", ref: "SOJO: £20–25" },
  { s: "Troca de zíper", p: "R$ 64,90", ref: "SOJO: £22–28" },
  { s: "Ajuste de vestido / blazer", p: "R$ 89,90", ref: "SOJO: £30–35" },
  { s: "Coleta + entrega", p: "R$ 16,90", ref: "SOJO: £3,99" },
];

const GROWTH = [
  { m: "Mês 3", pedidos: 150, receita: 12.7 },
  { m: "Mês 6", pedidos: 320, receita: 27 },
  { m: "Mês 9", pedidos: 500, receita: 42.5 },
  { m: "Mês 12", pedidos: 800, receita: 68 },
  { m: "Mês 15", pedidos: 1200, receita: 102 },
  { m: "Mês 18", pedidos: 1700, receita: 145 },
  { m: "Mês 24", pedidos: 2500, receita: 212 },
];

const UNIT = [
  { v: <CountUp end={85} prefix="R$ " decimals={0} />, l: "Ticket médio por pedido (R$ 75–95)" },
  { v: <CountUp end={30} prefix="R$ " decimals={0} />, l: "Margem de contribuição por pedido (R$ 25–35)" },
  { v: <CountUp end={65} suffix="%" />, l: "Repasse à costureira — ~2x o mercado informal" },
  { v: <CountUp end={700} />, l: "Pedidos/mês para breakeven enxuto (600–800)" },
];

export function Financials() {
  return (
    <section id="financeiro" className="py-20 lg:py-28 bg-secondary/60">
      <div className="container">
        <ChapterHeader
          number="04"
          label="Os números"
          title={
            <>
              Unit economics de ateliê,{" "}
              <em className="text-needle">disciplina de startup.</em>
            </>
          }
        />

        <div className="grid lg:grid-cols-12 gap-12 mt-14">
          {/* Tabela de preços */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="bg-card border border-border rounded-[4px] overflow-hidden">
                <div className="px-6 py-4 border-b border-dashed border-border flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">Cardápio de serviços</h3>
                  <span className="label-tag text-muted-foreground">Preços sugeridos · SP</span>
                </div>
                <ul>
                  {PRICES.map((r, i) => (
                    <li
                      key={r.s}
                      className={`flex items-baseline justify-between gap-4 px-6 py-3.5 ${i % 2 ? "bg-secondary/50" : ""}`}
                    >
                      <div>
                        <p className="text-foreground font-medium text-sm">{r.s}</p>
                        <p className="label-tag text-muted-foreground mt-0.5">{r.ref}</p>
                      </div>
                      <span className="font-mono-data font-semibold text-needle whitespace-nowrap">{r.p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-6 baste-border rounded-[4px] p-5 bg-card">
                <p className="label-tag text-needle mb-1.5">Investimento inicial</p>
                <p className="font-display text-3xl font-semibold text-foreground">
                  R$ 150–250 mil
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Para 12 meses de operação enxuta — menos do que os R$ 129 mil
                  exigidos por uma única loja de franquia física de consertos, com
                  potencial de escala incomparável.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Gráfico + unit economics */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="bg-card border border-border rounded-[4px] p-6">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="font-display text-lg font-semibold">Trajetória até o breakeven</h3>
                  <span className="label-tag text-muted-foreground">Receita mensal · R$ mil</span>
                </div>
                <div className="h-[260px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={GROWTH} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.45 0.11 150)" stopOpacity={0.32} />
                          <stop offset="100%" stopColor="oklch(0.45 0.11 150)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 5" stroke="oklch(0.86 0.02 100)" vertical={false} />
                      <XAxis dataKey="m" tick={{ fontSize: 12, fill: "oklch(0.48 0.02 130)" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "oklch(0.48 0.02 130)" }} tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(v: number, name: string) =>
                          name === "receita" ? [`R$ ${v} mil`, "Receita"] : [v.toLocaleString("pt-BR"), "Pedidos"]
                        }
                        contentStyle={{
                          background: "oklch(0.985 0.008 85)",
                          border: "1px solid oklch(0.86 0.02 100)",
                          borderRadius: 4,
                          fontSize: 13,
                        }}
                      />
                      <Area type="monotone" dataKey="receita" stroke="oklch(0.45 0.11 150)" strokeWidth={2.2} fill="url(#gReceita)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  Mês 15: 1.200 pedidos + primeiro contrato B2B · Mês 24: 2.500 pedidos/mês
                  e breakeven operacional (~R$ 212 mil/mês). Com hub próprio, o breakeven
                  sobe para 1.500–1.800 pedidos/mês.
                </p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              {UNIT.map((u, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="bg-card border border-border rounded-[4px] p-5 h-full">
                    <p className="font-display text-3xl font-semibold text-needle">{u.v}</p>
                    <p className="text-sm text-muted-foreground leading-snug mt-2">{u.l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
