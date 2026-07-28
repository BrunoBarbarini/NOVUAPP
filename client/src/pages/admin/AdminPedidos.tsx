/*
 * NOVU Admin — Pedidos (Ateliê Editorial).
 * Lista com filtros por status + busca; detalhe em painel lateral (Sheet)
 * com timeline (espelho da T8 do app), extra aprovado e atribuição de costureira.
 */
import { useMemo, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { Kpi, Chip, EmptyRow } from "@/admin/ui";
import {
  pedidos as pedidosIniciais,
  costureirasAtivas,
  brl,
  dataCurta,
  STATUS_PEDIDO_LABEL,
  STATUS_PEDIDO_TONE,
  TAXA_NOVU,
  type Pedido,
  type StatusPedido,
} from "@/admin/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Quote } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FILTROS: { id: "todos" | StatusPedido; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "novo", label: "Novos" },
  { id: "aguardando_aceite", label: "Aguardando aceite" },
  { id: "coleta", label: "Coleta" },
  { id: "em_costura", label: "Em costura" },
  { id: "pronto", label: "Prontos" },
  { id: "entregue", label: "Entregues" },
  { id: "cancelado", label: "Cancelados" },
];

const ETAPAS: StatusPedido[] = ["novo", "aguardando_aceite", "coleta", "em_costura", "pronto", "entregue"];

export default function AdminPedidos() {
  const [lista, setLista] = useState<Pedido[]>(pedidosIniciais);
  const [filtro, setFiltro] = useState<"todos" | StatusPedido>("todos");
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<Pedido | null>(null);

  const filtrados = useMemo(() => {
    return lista.filter((p) => {
      const okF = filtro === "todos" || p.status === filtro;
      const q = busca.trim().toLowerCase();
      const okB =
        !q ||
        [p.codigo, p.cliente, p.peca, p.servico, p.costureira ?? "", p.bairro].join(" ").toLowerCase().includes(q);
      return okF && okB;
    });
  }, [lista, filtro, busca]);

  const atribuir = (codigo: string, costureira: string) => {
    setLista((ls) =>
      ls.map((p) => (p.codigo === codigo ? { ...p, costureira, status: "aguardando_aceite" as StatusPedido } : p)),
    );
    setSel((s) => (s && s.codigo === codigo ? { ...s, costureira, status: "aguardando_aceite" } : s));
    toast.success(`Pedido ${codigo} enviado para ${costureira.split(" (")[0]}`);
  };

  const ativos = lista.filter((p) => !["entregue", "cancelado"].includes(p.status));

  return (
    <AdminLayout title="Pedidos" subtitle="Cada peça em movimento no ateliê, do pedido à entrega.">
      <div className="grid grid-cols-3 gap-3 lg:w-2/3 lg:gap-4">
        <Kpi label="Ativos" value={ativos.length} tone="needle" />
        <Kpi label="Sem costureira" value={lista.filter((p) => !p.costureira && p.status !== "cancelado").length} tone="thread" />
        <Kpi label="Entregues no mês" value={lista.filter((p) => p.status === "entregue").length} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filtro === f.id
                ? "border-needle bg-needle text-primary-foreground"
                : "border-border bg-card text-ink/70 hover:border-needle/40",
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código, cliente, peça…"
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-card">
        {filtrados.length === 0 ? (
          <EmptyRow>Nenhum pedido encontrado com esses filtros.</EmptyRow>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Peça · Serviço</th>
                <th className="px-4 py-3">Costureira</th>
                <th className="px-4 py-3">Prazo</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr
                  key={p.codigo}
                  onClick={() => setSel(p)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-linen/60"
                >
                  <td className="px-4 py-3 font-mono text-xs text-thread">{p.codigo}</td>
                  <td className="px-4 py-3">{p.cliente}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{p.peca}</span>
                    <span className="text-muted-foreground"> · {p.servico}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.costureira ?? <em className="text-thread">a atribuir</em>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{dataCurta(p.prazo)}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {brl(p.valor + (p.extra?.aprovado ? p.extra.valor : 0))}
                  </td>
                  <td className="px-4 py-3">
                    <Chip className={STATUS_PEDIDO_TONE[p.status]}>{STATUS_PEDIDO_LABEL[p.status]}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detalhe do pedido */}
      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-linen p-0">
          {sel && (
            <div className="p-6">
              <SheetHeader className="p-0">
                <p className="font-mono text-xs text-thread">{sel.codigo}</p>
                <SheetTitle className="font-display text-xl tracking-tight text-ink">
                  {sel.peca} — {sel.servico}
                </SheetTitle>
                <Chip className={cn("w-fit", STATUS_PEDIDO_TONE[sel.status])}>{STATUS_PEDIDO_LABEL[sel.status]}</Chip>
              </SheetHeader>

              {/* Timeline (espelho da T8) */}
              {sel.status !== "cancelado" && (
                <div className="mt-6 rounded-md border border-border bg-card p-4">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Linha do pedido
                  </p>
                  <ol className="flex items-center">
                    {ETAPAS.map((etapa, i) => {
                      const atual = ETAPAS.indexOf(sel.status);
                      const done = i <= atual;
                      return (
                        <li key={etapa} className="flex items-center flex-1 last:flex-none">
                          <span
                            className={cn(
                              "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[9px] font-bold",
                              done ? "border-needle bg-needle text-primary-foreground" : "border-border bg-card text-muted-foreground",
                            )}
                            title={STATUS_PEDIDO_LABEL[etapa]}
                          >
                            {i + 1}
                          </span>
                          {i < ETAPAS.length - 1 && (
                            <span
                              className={cn(
                                "mx-1 h-0 flex-1 border-t-2 border-dashed",
                                i < atual ? "border-needle" : "border-border",
                              )}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ol>
                  <p className="mt-2.5 text-xs text-muted-foreground">
                    Etapa atual: <strong className="text-ink">{STATUS_PEDIDO_LABEL[sel.status]}</strong> · prazo{" "}
                    {dataCurta(sel.prazo)}
                  </p>
                </div>
              )}

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border border-border bg-card p-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Cliente</dt>
                  <dd className="mt-0.5 font-medium">{sel.cliente}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Coleta</dt>
                  <dd className="mt-0.5 font-medium">{sel.bairro}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Criado em</dt>
                  <dd className="mt-0.5 font-medium">{dataCurta(sel.criadoEm)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Costureira</dt>
                  <dd className="mt-0.5 font-medium">{sel.costureira ?? "—"}</dd>
                </div>
              </dl>

              {sel.observacao && (
                <blockquote className="mt-4 flex gap-2.5 rounded-md border border-border bg-card p-4 text-sm italic text-ink/80">
                  <Quote className="h-4 w-4 shrink-0 text-thread" />
                  <span>
                    “{sel.observacao}” <span className="not-italic text-muted-foreground">— {sel.cliente.split(" ")[0]}</span>
                  </span>
                </blockquote>
              )}

              {/* Valores */}
              <div className="mt-5 rounded-md border border-border bg-card p-4 text-sm">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Valores</p>
                <div className="flex justify-between py-1">
                  <span>Serviço</span>
                  <span className="font-mono">{brl(sel.valor)}</span>
                </div>
                {sel.extra && (
                  <div className="flex justify-between py-1">
                    <span>
                      Extra: {sel.extra.descricao}{" "}
                      <Chip
                        className={
                          sel.extra.aprovado
                            ? "bg-needle/10 text-needle border-needle/40"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/40"
                        }
                      >
                        {sel.extra.aprovado ? "aprovado pela cliente" : "aguardando cliente"}
                      </Chip>
                    </span>
                    <span className="font-mono">{brl(sel.extra.valor)}</span>
                  </div>
                )}
                {(() => {
                  const total = sel.valor + (sel.extra?.aprovado ? sel.extra.valor : 0);
                  return (
                    <>
                      <div className="mt-1 flex justify-between border-t border-dashed border-border pt-2 font-medium">
                        <span>Total da cliente</span>
                        <span className="font-mono">{brl(total)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-muted-foreground">
                        <span>Repasse costureira (70%)</span>
                        <span className="font-mono">{brl(Math.round(total * (1 - TAXA_NOVU)))}</span>
                      </div>
                      <div className="flex justify-between py-1 text-needle font-medium">
                        <span>Taxa NOVU (30%)</span>
                        <span className="font-mono">{brl(Math.round(total * TAXA_NOVU))}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Atribuir costureira */}
              {!sel.costureira && sel.status !== "cancelado" && (
                <div className="mt-5 rounded-md border border-thread/40 bg-thread/8 p-4">
                  <p className="mb-2 text-sm font-medium">Atribuir costureira</p>
                  <AtribuirForm codigo={sel.codigo} onAtribuir={atribuir} />
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}

function AtribuirForm({ codigo, onAtribuir }: { codigo: string; onAtribuir: (c: string, n: string) => void }) {
  const [nome, setNome] = useState("");
  return (
    <div className="flex gap-2">
      <Select value={nome} onValueChange={setNome}>
        <SelectTrigger className="flex-1 bg-card">
          <SelectValue placeholder="Escolher da rede…" />
        </SelectTrigger>
        <SelectContent>
          {costureirasAtivas
            .filter((c) => c.status === "ativa")
            .map((c) => (
              <SelectItem key={c.id} value={c.nome}>
                {c.nome} · {c.bairro}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Button disabled={!nome} onClick={() => onAtribuir(codigo, nome)}>
        Enviar
      </Button>
    </div>
  );
}
