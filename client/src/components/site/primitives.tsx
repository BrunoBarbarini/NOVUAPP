/*
 * ALINHAVO — Ateliê Editorial
 * Primitivas do design system: reveal on scroll, contadores costurados,
 * cabeçalhos de capítulo com numeração vertical, etiquetas de papel (swing tags).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fade+slide na entrada da viewport, com stagger opcional. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal-up", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Contador numérico que anima até o valor final ao entrar na viewport. */
export function CountUp({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setValue(end);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(end * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span ref={ref} className={cn("font-mono-data", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/** Cabeçalho de capítulo editorial com numeração vertical na margem. */
export function ChapterHeader({
  number,
  label,
  title,
  className,
}: {
  number: string;
  label: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("relative", className)}>
      <div className="flex items-start gap-5 sm:gap-8">
        <div className="hidden sm:flex flex-col items-center gap-3 pt-2 shrink-0">
          <span className="font-mono-data text-sm text-needle font-semibold [writing-mode:vertical-rl] tracking-[0.3em]">
            {number}
          </span>
          <span className="w-px h-14 bg-border" />
        </div>
        <div className="max-w-3xl">
          <p className="label-tag text-needle mb-3">{label}</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] font-semibold text-foreground">
            {title}
          </h2>
        </div>
      </div>
    </Reveal>
  );
}

/** Etiqueta de papel (swing tag) com furo e barbante — assinatura da marca. */
export function SwingTag({
  value,
  label,
  accent = false,
  className,
}: {
  value: ReactNode;
  label: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <svg
        className="absolute -top-6 left-6 h-7 w-8 text-muted-foreground/60"
        viewBox="0 0 32 28"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 2 C 12 10, 20 14, 16 26"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
      </svg>
      <div
        className={cn(
          "relative bg-card border border-border shadow-[0_2px_10px_-4px_rgba(40,50,30,0.25)] px-5 pt-5 pb-4 rounded-[3px]",
          "transition-transform duration-200 hover:-translate-y-0.5",
          accent && "bg-needle text-primary-foreground border-needle-deep",
        )}
      >
        <span
          className={cn(
            "absolute top-2.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full border",
            accent ? "border-primary-foreground/50 bg-needle-deep" : "border-border bg-background",
          )}
        />
        <div className="mt-2">
          <div className={cn("font-display text-2xl sm:text-[1.7rem] font-semibold leading-none", accent ? "text-primary-foreground" : "text-foreground")}>
            {value}
          </div>
          <div className={cn("label-tag mt-2", accent ? "text-primary-foreground/75" : "text-muted-foreground")}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Separador de linha de alinhavo com agulha. */
export function BasteDivider({ className }: { className?: string }) {
  return (
    <div className={cn("container flex items-center gap-3", className)} aria-hidden>
      <div className="baste-line flex-1" />
      <svg width="26" height="10" viewBox="0 0 26 10" fill="none" className="text-needle shrink-0">
        <path d="M1 5 L20 5 M20 5 L25 3.2 L25 6.8 Z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" strokeLinejoin="round" />
        <circle cx="4.5" cy="5" r="1.6" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
