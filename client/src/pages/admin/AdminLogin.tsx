/*
 * NOVU Admin — login do painel (Ateliê Editorial).
 * Acesso demo: senha "novu2026". Sem backend: flag em localStorage.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Scissors, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  const entrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === "novu2026") {
      localStorage.setItem("novu_admin", "1");
      navigate("/admin");
    } else {
      setErro(true);
    }
  };

  return (
    <div className="min-h-screen bg-linen text-ink grid place-items-center px-5 texture-linen">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-needle text-primary-foreground">
            <Scissors className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Ateliê central</h1>
          <p className="mt-1 text-sm text-muted-foreground">Painel de administração da NOVU</p>
        </div>
        <form
          onSubmit={entrar}
          className="rounded-md border border-border bg-card p-6 shadow-[0_1px_3px_rgba(40,44,36,0.08)]"
        >
          <label className="mb-1.5 block text-sm font-medium" htmlFor="senha">
            Senha de acesso
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro(false);
              }}
              placeholder="••••••••"
              className="pl-9 bg-linen"
              autoFocus
            />
          </div>
          {erro && <p className="mt-2 text-xs text-destructive">Senha incorreta. Tente novamente.</p>}
          <Button type="submit" className="mt-4 w-full">
            Entrar no painel
          </Button>
          <p className="mt-4 border-t border-dashed border-border pt-3 text-center font-mono text-[11px] text-muted-foreground">
            demo · senha: novu2026
          </p>
        </form>
      </div>
    </div>
  );
}
