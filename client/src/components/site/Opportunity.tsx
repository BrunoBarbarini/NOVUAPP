/* ALINHAVO — Ateliê Editorial: capítulo 01, números como manchetes, swing tags */
import { ChapterHeader, CountUp, Reveal, SwingTag } from "./primitives";

const PAIN_POINTS = [
  {
    n: "62%",
    t: "das costureiras autônomas de reparo ganham menos de 1 salário mínimo",
    s: "Aliança Empreendedora, 2023",
  },
  {
    n: "44 anos",
    t: "é a idade mediana da profissão — talento envelhecendo sem renovação nem demanda organizada",
    s: "Aliança Empreendedora, 2023",
  },
  {
    n: "2/3",
    t: "das roupas descartadas ainda seriam perfeitamente reparáveis",
    s: "Estimativas de economia circular",
  },
];

export function Opportunity() {
  return (
    <section id="oportunidade" className="py-20 lg:py-28">
      <div className="container">
        <ChapterHeader
          number="01"
          label="A oportunidade"
          title={
            <>
              R$ 314,9 bilhões em roupas vendidas por ano.{" "}
              <em className="text-needle">Nenhuma plataforma para mantê-las vivas.</em>
            </>
          }
        />
        <div className="grid lg:grid-cols-12 gap-10 mt-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-muted-foreground leading-relaxed text-lg">
                O Brasil consome <strong className="text-foreground">6,4 bilhões de peças de
                vestuário por ano</strong>. Se apenas 1% delas passasse por um reparo ou
                ajuste pago a um ticket médio de R$ 30–35, o mercado endereçável já
                supera <strong className="text-foreground">R$ 2 bilhões anuais</strong> — hoje
                atendido de forma totalmente fragmentada, informal e invisível ao
                consumidor digital.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
                Do outro lado, a oferta existe e é abundante: são{" "}
                <strong className="text-foreground">1,34 milhão de profissionais</strong> na
                cadeia têxtil formal, além de um exército de costureiras autônomas
                talentosas, subremuneradas e sem acesso a demanda organizada.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-12 pt-8">
                <SwingTag
                  value={<CountUp end={2} prefix="R$ " suffix=" bi/ano" />}
                  label="Mercado endereçável"
                />
                <SwingTag
                  value={<CountUp end={0} />}
                  label="Players nacionais com o modelo completo"
                  accent
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <ul className="space-y-0">
              {PAIN_POINTS.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 80}>
                  <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr] gap-5 items-start py-7 border-b border-dashed border-border last:border-0">
                    <span className="font-display text-4xl sm:text-5xl font-semibold text-thread leading-none">
                      {p.n}
                    </span>
                    <div>
                      <p className="text-foreground leading-relaxed">{p.t}</p>
                      <p className="label-tag text-muted-foreground mt-2">{p.s}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={260}>
              <div className="mt-8 bg-secondary rounded-[4px] p-6 baste-border">
                <p className="label-tag text-needle mb-2">Ventos de cauda</p>
                <p className="text-foreground leading-relaxed">
                  Mercado de segunda mão em plena expansão (Enjoei, Repassa, Troc),
                  pressão ESG sobre grandes varejistas (Renner, C&amp;A, Abit na
                  Coalizão Moda Justa) e uma cultura de delivery já instalada, com
                  last-mile a R$ 12–25 por corrida.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

