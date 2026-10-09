import { describe, test, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  NOVU_SUPABASE_URL,
  NOVU_SUPABASE_PROJECT_REF,
  validateSupabaseConfig,
} from "../supabaseConfig";

const names = { url: "SUPABASE_URL", key: "SUPABASE_ANON_KEY" };
const publicKey = "sb_publishable_synthetic_test_key";
const jwt = (payload: unknown) =>
  `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.synthetic_signature`;
const anon = (ref = NOVU_SUPABASE_PROJECT_REF) => jwt({ ref, role: "anon" });

describe("política Supabase NOVU", () => {
  test.each([publicKey, anon()])("aceita chave pública dedicada: %s", key => {
    expect(validateSupabaseConfig(NOVU_SUPABASE_URL, key, names)).toEqual({
      url: NOVU_SUPABASE_URL,
      anonKey: key,
    });
  });

  test("normaliza espaços externos e barra final", () => {
    expect(
      validateSupabaseConfig(` ${NOVU_SUPABASE_URL}/ `, ` ${publicKey} `, names)
    ).toEqual({
      url: NOVU_SUPABASE_URL,
      anonKey: publicKey,
    });
  });

  test.each([undefined, "", "   "])("exige URL/chave: %s", missing => {
    expect(() => validateSupabaseConfig(missing, publicKey, names)).toThrow(
      /Configure/
    );
    expect(() =>
      validateSupabaseConfig(NOVU_SUPABASE_URL, missing, names)
    ).toThrow(/Configure/);
  });

  test.each([
    "https://ucmdzwtqpdomgfdzwubw.supabase.co",
    "https://another-project.supabase.co",
    "http://aioooyvzggpuaktczqpq.supabase.co",
    "http://localhost:54321",
    `${NOVU_SUPABASE_URL}.evil.example`,
    `${NOVU_SUPABASE_URL}:443`,
    `${NOVU_SUPABASE_URL}/rest/v1`,
    `${NOVU_SUPABASE_URL}?other=1`,
    `${NOVU_SUPABASE_URL}#fragment`,
    "https://user:pass@aioooyvzggpuaktczqpq.supabase.co",
    "not-a-url",
  ])("bloqueia destino não autorizado: %s", url => {
    expect(() => validateSupabaseConfig(url, publicKey, names)).toThrow(
      /projeto dedicado/
    );
  });

  test.each([
    anon("ucmdzwtqpdomgfdzwubw"),
    anon("another-project"),
    jwt({ ref: NOVU_SUPABASE_PROJECT_REF, role: "service_role" }),
    jwt({ ref: NOVU_SUPABASE_PROJECT_REF, role: "authenticated" }),
    jwt({ role: "anon" }),
    jwt({ ref: NOVU_SUPABASE_PROJECT_REF }),
    jwt(null),
    jwt([]),
    jwt("anon"),
    "sb_secret_test_do_not_use",
    "sb_publishable_",
    "sb_publishable_bad key",
    "replace-me",
    "a.b.c",
    "a.e30.c",
    "a.%%%%.c",
    "a.b.c.d",
    "a.bm90LWpzb24.c",
  ])("bloqueia chave incompatível ou malformada: %s", key => {
    expect(() =>
      validateSupabaseConfig(NOVU_SUPABASE_URL, key, names)
    ).toThrow();
  });

  test("erros não expõem chave fornecida", () => {
    const key = "sb_secret_sensitive_test";
    try {
      validateSupabaseConfig(NOVU_SUPABASE_URL, key, names);
      throw new Error("expected validation failure");
    } catch (error) {
      expect(String(error)).not.toContain(key);
    }
  });

  test("exemplo exige chave explícita e usa URL dedicada", () => {
    const example = readFileSync(".env.example", "utf8");
    expect(example).toContain(`VITE_SUPABASE_URL=${NOVU_SUPABASE_URL}`);
    expect(example).toMatch(/^VITE_SUPABASE_ANON_KEY=$/m);
    expect(example).not.toContain("ucmdzwtqpdomgfdzwubw");
    expect(example).not.toContain(
      "sb_publishable_1uzTAHsYgpmWmw7wtjyB6A_KToMHnOz"
    );
  });
});
