/*
 * NOVU Admin — cliente Supabase.
 * Backend compartilhado entre o app (cliente/costureira) e este painel.
 * A anon key é pública por design; a segurança vem das políticas RLS
 * (apenas usuários com role=admin enxergam pedidos, repasses e a fila).
 */
import { createClient } from "@supabase/supabase-js";
import { validateSupabaseConfig } from "./supabaseConfig";

const { url, anonKey } = validateSupabaseConfig(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { url: "VITE_SUPABASE_URL", key: "VITE_SUPABASE_ANON_KEY" },
);

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "novu_admin_auth",
  },
});

