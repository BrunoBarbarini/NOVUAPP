/**
 * Todos os CTAs de "reparar peça" / "sou costureira" do site (Nav, Hero,
 * Como funciona, Para costureiras, Contato) devem avisar que a NOVU lança em
 * setembro ao serem clicados — nada de link morto ou silêncio no clique,
 * já que nenhum fluxo real (pedido/cadastro) está no ar ainda.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll } from "vitest";
import { Nav } from "../Nav";
import { Hero } from "../Hero";
import { HowItWorks } from "../HowItWorks";
import { ForSeamstresses } from "../ForSeamstresses";
import { Contact } from "../Contact";
import { LAUNCH_MESSAGE_CLIENTE, LAUNCH_MESSAGE_COSTUREIRA } from "@/lib/launchCopy";

vi.mock("sonner", () => ({
  toast: { info: vi.fn() },
}));
import { toast } from "sonner";

beforeAll(() => {
  // Reveal (primitives.tsx) usa IntersectionObserver, ausente no jsdom.
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error stub mínimo só pra não quebrar o render em teste
  global.IntersectionObserver = IntersectionObserverStub;
});

describe("CTAs — aviso de lançamento em setembro", () => {
  it("Nav: os dois CTAs de ação avisam a mensagem certa", () => {
    render(<Nav />);
    fireEvent.click(screen.getByText("Sou costureira"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_COSTUREIRA);

    fireEvent.click(screen.getByText("Quero reparar uma peça"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_CLIENTE);
  });

  it("Hero: os dois CTAs de ação avisam a mensagem certa", () => {
    render(<Hero />);
    fireEvent.click(screen.getByText("Quero reparar uma peça"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_CLIENTE);

    fireEvent.click(screen.getByText("Sou costureira, quero costurar com a NOVU"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_COSTUREIRA);
  });

  it("Como funciona: 'Agendar meu primeiro reparo' avisa o lançamento", () => {
    render(<HowItWorks />);
    fireEvent.click(screen.getByText("Agendar meu primeiro reparo"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_CLIENTE);
  });

  it("Para costureiras: 'Quero fazer parte da rede' avisa o lançamento", () => {
    render(<ForSeamstresses />);
    fireEvent.click(screen.getByText("Quero fazer parte da rede"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_COSTUREIRA);
  });

  it("Contato: os dois botões finais avisam a mensagem certa", () => {
    render(<Contact />);
    fireEvent.click(screen.getByText("Quero reparar uma peça"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_CLIENTE);

    fireEvent.click(screen.getByText("Sou costureira"));
    expect(toast.info).toHaveBeenCalledWith(LAUNCH_MESSAGE_COSTUREIRA);
  });
});
