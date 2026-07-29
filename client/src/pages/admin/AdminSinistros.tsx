/*
 * NOVU Admin — Proteção contra dano à peça (Ateliê Editorial).
 * Fila de relatos que as clientes abrem no app quando algo deu errado com a
 * peça (T8 "Encontrou algum problema? Reportar"). O admin decide aprovar
 * (com valor de reembolso) ou recusar, e depois marca quando o reembolso foi
 * de fato pago. Fundo próprio de proteção — sem seguradora ainda.
 */
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { Chip, EmptyRow, Kpi, SectionTitle } from "@/admin/ui";
import { brl } from "@/admin/data";
import {
  decidirSinistroDb,
  fetchSinistros,
  marcarSinistroReembolsadoDb,
  subscribe,
  type SinistroAdmin,
} from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

function dataCurta(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_LABEL: Record<SinistroAdmin["status"], string> = {
  aberto: "Em análise",
  aprovado: "Aprovado",
  recusado: "Recusado",
  reembolsado: "Reembolsado",
};

const STATUS_TONE: Record<SinistroAdmin["status"], string> = {
  aberto: "border-thread/40 bg-thread/8 text-thread",
  aprovado: "border-needle/40 bg-needle/8 text-needle",
  recusado: "border-border bg-muted text-muted-foreground",
  reembolsado: "border-needle/50 bg-needle/15 text-needle-deep",
};

function DecisaoForm({
  sinistro,
  onDecidido,
}: {
  sinistro: SinistroAdmin;
  onDecidido: () => void;
}) {
  const [valor, setValor] = useState("");
  const [resposta, setResposta] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function decidir(status: "aprovado" | "recusado") {
    if (status === "aprovado" && !valor.trim()) {
      toast.error("Informe o valor a reembolsar antes de aprovar.");
      return;
    }
    const valorNumero = Number(valor.replace(",", "."));
    if (
      status === "aprovado" &&
      (!Number.isFinite(valorNumero) || valorNumero <= 0)
    ) {
      toast.error("Confira o valor — use algo como 45,00.");
      return;
    }
    setEnviando(true);
    try {
      await decidirSinistroDb(sinistro.id, {
        status,
        valorReembolso: status === "aprovado" ? valorNumero : undefined,
        respostaAdmin: resposta.trim() || undefined,
      });
      toast.success(
        status === "aprovado" ? "Relato aprovado." : "Relato recusado."
      );
      onDecidido();
    } catch {
      toast.error("Não foi possível salvar a decisão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mt-4 grid gap-3 border-t border-dashed border-border pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor={`valor-${sinistro.id}`}>
            Valor a reembolsar (R$)
          </Label>
          <Input
            id={`valor-${sinistro.id}`}
            inputMode="decimal"
            value={valor}
            onChange={e => setValor(e.target.value)}
            placeholder="45,00"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`resposta-${sinistro.id}`}>
          Resposta pra cliente (opcional)
        </Label>
        <Textarea
          id={`resposta-${sinistro.id}`}
          value={resposta}
          onChange={e => setResposta(e.target.value)}
          placeholder="Ex.: Identificamos a mancha e já ajustamos o reembolso."
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-border"
          disabled={enviando}
          onClick={() => decidir("recusado")}
        >
          <XCircle className="h-4 w-4" /> Recusar
        </Button>
        <Button
          className="flex-1"
          disabled={enviando}
          onClick={() => decidir("aprovado")}
        >
          <CheckCircle2 className="h-4 w-4" /> Aprovar
        </Button>
      </div>
    </div>
  );
}

export default function AdminSinistros() {
  const [sinistros, setSinistros] = useState<SinistroAdmin[]>([]);
  const [carregado, setCarregado] = useState(false);

  const carregar = () =>
    fetchSinistros()
      .then(setSinistros)
      .catch(() => toast.error("Não foi possível carregar os relatos."))
      .finally(() => setCarregado(true));

  useEffect(() => {
    carregar();
    const off = subscribe("pedido_sinistros", carregar);
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const abertos = useMemo(
    () => sinistros.filter(s => s.status === "aberto"),
    [sinistros]
  );
  const decididos = useMemo(
    () => sinistros.filter(s => s.status !== "aberto"),
    [sinistros]
  );
  const totalReembolsado = useMemo(
    () =>
      sinistros
        .filter(s => s.status === "reembolsado")
        .reduce((sum, s) => sum + (s.valorReembolso ?? 0), 0),
    [sinistros]
  );

  async function marcarReembolsado(id: string) {
    try {
      await marcarSinistroReembolsadoDb(id);
      toast.success("Marcado como reembolsado.");
    } catch {
      toast.error("Não foi possível atualizar agora.");
    }
  }

  return (
    <AdminLayout
      title="Proteção contra dano"
      subtitle="Relatos abertos pela cliente quando algo dá errado com a peça."
    >
      <div className="grid grid-cols-3 gap-3 lg:w-2/3 lg:gap-4">
        <Kpi label="Em análise" value={abertos.length} tone="thread" />
        <Kpi label="No histórico" value={decididos.length} tone="needle" />
        <Kpi label="Total reembolsado" value={brl(totalReembolsado)} />
      </div>

      <section className="mt-8">
        <SectionTitle>Em análise ({abertos.length})</SectionTitle>
        {!carregado ? (
          <EmptyRow>Carregando os relatos…</EmptyRow>
        ) : abertos.length === 0 ? (
          <EmptyRow>Nenhum relato aberto no momento.</EmptyRow>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {abertos.map(s => (
              <article
                key={s.id}
                className="relative rounded-md border border-border bg-card p-5 shadow-[0_1px_3px_rgba(40,44,36,0.06)]"
              >
                <span className="absolute left-5 top-0 h-[3px] w-10 rounded-b-sm bg-thread" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {s.pedidoCodigo}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.clienteNome}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                    {dataCurta(s.criadoEm)}
                  </span>
                </div>

                <p className="mt-3 text-sm text-ink/80">{s.descricao}</p>

                {s.fotos.length > 0 ? (
                  <div className="mt-3 flex gap-2">
                    {s.fotos.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block h-16 w-16 overflow-hidden rounded-md border border-border"
                      >
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                ) : null}

                <DecisaoForm sinistro={s} onDecidido={carregar} />
              </article>
            ))}
          </div>
        )}
      </section>

      {decididos.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Histórico</SectionTitle>
          <div className="flex flex-col gap-2">
            {decididos.map(s => (
              <div
                key={s.id}
                className="flex flex-col gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="font-medium">{s.pedidoCodigo}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {s.clienteNome}
                  </span>
                  {s.valorReembolso !== null && (
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      {brl(s.valorReembolso)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Chip className={STATUS_TONE[s.status]}>
                    {STATUS_LABEL[s.status]}
                  </Chip>
                  {s.status === "aprovado" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => marcarReembolsado(s.id)}
                    >
                      <Wallet className="h-3.5 w-3.5" /> Marcar reembolsado
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </AdminLayout>
  );
}
