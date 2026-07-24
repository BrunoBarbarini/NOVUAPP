/* ALINHAVO — Ateliê Editorial: capítulo 02, o caso SOJO como prova internacional.
   Bloco full-bleed verde-agulha profundo — momento-chave do pitch. */
import { ChapterHeader, Reveal } from "./primitives";

const TIMELINE = [
  {
    year: "2021",
    title: "MVP com £8 mil",
    text: "Josephine Philips lança um app beta em 2 zonas de Londres: 10 costureiras parceiras, entregas de bicicleta, comissão de 30% + £3,99 de entrega. Cinco serviços concentram 70% dos pedidos.",
  },
  {
    year: "2021–22",
    title: "Pivô B2B com a GANNI",
    text: "A marca dinamarquesa integra a SOJO como serviço de reparo pós-venda. Seed de US$ 2,4 milhões em abril de 2022 (~£1,8M no total captado).",
  },
  {
    year: "2023–24",
    title: "M&S, Selfridges e o hub próprio",
    text: "Mais de 20 marcas parceiras — M&S, Selfridges, Ralph Lauren, Reiss, Paul Smith, ARKET, Next. Verticalização com hub de costureiras em Hackney: a \"dark kitchen da costura\".",
  },
  {
    year: "Hoje",
    title: "Infraestrutura nacional de reparo",
    text: "Logística via Royal Mail/DPD com 6.000 pontos de coleta, nota 4,9 em mais de 1.000 avaliações e o selo de primeira B Corp de reparos do Reino Unido.",
  },
];

const PROOF = [
  { v: "20+", l: "marcas parceiras B2B" },
  { v: "£1,8M", l: "captados (seed 2022)" },
  { v: "4,9★", l: "em 1.000+ avaliações" },
  { v: "12%", l: "da receita circular da Selfridges vem de reparos" },
];

export function Validation() {
  return (
    <section id="validacao" className="py-20 lg:py-28 bg-needle-deep text-primary-foreground paper-grain">
      <div className="container">
        <div className="flex items-start gap-5 sm:gap-8">
          <div className="hidden sm:flex flex-col items-center gap-3 pt-2 shrink-0">
            <span className="font-mono-data text-sm text-primary-foreground/70 font-semibold [writing-mode:vertical-rl] tracking-[0.3em]">
              02
            </span>
            <span className="w-px h-14 bg-primary-foreground/25" />
          </div>
          <Reveal className="max-w-3xl">
            <p className="label-tag text-primary-foreground/70 mb-3">A validação internacional</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] font-semibold">
              A SOJO já provou o modelo em Londres —{" "}
              <em className="text-[oklch(0.82_0.1_150)]">de £8 mil a parceira da M&amp;S.</em>
            </h2>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mt-14">
          <div className="lg:col-span-7">
            <ol className="relative border-l border-dashed border-primary-foreground/30 ml-2 space-y-10 pl-8">
              {TIMELINE.map((t, i) => (
                <Reveal as="li" key={t.year} delay={i * 80} className="relative">
                  <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full bg-thread ring-4 ring-needle-deep" />
                  <p className="font-mono-data text-sm text-[oklch(0.82_0.1_150)] font-semibold tracking-wider">
                    {t.year}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold mt-1">{t.title}</h3>
                  <p className="text-primary-foreground/80 leading-relaxed mt-2 max-w-xl">{t.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={120}>
              <div className="rounded-[4px] overflow-hidden -rotate-[1.2deg] shadow-[0_20px_50px_-18px_rgba(0,0,0,0.5)]">
                <img
                  src="/manus-storage/alinhavo-garment_30d28ac5.png"
                  alt="Jaqueta jeans reparada com costura decorativa verde e etiqueta de papel"
                  className="w-full h-[300px] sm:h-[360px] object-cover"
                />
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-px bg-primary-foreground/20 mt-10 border border-primary-foreground/20">
              {PROOF.map((p, i) => (
                <Reveal key={p.l} delay={i * 60} className="bg-needle-deep p-5">
                  <p className="font-display text-3xl font-semibold text-[oklch(0.82_0.1_150)]">{p.v}</p>
                  <p className="text-sm text-primary-foreground/70 mt-1 leading-snug">{p.l}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <blockquote className="mt-8 border-l-2 border-thread pl-5 text-primary-foreground/85 italic font-display text-lg leading-relaxed">
                "A tese não é especulativa: é a importação de um playbook já
                testado, com três anos de vantagem informacional, para um mercado
                maior e sem concorrência direta."
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
