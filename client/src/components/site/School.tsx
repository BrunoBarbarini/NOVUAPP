import escolaImg from "@/assets/novu-escola.webp";
/* NOVU — Casa de Vó Editorial: Escola NOVU — formação de novas gerações
   de costureiras, mestras e aprendizes, saber que passa adiante. */
import { ChapterHeader, Reveal } from "./primitives";

const PILARES = [
  {
    t: "Mestras que ensinam",
    d: "Costureiras experientes da rede se tornam formadoras remuneradas, transmitindo técnicas que nenhuma máquina substitui.",
  },
  {
    t: "Aprendizes que chegam",
    d: "Jovens e recomeçantes aprendem o ofício do reparo em turmas práticas, com parceiros como SENAI e institutos de moda circular.",
  },
  {
    t: "Futuro que se costura",
    d: "Quem se forma entra na rede NOVU com demanda garantida — o ofício volta a ser um caminho de vida, não uma lembrança.",
  },
];

export function School() {
  return (
    <section id="escola" className="py-20 lg:py-28 bg-secondary/60 scroll-mt-16">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <ChapterHeader
              number="05"
              label="Escola NOVU"
              title={
                <>
                  Um ofício só morre quando ninguém mais{" "}
                  <em className="text-needle">o ensina.</em>
                </>
              }
            />
            <Reveal delay={100}>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-2xl">
                Com idade mediana de 44 anos e pouquíssimos jovens entrando na
                profissão, o reparo de roupas corre o risco de virar memória.
                A Escola NOVU nasce para reverter isso: cada turma formada é
                uma geração a mais de mãos que sabem cuidar — e uma parte de
                cada reparo que você faz financia essa formação.
              </p>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-6 mt-9">
              {PILARES.map((p, i) => (
                <Reveal key={p.t} delay={i * 80}>
                  <div className="border-t-2 border-needle pt-4 h-full">
                    <h3 className="font-display text-lg font-semibold text-foreground">{p.t}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={120} className="lg:col-span-5 order-1 lg:order-2">
            <div className="rounded-[4px] overflow-hidden -rotate-[1.2deg] shadow-[0_18px_44px_-18px_rgba(40,50,30,0.4)]">
              <img
                src={escolaImg}
                alt="Oficina de costura intergeracional: mestra ensinando jovem aprendiz em ateliê iluminado"
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

