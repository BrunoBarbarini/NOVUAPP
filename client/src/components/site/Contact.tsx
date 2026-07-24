/* ALINHAVO — Ateliê Editorial: o "ask" em bloco full-bleed + footer costurado */
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
              Buscamos <em className="text-[oklch(0.78_0.14_45)]">R$ 150–250 mil</em> para
              costurar os primeiros 12 meses.
            </h2>
            <p className="text-[oklch(0.78_0.01_85)] leading-relaxed mt-6 text-lg max-w-2xl lg:mx-auto">
              Investidores-anjo, fundos de impacto, marcas e brechós que queiram
              ser parceiros fundadores: o playbook está pronto, o mercado está
              aberto e a janela de pioneirismo não fica aberta para sempre.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap lg:justify-center gap-4">
              <button
                onClick={() => toast.info("Em breve: agenda direta com o fundador. Por enquanto, use o e-mail ao lado.")}
                className="inline-flex items-center gap-2 bg-thread text-white font-semibold px-7 py-4 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:brightness-95"
              >
                Agendar conversa
              </button>
              <a
                href="mailto:contato@alinhavo.com.br?subject=Interesse%20no%20pitch%20Alinhavo"
                className="inline-flex items-center gap-2 font-semibold px-7 py-4 rounded-[3px] border-[1.5px] border-dashed border-[oklch(0.72_0.1_150)] text-[oklch(0.88_0.05_150)] hover:bg-white/5 transition-colors duration-150 active:scale-[0.97]"
              >
                contato@alinhavo.com.br
              </a>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="label-tag text-[oklch(0.6_0.01_85)] mt-10">
              Deck completo, plano financeiro e pesquisa de mercado disponíveis sob NDA
            </p>
          </Reveal>
        </div>
      </section>
      <footer className="bg-ink text-[oklch(0.68_0.01_85)] border-t border-white/10">
        <div className="container py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/manus-storage/alinhavo-logo_367ede4a.png" alt="" className="h-7 w-7 object-contain brightness-[2.2]" />
            <span className="font-display text-lg font-semibold text-[oklch(0.9_0.01_85)]">alinhavo</span>
          </div>
          <p className="text-xs leading-relaxed max-w-md">
            Site de apresentação do plano de negócio. Dados de mercado: IEMI, Aliança
            Empreendedora, Vogue Business, ReLondon. SOJO é marca de terceiros, citada
            como referência de modelo.
          </p>
          <p className="text-xs font-mono-data">© 2026 Alinhavo</p>
        </div>
      </footer>
    </>
  );
}
