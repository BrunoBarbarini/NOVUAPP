/**
 * Mock reutilizável do client Supabase pros testes de admin/api.ts —
 * mesma estratégia usada no app mobile (lib/testHelpers/supabaseMock.ts):
 * um builder encadeável e "thenable" que resolve pro resultado configurado
 * na fila, na ordem em que o código de produção chama `supabase.from(...)`.
 */
import { vi } from "vitest";

export interface QueryResult<T = unknown> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export function ok<T>(data: T): QueryResult<T> {
  return { data, error: null };
}

export function fail(message: string, code?: string): QueryResult<never> {
  return { data: null, error: { message, code } };
}

function createBuilder(result: QueryResult) {
  const builder: Record<string, unknown> = {};
  const chainMethods = [
    "select",
    "eq",
    "neq",
    "not",
    "is",
    "in",
    "order",
    "limit",
    "gte",
    "lte",
    "single",
    "maybeSingle",
    "insert",
    "update",
    "upsert",
    "delete",
  ];
  chainMethods.forEach((m) => {
    builder[m] = vi.fn(() => builder);
  });
  builder.then = (resolve: (v: QueryResult) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);
  return builder;
}

export interface SupabaseMockHandle {
  supabase: {
    from: ReturnType<typeof vi.fn>;
    auth: Record<string, ReturnType<typeof vi.fn>>;
    storage: { from: ReturnType<typeof vi.fn> };
  };
  queueFromResult: (result: QueryResult) => void;
  builders: Record<string, ReturnType<typeof vi.fn>>[];
  storageCreateSignedUrls: ReturnType<typeof vi.fn>;
}

export function createSupabaseMock(): SupabaseMockHandle {
  const queue: QueryResult[] = [];
  const builders: Record<string, ReturnType<typeof vi.fn>>[] = [];
  const from = vi.fn(() => {
    const next = queue.shift();
    const builder = createBuilder(next ?? ok(null));
    builders.push(builder as Record<string, ReturnType<typeof vi.fn>>);
    return builder;
  });

  const storageCreateSignedUrls = vi.fn(() => Promise.resolve({ data: [], error: null }));

  const supabase = {
    from,
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
    storage: {
      from: vi.fn(() => ({ createSignedUrls: storageCreateSignedUrls })),
    },
  };

  return {
    supabase,
    queueFromResult: (result) => queue.push(result),
    builders,
    storageCreateSignedUrls,
  };
}
