import costureiraImg from "@/assets/novu-costureira.webp";
/* NOVU — Casa de Vó Editorial: convite às costureiras — dignidade, renda justa,
   comunidade e fila organizada de clientes. */
import { ChapterHeader, Reveal } from "./primitives";
import { toast } from "sonner";

const PROMESSAS = [
  {
    t: "Renda que respeita seu ofício",
    d: "65% do valor de cada reparo é seu — cerca de o dobro do que o mercado informal paga hoje. Pagamento toda semana, sem atraso e sem promessa.",
  },
  {
    t: "Clientes sem precisar caçar",
    d: "A NOVU cuida da divulgação, da coleta e da entrega. Você recebe as peças em casa ou no ateliê e faz o que faz de melhor: costurar.",
  },
  {
    t: "Formalização sem dor de cabeça",
    d: "Ajudamos você a virar MEI, ter acesso a previdência, crédito e nota fiscal — com apoio de verdade, passo a passo.",
  },
  {
    t: "Uma rede, não uma solidão",
    d: "Encontros, troca de técnicas, mentoria entre colegas e reconhecimento pelo nome: na NOVU, cada reparo leva a assinatura de quem o fez.",
  },
];

export function ForSeamstresses() {
  return (
    <section id="costureiras" className="py-20 lg:py-28 scroll-mt-16">
      <div className="container grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <div className="rounded-[4px] overflow-hidden rotate-[1.2deg] shadow-[0_18px_44px_-18px_rgba(40,50,30,0.4)]">
              <img
                src={costureiraImg}
                alt="Costureira sorridente em seu ateliê doméstico, diante da máquina de costura perto da janela"
                className="w-full h-[380px] sm:h-[460px] object-cover"
              />
            </div>
            <p className="font-display italic text-lg text-needle mt-4 pl-2">
              "Costuro há 30 anos. Pela primeira vez, sinto que isso vale alguma coisa."
            </p>
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <ChapterHeader
            number="04"
            label="Para costureiras"
            title={
              <>
                Seu talento sustenta famílias.{" "}
                <em className="text-needle">Agora ele vai sustentar a sua — com dignidade.</em>
              </>
            }
          />
          <div className="mt-9 space-y-6">
            {PROMESSAS.map((p, i) => (
              <Reveal key={p.t} delay={i * 70}>
                <div className="flex gap-5 items-start">
                  <span className="mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-thread bg-background shrink-0 relative">
                    <span className="absolute inset-[2.5px] rounded-full bg-thread/30" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{p.t}</h3>
                    <p className="text-muted-foreground leading-relaxed mt-1.5">{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={280}>
            <button
              onClick={() =>
                toast.info("As inscrições para a rede NOVU abrem em breve. Deixe seu contato no rodapé que a gente te chama!")
              }
              className="mt-9 inline-flex items-center gap-2 bg-thread text-white font-semibold px-6 py-3.5 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:brightness-95"
            >
              Quero fazer parte da rede
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
