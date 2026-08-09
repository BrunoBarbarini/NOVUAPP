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
  {
    id: "s1",
    nome: "Bainha",
    preco: 25,
    ordem: 0,
    ativo: true,
    criadoEm: "2026-01-01",
    videoAjudaUrl: null,
  },
  {
    id: "s2",
    nome: "Ajuste de cintura",
    preco: 50,
    ordem: 1,
    ativo: false,
    criadoEm: "2026-01-02",
    videoAjudaUrl: "https://x.test/marcacao-cintura.mp4",
  },
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
    expect(screen.getByText("Ajuste de cintura")).toBeTruthy();
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
        videoAjudaUrl: "",
      }),
    );
  });

  it("mostra o ícone de vídeo só nos serviços que têm video_ajuda_url", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Ajuste de cintura")).toBeTruthy());

    expect(screen.getByLabelText("Tem vídeo de ajuda de marcação")).toBeTruthy();
  });

  it("editar um serviço com vídeo pré-preenche o campo, e permite trocar a URL", async () => {
    mockFetchServicos.mockResolvedValue(servicos);
    mockAtualizarServicoDb.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AdminServicos />);
    await waitFor(() => expect(screen.getByText("Ajuste de cintura")).toBeTruthy());

    await user.click(screen.getAllByRole("button", { name: "Editar" })[1]);

    const campoVideo = screen.getByLabelText("Vídeo de ajuda (opcional)") as HTMLInputElement;
    expect(campoVideo.value).toBe("https://x.test/marcacao-cintura.mp4");

    await user.clear(campoVideo);
    await user.type(campoVideo, "https://x.test/nova-url.mp4");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(mockAtualizarServicoDb).toHaveBeenCalledWith(
        "s2",
        expect.objectContaining({ videoAjudaUrl: "https://x.test/nova-url.mp4" }),
      ),
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
