/**
 * Política compartilhada com o outro repositório NOVU. Alterações de projeto
 * precisam de revisão nos dois repositórios; não há override por variável.
 */
export const NOVU_SUPABASE_PROJECT_REF = "aioooyvzggpuaktczqpq";
export const NOVU_SUPABASE_URL = `https://${NOVU_SUPABASE_PROJECT_REF}.supabase.co`;

function decodeJwtPayload(segment: string): unknown {
  // Base64url sem Buffer/atob: funciona no Hermes, browser e Node.
  if (!/^[A-Za-z0-9_-]+$/.test(segment) || segment.length % 4 === 1) {
    throw new Error("Invalid base64url");
  }
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let bits = 0;
  let value = 0;
  let decoded = "";
  for (const char of segment) {
    value = (value << 6) | alphabet.indexOf(char);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      decoded += String.fromCharCode((value >> bits) & 255);
      value &= (1 << bits) - 1;
    }
  }
  return JSON.parse(decoded);
}

/** Validação local de configuração; não autentica a chave nem acessa a rede. */
export function validateSupabaseConfig(
  urlValue: string | undefined,
  keyValue: string | undefined,
  variables: { url: string; key: string }
): { url: string; anonKey: string } {
  const url = urlValue?.trim();
  const anonKey = keyValue?.trim();
  if (!url || !anonKey) {
    throw new Error(
      `Configure ${variables.url} e ${variables.key}. Consulte .env.example e docs/supabase-config.md.`
    );
  }

  // Comparação exata também rejeita HTTP, credenciais, portas, paths, query,
  // fragmentos e domínios que apenas imitam o host autorizado.
  if (url !== NOVU_SUPABASE_URL && url !== `${NOVU_SUPABASE_URL}/`) {
    throw new Error(
      `${variables.url} deve apontar para o projeto dedicado NOVU (${NOVU_SUPABASE_PROJECT_REF}).`
    );
  }

  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(anonKey)) {
    // Chaves publishable são opacas: o projeto de origem só pode ser
    // conferido no Dashboard; nunca inferimos o ref a partir delas.
    return { url: NOVU_SUPABASE_URL, anonKey };
  }

  let payload: unknown;
  try {
    const parts = anonKey.split(".");
    if (
      parts.length !== 3 ||
      parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))
    ) {
      throw new Error("Invalid JWT");
    }
    payload = decodeJwtPayload(parts[1]);
  } catch {
    throw new Error(
      `${variables.key} deve ser uma chave pública publishable ou JWT anon válida.`
    );
  }
  if (
    !payload ||
    typeof payload !== "object" ||
    !("role" in payload) ||
    payload.role !== "anon" ||
    !("ref" in payload) ||
    payload.ref !== NOVU_SUPABASE_PROJECT_REF
  ) {
    throw new Error(
      `${variables.key} deve ser anon e pertencer ao projeto dedicado NOVU; chaves privilegiadas são proibidas.`
    );
  }
  return { url: NOVU_SUPABASE_URL, anonKey };
}
