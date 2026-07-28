/*
 * NOVU Admin — Aprovações de costureiras (Ateliê Editorial).
 * O outro lado da T18 do app: fila de cadastros com portfólio, história e aprovar/recusar.
 */
import { useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { Chip, EmptyRow, SectionTitle } from "@/admin/ui";
import { cadastrosPendentes as iniciais, dataCurta, type CadastroCostureira } from "@/admin/data";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, MapPin, Phone, Camera, Quote } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminAprovacoes() {
  const [fila, setFila] = useState<CadastroCostureira[]>(iniciais);
  const [historico, setHistorico] = useState<CadastroCostureira[]>([]);

  const decidir = (id: string, status: "aprovada" | "recusada") => {
    const cad = fila.find((c) => c.id === id);
    if (!cad) return;
    setFila((f) => f.filter((c) => c.id !== id));
    setHistorico((h) => [{ ...cad, status }, ...h]);
    toast.success(
      status === "aprovada"
        ? `${cad.nome.split(" ")[0]} aprovada! Ela recebe a boa notícia pelo WhatsApp.`
        : `Cadastro de ${cad.nome.split(" ")[0]} recusado com carinho.`,
    );
  };

  return (
    <AdminLayout
      title="Aprovações"
      subtitle="Cada aprovação é uma costureira que passa a viver do próprio ofício."
    >
      <SectionTitle>Fila de cadastros ({fila.length})</SectionTitle>
      {fila.length === 0 ? (
        <EmptyRow>Fila limpa — nenhuma costureira aguardando. Bom trabalho!</EmptyRow>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2">
          {fila.map((c) => (
            <article
              key={c.id}
              className="relative flex flex-col rounded-md border border-border bg-card p-5 shadow-[0_1px_3px_rgba(40,44,36,0.06)]"
            >
              <span className="absolute left-5 top-0 h-[3px] w-10 rounded-b-sm bg-thread" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{c.nome}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {c.bairro}, {c.cidade} · raio {c.raioKm} km
                  </p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {dataCurta(c.enviadoEm)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.especialidades.map((e) => (
                  <Chip key={e} className="border-needle/40 bg-needle/8 text-needle">
                    {e}
                  </Chip>
                ))}
              </div>

              <blockquote className="mt-3 flex gap-2 rounded-md bg-linen p-3 text-sm italic text-ink/80">
                <Quote className="h-3.5 w-3.5 shrink-0 text-thread mt-0.5" />“{c.historia}”
              </blockquote>

              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {c.whatsapp}
                </div>
                <div className="flex items-center gap-1.5">
                  <Camera className="h-3 w-3" /> {c.fotos} fotos de portfólio
                </div>
                <div className="col-span-2">
                  Experiência: <strong className="text-ink">{c.experiencia}</strong> · veio por{" "}
                  <strong className="text-ink">{c.origem}</strong>
                </div>
              </dl>

              <div className="mt-4 flex gap-2 border-t border-dashed border-border pt-4">
                <Button variant="outline" className="flex-1 border-border" onClick={() => decidir(c.id, "recusada")}>
                  <XCircle className="h-4 w-4" /> Recusar
                </Button>
                <Button className="flex-1" onClick={() => decidir(c.id, "aprovada")}>
                  <CheckCircle2 className="h-4 w-4" /> Aprovar
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {historico.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Decididos nesta sessão</SectionTitle>
          <div className="flex flex-col gap-2">
            {historico.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="font-medium">{c.nome}</span>
                <Chip
                  className={cn(
                    c.status === "aprovada"
                      ? "border-needle/40 bg-needle/10 text-needle"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {c.status === "aprovada" ? "Aprovada · avisada por WhatsApp" : "Recusada"}
                </Chip>
              </div>
            ))}
          </div>
        </section>
      )}
    </AdminLayout>
  );
}
