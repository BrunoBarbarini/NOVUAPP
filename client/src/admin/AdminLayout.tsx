/*
 * NOVU Admin — layout do painel.
 * Estilo Ateliê Editorial: papel linho, sidebar "lombada de caderno de ateliê"
 * com linha de alinhavo tracejada, Fraunces para títulos, Spline Sans Mono para dados.
 */
import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { supabase } from "./supabase";
import {
  LayoutDashboard,
  Package,
  UserCheck,
  Users,
  Wallet,
  Contact,
  LogOut,
  Scissors,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/aprovacoes", label: "Aprovações", icon: UserCheck, badge: 0 },
  { href: "/admin/costureiras", label: "Costureiras", icon: Users },
  { href: "/admin/clientes", label: "Clientes", icon: Contact },
  { href: "/admin/financeiro", label: "Financeiro", icon: Wallet },
];

export default function AdminLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [pendentes, setPendentes] = useState(0);

  useEffect(() => {
    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      if (!data.session) navigate("/admin/login");
      else setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!pronto) return;
    const carregar = () =>
      supabase
        .from("costureiras")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente")
        .then(({ count }) => setPendentes(count ?? 0));
    carregar();
    const channel = supabase
      .channel("layout-costureiras")
      .on("postgres_changes", { event: "*", schema: "public", table: "costureiras" }, carregar)
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [pronto]);

  const sair = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active =
          item.href === "/admin" ? location === "/admin" : location.startsWith(item.href);
        const Icon = item.icon;
        const badge = item.href === "/admin/aprovacoes" ? pendentes : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
              active
                ? "bg-needle text-primary-foreground shadow-sm"
                : "text-ink/70 hover:bg-linen-deep hover:text-ink",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.4 : 2} />
            <span className="flex-1">{item.label}</span>
            {badge ? (
              <span
                className={cn(
                  "font-mono text-[11px] rounded-full px-1.5 py-0.5 leading-none",
                  active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-thread/15 text-thread",
                )}
              >
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="px-6 pt-6 pb-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-needle text-primary-foreground">
            <Scissors className="h-4.5 w-4.5" />
          </span>
          <span>
            <span className="block font-display text-xl font-semibold tracking-tight text-ink">NOVU</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Ateliê central
            </span>
          </span>
        </Link>
      </div>
      <div className="mx-6 mb-4 border-t border-dashed border-border" aria-hidden />
      {nav}
      <div className="mt-auto px-3 pb-5">
        <div className="mx-3 mb-4 border-t border-dashed border-border" aria-hidden />
        <button
          onClick={sair}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:bg-linen-deep hover:text-ink"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </>
  );

  if (!pronto) {
    return (
      <div className="min-h-screen bg-linen grid place-items-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
          NOVU · abrindo o ateliê…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen text-ink flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
        {sidebarInner}
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-card shadow-xl">
            <button
              className="absolute right-3 top-3 p-2 text-ink/60"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarInner}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-border bg-linen/90 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-5 py-4 lg:px-8">
            <button
              className="lg:hidden p-1.5 -ml-1.5 text-ink/70"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl lg:text-2xl font-semibold tracking-tight truncate">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
            </div>
            <span className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink/70">
              <span className="h-2 w-2 rounded-full bg-needle" /> Bruno · Fundador
            </span>
          </div>
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
        <footer className="px-5 pb-6 lg:px-8">
          <p className="border-t border-dashed border-border pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            NOVU · painel interno · conectado ao ateliê em tempo real
          </p>
        </footer>
      </div>
    </div>
  );
}
