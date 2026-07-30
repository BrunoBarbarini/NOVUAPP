/*
 * NOVU Admin — dados de demonstração (mock)
 * Espelham as jornadas do app: pedidos (T3–T10 cliente / T19–T20 costureira),
 * cadastros de costureiras aguardando aprovação (T15–T18) e financeiro (T21).
 * Quando o backend NestJS nascer, este arquivo vira a camada de API.
 */

export type StatusPedido =
  | "novo"
  | "aguardando_aceite"
  | "coleta"
  | "em_costura"
  | "pronto"
  | "entregue"
  | "cancelado";

export type StatusCostureira = "pendente" | "aprovada" | "recusada" | "pausada";
export type StatusRepasse = "pago" | "a_caminho" | "agendado";

export interface Pedido {
  codigo: string;
  cliente: string;
  bairro: string;
  peca: string;
  servico: string;
  valor: number;
  extra?: { descricao: string; valor: number; aprovado: boolean };
  costureira: string | null;
  status: StatusPedido;
  criadoEm: string; // ISO
  prazo: string; // ISO
  observacao?: string;
}

export interface CadastroCostureira {
  id: string;
  nome: string;
  bairro: string;
  cidade: string;
  whatsapp: string;
  especialidades: string[];
  experiencia: string;
  raioKm: number;
  historia: string;
  fotos: number;
  enviadoEm: string;
  status: StatusCostureira;
  origem: string;
}

export interface CostureiraAtiva {
  id: string;
  nome: string;
  bairro: string;
  especialidades: string[];
  pedidosMes: number;
  emAndamento: number;
  avaliacao: number;
  ganhosMes: number;
  desde: string;
  status: "ativa" | "pausada";
}

export interface Repasse {
  id: string;
  costureira: string;
  periodo: string;
  pedidos: number;
  valor: number;
  status: StatusRepasse;
  data: string;
}

export const STATUS_PEDIDO_LABEL: Record<StatusPedido, string> = {
  novo: "Novo",
  aguardando_aceite: "Aguardando aceite",
  coleta: "Coleta agendada",
  em_costura: "Em costura",
  pronto: "Pronto p/ entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const STATUS_PEDIDO_TONE: Record<StatusPedido, string> = {
  novo: "bg-thread/15 text-thread border-thread/40",
  aguardando_aceite: "bg-amber-500/10 text-amber-700 border-amber-500/40",
  coleta: "bg-sky-500/10 text-sky-700 border-sky-500/40",
  em_costura: "bg-needle/10 text-needle border-needle/40",
  pronto: "bg-violet-500/10 text-violet-700 border-violet-500/40",
  entregue: "bg-needle/15 text-needle-deep border-needle/50",
  cancelado: "bg-muted text-muted-foreground border-border",
};

export const pedidos: Pedido[] = [
  { codigo: "NV-0061", cliente: "Ana Beatriz Rocha", bairro: "Pinheiros", peca: "Vestido de linho", servico: "Ajuste de barra", valor: 45, costureira: null, status: "novo", criadoEm: "2026-07-28T09:12:00", prazo: "2026-08-01", observacao: "Barra 3 cm acima do joelho, tem foto de referência." },
  { codigo: "NV-0060", cliente: "Carlos Mendes", bairro: "Vila Madalena", peca: "Calça jeans", servico: "Troca de zíper", valor: 30, costureira: null, status: "aguardando_aceite", criadoEm: "2026-07-28T08:40:00", prazo: "2026-07-31" },
  { codigo: "NV-0059", cliente: "Fernanda Lima", bairro: "Perdizes", peca: "Blazer de alfaiataria", servico: "Ajuste de ombros", valor: 85, costureira: "Dona Cida (Maria A. Silva)", status: "coleta", criadoEm: "2026-07-27T16:20:00", prazo: "2026-08-02" },
  { codigo: "NV-0058", cliente: "Juliana Prado", bairro: "Pinheiros", peca: "Vestido de festa", servico: "Ajuste de cintura + alças", valor: 120, extra: { descricao: "Forro descosturado descoberto na peça", valor: 25, aprovado: true }, costureira: "Dona Cida (Maria A. Silva)", status: "em_costura", criadoEm: "2026-07-26T11:05:00", prazo: "2026-07-30", observacao: "Casamento no dia 02/08 — prazo firme." },
  { codigo: "NV-0057", cliente: "Roberto Alves", bairro: "Butantã", peca: "Camisa social", servico: "Ajuste de mangas", valor: 35, costureira: "Rosa Ferreira", status: "em_costura", criadoEm: "2026-07-26T09:30:00", prazo: "2026-07-29" },
  { codigo: "NV-0056", cliente: "Patrícia Nunes", bairro: "Lapa", peca: "Saia midi", servico: "Cerzido invisível", valor: 60, costureira: "Tereza Campos", status: "pronto", criadoEm: "2026-07-24T14:00:00", prazo: "2026-07-28" },
  { codigo: "NV-0055", cliente: "Marina Duarte", bairro: "Pompeia", peca: "Casaco de lã", servico: "Troca de forro", valor: 140, costureira: "Rosa Ferreira", status: "entregue", criadoEm: "2026-07-21T10:15:00", prazo: "2026-07-26" },
  { codigo: "NV-0054", cliente: "Luiza Camargo", bairro: "Pinheiros", peca: "Calça de alfaiataria", servico: "Barra italiana", valor: 40, costureira: "Dona Cida (Maria A. Silva)", status: "entregue", criadoEm: "2026-07-20T15:45:00", prazo: "2026-07-24" },
  { codigo: "NV-0053", cliente: "Pedro Igarashi", bairro: "Vila Madalena", peca: "Jaqueta corta-vento", servico: "Reparo de costura", valor: 28, costureira: "Tereza Campos", status: "entregue", criadoEm: "2026-07-19T12:00:00", prazo: "2026-07-23" },
  { codigo: "NV-0052", cliente: "Helena Braga", bairro: "Perdizes", peca: "Vestido longo", servico: "Ajuste de comprimento", valor: 55, costureira: null, status: "cancelado", criadoEm: "2026-07-18T17:30:00", prazo: "2026-07-25", observacao: "Cliente desistiu antes da coleta." },
];

export const cadastrosPendentes: CadastroCostureira[] = [
  { id: "cad-014", nome: "Marlene Souza", bairro: "Vila Romana", cidade: "São Paulo/SP", whatsapp: "(11) 98765-1122", especialidades: ["Barras", "Zíperes", "Ajustes gerais"], experiencia: "Mais de 20 anos", raioKm: 5, historia: "Aprendi com minha mãe aos 12 anos. Costurei por 18 anos numa alfaiataria no Bom Retiro e hoje atendo em casa.", fotos: 6, enviadoEm: "2026-07-27T18:40:00", status: "pendente", origem: "Indicação de costureira" },
  { id: "cad-013", nome: "Neusa Tavares", bairro: "Freguesia do Ó", cidade: "São Paulo/SP", whatsapp: "(11) 97654-3388", especialidades: ["Sob medida", "Vestidos de festa", "Cerzido"], experiencia: "10 a 20 anos", raioKm: 8, historia: "Fiz vestido de noiva da metade do bairro. Quero voltar a ter renda fixa com o que amo.", fotos: 9, enviadoEm: "2026-07-27T10:15:00", status: "pendente", origem: "Instagram" },
  { id: "cad-012", nome: "Ivone Prates", bairro: "Santana", cidade: "São Paulo/SP", whatsapp: "(11) 96543-7799", especialidades: ["Ajustes gerais", "Roupas infantis"], experiencia: "5 a 10 anos", raioKm: 4, historia: "Costuro desde que meus filhos eram pequenos. Tenho máquina reta e overloque em casa.", fotos: 4, enviadoEm: "2026-07-26T20:05:00", status: "pendente", origem: "Escola NOVU" },
];

export const costureirasAtivas: CostureiraAtiva[] = [
  { id: "cos-001", nome: "Maria Aparecida Silva (Dona Cida)", bairro: "Pinheiros", especialidades: ["Barras", "Ajustes", "Alfaiataria leve"], pedidosMes: 14, emAndamento: 3, avaliacao: 4.9, ganhosMes: 1240, desde: "2026-03-10", status: "ativa" },
  { id: "cos-002", nome: "Rosa Ferreira", bairro: "Lapa", especialidades: ["Forros", "Casacos", "Ajustes"], pedidosMes: 11, emAndamento: 2, avaliacao: 4.8, ganhosMes: 980, desde: "2026-04-02", status: "ativa" },
  { id: "cos-003", nome: "Tereza Campos", bairro: "Vila Madalena", especialidades: ["Cerzido invisível", "Reparos finos"], pedidosMes: 9, emAndamento: 1, avaliacao: 5.0, ganhosMes: 815, desde: "2026-04-28", status: "ativa" },
  { id: "cos-004", nome: "Lourdes Menezes", bairro: "Perdizes", especialidades: ["Sob medida", "Vestidos"], pedidosMes: 0, emAndamento: 0, avaliacao: 4.7, ganhosMes: 0, desde: "2026-05-15", status: "pausada" },
];

export const repasses: Repasse[] = [
  { id: "rep-031", costureira: "Maria Aparecida Silva", periodo: "21–27 jul", pedidos: 5, valor: 312, status: "a_caminho", data: "2026-07-29" },
  { id: "rep-030", costureira: "Rosa Ferreira", periodo: "21–27 jul", pedidos: 4, valor: 268, status: "a_caminho", data: "2026-07-29" },
  { id: "rep-029", costureira: "Tereza Campos", periodo: "21–27 jul", pedidos: 3, valor: 187, status: "agendado", data: "2026-07-30" },
  { id: "rep-028", costureira: "Maria Aparecida Silva", periodo: "14–20 jul", pedidos: 4, valor: 256, status: "pago", data: "2026-07-22" },
  { id: "rep-027", costureira: "Rosa Ferreira", periodo: "14–20 jul", pedidos: 3, valor: 214, status: "pago", data: "2026-07-22" },
  { id: "rep-026", costureira: "Tereza Campos", periodo: "14–20 jul", pedidos: 3, valor: 176, status: "pago", data: "2026-07-22" },
];

/** Receita bruta semanal (últimas 8 semanas) para o gráfico do dashboard. */
export const receitaSemanal = [
  { semana: "01 jun", bruto: 1180, novu: 354 },
  { semana: "08 jun", bruto: 1345, novu: 404 },
  { semana: "15 jun", bruto: 1290, novu: 387 },
  { semana: "22 jun", bruto: 1520, novu: 456 },
  { semana: "29 jun", bruto: 1610, novu: 483 },
  { semana: "06 jul", bruto: 1740, novu: 522 },
  { semana: "13 jul", bruto: 1685, novu: 506 },
  { semana: "20 jul", bruto: 1930, novu: 579 },
];

export const TAXA_NOVU = 0.3; // 30% NOVU / 70% costureira

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: v % 1 ? 2 : 0 });

export const dataCurta = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};
