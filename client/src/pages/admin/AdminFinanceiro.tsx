/*
 * NOVU Admin — Financeiro (Ateliê Editorial).
 * O outro lado da T21 do app: receita, taxa NOVU e repasses às costureiras.
 */
import { useEffect, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { Kpi, Chip, SectionTitle } from "@/admin/ui";
import { brl, dataCurta, TAXA_NOVU, type StatusRepasse, type Repasse } from "@/admin/data";
import {
  fetchRepasses,
  fetchReceitaSemanal,
  marcarRepassePagoDb,
  gerarRepassesSemana,
  subscribe,
  type SemanaReceita,
} from "@/admin/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const REPASSE_LABEL: Record<StatusRepasse, string> = {
  pago: "Pago",
  a_caminho: "A caminho",
  agendado: "Agendado",
};

const REPASSE_TONE: Record<StatusRepasse, string> = {
  pago: "border-needle/40 bg-needle/10 text-needle",
  a_caminho: "border-sky-500/40 bg-sky-500/10 text-sky-700",
  agendado: "border-amber-500/40 bg-amber-500/10 text-amber-700",
};

export default function AdminFinanceiro() {
  const [receitaSemanal, setReceita] = useState<SemanaReceita[]>([]);
  const [repasses, setRepasses] = useState<(Repasse & { dbId: string })[]>([]);
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      Promise.all([fetchReceitaSemanal(), fetchRepasses()])
        .then(([r, reps]) => {
          if (!ativo) return;
          setReceita(r);
          setRepasses(reps);
        })
        .catch(() => {});
    carregar();
    const offR = subscribe("repasses", carregar);
    const offP = subscribe("pedidos", carregar);
    return () => {
      ativo = false;
      offR();
      offP();
    };
  }, []);

  const marcarPago = async (r: Repasse & { dbId: string }) => {
    try {
      await marcarRepassePagoDb(r.dbId);
      setRepasses((rs) => rs.map((x) => (x.dbId === r.dbId ? { ...x, status: "pago" as StatusRepasse } : x)));
      toast.success(`Repasse de ${r.costureira} marcado como pago.`);
    } catch {
      toast.error("Não foi possível atualizar o repasse.");
    }
  };

  const gerarRepasses = async () => {
    setGerando(true);
    try {
      const resultado = await gerarRepassesSemana();
      if (resultado.pedidos === 0) {
        toast.info("Nenhum pedido entregue está aguardando repasse no momento.");
      } else {
        const reps = await fetchRepasses();
        setRepasses(reps);
        toast.success(
          `${resultado.pedidos} pedido(s) de ${resultado.costureiras} costureira(s) viraram repasse "Agendado".`,
        );
      }
    } catch {
      toast.error("Não foi possível gerar os repasses agora.");
    } finally {
      setGerando(false);
    }
  };

  const mes = receitaSemanal.slice(-4);
  const bruto = mes.reduce((s, w) => s + w.bruto, 0);
  const novu = Math.round(bruto * TAXA_NOVU);
  const costureiras = bruto - novu;
  const pendentes = repasses.filter((r) => r.status !== "pago").reduce((s, r) => s + r.valor, 0);
  const max = Math.max(1, ...receitaSemanal.map((w) => w.bruto));

  return (
    <AdminLayout title="Financeiro" subtitle="Cada pedido costurado vira renda dividida com justiça: 70/30.">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi label="Receita bruta (mês)" value={brl(bruto)} hint="últimas 4 semanas" tone="needle" />
        <Kpi label="Taxa NOVU (30%)" value={brl(novu)} hint="margem da plataforma" tone="thread" />
        <Kpi label="Repasse costureiras (70%)" value={brl(costureiras)} hint="renda gerada na rede" />
        <Kpi label="Repasses pendentes" value={brl(pendentes)} hint="a pagar esta semana" />
      </div>

      <section className="mt-8">
        <SectionTitle>Receita semanal · bruto × taxa NOVU</SectionTitle>
        <div className="rounded-md border border-border bg-card p-5">
          <div className="flex items-end gap-2 h-48">
            {receitaSemanal.map((w) => (
              <div key={w.semana} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted-foreground">{brl(w.bruto).replace(",00", "")}</span>
                <div className="w-full max-w-10 flex flex-col justify-end" style={{ height: "130px" }}>
                  <div className="w-full flex flex-col justify-end rounded-t-sm overflow-hidden" style={{ height: `${(w.bruto / max) * 100}%` }}>
                    <div className="w-full bg-needle/30" style={{ height: `${(1 - TAXA_NOVU) * 100}%` }} />
                    <div className="w-full bg-thread" style={{ height: `${TAXA_NOVU * 100}%` }} />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{w.semana}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-5 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-needle/30" /> Repasse às costureiras (70%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-thread" /> Taxa NOVU (30%)
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle>Repasses às costureiras</SectionTitle>
          <Button size="sm" onClick={gerarRepasses} disabled={gerando} className="shrink-0">
            {gerando ? "Gerando..." : "Gerar repasses da semana"}
          </Button>
        </div>
        <div className="mt-3 overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3">Costureira</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3 text-center">Pedidos</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {repasses.map((r) => (
                <tr key={r.dbId} className="border-b border-border/60 last:border-0 hover:bg-linen/60">
                  <td className="px-4 py-3 font-medium">{r.costureira}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.periodo}</td>
                  <td className="px-4 py-3 text-center font-mono">{r.pedidos}</td>
                  <td className="px-4 py-3 text-right font-mono">{brl(r.valor)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{dataCurta(r.data)}</td>
                  <td className="px-4 py-3">
                    <Chip className={cn(REPASSE_TONE[r.status])}>{REPASSE_LABEL[r.status]}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status !== "pago" ? (
                      <Button size="sm" variant="outline" className="h-7 border-border text-xs" onClick={() => marcarPago(r)}>
                        Marcar pago
                      </Button>
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Repasses são consolidados por semana (segunda a domingo) e pagos via Pix toda terça-feira. O espelho desta
          tela para a costureira é a aba Ganhos (T21) do app.
        </p>
      </section>
    </AdminLayout>
  );
}
