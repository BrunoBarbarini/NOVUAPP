/* NOVU — Casa de Vó Editorial: sustentabilidade — moda circular com afeto,
   cada reparo é um gesto pelo planeta. */
import { ChapterHeader, Reveal } from "./primitives";

const GESTOS = [
  {
    v: "+2 anos",
    l: "de vida útil em uma peça reparada reduzem em cerca de um quarto sua pegada de carbono, água e resíduo",
  },
  {
    v: "-1 peça nova",
    l: "cada reparo evita a produção de uma peça nova — e todo o algodão, água e energia que ela custaria",
  },
  {
    v: "0 aterro",
    l: "roupa cuidada não vira montanha de resíduo têxtil — vira herança, presente, história que continua",
  },
];

export function Sustainability() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <ChapterHeader
          number="06"
          label="Pelo planeta"
          title={
            <>
              A moda mais sustentável é a que{" "}
              <em className="text-needle">já está no seu armário.</em>
            </>
          }
        />
        <Reveal delay={100}>
          <p className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-2xl">
            A indústria da moda é uma das que mais consomem água e geram
            resíduos no mundo. Reparar em vez de comprar é o gesto individual
            mais simples — e mais afetuoso — da moda circular. Como faziam
            nossas avós, sem nunca terem chamado isso de sustentabilidade.
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {GESTOS.map((g, i) => (
            <Reveal key={g.v} delay={i * 80}>
              <div className="bg-card border border-border rounded-[4px] p-6 h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-14px_rgba(40,50,30,0.35)]">
                <p className="font-display text-3xl font-semibold text-needle">{g.v}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{g.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
