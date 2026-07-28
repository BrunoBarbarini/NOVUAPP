/*
 * NOVU Admin — login do painel (Ateliê Editorial).
 * Autenticação real via Supabase (email + senha). Só usuários com
 * role=admin no banco enxergam os dados (RLS).
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Scissors, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/admin/supabase";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setCarregando(false);
      setErro("E-mail ou senha incorretos.");
      return;
    }
    // Confirma que o usuário é admin (RLS esconderia tudo de qualquer forma)
    const { data: perfil } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    setCarregando(false);
    if (perfil?.role !== "admin") {
      await supabase.auth.signOut();
      setErro("Esta conta não tem acesso de administrador.");
      return;
    }
    navigate("/admin");
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
          <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro(null);
              }}
              placeholder="voce@novuapp.com.br"
              className="pl-9 bg-linen"
              autoFocus
              autoComplete="email"
            />
          </div>
          <label className="mb-1.5 mt-4 block text-sm font-medium" htmlFor="senha">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                setErro(null);
              }}
              placeholder="••••••••"
              className="pl-9 bg-linen"
              autoComplete="current-password"
            />
          </div>
          {erro && <p className="mt-2 text-xs text-destructive">{erro}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={carregando || !email || !senha}>
            {carregando ? "Entrando…" : "Entrar no painel"}
          </Button>
          <p className="mt-4 border-t border-dashed border-border pt-3 text-center font-mono text-[11px] text-muted-foreground">
            acesso restrito · conta de administrador
          </p>
        </form>
      </div>
    </div>
  );
}
