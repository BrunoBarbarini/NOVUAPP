# Configuração Supabase da NOVU

## Projeto e auditoria (09/10/2026)

Site/painel `BrunoBarbarini/NOVUAPP` e mobile `BrunoBarbarini/novu-app`
devem usar o projeto dedicado **`aioooyvzggpuaktczqpq`**:
`https://aioooyvzggpuaktczqpq.supabase.co`.

A decisão está registrada no [commit cc4d322 de 22/09/2026](https://github.com/BrunoBarbarini/NOVUAPP/commit/cc4d32216231755714ce22809670d6cb0c49a091).
O projeto anterior `ucmdzwtqpdomgfdzwubw` foi identificado nesse commit como
compartilhado indevidamente com outra aplicação. Ele não é um destino autorizado.

| Repositório | Estado encontrado | Correção |
| --- | --- | --- |
| NOVUAPP (cc4d322) | URL/chave dedicadas como fallback no painel; sem exemplo de configuração | Remove fallback, exige env explícita, acrescenta exemplo e validação |
| novu-app (6f9dfcad) | Exemplo com URL/chave do projeto anterior; roteiro v2 afirma que o schema está nesse projeto | Atualiza exemplo, retira chave preenchida, corrige roteiro e valida antes de criar o cliente |

Não foram lidos nem alterados bancos, configurações de hospedagem, credenciais ou
ambientes de produção. O código e o relato do commit não comprovam quais valores
estão em uso nos ambientes reais, nem a aplicação do schema, RLS, buckets ou redirects
no projeto dedicado. Os roteiros de schema são históricos, não evidência de migração.

## Configuração explícita

| Aplicação | URL | Chave pública |
| --- | --- | --- |
| Expo/mobile | `EXPO_PUBLIC_SUPABASE_URL` | `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| Vite/painel | `VITE_SUPABASE_URL` | `VITE_SUPABASE_ANON_KEY` |

1. Copie `.env.example` para `.env` na raiz do repositório.
2. Abra o **projeto dedicado** no Supabase Dashboard, confira o ref
   `aioooyvzggpuaktczqpq` e copie sua chave **publishable** (ou JWT legado com
   papel `anon`) em Settings → API Keys. O exemplo deixa a chave vazia de propósito.
3. Não reutilize a chave do projeto anterior. Nunca coloque `service_role` ou
   `sb_secret_*` no app, site, exemplos ou bundles.
4. Reinicie o servidor de desenvolvimento e recarregue completamente o aplicativo.
   No mobile, mantenha acessos estáticos `process.env.EXPO_PUBLIC_*` para o Expo
   incorporar as variáveis. No site, o Vite lê `.env` da raiz via `envDir`.
5. Antes de uma futura publicação, o responsável deve conferir os pares URL/chave
   em cada ambiente local, CI, hospedagem e perfil de build/update do Expo.
   As variáveis públicas são incorporadas no bundle; alterar o ambiente não
   corrige automaticamente bundles já distribuídos. Esta correção não publica nada.

## Proteções e limites

Os dois clientes validam **antes de chamar `createClient`**, sem consultar a rede:

- URL e chave obrigatórias, mesmo em desenvolvimento; não há fallback.
- Somente a URL HTTPS exata dedicada, com barra final opcional. Outros projetos,
  localhost, HTTP, paths, queries, fragmentos, portas e credenciais na URL são rejeitados.
- JWT legado precisa declarar `role=anon` e `ref=aioooyvzggpuaktczqpq`.
  Isso confere a coerência local dos claims; não verifica assinatura ou validade
  da credencial. A autenticação real continua a cargo do Supabase.
- Chaves publishable são opacas: a validação reconhece seu formato, mas **não
  consegue comprovar seu projeto de origem offline**. Confirme a origem no Dashboard.
- Erros não imprimem a chave. Chaves públicas ainda dependem de RLS e autorização.
- O projeto permitido é fixado em código, não em um override de ambiente que
  permitiria repetir o erro. Usar outro projeto (inclusive staging/local) exige uma
  alteração revisada da política e dos exemplos nos dois repositórios.
- Configuração ausente/incorreta interrompe a inicialização. No site, as rotas admin
  são importadas pelo App, por isso configuração válida é necessária também para
  abrir a SPA. Verifique as variáveis antes de adotar esta mudança.

A política em `supabaseConfig.ts` é idêntica nos dois repositórios. Mantenha as
duas cópias e suas matrizes de testes alinhadas ao revisar o projeto permitido.

## Testes sem banco

Mobile: `npm test -- --runInBand`, `npm run typecheck`, `npm run lint`
(Node 22, conforme CI). Site: `npm test`, `npm run check`.

Os testes de configuração usam chaves sintéticas; os testes de inicialização
mockam `createClient` para provar que configurações inválidas não criam clientes.
Nenhum teste novo se conecta ao Supabase.

Referências técnicas: [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/),
[variáveis Expo](https://docs.expo.dev/guides/environment-variables/),
[chaves Supabase](https://supabase.com/docs/guides/getting-started/api-keys).
