/*
 * ALINHAVO — Ateliê Editorial
 * One-page pitch para investidores e parceiros: hero → oportunidade →
 * validação SOJO → modelo → números → roadmap → impacto → convite.
 */
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Opportunity } from "@/components/site/Opportunity";
import { Validation } from "@/components/site/Validation";
import { Model } from "@/components/site/Model";
import { Financials } from "@/components/site/Financials";
import { Roadmap } from "@/components/site/Roadmap";
import { Impact } from "@/components/site/Impact";
import { Contact } from "@/components/site/Contact";
import { BasteDivider } from "@/components/site/primitives";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Nav />
      <main>
        <Hero />
        <BasteDivider />
        <Opportunity />
        <Validation />
        <Model />
        <Financials />
        <Roadmap />
        <Impact />
        <Contact />
      </main>
    </div>
  );
}
