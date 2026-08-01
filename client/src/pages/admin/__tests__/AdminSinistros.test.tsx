/**
 * Admin — Proteção contra dano à peça: decidir sinistro (aprovar com valor
 * de reembolso, ou recusar) e marcar como reembolsado depois de pago.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminSinistros from "../AdminSinistros";
import type { SinistroAdmin } from "@/admin/api";

vi.mock("@/admin/AdminLayout", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

const mockFetchSinistros = vi.fn();
const mockDecidirSinistroDb = vi.fn();
const mockMarcarSinistroReembolsadoDb = vi.fn();
const mockSubscribe = vi.fn((..._a: unknown[]) => () => {});

vi.mock("@/admin/api", () => ({
  fetchSinistros: (...a: unknown[]) => mockFetchSinistros(...a),
  decidirSinistroDb: (...a: unknown[]) => mockDecidirSinistroDb(...a),
  marcarSinistroReembolsadoDb: (...a: unknown[]) => mockMarcarSinistroReembolsadoDb(...a),
  subscribe: (...a: unknown[]) => mockSubscribe(...a),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const aberto: SinistroAdmin = {
  id: "sin-1",
  pedidoId: "pedido-1",
  pedidoCodigo: "NV-0100",
  clienteNome: "Ana Souza",
  descricao: "Mancha na barra depois do conserto.",
  fotos: [],
  status: "aberto",
  valorReembolso: null,
  respostaAdmin: null,
  criadoEm: "2026-07-28T10:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSubscribe.mockReturnValue(() => {});
});

describe("Admin Proteção contra dano (sinistros)", () => {
  it("sem relatos abertos mostra o estado vazio", async () => {
    mockFetchSinistros.mockResolvedValue([]);
    render(<AdminSinistros />);
    await waitFor(() =>
      expect(screen.getByText("Nenhum relato aberto no momento.")).toBeTruthy(),
    );
  });

  it("aprovar exige valor de reembolso antes de enviar", async () => {
    mockFetchSinistros.mockResolvedValue([aberto]);
    const user = userEvent.setup();
    render(<AdminSinistros />);
    await waitFor(() => expect(screen.getByText("NV-0100")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Aprovar/i }));
    expect(mockDecidirSinistroDb).not.toHaveBeenCalled();
  });

  it("aprova com valor de reembolso e resposta opcional", async () => {
    mockFetchSinistros.mockResolvedValue([aberto]);
    mockDecidirSinistroDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminSinistros />);
    await waitFor(() => expect(screen.getByText("NV-0100")).toBeTruthy());

    await user.type(screen.getByLabelText("Valor a reembolsar (R$)"), "45,00");
    await user.type(
      screen.getByLabelText("Resposta pra cliente (opcional)"),
      "Reembolso aprovado.",
    );
    await user.click(screen.getByRole("button", { name: /Aprovar/i }));

    await waitFor(() =>
      expect(mockDecidirSinistroDb).toHaveBeenCalledWith("sin-1", {
        status: "aprovado",
        valorReembolso: 45,
        respostaAdmin: "Reembolso aprovado.",
      }),
    );
  });

  it("recusa sem exigir valor", async () => {
    mockFetchSinistros.mockResolvedValue([aberto]);
    mockDecidirSinistroDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminSinistros />);
    await waitFor(() => expect(screen.getByText("NV-0100")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Recusar/i }));

    await waitFor(() =>
      expect(mockDecidirSinistroDb).toHaveBeenCalledWith("sin-1", {
        status: "recusado",
        valorReembolso: undefined,
        respostaAdmin: undefined,
      }),
    );
  });

  it("no histórico, aprovado mostra ação para marcar como reembolsado", async () => {
    mockFetchSinistros.mockResolvedValue([
      { ...aberto, status: "aprovado", valorReembolso: 45 },
    ]);
    mockMarcarSinistroReembolsadoDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminSinistros />);

    await waitFor(() => expect(screen.getByText("Histórico")).toBeTruthy());
    await user.click(screen.getByRole("button", { name: /Marcar reembolsado/i }));

    await waitFor(() =>
      expect(mockMarcarSinistroReembolsadoDb).toHaveBeenCalledWith("sin-1"),
    );
  });
});
