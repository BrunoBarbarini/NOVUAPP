# NOVU — Roupas guardam memórias. A gente cuida delas.

Site institucional da NOVU: plataforma de reparo de roupas de porta em porta, com rede de costureiras remuneradas com dignidade e a Escola NOVU de formação geracional.

## Stack

React 19 + Vite 7 + Tailwind CSS 4 + shadcn/ui. Site 100% estático (SPA) — não requer backend.

## Desenvolvimento local

```bash
pnpm install   # ou npm install / yarn
pnpm dev       # dev server em http://localhost:3000
```

## Build de produção (qualquer host estático)

```bash
pnpm build
```

A saída fica em `dist/public/` — publique essa pasta em qualquer host estático (readdy.ai, Vercel, Netlify, Cloudflare Pages, GitHub Pages).

| Configuração | Valor |
| --- | --- |
| Build command | `pnpm build` (ou `npm run build`) |
| Output directory | `dist/public` |
| SPA fallback | redirecionar 404 → `/index.html` |

Observações: o `index.html` do Vite fica em `client/` (configurado via `root` no `vite.config.ts`); não deve existir `index.html` na raiz do repositório. Os pacotes `vite-plugin-manus-runtime` e `@builder.io/vite-plugin-jsx-loc` são `optionalDependencies` usados apenas no ambiente Manus — o build funciona normalmente sem eles.

## Estrutura

```
client/
  index.html          ← entry HTML (root do Vite)
  public/             ← favicon e arquivos estáticos copiados como estão
  src/
    assets/           ← imagens da marca (webp)
    components/site/  ← seções da página (Hero, Manifesto, Causa, etc.)
    pages/Home.tsx    ← composição da página única
server/               ← servidor Express opcional (apenas para `build:full`)
```
