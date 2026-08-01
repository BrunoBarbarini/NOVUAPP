/**
 * Admin — Aprovações de costureira: aprovar/recusar cadastro (T18 do lado
 * costureira, decidido aqui em /admin/aprovacoes).
 */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminAprovacoes from "../AdminAprovacoes";
import type { CadastroCostureira } from "@/admin/data";

vi.mock("@/admin/AdminLayout", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

const mockFetchCadastrosPendentes = vi.fn();
const mockDecidirCadastroDb = vi.fn();
const mockSubscribe = vi.fn((..._a: unknown[]) => () => {});

vi.mock("@/admin/api", () => ({
  fetchCadastrosPendentes: (...a: unknown[]) => mockFetchCadastrosPendentes(...a),
  decidirCadastroDb: (...a: unknown[]) => mockDecidirCadastroDb(...a),
  subscribe: (...a: unknown[]) => mockSubscribe(...a),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const cadastro: CadastroCostureira = {
  id: "cad-014",
  nome: "Marlene Souza",
  bairro: "Vila Romana",
  cidade: "São Paulo/SP",
  whatsapp: "(11) 98765-1122",
  especialidades: ["Barras", "Zíperes"],
  experiencia: "Mais de 20 anos",
  raioKm: 5,
  historia: "Aprendi com minha mãe aos 12 anos.",
  fotos: 6,
  enviadoEm: "2026-07-27T18:40:00",
  status: "pendente",
  origem: "Indicação de costureira",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSubscribe.mockReturnValue(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Admin Aprovações", () => {
  it("fila vazia mostra o estado vazio", async () => {
    mockFetchCadastrosPendentes.mockResolvedValue([]);
    render(<AdminAprovacoes />);
    await waitFor(() =>
      expect(screen.getByText(/Fila limpa/)).toBeTruthy(),
    );
  });

  it("aprovar remove da fila, move pro histórico e chama decidirCadastroDb(true)", async () => {
    mockFetchCadastrosPendentes.mockResolvedValue([cadastro]);
    mockDecidirCadastroDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminAprovacoes />);

    await waitFor(() => expect(screen.getByText("Marlene Souza")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Aprovar/i }));

    await waitFor(() => expect(mockDecidirCadastroDb).toHaveBeenCalledWith("cad-014", true));
    await waitFor(() => expect(screen.getByText(/Fila limpa/)).toBeTruthy());
    expect(screen.getByText("Decididos nesta sessão")).toBeTruthy();
    const historico = screen.getByText("Decididos nesta sessão").closest("section")!;
    expect(within(historico).getByText("Marlene Souza")).toBeTruthy();
    expect(within(historico).getByText(/Aprovada/)).toBeTruthy();
  });

  it("recusar chama decidirCadastroDb(false) e marca como recusada no histórico", async () => {
    mockFetchCadastrosPendentes.mockResolvedValue([cadastro]);
    mockDecidirCadastroDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminAprovacoes />);

    await waitFor(() => expect(screen.getByText("Marlene Souza")).toBeTruthy());
    await user.click(screen.getByRole("button", { name: /Recusar/i }));

    await waitFor(() => expect(mockDecidirCadastroDb).toHaveBeenCalledWith("cad-014", false));
    const historico = screen.getByText("Decididos nesta sessão").closest("section")!;
    expect(within(historico).getByText("Recusada")).toBeTruthy();
  });
});
