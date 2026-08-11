/* NOVU — Casa de Vó Editorial: como funciona para o cliente, 4 passos com
   carinho + cardápio de reparos com preços acessíveis. */
import { ChapterHeader, Reveal } from "./primitives";
import { toast } from "sonner";
import { LAUNCH_MESSAGE_CLIENTE } from "@/lib/launchCopy";

const STEPS = [
  {
    n: "1",
    t: "Conte a história da peça",
    d: "Escolha o reparo no site, diga o que a peça significa para você e agende a coleta no melhor horário.",
  },
  {
    n: "2",
    t: "A gente busca na sua porta",
    d: "Sua roupa viaja embalada com cuidado, como um presente, até as mãos de uma costureira da rede NOVU.",
  },
  {
    n: "3",
    t: "Mãos que sabem o que fazem",
    d: "Costureiras com décadas de ofício reparam sua peça ponto a ponto, com controle de qualidade e garantia de refação.",
  },
  {
    n: "4",
    t: "De volta, pronta para mais histórias",
    d: "Em até 5 dias úteis, sua peça volta para casa — com uma etiqueta contando o que foi feito e quem cuidou dela.",
  },
];

const PRICES = [
  { s: "Pregar botão", p: "R$ 14,90" },
  { s: "Bainha de calça", p: "R$ 39,90" },
  { s: "Ajuste de cintura", p: "R$ 59,90" },
  { s: "Troca de zíper", p: "R$ 64,90" },
  { s: "Ajuste de vestido ou blazer", p: "R$ 89,90" },
  { s: "Coleta + entrega", p: "R$ 16,90" },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-secondary/60">
      <div className="container">
        <ChapterHeader
          number="02"
          label="Como funciona"
          title={
            <>
              Sua peça querida sai de casa e volta{" "}
              <em className="text-needle">de novo nova.</em>
            </>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className="bg-card border border-border rounded-[4px] p-6 h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-14px_rgba(40,50,30,0.35)]">
                <span className="font-display text-4xl font-semibold text-needle/25">{s.n}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-3">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div id="reparar" className="grid lg:grid-cols-12 gap-10 mt-16 items-center scroll-mt-24">
          <Reveal className="lg:col-span-6">
            <div className="bg-card border border-border rounded-[4px] overflow-hidden">
              <div className="px-6 py-4 border-b border-dashed border-border flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Cardápio de reparos</h3>
                <span className="label-tag text-muted-foreground">Americana - SP · piloto</span>
              </div>
              <ul>
                {PRICES.map((r, i) => (
                  <li
                    key={r.s}
                    className={`flex items-baseline justify-between gap-4 px-6 py-3.5 ${i % 2 ? "bg-secondary/50" : ""}`}
                  >
                    <p className="text-foreground font-medium text-sm">{r.s}</p>
                    <span className="font-mono-data font-semibold text-needle whitespace-nowrap">{r.p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6">
            <div className="max-w-lg">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-snug">
                Menos que o preço de uma peça nova.{" "}
                <em className="text-needle">Muito mais que um conserto.</em>
              </h3>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Todo reparo vem com coleta e entrega na sua porta, embalagem
                cuidadosa, garantia de refação sem custo e a certeza de que
                quem costurou foi remunerada com justiça.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <button
                  onClick={() => toast.info(LAUNCH_MESSAGE_CLIENTE)}
                  className="inline-flex items-center gap-2 bg-needle text-primary-foreground font-semibold px-6 py-3.5 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:bg-needle-deep"
                >
                  Agendar meu primeiro reparo
                </button>
              </div>
              <p className="label-tag text-muted-foreground mt-4">
                Piloto em Americana, SP e região
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

