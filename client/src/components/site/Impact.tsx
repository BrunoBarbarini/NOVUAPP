/* ALINHAVO — Ateliê Editorial: impacto social + imagem delivery, spread assimétrico */
import { Reveal } from "./primitives";

const IMPACT = [
  { v: "~2x", l: "de renda para costureiras vs. mercado informal" },
  { v: "7 dias", l: "ciclo de pagamento semanal garantido" },
  { v: "MEI", l: "formalização e acesso a crédito e previdência" },
  { v: "-CO₂", l: "cada peça reparada evita uma peça nova produzida" },
];

export function Impact() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/60">
      <div className="container grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <Reveal>
            <p className="label-tag text-needle mb-3">Impacto que investidores ESG procuram</p>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.12] font-semibold text-foreground">
              Um negócio que remunera o ofício —{" "}
              <em className="text-needle">e estende a vida das roupas.</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-5 text-lg">
              64% das costureiras autônomas dizem não se sentir valorizadas. A
              Alinhavo inverte essa equação: demanda organizada, repasse justo,
              treinamento com SENAI e institutos parceiros, e a dignidade de um
              ofício tratado como profissão — não como quebra-galho.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-5 mt-8">
            {IMPACT.map((m, i) => (
              <Reveal key={m.l} delay={i * 60}>
                <div className="border-l-2 border-thread pl-4">
                  <p className="font-display text-2xl font-semibold text-foreground">{m.v}</p>
                  <p className="text-sm text-muted-foreground leading-snug mt-1">{m.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={100} className="lg:col-span-6 order-1 lg:order-2">
          <div className="rounded-[4px] overflow-hidden rotate-[1deg] shadow-[0_18px_44px_-18px_rgba(40,50,30,0.4)]">
            <img
              src="/manus-storage/alinhavo-delivery_e2a0bfa3.png"
              alt="Entregador de bicicleta recebendo peça embalada em papel kraft de uma cliente"
              className="w-full h-[320px] sm:h-[400px] object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
