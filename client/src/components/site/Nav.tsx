/* ALINHAVO — Ateliê Editorial: nav fina, wordmark Fraunces, CTA laranja-linha */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#oportunidade", label: "A oportunidade" },
  { href: "#validacao", label: "O caso SOJO" },
  { href: "#modelo", label: "O modelo" },
  { href: "#financeiro", label: "Números" },
  { href: "#roadmap", label: "Roadmap" },
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
        <a href="#" className="flex items-center gap-2.5" aria-label="Alinhavo — início">
          <img
            src="/manus-storage/alinhavo-logo_367ede4a.png"
            alt=""
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-[1.45rem] font-semibold tracking-tight text-foreground">
            alinhavo
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
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
        <a
          href="#contato"
          className="inline-flex items-center gap-2 bg-thread text-white text-sm font-semibold px-4 py-2 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:brightness-95"
        >
          Falar com o fundador
        </a>
      </div>
    </header>
  );
}
