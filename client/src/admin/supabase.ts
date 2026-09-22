/*
 * NOVU Admin — cliente Supabase.
 * Backend compartilhado entre o app (cliente/costureira) e este painel.
 * A anon key é pública por design; a segurança vem das políticas RLS
 * (apenas usuários com role=admin enxergam pedidos, repasses e a fila).
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://aioooyvzggpuaktczqpq.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb29veXZ6Z2dwdWFrdGN6cXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMTU4MDEsImV4cCI6MjEwNTY5MTgwMX0.6lrPLjgoh5E8i2YxXnMaa_FlQRlnwBo_PF28_y2Vlus";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "novu_admin_auth",
  },
});
