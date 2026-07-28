/*
 * NOVU Admin — Rede de costureiras (Ateliê Editorial).
 * Visão da rede ativa: especialidades, carga, avaliação e ganhos do mês.
 */
import AdminLayout from "@/admin/AdminLayout";
import { Kpi, Chip, SectionTitle } from "@/admin/ui";
import { costureirasAtivas, brl } from "@/admin/data";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCostureiras() {
  const ativas = costureirasAtivas.filter((c) => c.status === "ativa");
  const mediaAval = ativas.reduce((s, c) => s + c.avaliacao, 0) / ativas.length;

  return (
    <AdminLayout title="Costureiras" subtitle="A rede que faz a NOVU acontecer, bairro a bairro.">
      <div className="grid grid-cols-3 gap-3 lg:w-2/3 lg:gap-4">
        <Kpi label="Na rede" value={costureirasAtivas.length} hint={`${ativas.length} ativas`} tone="needle" />
        <Kpi label="Avaliação média" value={mediaAval.toFixed(1)} hint="das clientes" tone="thread" />
        <Kpi label="Pedidos no mês" value={ativas.reduce((s, c) => s + c.pedidosMes, 0)} />
      </div>

      <section className="mt-8">
        <SectionTitle>Rede completa</SectionTitle>
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3">Costureira</th>
                <th className="px-4 py-3">Especialidades</th>
                <th className="px-4 py-3 text-center">Pedidos/mês</th>
                <th className="px-4 py-3 text-center">Em andamento</th>
                <th className="px-4 py-3 text-center">Avaliação</th>
                <th className="px-4 py-3 text-right">Ganhos no mês</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {costureirasAtivas.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-linen/60">
                  <td className="px-4 py-3">
                    <span className="font-medium">{c.nome}</span>
                    <span className="block text-xs text-muted-foreground">
                      {c.bairro} · desde {new Date(c.desde).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.especialidades.map((e) => (
                        <Chip key={e} className="border-needle/30 bg-needle/6 text-needle text-[11px]">
                          {e}
                        </Chip>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono">{c.pedidosMes}</td>
                  <td className="px-4 py-3 text-center font-mono">{c.emAndamento}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Star className="h-3.5 w-3.5 fill-thread text-thread" /> {c.avaliacao.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{brl(c.ganhosMes)}</td>
                  <td className="px-4 py-3">
                    <Chip
                      className={cn(
                        c.status === "ativa"
                          ? "border-needle/40 bg-needle/10 text-needle"
                          : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {c.status === "ativa" ? "Ativa" : "Pausada"}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A carga é balanceada na atribuição de pedidos: costureiras com menos peças em andamento aparecem primeiro na
          lista de atribuição.
        </p>
      </section>
    </AdminLayout>
  );
}

