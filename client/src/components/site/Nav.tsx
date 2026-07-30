import wordmarkImg from "@/assets/novu-wordmark.png";
/* NOVU — Casa de Vó Editorial: nav fina, wordmark Fraunces, CTA duplo afetivo */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#manifesto", label: "Nosso manifesto" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#a-causa", label: "A causa" },
  { href: "#costureiras", label: "Para costureiras" },
  { href: "#escola", label: "Escola NOVU" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "bg-background/92 backdrop-blur-md shadow-[0_1px_0_0_var(--border)]"
          : "bg-transparent",
      )}
    >
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center" aria-label="NOVU — início">
          <img
            src={wordmarkImg}
            alt="NOVU"
            className="h-8 w-auto object-contain"
          />
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:link-baste transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#costureiras"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-needle link-baste"
          >
            Sou costureira
          </a>
          <a
            href="#reparar"
            className="inline-flex items-center gap-2 bg-thread text-white text-sm font-semibold px-4 py-2 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:brightness-95"
          >
            Quero reparar uma peça
          </a>
        </div>
      </div>
    </header>
  );
}
