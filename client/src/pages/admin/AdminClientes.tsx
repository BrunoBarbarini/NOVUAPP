/*
 * NOVU Admin — Clientes (Ateliê Editorial).
 * Base de clientes cadastrados no app: contato, bairro, origem do cadastro
 * e relação com pedidos. Papel linho, Fraunces nos títulos, mono nos dados.
 */
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { Kpi, Chip, SectionTitle, EmptyRow } from "@/admin/ui";
import { brl } from "@/admin/data";
import { fetchClientes, subscribe, type ClienteAdmin } from "@/admin/api";
import { Search } from "lucide-react";

function dataCurta(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<ClienteAdmin[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      fetchClientes()
        .then((d) => {
          if (ativo) {
            setClientes(d);
            setCarregado(true);
          }
        })
        .catch(() => {});
    carregar();
    const offPerfis = subscribe("profiles", carregar);
    const offPedidos = subscribe("pedidos", carregar);
    return () => {
      ativo = false;
      offPerfis();
      offPedidos();
    };
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((c) =>
      [c.nome, c.celular, c.bairro, c.cidade, c.origem].some((v) => v.toLowerCase().includes(q)),
    );
  }, [clientes, busca]);

  const agora = new Date();
  const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
  const novosNoMes = clientes.filter((c) => c.criadoEm.startsWith(mesAtual)).length;
  const comPedido = clientes.filter((c) => c.pedidos > 0).length;

  return (
    <AdminLayout title="Clientes" subtitle="Quem já entrou no ateliê: cadastro, origem e pedidos.">
      <div className="grid grid-cols-3 gap-3 lg:w-2/3 lg:gap-4">
        <Kpi label="Cadastrados" value={clientes.length} hint={`${novosNoMes} novos no mês`} tone="needle" />
        <Kpi
          label="Já pediram"
          value={comPedido}
          hint={clientes.length ? `${Math.round((comPedido / clientes.length) * 100)}% da base` : "—"}
          tone="thread"
        />
        <Kpi label="Receita da base" value={brl(clientes.reduce((s, c) => s + c.totalGasto, 0))} />
      </div>

      <section className="mt-8">
        <SectionTitle
          action={
            <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-ink/80 focus-within:border-needle/50">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, bairro, origem…"
                className="w-44 bg-transparent outline-none placeholder:text-muted-foreground sm:w-56"
              />
            </label>
          }
        >
          Base completa
        </SectionTitle>

        {carregado && filtrados.length === 0 ? (
          <EmptyRow>
            {busca
              ? "Nenhum cliente encontrado para essa busca."
              : "Nenhum cliente cadastrado ainda — os cadastros feitos no app aparecem aqui em tempo real."}
          </EmptyRow>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Origem</th>
                  <th className="px-4 py-3 text-center">Pedidos</th>
                  <th className="px-4 py-3 text-right">Total gasto</th>
                  <th className="px-4 py-3">Último pedido</th>
                  <th className="px-4 py-3">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-linen/60">
                    <td className="px-4 py-3">
                      <span className="font-medium">{c.nome}</span>
                      <span className="block text-xs text-muted-foreground">
                        {[c.bairro, c.cidade].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{c.celular || "—"}</td>
                    <td className="px-4 py-3">
                      <Chip className="border-thread/30 bg-thread/8 text-thread text-[11px]">{c.origem}</Chip>
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{c.pedidos}</td>
                    <td className="px-4 py-3 text-right font-mono">{brl(c.totalGasto)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {c.ultimoPedidoEm ? dataCurta(c.ultimoPedidoEm) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{dataCurta(c.criadoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          A lista vem direto da tabela de perfis do app (papel cliente) e atualiza em tempo real conforme novos
          cadastros e pedidos chegam.
        </p>
      </section>
    </AdminLayout>
  );
}

