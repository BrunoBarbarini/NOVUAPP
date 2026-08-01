/**
 * Admin — Catálogo de serviços: criar, editar, pausar/ativar e excluir
 * (CRUD completo sobre a tabela `servicos`, que alimenta T3 no app).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminServicos from "../AdminServicos";
import type { ServicoAdmin } from "@/admin/api";

vi.mock("@/admin/AdminLayout", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

const mockFetchServicos = vi.fn();
const mockCriarServicoDb = vi.fn();
const mockAtualizarServicoDb = vi.fn();
const mockAlternarServicoAtivoDb = vi.fn();
const mockExcluirServicoDb = vi.fn();
const mockSubscribe = vi.fn((..._a: unknown[]) => () => {});

vi.mock("@/admin/api", () => ({
  fetchServicos: (...a: unknown[]) => mockFetchServicos(...a),
  criarServicoDb: (...a: unknown[]) => mockCriarServicoDb(...a),
  atualizarServicoDb: (...a: unknown[]) => mockAtualizarServicoDb(...a),
  alternarServicoAtivoDb: (...a: unknown[]) => mockAlternarServicoAtivoDb(...a),
  excluirServicoDb: (...a: unknown[]) => mockExcluirServicoDb(...a),
  subscribe: (...a: unknown[]) => mockSubscribe(...a),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const servicos: ServicoAdmin[] = [
  { id: "s1", nome: "Bainha", preco: 25, ordem: 0, ativo: true, criadoEm: "2026-01-01" },
  { id: "s2", nome: "Zíper", preco: 35, ordem: 1, ativo: false, criadoEm: "2026-01-02" },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockSubscribe.mockReturnValue(() => {});
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

describe("Admin Catálogo de serviços", () => {
  it("catálogo vazio mostra o estado vazio", async () => {
    mockFetchServicos.mockResolvedValue([]);
    render(<AdminServicos />);
    await waitFor(() =>
      expect(screen.getByText(/Nenhum serviço cadastrado ainda/)).toBeTruthy(),
    );
  });

  it("lista os serviços com preço e status", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Bainha")).toBeTruthy());
    expect(screen.getByText("Zíper")).toBeTruthy();
    expect(screen.getByText("Ativo")).toBeTruthy();
    expect(screen.getByText("Pausado")).toBeTruthy();
  });

  it("cria um novo serviço pelo dialog", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    mockCriarServicoDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Bainha")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Novo serviço/i }));
    await user.type(screen.getByLabelText("Nome"), "Cerzido");
    await user.type(screen.getByLabelText("Preço (R$)"), "45,00");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockCriarServicoDb).toHaveBeenCalledWith({
        nome: "Cerzido",
        preco: 45,
        ordem: 2,
        ativo: true,
      }),
    );
  });

  it("valida preço inválido antes de salvar", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    const user = userEvent.setup();
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Bainha")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: /Novo serviço/i }));
    await user.type(screen.getByLabelText("Nome"), "Cerzido");
    await user.type(screen.getByLabelText("Preço (R$)"), "abc");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(mockCriarServicoDb).not.toHaveBeenCalled();
  });

  it("pausa um serviço ativo (alternarServicoAtivoDb)", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    mockAlternarServicoAtivoDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Bainha")).toBeTruthy());

    const switches = screen.getAllByRole("switch");
    await user.click(switches[0]); // Bainha está ativo -> alterna pra pausado

    await waitFor(() => expect(mockAlternarServicoAtivoDb).toHaveBeenCalledWith("s1", false));
  });

  it("exclui um serviço após confirmação", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    mockExcluirServicoDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Bainha")).toBeTruthy());

    const excluirButtons = screen.getAllByRole("button", { name: "Excluir" });
    await user.click(excluirButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => expect(mockExcluirServicoDb).toHaveBeenCalledWith("s1"));
  });
});
