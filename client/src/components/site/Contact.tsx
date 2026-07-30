import logoImg from "@/assets/novu-logo.webp";
/* NOVU — Casa de Vó Editorial: convite final duplo (cliente + costureira) e
   footer costurado com aviso de piloto. */
import { Reveal } from "./primitives";
import { toast } from "sonner";

export function Contact() {
  return (
    <>
      <section id="contato" className="py-20 lg:py-28 bg-ink text-[oklch(0.94_0.01_85)] paper-grain">
        <div className="container max-w-4xl mx-auto text-left lg:text-center">
          <Reveal>
            <p className="label-tag text-[oklch(0.72_0.1_150)] mb-4">O convite</p>
            <h2 className="font-display text-3xl sm:text-5xl leading-[1.1] font-semibold">
              Tem uma peça esperando por cuidado?{" "}
              <em className="text-[oklch(0.78_0.14_45)]">Ou mãos que sabem cuidar?</em>
            </h2>
            <p className="text-[oklch(0.78_0.01_85)] leading-relaxed mt-6 text-lg max-w-2xl lg:mx-auto">
              A NOVU está começando por Americana, de pontinho em pontinho.
              Deixe seu contato e seja das primeiras pessoas a reparar com a
              gente — ou das primeiras costureiras da rede.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap lg:justify-center gap-4">
              <button
                onClick={() => toast.info("Lista de espera abrindo em breve! Enquanto isso, escreva para ola@novu.com.br.")}
                className="inline-flex items-center gap-2 bg-thread text-white font-semibold px-7 py-4 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:brightness-95"
              >
                Quero reparar uma peça
              </button>
              <button
                onClick={() => toast.info("Cadastro da rede de costureiras abrindo em breve! Escreva para ola@novu.com.br.")}
                className="inline-flex items-center gap-2 font-semibold px-7 py-4 rounded-[3px] border-[1.5px] border-dashed border-[oklch(0.72_0.1_150)] text-[oklch(0.88_0.05_150)] hover:bg-white/5 transition-colors duration-150 active:scale-[0.97]"
              >
                Sou costureira
              </button>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <a
              href="mailto:ola@novu.com.br"
              className="label-tag text-[oklch(0.6_0.01_85)] mt-10 inline-block link-baste"
            >
              ola@novu.com.br
            </a>
          </Reveal>
        </div>
      </section>
      <footer className="bg-ink text-[oklch(0.68_0.01_85)] border-t border-white/10">
        <div className="container py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="" className="h-7 w-7 object-contain brightness-[1.6]" />
            <span className="font-display text-lg font-semibold text-[oklch(0.9_0.01_85)]">novu</span>
          </div>
          <p className="text-xs leading-relaxed max-w-md">
            Roupas guardam memórias — a gente cuida delas. Dados sobre o ofício:
            Aliança Empreendedora (2023) e IEMI. Piloto em Americana, SP.
          </p>
          <p className="text-xs font-mono-data">© 2026 NOVU · feito com carinho</p>
        </div>
      </footer>
    </>
  );
}
