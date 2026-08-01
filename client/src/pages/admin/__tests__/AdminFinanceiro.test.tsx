/**
 * Admin — Financeiro: gerar repasses da semana e marcar repasse como pago
 * (espelho do T21 "Ganhos" do app, do lado da costureira).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminFinanceiro from "../AdminFinanceiro";
import type { Repasse } from "@/admin/data";

vi.mock("@/admin/AdminLayout", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

const mockFetchReceitaSemanal = vi.fn();
const mockFetchRepasses = vi.fn();
const mockMarcarRepassePagoDb = vi.fn();
const mockGerarRepassesSemana = vi.fn();
const mockSubscribe = vi.fn((..._a: unknown[]) => () => {});

vi.mock("@/admin/api", () => ({
  fetchReceitaSemanal: (...a: unknown[]) => mockFetchReceitaSemanal(...a),
  fetchRepasses: (...a: unknown[]) => mockFetchRepasses(...a),
  marcarRepassePagoDb: (...a: unknown[]) => mockMarcarRepassePagoDb(...a),
  gerarRepassesSemana: (...a: unknown[]) => mockGerarRepassesSemana(...a),
  subscribe: (...a: unknown[]) => mockSubscribe(...a),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const repasseAgendado: Repasse & { dbId: string } = {
  id: "r1",
  dbId: "r1",
  costureira: "Dona Cida",
  periodo: "1–7 de julho",
  pedidos: 3,
  valor: 112,
  status: "agendado",
  data: "2026-07-07",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSubscribe.mockReturnValue(() => {});
  mockFetchReceitaSemanal.mockResolvedValue([
    { semana: "S1", bruto: 160, novu: 48 },
    { semana: "S2", bruto: 0, novu: 0 },
  ]);
  mockFetchRepasses.mockResolvedValue([repasseAgendado]);
});

describe("Admin Financeiro", () => {
  it("mostra a linha de repasse carregada", async () => {
    render(<AdminFinanceiro />);
    await waitFor(() => expect(screen.getByText("Dona Cida")).toBeTruthy());
    expect(screen.getByText("1–7 de julho")).toBeTruthy();
    expect(screen.getByText("Agendado")).toBeTruthy();
  });

  it("gerar repasses da semana: sem pedidos elegíveis avisa e não recarrega a lista à toa", async () => {
    mockGerarRepassesSemana.mockResolvedValue({ costureiras: 0, pedidos: 0 });
    const user = userEvent.setup();
    render(<AdminFinanceiro />);
    await waitFor(() => expect(screen.getByText("Dona Cida")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Gerar repasses da semana/i }));

    await waitFor(() => expect(mockGerarRepassesSemana).toHaveBeenCalled());
    // fetchRepasses só foi chamado 1x no load inicial, não de novo (0 pedidos)
    expect(mockFetchRepasses).toHaveBeenCalledTimes(1);
  });

  it("gerar repasses da semana: com pedidos elegíveis, recarrega a lista de repasses", async () => {
    mockGerarRepassesSemana.mockResolvedValue({ costureiras: 1, pedidos: 2 });
    const user = userEvent.setup();
    render(<AdminFinanceiro />);
    await waitFor(() => expect(screen.getByText("Dona Cida")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Gerar repasses da semana/i }));

    await waitFor(() => expect(mockFetchRepasses).toHaveBeenCalledTimes(2));
  });

  it("marcar pago chama marcarRepassePagoDb e atualiza o status na tela", async () => {
    mockMarcarRepassePagoDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminFinanceiro />);
    await waitFor(() => expect(screen.getByText("Dona Cida")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: "Marcar pago" }));

    await waitFor(() => expect(mockMarcarRepassePagoDb).toHaveBeenCalledWith("r1"));
    await waitFor(() => expect(screen.getByText("Pago")).toBeTruthy());
  });
});
