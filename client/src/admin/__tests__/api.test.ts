/**
 * Testes unitários de admin/api.ts para os 4 fluxos administrativos
 * cobertos no QA manual (docs/qa_relatorio_2026-07-30.md, jornada admin):
 * aprovar cadastro de costureira, catálogo de serviços (CRUD), decidir
 * sinistro, gerar repasse da semana.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { ok, type SupabaseMockHandle } from "../testHelpers/supabaseMock";

vi.mock("../supabase", async () => {
  const { createSupabaseMock } = await import("../testHelpers/supabaseMock");
  const handle = createSupabaseMock();
  return { supabase: handle.supabase, __handle: handle };
});

const mockHandle = ((await import("../supabase")) as unknown as { __handle: SupabaseMockHandle })
  .__handle;

import {
  alternarServicoAtivoDb,
  atualizarServicoDb,
  criarServicoDb,
  decidirCadastroDb,
  decidirSinistroDb,
  excluirServicoDb,
  gerarRepassesSemana,
  marcarSinistroReembolsadoDb,
} from "../api";

beforeEach(() => {
  mockHandle.builders.length = 0;
  mockHandle.supabase.from.mockClear();
});

describe("aprovar cadastro de costureira", () => {
  it("aprovar grava status ativa + aprovada_em", async () => {
    mockHandle.queueFromResult(ok(null));
    await decidirCadastroDb("cost-1", true);

    expect(mockHandle.supabase.from).toHaveBeenCalledWith("costureiras");
    const payload = mockHandle.builders[0].update.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.status).toBe("ativa");
    expect(typeof payload.aprovada_em).toBe("string");
  });

  it("recusar grava status recusada, sem aprovada_em", async () => {
    mockHandle.queueFromResult(ok(null));
    await decidirCadastroDb("cost-1", false);

    expect(mockHandle.builders[0].update).toHaveBeenCalledWith({ status: "recusada" });
  });
});

describe("catálogo de serviços (CRUD)", () => {
  it("cria um serviço novo, sem vídeo de ajuda (video_ajuda_url fica null)", async () => {
    mockHandle.queueFromResult(ok(null));
    await criarServicoDb({ nome: "Cerzido", preco: 35, ordem: 5, ativo: true });
    expect(mockHandle.supabase.from).toHaveBeenCalledWith("servicos");
    expect(mockHandle.builders[0].insert).toHaveBeenCalledWith({
      nome: "Cerzido",
      preco: 35,
      ordem: 5,
      ativo: true,
      video_ajuda_url: null,
    });
  });

  it("cria um serviço com vídeo de ajuda (trim, string vazia vira null)", async () => {
    mockHandle.queueFromResult(ok(null));
    await criarServicoDb({
      nome: "Ajuste de cintura",
      preco: 50,
      ordem: 3,
      ativo: true,
      videoAjudaUrl: "  https://x.test/marcacao-cintura.mp4  ",
    });
    expect(mockHandle.builders[0].insert).toHaveBeenCalledWith(
      expect.objectContaining({ video_ajuda_url: "https://x.test/marcacao-cintura.mp4" }),
    );

    mockHandle.queueFromResult(ok(null));
    await criarServicoDb({ nome: "Bainha", preco: 25, ordem: 1, ativo: true, videoAjudaUrl: "   " });
    expect(mockHandle.builders[1].insert).toHaveBeenCalledWith(
      expect.objectContaining({ video_ajuda_url: null }),
    );
  });

  it("atualiza um serviço existente", async () => {
    mockHandle.queueFromResult(ok(null));
    await atualizarServicoDb("serv-1", { nome: "Bainha", preco: 25, ordem: 1, ativo: true });
    expect(mockHandle.builders[0].update).toHaveBeenCalledWith({
      nome: "Bainha",
      preco: 25,
      ordem: 1,
      ativo: true,
      video_ajuda_url: null,
    });
    expect(mockHandle.builders[0].eq).toHaveBeenCalledWith("id", "serv-1");
  });

  it("pausa/ativa (alternarServicoAtivoDb)", async () => {
    mockHandle.queueFromResult(ok(null));
    await alternarServicoAtivoDb("serv-1", false);
    expect(mockHandle.builders[0].update).toHaveBeenCalledWith({ ativo: false });
  });

  it("exclui um serviço (DELETE de verdade, não é soft-delete)", async () => {
    mockHandle.queueFromResult(ok(null));
    await excluirServicoDb("serv-1");
    expect(mockHandle.builders[0].delete).toHaveBeenCalled();
    expect(mockHandle.builders[0].eq).toHaveBeenCalledWith("id", "serv-1");
  });
});

describe("decidir sinistro (fundo de proteção)", () => {
  it("aprova com valor de reembolso e resposta", async () => {
    mockHandle.queueFromResult(ok(null));
    await decidirSinistroDb("sin-1", {
      status: "aprovado",
      valorReembolso: 45.9,
      respostaAdmin: "Reembolso aprovado, cobrimos o conserto.",
    });

    const payload = mockHandle.builders[0].update.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).toMatchObject({
      status: "aprovado",
      valor_reembolso: 45.9,
      resposta_admin: "Reembolso aprovado, cobrimos o conserto.",
    });
    expect(typeof payload.decidido_em).toBe("string");
  });

  it("recusa sem valor de reembolso (fica null)", async () => {
    mockHandle.queueFromResult(ok(null));
    await decidirSinistroDb("sin-1", { status: "recusado" });

    const payload = mockHandle.builders[0].update.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.status).toBe("recusado");
    expect(payload.valor_reembolso).toBeNull();
  });

  it("marca como reembolsado depois de pago de fato", async () => {
    mockHandle.queueFromResult(ok(null));
    await marcarSinistroReembolsadoDb("sin-1");
    expect(mockHandle.builders[0].update).toHaveBeenCalledWith({ status: "reembolsado" });
  });
});

describe("gerar repasses da semana", () => {
  it("agrupa pedidos entregues por costureira e cria um repasse líquido (70%) por grupo", async () => {
    mockHandle.queueFromResult(
      ok([
        {
          id: "p1",
          valor: 100,
          costureira_id: "cost-1",
          updated_at: "2026-07-10T00:00:00Z",
          pedido_extras: [],
        },
        {
          id: "p2",
          valor: 50,
          costureira_id: "cost-1",
          updated_at: "2026-07-12T00:00:00Z",
          pedido_extras: [{ valor: 10, status: "aprovado" }],
        },
        {
          id: "p3",
          valor: 80,
          costureira_id: "cost-2",
          updated_at: "2026-07-11T00:00:00Z",
          pedido_extras: null,
        },
      ]),
    ); // select pedidos elegíveis
    mockHandle.queueFromResult(ok({ id: "repasse-1" })); // insert repasse cost-1
    mockHandle.queueFromResult(ok(null)); // update pedidos (marca repasse_id) cost-1
    mockHandle.queueFromResult(ok({ id: "repasse-2" })); // insert repasse cost-2
    mockHandle.queueFromResult(ok(null)); // update pedidos cost-2

    const resultado = await gerarRepassesSemana();

    expect(resultado).toEqual({ costureiras: 2, pedidos: 3 });

    // cost-1: bruto = 100 + 50 + 10 (extra aprovado) = 160; líquido 70% = 112
    const insertCost1 = mockHandle.builders[1].insert.mock.calls[0][0] as Record<string, unknown>;
    expect(insertCost1.valor).toBeCloseTo(112);
    expect(insertCost1.pedidos).toBe(2);
    expect(insertCost1.status).toBe("agendado");

    // cost-2: bruto = 80; líquido 70% = 56
    const insertCost2 = mockHandle.builders[3].insert.mock.calls[0][0] as Record<string, unknown>;
    expect(insertCost2.valor).toBeCloseTo(56);
    expect(insertCost2.pedidos).toBe(1);
  });

  it("sem pedidos elegíveis, não cria nenhum repasse", async () => {
    mockHandle.queueFromResult(ok([]));
    const resultado = await gerarRepassesSemana();
    expect(resultado).toEqual({ costureiras: 0, pedidos: 0 });
    expect(mockHandle.supabase.from).toHaveBeenCalledTimes(1); // só a leitura, nenhum insert
  });
});
