import memoriaImg from "@/assets/novu-memoria.webp";
/* NOVU — Casa de Vó Editorial: manifesto emocional, foto-memória estilo álbum,
   carta sobre roupas que guardam histórias e passam entre gerações. */
import { ChapterHeader, Reveal } from "./primitives";

const CRENCAS = [
  {
    t: "Roupa boa não morre",
    d: "Um zíper quebrado, uma bainha desfeita, um botão perdido: nada disso é fim de linha. Dois terços das roupas que o Brasil joga fora poderiam ser reparadas.",
  },
  {
    t: "Memória se veste",
    d: "O casaco do primeiro inverno juntos, a camisa do aniversário, o vestido do batizado. Descartar essas peças é descartar um pedaço da história de vocês.",
  },
  {
    t: "Cuidar é um ofício",
    d: "Por trás de cada reparo há uma costureira com décadas de saber nas mãos. Valorizar esse trabalho é manter viva uma arte que o Brasil está esquecendo.",
  },
];

export function Manifesto() {
  return (
    <section id="manifesto" className="py-20 lg:py-28">
      <div className="container grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5 order-1">
          <div className="relative">
            <div className="rounded-[4px] overflow-hidden -rotate-[1.5deg] shadow-[0_18px_44px_-18px_rgba(40,50,30,0.4)]">
              <img
                src={memoriaImg}
                alt="Jaqueta jeans querida ao lado de fotografia antiga de família, flores secas e linha verde"
                className="w-full h-[380px] sm:h-[460px] object-cover"
              />
            </div>
            <p className="font-display italic text-lg text-needle mt-4 pl-2">
              "Essa jaqueta era do meu pai. Agora é do meu filho."
            </p>
          </div>
        </Reveal>
        <div className="lg:col-span-7 order-2">
          <ChapterHeader
            number="01"
            label="Nosso manifesto"
            title={
              <>
                Antes de ser tecido, roupa é{" "}
                <em className="text-needle">memória.</em>
              </>
            }
          />
          <Reveal delay={100}>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-2xl">
              A gente cresceu vendo nossas avós darem vida nova ao que parecia
              perdido: viravam a gola da camisa, subiam a bainha, bordavam por
              cima do rasgo. Na casa delas, nada querido ia para o lixo — ia
              para a caixinha de costura. A NOVU existe para trazer esse
              cuidado de volta ao dia a dia, com a conveniência de hoje e o
              carinho de sempre.
            </p>
          </Reveal>
          <div className="mt-9 space-y-6">
            {CRENCAS.map((c, i) => (
              <Reveal key={c.t} delay={i * 80}>
                <div className="flex gap-5 items-start">
                  <span className="mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-needle bg-background shrink-0 relative">
                    <span className="absolute inset-[2.5px] rounded-full bg-needle/30" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{c.t}</h3>
                    <p className="text-muted-foreground leading-relaxed mt-1.5">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
