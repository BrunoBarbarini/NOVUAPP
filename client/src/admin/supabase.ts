/*
 * NOVU Admin — cliente Supabase.
 * Backend compartilhado entre o app (cliente/costureira) e este painel.
 * A anon key é pública por design; a segurança vem das políticas RLS
 * (apenas usuários com role=admin enxergam pedidos, repasses e a fila).
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://ucmdzwtqpdomgfdzwubw.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbWR6d3RxcGRvbWdmZHp3dWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTAyOTQsImV4cCI6MjA4Nzc2NjI5NH0.ZkuJGhgH7uS2uc0rX7iq00g4QJ13GXX6FmmJnjzAIlg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "novu_admin_auth",
  },
});
