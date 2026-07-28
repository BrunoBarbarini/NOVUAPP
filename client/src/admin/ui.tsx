/*
 * NOVU Admin — primitivas visuais do painel (Ateliê Editorial).
 * KPI "etiqueta de papel", chips de status, seção com título costurado.
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kpi({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "thread" | "needle";
}) {
  return (
    <div className="relative rounded-md border border-border bg-card px-4 py-4 shadow-[0_1px_2px_rgba(40,44,36,0.05)]">
      <span
        className={cn(
          "absolute left-4 top-0 h-[3px] w-8 rounded-b-sm",
          tone === "thread" ? "bg-thread" : tone === "needle" ? "bg-needle" : "bg-border",
        )}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-2xl lg:text-[28px] font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Chip({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card/50 px-4 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

