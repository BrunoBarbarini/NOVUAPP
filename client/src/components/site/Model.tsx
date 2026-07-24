/* ALINHAVO — Ateliê Editorial: capítulo 03, modelo em 3 fases + como funciona + hub */
import { ChapterHeader, Reveal } from "./primitives";
import { Smartphone, Bike, Scissors, PackageCheck, Building2, Warehouse, Store } from "lucide-react";

const STEPS = [
  {
    icon: Smartphone,
    t: "1 · Pedido em 2 minutos",
    d: "Cliente escolhe o serviço (bainha, zíper, ajuste de cintura...) no site ou WhatsApp, com preço fechado e prazo de 5 dias úteis.",
  },
  {
    icon: Bike,
    t: "2 · Coleta porta-a-porta",
    d: "Motoboy parceiro retira a peça em casa, lacrada e rastreada, por R$ 16,90 de logística agrupada.",
  },
  {
    icon: Scissors,
    t: "3 · Reparo por especialista",
    d: "A peça vai para a costureira certa da rede curada — remunerada com 65% do valor, cerca de 2x o mercado informal.",
  },
  {
    icon: PackageCheck,
    t: "4 · Devolução com QC",
    d: "Controle de qualidade, embalagem de marca e entrega de volta — com garantia de refação sem custo.",
  },
];

const PHASES = [
  {
    icon: Store,
    tag: "Fase 1 · Meses 0–9",
    t: "Marketplace curado",
    d: "8–12 costureiras selecionadas, logística terceirizada, site + WhatsApp. Foco no quadrilátero Pinheiros–Vila Madalena–Itaim–Jardins, em São Paulo, com 10 serviços core.",
    highlight: false,
  },
  {
    icon: Warehouse,
    tag: "Fase 2 · Meses 9–18",
    t: "Hub híbrido de costura",
    d: "Mini-hub de 60–100 m² com 2–4 costureiras CLT — a \"dark kitchen da costura\". QC de 100% das peças, prazos menores e início dos pilotos B2B.",
    highlight: true,
  },
  {
    icon: Building2,
    tag: "Fase 3 · Meses 18–36",
    t: "B2B white-label & escala",
    d: "Reparo pós-venda para marcas, recuperação de estoque danificado de varejistas e expansão para a segunda cidade.",
    highlight: false,
  },
];

export function Model() {
  return (
    <section id="modelo" className="py-20 lg:py-28">
      <div className="container">
        <ChapterHeader
          number="03"
          label="O modelo Alinhavo"
          title={
            <>
              Conveniência de app na frente,{" "}
              <em className="text-needle">ateliê profissional por trás.</em>
            </>
          }
        />

        {/* Como funciona */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 70}>
              <div className="relative h-full bg-card border border-border rounded-[4px] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_-14px_rgba(40,50,30,0.35)]">
                <s.icon className="h-6 w-6 text-needle" strokeWidth={1.6} />
                <h3 className="font-semibold text-foreground mt-4 leading-snug">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{s.d}</p>
                {i < STEPS.length - 1 && (
                  <span className="hidden lg:block absolute top-1/2 -right-[26px] w-6 baste-line-thread" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Imagens hub + delivery */}
        <div className="grid lg:grid-cols-12 gap-10 mt-20 items-center">
          <Reveal className="lg:col-span-6">
            <div className="rounded-[4px] overflow-hidden shadow-[0_18px_44px_-18px_rgba(40,50,30,0.4)]">
              <img
                src="/manus-storage/alinhavo-hub_c739fb01.png"
                alt="Hub de costura com costureiras profissionais trabalhando em bancadas"
                className="w-full h-[280px] sm:h-[340px] object-cover"
              />
            </div>
            <p className="label-tag text-muted-foreground mt-3">
              O hub: qualidade industrial com alma de ateliê
            </p>
          </Reveal>
          <div className="lg:col-span-6">
            <Reveal delay={80}>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-snug">
                O hub de costureiras é o fosso competitivo
              </h3>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Marketplaces puros não controlam qualidade — e qualidade é tudo
                neste negócio. Assim como a SOJO verticalizou em Hackney, a
                Alinhavo evolui de rede curada para um hub próprio: costureiras
                contratadas, treinamento contínuo (SENAI e institutos), controle
                de 100% das peças e capacidade de assinar contratos B2B com SLA.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Repasse de 65% por serviço na rede — cerca de 2x a renda do mercado informal",
                  "Pagamento semanal garantido e formalização via MEI",
                  "No hub: CLT, treinamento e plano de carreira para um ofício que envelhece sem renovação",
                ].map((li) => (
                  <li key={li} className="flex gap-3 text-foreground leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-4 baste-line-thread shrink-0" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* 3 fases */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {PHASES.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div
                className={
                  p.highlight
                    ? "h-full rounded-[4px] p-7 bg-needle text-primary-foreground shadow-[0_16px_40px_-16px_rgba(30,70,45,0.55)]"
                    : "h-full rounded-[4px] p-7 bg-card border border-border"
                }
              >
                <p className={p.highlight ? "label-tag text-primary-foreground/70" : "label-tag text-needle"}>
                  {p.tag}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <p.icon className={p.highlight ? "h-6 w-6 text-primary-foreground" : "h-6 w-6 text-needle"} strokeWidth={1.6} />
                  <h3 className="font-display text-xl font-semibold">{p.t}</h3>
                </div>
                <p className={p.highlight ? "text-primary-foreground/85 leading-relaxed mt-3 text-sm" : "text-muted-foreground leading-relaxed mt-3 text-sm"}>
                  {p.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

