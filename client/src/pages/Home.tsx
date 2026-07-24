/*
 * NOVU — Casa de Vó Editorial
 * One-page para cliente final e costureiras: hero afetivo → manifesto →
 * como funciona → a causa → para costureiras → escola → planeta → convite.
 */
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Cause } from "@/components/site/Cause";
import { ForSeamstresses } from "@/components/site/ForSeamstresses";
import { School } from "@/components/site/School";
import { Sustainability } from "@/components/site/Sustainability";
import { Contact } from "@/components/site/Contact";
import { BasteDivider } from "@/components/site/primitives";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Nav />
      <main>
        <Hero />
        <BasteDivider />
        <Manifesto />
        <HowItWorks />
        <Cause />
        <ForSeamstresses />
        <School />
        <Sustainability />
        <Contact />
      </main>
    </div>
  );
}

