/*
 * NOVU Admin — camada de dados (Supabase).
 * Substitui os mocks de data.ts: cada função mapeia as linhas do banco
 * para os tipos que as telas já consomem, então o visual não muda.
 */
import { supabase } from "./supabase";
import type { Pedido, StatusPedido, CadastroCostureira, CostureiraAtiva, Repasse } from "./data";

export type SemanaReceita = { semana: string; bruto: number; novu: number };

/* ---------- helpers ---------- */

const DB_TO_FRONT_STATUS: Record<string, StatusPedido> = {
  novo: "novo",
  aguardando_aceite: "aguardando_aceite",
  coleta_agendada: "coleta",
  em_costura: "em_costura",
  pronto: "pronto",
  entregue: "entregue",
  cancelado: "cancelado",
};
const FRONT_TO_DB_STATUS: Record<StatusPedido, string> = {
  novo: "novo",
  aguardando_aceite: "aguardando_aceite",
  coleta: "coleta_agendada",
  em_costura: "em_costura",
  pronto: "pronto",
  entregue: "entregue",
  cancelado: "cancelado",
};

/* ---------- pedidos ---------- */

type PedidoRow = {
  id: string;
  codigo: string;
  cliente_nome: string;
  bairro: string;
  peca: string;
  servico: string;
  valor: number;
  valor_extra: number | null;
  extra_descricao: string | null;
  status: string;
  criado_em: string;
  prazo: string | null;
  observacao: string | null;
  costureira_id: string | null;
  costureiras: { nome: string; bairro: string } | null;
};

const PEDIDO_SELECT =
  "id, codigo, cliente_nome, bairro, peca, servico, valor, valor_extra, extra_descricao, status, criado_em, prazo, observacao, costureira_id, costureiras ( nome, bairro )";

function mapPedido(r: PedidoRow): Pedido & { id: string; costureiraId: string | null } {
  return {
    id: r.id,
    codigo: r.codigo,
    cliente: r.cliente_nome,
    bairro: r.bairro,
    peca: r.peca,
    servico: r.servico,
    valor: Number(r.valor),
    extra: r.valor_extra
      ? { descricao: r.extra_descricao ?? "Ajuste adicional", valor: Number(r.valor_extra), aprovado: true }
      : undefined,
    costureira: r.costureiras ? `${r.costureiras.nome} (${r.costureiras.bairro})` : null,
    costureiraId: r.costureira_id,
    status: DB_TO_FRONT_STATUS[r.status] ?? "novo",
    criadoEm: r.criado_em,
    prazo: r.prazo ?? "",
    observacao: r.observacao ?? undefined,
  };
}

export async function fetchPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select(PEDIDO_SELECT)
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data as unknown as PedidoRow[]).map(mapPedido);
}

export async function atribuirCostureiraDb(pedidoId: string, costureiraId: string) {
  const { error } = await supabase
    .from("pedidos")
    .update({ costureira_id: costureiraId, status: "aguardando_aceite" })
    .eq("id", pedidoId);
  if (error) throw error;
}

export async function mudarStatusPedidoDb(pedidoId: string, status: StatusPedido) {
  const { error } = await supabase
    .from("pedidos")
    .update({ status: FRONT_TO_DB_STATUS[status] })
    .eq("id", pedidoId);
  if (error) throw error;
}

/* ---------- costureiras ---------- */

type CostureiraRow = {
  id: string;
  nome: string;
  bairro: string;
  cidade: string;
  whatsapp: string | null;
  especialidades: string[];
  experiencia: string | null;
  raio_km: number | null;
  historia: string | null;
  fotos_portfolio: number | null;
  origem: string | null;
  avaliacao: number | null;
  status: string;
  criado_em: string;
  ativa_desde: string | null;
};

export async function fetchCadastrosPendentes(): Promise<(CadastroCostureira & { dbId: string })[]> {
  const { data, error } = await supabase
    .from("costureiras")
    .select("*")
    .eq("status", "pendente")
    .order("criado_em", { ascending: true });
  if (error) throw error;
  return (data as CostureiraRow[]).map((r) => ({
    id: r.id,
    dbId: r.id,
    nome: r.nome,
    bairro: r.bairro,
    cidade: r.cidade,
    whatsapp: r.whatsapp ?? "",
    especialidades: r.especialidades ?? [],
    experiencia: r.experiencia ?? "",
    raioKm: r.raio_km ?? 0,
    historia: r.historia ?? "",
    fotos: r.fotos_portfolio ?? 0,
    enviadoEm: r.criado_em,
    status: "pendente",
    origem: r.origem ?? "Indicação",
  }));
}

export async function decidirCadastroDb(id: string, aprovar: boolean) {
  const { error } = await supabase
    .from("costureiras")
    .update(
      aprovar
        ? { status: "ativa", ativa_desde: new Date().toISOString().slice(0, 10) }
        : { status: "recusada" },
    )
    .eq("id", id);
  if (error) throw error;
}

export async function fetchCostureirasAtivas(): Promise<(CostureiraAtiva & { dbId: string })[]> {
  const [{ data: cost, error: e1 }, { data: peds, error: e2 }] = await Promise.all([
    supabase.from("costureiras").select("*").in("status", ["ativa", "pausada"]).order("nome"),
    supabase.from("pedidos").select("costureira_id, status, valor, valor_extra, criado_em"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  const agora = new Date();
  const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
  return (cost as CostureiraRow[]).map((r) => {
    const meus = (peds ?? []).filter((p) => p.costureira_id === r.id);
    const noMes = meus.filter((p) => String(p.criado_em).startsWith(mesAtual));
    const emAndamento = meus.filter((p) =>
      ["aguardando_aceite", "coleta_agendada", "em_costura", "pronto"].includes(p.status),
    ).length;
    const ganhos = noMes
      .filter((p) => p.status !== "cancelado")
      .reduce((s, p) => s + (Number(p.valor) + Number(p.valor_extra ?? 0)) * 0.7, 0);
    return {
      id: r.id,
      dbId: r.id,
      nome: r.nome,
      bairro: r.bairro,
      especialidades: r.especialidades ?? [],
      pedidosMes: noMes.length,
      emAndamento,
      avaliacao: Number(r.avaliacao ?? 0),
      ganhosMes: Math.round(ganhos),
      desde: r.ativa_desde ?? r.criado_em.slice(0, 10),
      status: r.status === "ativa" ? "ativa" : "pausada",
    };
  });
}

/* ---------- repasses e receita ---------- */

type RepasseRow = {
  id: string;
  periodo: string;
  qtd_pedidos: number;
  valor: number;
  status: string;
  data_pagamento: string | null;
  costureiras: { nome: string } | null;
};

export async function fetchRepasses(): Promise<(Repasse & { dbId: string })[]> {
  const { data, error } = await supabase
    .from("repasses")
    .select("id, periodo, qtd_pedidos, valor, status, data_pagamento, costureiras ( nome )")
    .order("data_pagamento", { ascending: false, nullsFirst: true });
  if (error) throw error;
  return (data as unknown as RepasseRow[]).map((r) => ({
    id: r.id,
    dbId: r.id,
    costureira: r.costureiras?.nome ?? "—",
    periodo: r.periodo,
    pedidos: r.qtd_pedidos,
    valor: Number(r.valor),
    status: (r.status === "pago" ? "pago" : r.status === "a_caminho" ? "a_caminho" : "agendado") as Repasse["status"],
    data: r.data_pagamento ?? "",
  }));
}

export async function marcarRepassePagoDb(id: string) {
  const { error } = await supabase
    .from("repasses")
    .update({ status: "pago", data_pagamento: new Date().toISOString().slice(0, 10) })
    .eq("id", id);
  if (error) throw error;
}

/** Receita das últimas 8 semanas calculada dos pedidos não-cancelados. */
export async function fetchReceitaSemanal(): Promise<SemanaReceita[]> {
  const { data, error } = await supabase
    .from("pedidos")
    .select("valor, valor_extra, criado_em, status")
    .neq("status", "cancelado");
  if (error) throw error;
  const semanas: SemanaReceita[] = [];
  const hoje = new Date();
  for (let i = 7; i >= 0; i--) {
    const ini = new Date(hoje);
    ini.setDate(hoje.getDate() - hoje.getDay() - i * 7);
    ini.setHours(0, 0, 0, 0);
    const fim = new Date(ini);
    fim.setDate(ini.getDate() + 7);
    const bruto = (data ?? [])
      .filter((p) => {
        const d = new Date(p.criado_em);
        return d >= ini && d < fim;
      })
      .reduce((s, p) => s + Number(p.valor) + Number(p.valor_extra ?? 0), 0);
    semanas.push({
      semana: `${String(ini.getDate()).padStart(2, "0")}/${String(ini.getMonth() + 1).padStart(2, "0")}`,
      bruto: Math.round(bruto),
      novu: Math.round(bruto * 0.3),
    });
  }
  return semanas;
}

/* ---------- realtime ---------- */

/** Assina mudanças em uma tabela e chama onChange (debounced pelo caller se preciso). */
export function subscribe(tabela: "pedidos" | "costureiras" | "repasses", onChange: () => void) {
  const channel = supabase
    .channel(`admin-${tabela}-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: tabela }, onChange)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
