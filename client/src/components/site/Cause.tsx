/* NOVU — Casa de Vó Editorial: a causa — números que doem sobre as costureiras
   do Brasil e o descarte têxtil, em etiquetas de papel e fichas. */
import { ChapterHeader, CountUp, Reveal, SwingTag } from "./primitives";

const FEITOS = [
  {
    v: <CountUp end={62} suffix="%" />,
    l: "das costureiras autônomas de reparo ganham menos de 1 salário mínimo por mês",
  },
  {
    v: <CountUp end={44} suffix=" anos" />,
    l: "é a idade mediana do ofício — a profissão envelhece sem novas gerações chegando",
  },
  {
    v: <CountUp end={64} suffix="%" />,
    l: "não se sentem valorizadas pelo trabalho que fazem, apesar de décadas de experiência",
  },
  {
    v: <CountUp end={90} suffix="%" />,
    l: "trabalham sozinhas de casa, sem vitrine, sem rede e sem fila organizada de clientes",
  },
];

export function Cause() {
  return (
    <section id="a-causa" className="py-20 lg:py-28 bg-ink text-[oklch(0.94_0.01_85)] paper-grain">
      <div className="container">
        <div className="max-w-3xl">
          <Reveal>
            <p className="label-tag text-[oklch(0.72_0.1_150)] mb-3">03 · A causa</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] font-semibold">
              O Brasil está deixando um ofício inteiro{" "}
              <em className="text-[oklch(0.78_0.14_45)]">se desfazer no tempo.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[oklch(0.78_0.01_85)] text-lg leading-relaxed mt-6">
              Enquanto consumimos cerca de <strong className="text-[oklch(0.94_0.01_85)]">6,4 bilhões de peças de
              roupa por ano</strong> e descartamos montanhas de tecido — sendo que{" "}
              <strong className="text-[oklch(0.94_0.01_85)]">2 em cada 3 peças jogadas fora ainda tinham
              conserto</strong> —, as mulheres que sabem consertar seguem invisíveis,
              mal pagas e sem sucessoras. Esses números não são estatística:
              são o retrato de um saber que pode desaparecer em uma geração.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-16">
          {FEITOS.map((f, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="border-t border-dashed border-[oklch(0.5_0.03_130)] pt-5 h-full">
                <p className="font-display text-4xl font-semibold text-[oklch(0.78_0.14_45)]">{f.v}</p>
                <p className="text-sm text-[oklch(0.75_0.01_85)] leading-relaxed mt-3">{f.l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 grid sm:grid-cols-3 gap-8 sm:gap-6 items-start">
            <div className="sm:pt-6">
              <SwingTag value="6,4 bi" label="peças consumidas por ano no Brasil" />
            </div>
            <div>
              <SwingTag value="2 de 3" label="peças descartadas ainda tinham conserto" accent />
            </div>
            <div className="sm:pt-6">
              <SwingTag value="1 reparo" label="= 1 peça a menos no lixão" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="font-display italic text-xl sm:text-2xl text-[oklch(0.88_0.05_150)] mt-16 max-w-2xl">
            "Reparar uma roupa é um ato pequeno. Milhões de reparos são uma
            revolução silenciosa — para o planeta e para quem costura."
          </p>
        </Reveal>
      </div>
    </section>
  );
}
