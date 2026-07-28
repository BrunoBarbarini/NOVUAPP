/*
 * NOVU Admin — Visão geral (Ateliê Editorial).
 * KPIs em etiquetas de papel, gráfico de receita (Views/CSS), fila do dia e pendências.
 */
import { Link } from "wouter";
import AdminLayout from "@/admin/AdminLayout";
import { Kpi, Chip, SectionTitle } from "@/admin/ui";
import {
  pedidos,
  cadastrosPendentes,
  receitaSemanal,
  brl,
  dataCurta,
  STATUS_PEDIDO_LABEL,
  STATUS_PEDIDO_TONE,
  TAXA_NOVU,
} from "@/admin/data";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const ativos = pedidos.filter((p) => !["entregue", "cancelado"].includes(p.status));
  const semCostureira = pedidos.filter((p) => !p.costureira && p.status !== "cancelado");
  const receitaMes = receitaSemanal.slice(-4).reduce((s, w) => s + w.bruto, 0);
  const max = Math.max(...receitaSemanal.map((w) => w.bruto));
  const urgentes = ativos.filter((p) => new Date(p.prazo).getTime() - Date.now() < 2 * 864e5);

  return (
    <AdminLayout title="Visão geral" subtitle="Segunda-feira, 28 de julho — o ateliê está em movimento.">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi label="Pedidos ativos" value={ativos.length} hint={`${semCostureira.length} aguardando costureira`} tone="needle" />
        <Kpi label="Receita do mês (bruta)" value={brl(receitaMes)} hint={`NOVU fica com ${brl(Math.round(receitaMes * TAXA_NOVU))}`} tone="thread" />
        <Kpi label="Costureiras na fila" value={cadastrosPendentes.length} hint="cadastros para aprovar" />
        <Kpi label="Prazos críticos" value={urgentes.length} hint="entrega em menos de 48h" />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-5">
        <section className="xl:col-span-3">
          <SectionTitle
            action={
              <Link href="/admin/financeiro" className="text-sm font-medium text-needle hover:underline">
                Ver financeiro <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            }
          >
            Receita bruta · últimas 8 semanas
          </SectionTitle>
          <div className="rounded-md border border-border bg-card p-5">
            <div className="flex items-end gap-2 h-44">
              {receitaSemanal.map((w) => (
                <div key={w.semana} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">{brl(w.bruto).replace(",00", "")}</span>
                  <div className="w-full max-w-9 flex flex-col justify-end" style={{ height: "120px" }}>
                    <div
                      className="w-full rounded-t-sm bg-needle/85 transition-all"
                      style={{ height: `${(w.bruto / max) * 100}%` }}
                    >
                      <div className="h-full w-full rounded-t-sm bg-gradient-to-t from-transparent to-white/15" />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{w.semana}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
              Crescimento de <strong className="text-needle">+63%</strong> desde o início de junho. A taxa NOVU (30%)
              está aplicada sobre cada pedido concluído.
            </p>
          </div>
        </section>

        <section className="xl:col-span-2">
          <SectionTitle
            action={
              <Link href="/admin/aprovacoes" className="text-sm font-medium text-needle hover:underline">
                Ver fila <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            }
          >
            Pendências de hoje
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {semCostureira.slice(0, 2).map((p) => (
              <Link
                key={p.codigo}
                href={`/admin/pedidos?sel=${p.codigo}`}
                className="group rounded-md border border-border bg-card p-4 transition-colors hover:border-needle/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-thread">{p.codigo}</span>
                  <Chip className={STATUS_PEDIDO_TONE[p.status]}>{STATUS_PEDIDO_LABEL[p.status]}</Chip>
                </div>
                <p className="mt-1.5 text-sm font-medium">
                  {p.peca} — {p.servico}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.cliente} · {p.bairro} · prazo {dataCurta(p.prazo)} · <strong>sem costureira</strong>
                </p>
              </Link>
            ))}
            {cadastrosPendentes.slice(0, 2).map((c) => (
              <Link
                key={c.id}
                href="/admin/aprovacoes"
                className="group rounded-md border border-border bg-card p-4 transition-colors hover:border-needle/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{c.nome}</span>
                  <Chip className="bg-amber-500/10 text-amber-700 border-amber-500/40">Aguardando aprovação</Chip>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.bairro} · {c.especialidades.slice(0, 2).join(", ")} · enviado {dataCurta(c.enviadoEm)}
                </p>
              </Link>
            ))}
            {urgentes.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-md border border-thread/40 bg-thread/8 p-4 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-thread" />
                <p className="text-ink/80">
                  <strong>{urgentes.length} pedido(s)</strong> com entrega em menos de 48h — vale conferir o andamento
                  na aba <Link href="/admin/pedidos" className="font-medium text-needle underline">Pedidos</Link>.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <SectionTitle
          action={
            <Link href="/admin/pedidos" className="text-sm font-medium text-needle hover:underline">
              Todos os pedidos <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          }
        >
          Em movimento agora
        </SectionTitle>
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Peça · Serviço</th>
                <th className="px-4 py-3">Costureira</th>
                <th className="px-4 py-3">Prazo</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ativos.map((p) => (
                <tr key={p.codigo} className="border-b border-border/60 last:border-0 hover:bg-linen/60">
                  <td className="px-4 py-3 font-mono text-xs text-thread">{p.codigo}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{p.peca}</span>
                    <span className="text-muted-foreground"> · {p.servico}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.costureira ?? <em className="text-thread">a atribuir</em>}</td>
                  <td className="px-4 py-3 font-mono text-xs">{dataCurta(p.prazo)}</td>
                  <td className="px-4 py-3 text-right font-mono">{brl(p.valor + (p.extra?.aprovado ? p.extra.valor : 0))}</td>
                  <td className="px-4 py-3">
                    <Chip className={STATUS_PEDIDO_TONE[p.status]}>{STATUS_PEDIDO_LABEL[p.status]}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

