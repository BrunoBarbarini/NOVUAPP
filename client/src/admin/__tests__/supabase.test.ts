import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { NOVU_SUPABASE_URL } from "../supabaseConfig";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ marker: "client" })),
}));
import { createClient } from "@supabase/supabase-js";

beforeEach(() => {
  vi.resetModules();
  vi.mocked(createClient).mockClear();
  vi.stubEnv("VITE_SUPABASE_URL", NOVU_SUPABASE_URL);
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", "sb_publishable_synthetic_test_key");
});

afterEach(() => vi.unstubAllEnvs());

describe("inicialização do cliente admin", () => {
  test("configuração válida preserva opções de autenticação", async () => {
    const { supabase } = await import("../supabase");
    expect(supabase).toEqual({ marker: "client" });
    expect(createClient).toHaveBeenCalledOnce();
    expect(createClient).toHaveBeenCalledWith(
      NOVU_SUPABASE_URL,
      "sb_publishable_synthetic_test_key",
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "novu_admin_auth",
        },
      }
    );
  });

  test.each([
    ["VITE_SUPABASE_URL", ""],
    ["VITE_SUPABASE_ANON_KEY", ""],
    ["VITE_SUPABASE_URL", "https://ucmdzwtqpdomgfdzwubw.supabase.co"],
    ["VITE_SUPABASE_ANON_KEY", "sb_secret_test"],
  ])("bloqueia %s antes de criar cliente", async (name, value) => {
    vi.stubEnv(name, value);
    await expect(import("../supabase")).rejects.toThrow();
    expect(createClient).not.toHaveBeenCalled();
  });
});
