/*
 * NOVU Admin — camada de dados (Supabase).
 * Substitui os mocks de data.ts: cada função mapeia as linhas do banco
 * para os tipos que as telas já consomem, então o visual não muda.
 */
import { supabase } from "./supabase";
import { TAXA_NOVU, type Pedido, type StatusPedido, type CadastroCostureira, type CostureiraAtiva, type Repasse } from "./data";

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
  status: string;
  created_at: string;
  prazo: string | null;
  observacoes: string | null;
  costureira_id: string | null;
  costureiras: { nome: string; bairro: string } | null;
  pedido_extras: { descricao: string; valor: number; status: string }[] | null;
};

const PEDIDO_SELECT =
  "id, codigo, cliente_nome, bairro, peca, servico, valor, status, created_at, prazo, observacoes, costureira_id, costureiras ( nome, bairro ), pedido_extras ( descricao, valor, status )";

function mapPedido(r: PedidoRow): Pedido & { id: string; costureiraId: string | null } {
  const extraAprovado = (r.pedido_extras ?? []).find((e) => e.status === "aprovado");
  const extraProposto = (r.pedido_extras ?? []).find((e) => e.status === "proposto");
  const extra = extraAprovado ?? extraProposto;
  return {
    id: r.id,
    codigo: r.codigo,
    cliente: r.cliente_nome,
    bairro: r.bairro,
    peca: r.peca,
    servico: r.servico,
    valor: Number(r.valor),
    extra: extra
      ? { descricao: extra.descricao, valor: Number(extra.valor), aprovado: extra.status === "aprovado" }
      : undefined,
    costureira: r.costureiras ? `${r.costureiras.nome} (${r.costureiras.bairro})` : null,
    costureiraId: r.costureira_id,
    status: DB_TO_FRONT_STATUS[r.status] ?? "novo",
    criadoEm: r.created_at,
    prazo: r.prazo ?? "",
    observacao: r.observacoes ?? undefined,
  };
}

export async function fetchPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select(PEDIDO_SELECT)
    .order("created_at", { ascending: false });
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
  celular: string | null;
  especialidades: string[];
  experiencia: string | null;
  raio_km: number | null;
  historia: string | null;
  fotos_portfolio: number | null;
  origem: string | null;
  avaliacao: number | null;
  status: string;
  created_at: string;
  aprovada_em: string | null;
};

export async function fetchCadastrosPendentes(): Promise<(CadastroCostureira & { dbId: string })[]> {
  const { data, error } = await supabase
    .from("costureiras")
    .select("*")
    .eq("status", "pendente")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as CostureiraRow[]).map((r) => ({
    id: r.id,
    dbId: r.id,
    nome: r.nome,
    bairro: r.bairro,
    cidade: r.cidade,
    whatsapp: r.celular ?? "",
    especialidades: r.especialidades ?? [],
    experiencia: r.experiencia ?? "",
    raioKm: r.raio_km ?? 0,
    historia: r.historia ?? "",
    fotos: r.fotos_portfolio ?? 0,
    enviadoEm: r.created_at,
    status: "pendente",
    origem: r.origem ?? "Indicação",
  }));
}

export async function decidirCadastroDb(id: string, aprovar: boolean) {
  const { error } = await supabase
    .from("costureiras")
    .update(
      aprovar
        ? { status: "ativa", aprovada_em: new Date().toISOString() }
        : { status: "recusada" },
    )
    .eq("id", id);
  if (error) throw error;
}

export async function fetchCostureirasAtivas(): Promise<(CostureiraAtiva & { dbId: string })[]> {
  const [{ data: cost, error: e1 }, { data: peds, error: e2 }] = await Promise.all([
    supabase.from("costureiras").select("*").in("status", ["ativa", "pausada"]).order("nome"),
    supabase.from("pedidos").select("costureira_id, status, valor, created_at, pedido_extras ( valor, status )"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  type PedLeve = {
    costureira_id: string | null;
    status: string;
    valor: number;
    created_at: string;
    pedido_extras: { valor: number; status: string }[] | null;
  };
  const somaExtra = (p: PedLeve) =>
    (p.pedido_extras ?? [])
      .filter((e) => e.status === "aprovado")
      .reduce((s, e) => s + Number(e.valor), 0);
  const agora = new Date();
  const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
  return (cost as CostureiraRow[]).map((r) => {
    const meus = ((peds ?? []) as unknown as PedLeve[]).filter((p) => p.costureira_id === r.id);
    const noMes = meus.filter((p) => String(p.created_at).startsWith(mesAtual));
    const emAndamento = meus.filter((p) =>
      ["aguardando_aceite", "coleta_agendada", "em_costura", "pronto"].includes(p.status),
    ).length;
    const ganhos = noMes
      .filter((p) => p.status !== "cancelado")
      .reduce((s, p) => s + (Number(p.valor) + somaExtra(p)) * 0.7, 0);
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
      desde: (r.aprovada_em ?? r.created_at).slice(0, 10),
      status: r.status === "ativa" ? "ativa" : "pausada",
    };
  });
}

/* ---------- repasses e receita ---------- */

/* ---------- clientes ---------- */

export type ClienteAdmin = {
  id: string;
  nome: string;
  celular: string;
  bairro: string;
  cidade: string;
  origem: string;
  criadoEm: string;
  pedidos: number;
  totalGasto: number;
  ultimoPedidoEm: string | null;
};

export async function fetchClientes(): Promise<ClienteAdmin[]> {
  const [{ data: perfis, error: e1 }, { data: peds, error: e2 }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, nome, celular, bairro, cidade, origem_cadastro, role, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("pedidos").select("cliente_id, valor, status, created_at"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  type PerfilRow = {
    id: string;
    nome: string | null;
    celular: string | null;
    bairro: string | null;
    cidade: string | null;
    origem_cadastro: string | null;
    role: string | null;
    created_at: string;
  };
  type PedLeve = { cliente_id: string | null; valor: number; status: string; created_at: string };
  const pedidos = (peds ?? []) as PedLeve[];
  return ((perfis ?? []) as PerfilRow[])
    .filter((p) => (p.role ?? "cliente") === "cliente")
    .map((p) => {
      const meus = pedidos.filter((x) => x.cliente_id === p.id);
      const validos = meus.filter((x) => x.status !== "cancelado");
      const ultimo = meus.length
        ? meus.reduce((a, b) => (a.created_at > b.created_at ? a : b)).created_at
        : null;
      return {
        id: p.id,
        nome: p.nome ?? "(sem nome)",
        celular: p.celular ?? "",
        bairro: p.bairro ?? "",
        cidade: p.cidade ?? "",
        origem: p.origem_cadastro ?? "—",
        criadoEm: p.created_at,
        pedidos: meus.length,
        totalGasto: validos.reduce((s, x) => s + Number(x.valor), 0),
        ultimoPedidoEm: ultimo,
      };
    });
}

type RepasseRow = {
  id: string;
  periodo_inicio: string;
  periodo_fim: string;
  pedidos: number;
  valor: number;
  status: string;
  data_pagamento: string | null;
  costureiras: { nome: string } | null;
};

function formatarPeriodo(ini: string, fim: string) {
  const f = (s: string) => {
    const [, m, d] = s.split("-");
    return `${d}/${m}`;
  };
  return `${f(ini)} – ${f(fim)}`;
}

export async function fetchRepasses(): Promise<(Repasse & { dbId: string })[]> {
  const { data, error } = await supabase
    .from("repasses")
    .select("id, periodo_inicio, periodo_fim, pedidos, valor, status, data_pagamento, costureiras ( nome )")
    .order("periodo_inicio", { ascending: false });
  if (error) throw error;
  return (data as unknown as RepasseRow[]).map((r) => ({
    id: r.id,
    dbId: r.id,
    costureira: r.costureiras?.nome ?? "—",
    periodo: formatarPeriodo(r.periodo_inicio, r.periodo_fim),
    pedidos: r.pedidos,
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

type PedidoElegivelRow = {
  id: string;
  valor: number;
  costureira_id: string;
  updated_at: string;
  pedido_extras: { valor: number; status: string }[] | null;
};

/**
 * Junta pedidos `entregue` que ainda não entraram em nenhum repasse
 * (`repasse_id is null`) e cria uma linha de repasse por costureira, com o
 * valor líquido dela (70%, mesma fórmula de `fetchReceitaSemanal`). Marca os
 * pedidos incluídos com o `id` do repasse gerado, pra não contar de novo numa
 * próxima geração. Não paga nada sozinho — cria como "agendado"; o pagamento
 * de fato (Pix) e o "Marcar pago" continuam manuais.
 */
export async function gerarRepassesSemana(): Promise<{ costureiras: number; pedidos: number }> {
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, valor, costureira_id, updated_at, pedido_extras ( valor, status )")
    .eq("status", "entregue")
    .is("repasse_id", null)
    .not("costureira_id", "is", null);
  if (error) throw error;

  const pedidos = (data ?? []) as unknown as PedidoElegivelRow[];
  if (pedidos.length === 0) return { costureiras: 0, pedidos: 0 };

  const porCostureira = new Map<string, PedidoElegivelRow[]>();
  for (const p of pedidos) {
    const lista = porCostureira.get(p.costureira_id) ?? [];
    lista.push(p);
    porCostureira.set(p.costureira_id, lista);
  }

  for (const costureiraId of Array.from(porCostureira.keys())) {
    const lista = porCostureira.get(costureiraId)!;
    const bruto = lista.reduce(
      (soma: number, p: PedidoElegivelRow) =>
        soma +
        Number(p.valor) +
        (p.pedido_extras ?? [])
          .filter((e) => e.status === "aprovado")
          .reduce((se: number, e: { valor: number }) => se + Number(e.valor), 0),
      0,
    );
    const valorCostureira = Math.round(bruto * (1 - TAXA_NOVU) * 100) / 100;
    const datas = lista.map((p: PedidoElegivelRow) => p.updated_at.slice(0, 10)).sort();

    const { data: repasse, error: erroInsert } = await supabase
      .from("repasses")
      .insert({
        costureira_id: costureiraId,
        periodo_inicio: datas[0],
        periodo_fim: datas[datas.length - 1],
        pedidos: lista.length,
        valor: valorCostureira,
        status: "agendado",
      })
      .select("id")
      .single();
    if (erroInsert) throw erroInsert;

    const { error: erroUpdate } = await supabase
      .from("pedidos")
      .update({ repasse_id: (repasse as { id: string }).id })
      .in(
        "id",
        lista.map((p: PedidoElegivelRow) => p.id),
      );
    if (erroUpdate) throw erroUpdate;
  }

  return { costureiras: porCostureira.size, pedidos: pedidos.length };
}

/** Receita das últimas 8 semanas calculada dos pedidos não-cancelados. */
export async function fetchReceitaSemanal(): Promise<SemanaReceita[]> {
  const { data, error } = await supabase
    .from("pedidos")
    .select("valor, created_at, status, pedido_extras ( valor, status )")
    .neq("status", "cancelado");
  if (error) throw error;
  type Row = {
    valor: number;
    created_at: string;
    status: string;
    pedido_extras: { valor: number; status: string }[] | null;
  };
  const rows = (data ?? []) as unknown as Row[];
  const semanas: SemanaReceita[] = [];
  const hoje = new Date();
  for (let i = 7; i >= 0; i--) {
    const ini = new Date(hoje);
    ini.setDate(hoje.getDate() - hoje.getDay() - i * 7);
    ini.setHours(0, 0, 0, 0);
    const fim = new Date(ini);
    fim.setDate(ini.getDate() + 7);
    const bruto = rows
      .filter((p) => {
        const d = new Date(p.created_at);
        return d >= ini && d < fim;
      })
      .reduce(
        (s, p) =>
          s +
          Number(p.valor) +
          (p.pedido_extras ?? [])
            .filter((e) => e.status === "aprovado")
            .reduce((se, e) => se + Number(e.valor), 0),
        0,
      );
    semanas.push({
      semana: `${String(ini.getDate()).padStart(2, "0")}/${String(ini.getMonth() + 1).padStart(2, "0")}`,
      bruto: Math.round(bruto),
      novu: Math.round(bruto * 0.3),
    });
  }
  return semanas;
}

/* ---------- catálogo de serviços ---------- */

export type ServicoAdmin = {
  id: string;
  nome: string;
  preco: number;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
};

type ServicoRow = {
  id: string;
  nome: string;
  preco: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
};

const mapServico = (r: ServicoRow): ServicoAdmin => ({
  id: r.id,
  nome: r.nome,
  preco: Number(r.preco),
  ordem: r.ordem,
  ativo: r.ativo,
  criadoEm: r.created_at,
});

/** Catálogo completo (ativos e inativos) — é o admin que decide o que aparece
 * pro cliente, então aqui mostramos tudo, ordenado como no app (`ordem`). */
export async function fetchServicos(): Promise<ServicoAdmin[]> {
  const { data, error } = await supabase
    .from("servicos")
    .select("id, nome, preco, ordem, ativo, created_at")
    .order("ordem", { ascending: true });
  if (error) throw error;
  return (data as ServicoRow[]).map(mapServico);
}

export type ServicoInput = { nome: string; preco: number; ordem: number; ativo: boolean };

export async function criarServicoDb(input: ServicoInput) {
  const { error } = await supabase.from("servicos").insert(input);
  if (error) throw error;
}

export async function atualizarServicoDb(id: string, input: ServicoInput) {
  const { error } = await supabase.from("servicos").update(input).eq("id", id);
  if (error) throw error;
}

export async function alternarServicoAtivoDb(id: string, ativo: boolean) {
  const { error } = await supabase.from("servicos").update({ ativo }).eq("id", id);
  if (error) throw error;
}

export async function excluirServicoDb(id: string) {
  const { error } = await supabase.from("servicos").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- proteção contra dano à peça (sinistros) ---------- */

export type SinistroStatus = "aberto" | "aprovado" | "recusado" | "reembolsado";

export type SinistroAdmin = {
  id: string;
  pedidoId: string;
  pedidoCodigo: string;
  clienteNome: string;
  descricao: string;
  fotos: string[];
  status: SinistroStatus;
  valorReembolso: number | null;
  respostaAdmin: string | null;
  criadoEm: string;
};

type SinistroRow = {
  id: string;
  pedido_id: string;
  descricao: string;
  fotos: string[] | null;
  status: SinistroStatus;
  valor_reembolso: number | null;
  resposta_admin: string | null;
  created_at: string;
  pedidos: { codigo: string; cliente_nome: string } | null;
};

const SINISTRO_SELECT =
  "id, pedido_id, descricao, fotos, status, valor_reembolso, resposta_admin, created_at, pedidos ( codigo, cliente_nome )";

function mapSinistro(r: SinistroRow): SinistroAdmin {
  return {
    id: r.id,
    pedidoId: r.pedido_id,
    pedidoCodigo: r.pedidos?.codigo ?? "—",
    clienteNome: r.pedidos?.cliente_nome ?? "—",
    descricao: r.descricao,
    fotos: r.fotos ?? [],
    status: r.status,
    valorReembolso: r.valor_reembolso !== null ? Number(r.valor_reembolso) : null,
    respostaAdmin: r.resposta_admin,
    criadoEm: r.created_at,
  };
}

export async function fetchSinistros(): Promise<SinistroAdmin[]> {
  const { data, error } = await supabase
    .from("pedido_sinistros")
    .select(SINISTRO_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const sinistros = (data as unknown as SinistroRow[]).map(mapSinistro);

  // O bucket é privado — as fotos precisam de URL assinada pra aparecer no painel.
  await Promise.all(
    sinistros.map(async (s) => {
      if (s.fotos.length === 0) return;
      const { data: assinadas } = await supabase.storage
        .from("novu-fotos-pecas")
        .createSignedUrls(s.fotos, 3600);
      s.fotos = (assinadas ?? []).map((a) => a.signedUrl).filter((u): u is string => Boolean(u));
    }),
  );
  return sinistros;
}

/** Aprova o relato e registra o valor a ser reembolsado (o pagamento em si,
 * fora do app, é marcado depois via marcarReembolsadoDb). */
export async function decidirSinistroDb(
  id: string,
  decisao: { status: "aprovado" | "recusado"; valorReembolso?: number; respostaAdmin?: string },
) {
  const { error } = await supabase
    .from("pedido_sinistros")
    .update({
      status: decisao.status,
      valor_reembolso: decisao.valorReembolso ?? null,
      resposta_admin: decisao.respostaAdmin ?? null,
      decidido_em: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function marcarSinistroReembolsadoDb(id: string) {
  const { error } = await supabase
    .from("pedido_sinistros")
    .update({ status: "reembolsado" })
    .eq("id", id);
  if (error) throw error;
}

/* ---------- realtime ---------- */

/** Assina mudanças em uma tabela e chama onChange (debounced pelo caller se preciso). */
export function subscribe(
  tabela: "pedidos" | "costureiras" | "repasses" | "profiles" | "servicos" | "pedido_sinistros",
  onChange: () => void,
) {
  const channel = supabase
    .channel(`admin-${tabela}-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: tabela }, onChange)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
