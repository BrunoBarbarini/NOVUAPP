/*
 * NOVU Admin — Catálogo de serviços (Ateliê Editorial).
 * O que a cliente escolhe em T3 (peça & serviços) no app vem direto daqui:
 * a tabela `servicos` é lida por `useCatalogoServicos` no app mobile,
 * filtrando por `ativo = true` e ordenando por `ordem`. RLS já pronta:
 * leitura é livre, escrita só pra quem tem role=admin (é este painel).
 */
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { Chip, EmptyRow, Kpi, SectionTitle } from "@/admin/ui";
import { brl } from "@/admin/data";
import {
  alternarServicoAtivoDb,
  atualizarServicoDb,
  criarServicoDb,
  excluirServicoDb,
  fetchServicos,
  subscribe,
  type ServicoAdmin,
  type ServicoInput,
} from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

type FormState = {
  nome: string;
  preco: string;
  ordem: string;
  ativo: boolean;
  videoAjudaUrl: string;
};

const FORM_VAZIO: FormState = { nome: "", preco: "", ordem: "0", ativo: true, videoAjudaUrl: "" };

function parsePreco(v: string): number | null {
  const limpo = v.trim().replace(/\./g, "").replace(",", ".");
  const n = Number(limpo);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function AdminServicos() {
  const [servicos, setServicos] = useState<ServicoAdmin[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<ServicoAdmin | null>(null);
  const [form, setForm] = useState<FormState>(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      fetchServicos()
        .then(d => {
          if (ativo) {
            setServicos(d);
            setCarregado(true);
          }
        })
        .catch(() => {
          if (ativo) toast.error("Não foi possível carregar o catálogo.");
        });
    carregar();
    const off = subscribe("servicos", carregar);
    return () => {
      ativo = false;
      off();
    };
  }, []);

  const ativos = useMemo(
    () => servicos.filter(s => s.ativo).length,
    [servicos]
  );

  function abrirNovo() {
    setEditando(null);
    setForm({ ...FORM_VAZIO, ordem: String(servicos.length) });
    setDialogAberto(true);
  }

  function abrirEdicao(s: ServicoAdmin) {
    setEditando(s);
    setForm({
      nome: s.nome,
      preco: String(s.preco).replace(".", ","),
      ordem: String(s.ordem),
      ativo: s.ativo,
      videoAjudaUrl: s.videoAjudaUrl ?? "",
    });
    setDialogAberto(true);
  }

  async function handleSalvar() {
    const nome = form.nome.trim();
    const preco = parsePreco(form.preco);
    const ordem = Number(form.ordem);
    if (!nome) {
      toast.error("Digite o nome do serviço.");
      return;
    }
    if (preco === null) {
      toast.error("Confira o preço — use algo como 45,00.");
      return;
    }
    if (!Number.isInteger(ordem) || ordem < 0) {
      toast.error("A ordem precisa ser um número inteiro (0, 1, 2…).");
      return;
    }

    const input: ServicoInput = {
      nome,
      preco,
      ordem,
      ativo: form.ativo,
      videoAjudaUrl: form.videoAjudaUrl,
    };
    setSalvando(true);
    try {
      if (editando) {
        await atualizarServicoDb(editando.id, input);
        toast.success(`"${nome}" atualizado.`);
      } else {
        await criarServicoDb(input);
        toast.success(`"${nome}" adicionado ao catálogo.`);
      }
      setDialogAberto(false);
    } catch {
      toast.error("Não foi possível salvar agora. Tente de novo.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleToggleAtivo(s: ServicoAdmin) {
    try {
      await alternarServicoAtivoDb(s.id, !s.ativo);
      toast.success(
        s.ativo
          ? `"${s.nome}" não aparece mais pro cliente.`
          : `"${s.nome}" volta a aparecer pro cliente.`
      );
    } catch {
      toast.error("Não foi possível atualizar agora.");
    }
  }

  async function handleExcluir(s: ServicoAdmin) {
    if (
      !window.confirm(
        `Excluir "${s.nome}" do catálogo? Essa ação não pode ser desfeita.`
      )
    )
      return;
    try {
      await excluirServicoDb(s.id);
      toast.success(`"${s.nome}" removido do catálogo.`);
    } catch {
      toast.error(
        "Não foi possível excluir — se algum pedido já usou esse serviço, pausar em vez de excluir é mais seguro."
      );
    }
  }

  return (
    <AdminLayout
      title="Catálogo de serviços"
      subtitle="O que a cliente vê e escolhe no app, na hora de montar o pedido."
    >
      <div className="grid grid-cols-2 gap-3 lg:w-1/2 lg:gap-4">
        <Kpi label="No catálogo" value={servicos.length} tone="needle" />
        <Kpi
          label="Visíveis no app"
          value={ativos}
          hint={`${servicos.length - ativos} pausados`}
          tone="thread"
        />
      </div>

      <section className="mt-8">
        <SectionTitle
          action={
            <Button onClick={abrirNovo}>
              <Plus className="h-4 w-4" /> Novo serviço
            </Button>
          }
        >
          Serviços
        </SectionTitle>

        {!carregado ? (
          <EmptyRow>Carregando o catálogo…</EmptyRow>
        ) : servicos.length === 0 ? (
          <EmptyRow>
            Nenhum serviço cadastrado ainda — comece adicionando o primeiro.
          </EmptyRow>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-4 py-3">Ordem</th>
                  <th className="px-4 py-3">Serviço</th>
                  <th className="px-4 py-3 text-right">Preço</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map(s => (
                  <tr
                    key={s.id}
                    className="border-b border-border/60 last:border-0 hover:bg-linen/60"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {s.ordem}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        {s.nome}
                        {s.videoAjudaUrl ? (
                          <Video
                            className="h-3.5 w-3.5 text-needle"
                            aria-label="Tem vídeo de ajuda de marcação"
                          />
                        ) : null}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {brl(s.preco)}
                    </td>
                    <td className="px-4 py-3">
                      <label className="flex items-center gap-2">
                        <Switch
                          checked={s.ativo}
                          onCheckedChange={() => handleToggleAtivo(s)}
                        />
                        <Chip
                          className={
                            s.ativo
                              ? "border-needle/40 bg-needle/8 text-needle"
                              : "border-border bg-muted text-muted-foreground"
                          }
                        >
                          {s.ativo ? "Ativo" : "Pausado"}
                        </Chip>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => abrirEdicao(s)}
                          aria-label="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleExcluir(s)}
                          aria-label="Excluir"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Pausar em vez de excluir mantém o histórico de pedidos que já usaram o
          serviço intacto. "Ordem" define a posição em que o serviço aparece na
          lista dentro do app.
        </p>
      </section>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editando ? "Editar serviço" : "Novo serviço"}
            </DialogTitle>
            <DialogDescription>
              {editando
                ? "Altere os dados e salve — o app atualiza na próxima vez que a cliente abrir o catálogo."
                : "Esse serviço passa a aparecer pro cliente assim que for salvo, se estiver marcado como ativo."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="servico-nome">Nome</Label>
              <Input
                id="servico-nome"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Ajuste de barra"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="servico-preco">Preço (R$)</Label>
                <Input
                  id="servico-preco"
                  inputMode="decimal"
                  value={form.preco}
                  onChange={e =>
                    setForm(f => ({ ...f, preco: e.target.value }))
                  }
                  placeholder="45,00"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="servico-ordem">Ordem</Label>
                <Input
                  id="servico-ordem"
                  type="number"
                  min={0}
                  step={1}
                  value={form.ordem}
                  onChange={e =>
                    setForm(f => ({ ...f, ordem: e.target.value }))
                  }
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5">
              <Switch
                checked={form.ativo}
                onCheckedChange={v => setForm(f => ({ ...f, ativo: v }))}
              />
              <span className="text-sm text-ink/80">
                Visível pro cliente no app
              </span>
            </label>

            <div className="grid gap-1.5">
              <Label htmlFor="servico-video">Vídeo de ajuda (opcional)</Label>
              <Input
                id="servico-video"
                value={form.videoAjudaUrl}
                onChange={e =>
                  setForm(f => ({ ...f, videoAjudaUrl: e.target.value }))
                }
                placeholder="https://.../marcacao-cintura.mp4"
              />
              <p className="text-xs text-muted-foreground">
                Se esse serviço precisa que a cliente marque a peça antes de
                fotografar (ex.: ajuste de cintura), cole aqui a URL de um
                vídeo curto — o app mostra um botão "Não sabe marcar sua
                peça?" em T4 pra quem escolheu esse serviço. Deixe em branco
                pra não mostrar nenhuma dica.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
